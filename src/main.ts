import { extent } from 'd3-array'
import { axisBottom } from 'd3-axis'
import type { DraggedElementBaseType } from 'd3-drag'
import { drag as d3Drag } from 'd3-drag'
import type { Force, Simulation } from 'd3-force'
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX } from 'd3-force'
import { interpolateRgb } from 'd3-interpolate'
import { scaleLinear, scaleTime } from 'd3-scale'
import { select } from 'd3-selection'
import { curveBumpX, line as d3Line } from 'd3-shape'
import { timeYear } from 'd3-time'

import { default as rawData } from './data.ts'
import { chunks, drawChunk, split } from './gradient-path.ts'
import './style.css'
import type { Data, Link, Node } from './types.ts'

const width = window.innerWidth / 2
const height = window.innerHeight / 2

const styles = {
  node: {
    fill: 'white',
    height: 50,
    stroke: 'black',
    'stroke-width': 3,
    width: 60,
  },
  label: {
    font: '6px sans-serif',
  },
  link: {
    fill: 'none',
    opacity: 0.6,
    stroke: 'grey',
    'stroke-width': 10,
  },
  axis: {
    height: height - 20,
  },
}

const svg = select('#app')
  .append('svg:svg')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', `0 0 ${width} ${height}`)
  .attr('pointer-events', 'all')

const content = svg
  .append('g')
  .attr('transform', `translate(${(styles.node.width + styles.node['stroke-width']) / 2}, 0)`)

const graph = content.append('g')

const linksGroup = graph.append('g')
const nodesGroup = graph.append('g')

const axis = content.append('g')

const nodeMap = rawData.nodes.reduce((acc, { id, date, ...rest }) => {
  acc.set(id, { id, date: new Date(date), ...rest })
  return acc
}, new Map<string, Node>())

const data: Data = {
  nodes: [...nodeMap.values()],
  links: rawData.links.reduce((acc, { source: sourceId, target: targetId }) => {
    const source = nodeMap.get(sourceId)
    const target = nodeMap.get(targetId)
    if (source && target) {
      acc.push({ source, target })
    } else {
      throw Error(`Cannot find node with id = ${source ? targetId : sourceId}`)
    }
    return acc
  }, [] as Link[]),
}

const xScale = scaleTime()
  .domain(
    data.nodes.length >= 2 ? (extent(data.nodes.map(({ date }) => date)) as [Date, Date]) : [new Date(0), new Date()]
  )
  .range([0, width - styles.node.width - styles.node['stroke-width']])

axis.attr('transform', `translate(0, ${styles.axis.height})`).call(axisBottom(xScale).ticks(timeYear.every(3)))

const line = d3Line().curve(curveBumpX)

const x = ({ date }: Node) => xScale(date)

const nodes = nodesGroup
  // we need to specify the Element type in generic as it cannot be inferred by the selector
  .selectAll<SVGElementTagNameMap['g'], Node>('.node')
  .data<Node>(data.nodes)
  .enter()
  .append('g')
  .classed('node', true)
  .attr('transform', `translate(-${styles.node.width / 2}, -${styles.node.height / 2})`)

const rects = nodes
  .append('rect')
  .attr('width', styles.node.width)
  .attr('height', styles.node.height)
  .attr('rx', styles.link['stroke-width'])
  .attr('title', ({ name }) => name)

nodes
  .append('text')
  .attr('x', 5)
  .attr('y', 9)
  .style('font', styles.label.font)
  .attr('dominant-baseline', 'central')
  .text(({ name }) => name)

Object.keys(styles.node).forEach((key) => {
  rects.style(key, styles.node[key as keyof typeof styles.node])
})

const forceLimits: Force<Node, undefined> = () => {
  data.nodes.forEach((node) => {
    const y = node.y as number
    const min = (styles.node.height + styles.node['stroke-width']) / 2
    const max = styles.axis.height - (styles.node.height + styles.node['stroke-width']) / 2
    node.y = y < min ? min : y > max ? max : y
  })
}

const selectAllLinks = () =>
  // we need to specify the Element type in generic as it cannot be inferred by the selector
  linksGroup.selectAll<SVGElementTagNameMap['path'], Link>('.link')

const simulation: Simulation<Node, Link> = forceSimulation<Node>(data.nodes)
  .force('charge', forceManyBody<Node>().strength(-1))
  .force('x', forceX<Node>().x(x).strength(1))
  .force(
    'collision',
    forceCollide()
      .radius(() => Math.max(styles.node.width, styles.node.height)) // empirically determined
      .strength(0.8)
  )
  .force('limits', forceLimits)
  .force('links', forceLink(data.links).strength(1))
  .on('tick', () => {
    linksGroup.selectAll('.gradient').remove()

    const links = selectAllLinks()
      .data(data.links)
      .join('path')
      .classed('link', true)
      // in this function we know y is not undefined because its value has been set when the simulation started
      .attr('d', ({ source, target }: Link) =>
        line([
          [x(source), source.y as number],
          [x(target), target.y as number],
        ])
      )

    Object.keys(styles.link).forEach((key) => {
      links.style(key, styles.link[key as keyof typeof styles.link])
    })

    nodes.attr(
      'transform',
      ({ date, y }) => `translate(${-styles.node.width / 2 + xScale(date)}, ${-styles.node.height / 2 + (y as number)})`
    )
  })
  .on('end', () => {
    selectAllLinks()
      .remove()
      .each(function ({ source, target }) {
        const data = chunks(split(this, 1))

        const colorRange = [source.color ?? styles.link.stroke, target.color ?? styles.link.stroke]
        const colorScale = scaleLinear<string>().domain([0, 1]).range(colorRange).interpolate(interpolateRgb)

        selectAllLinks()
          .data(data)
          .join('path')
          .classed('gradient', true)
          .style('fill', (d) => colorScale(d.progress))
          .style('opacity', styles.link.opacity)
          .attr('d', ({ p0, p1, p2, p3 }) => drawChunk(p0, p1, p2, p3, styles.link['stroke-width']))
      })
  })

const drag = <DraggedElement extends DraggedElementBaseType, Datum>(simulation: Simulation<Node, undefined>) =>
  d3Drag<DraggedElement, Datum>()
    .on('start', (event) => {
      if (!event.active) {
        simulation.alphaTarget(0.3).restart()
      }
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    })
    .on('drag', (event) => {
      event.subject.fx = event.x
      event.subject.fy = event.y
    })
    .on('end', (event) => {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    })

nodes.call(drag<SVGElementTagNameMap['g'], Node>(simulation))
