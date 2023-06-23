import { computed, effect, signal } from '@preact/signals-core'
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
import * as dayjs from 'dayjs'

import { default as rawData } from './data.ts'
import debounce from './debounce.ts'
import download from './download.ts'
import { chunks, drawChunk, split } from './gradient-path.ts'
import showSolution from './show-solution-control.ts'
import './style.css'
import type { Data, Link, Node } from './types.ts'

const width = signal(window.innerWidth / 2)
const height = signal(window.innerHeight / 2)

const axisY = computed(() => height.value - 20)

const styles = {
  node: {
    fill: 'white',
    height: 50,
    stroke: 'black',
    'stroke-width': 3,
    width: 60,
  },
  label: {
    'font-family': 'sans-serif',
    'font-size': 5,
  },
  link: {
    fill: 'none',
    opacity: 0.6,
    stroke: 'grey',
    'stroke-width': 10,
  },
}

const svg = select('#app')
  .append<SVGSVGElement>('svg:svg')
  .attr('preserveAspectRatio', 'xMidYMid meet')
  .attr('pointer-events', 'all')

effect(() => {
  svg.attr('viewBox', `0 0 ${width} ${height}`)
})

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

const xScale = scaleTime().domain(
  data.nodes.length >= 2
    ? (extent([...data.nodes.map(({ date }) => date), new Date()]) as [Date, Date]).map((date, i) =>
        dayjs(date)
          .add(i === 0 ? -2 : 2, 'year')
          .toDate()
      )
    : [new Date(0), new Date()]
)

effect(() => {
  xScale.range([0, width.value - styles.node.width - styles.node['stroke-width']])
  axis.attr('transform', `translate(0, ${axisY})`).call(axisBottom(xScale).ticks(timeYear.every(3)))
})

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

const solutions = nodes.append('g')

solutions
  .append('image')
  .attr('transform', `translate(${styles.node['stroke-width'] / 2}, ${styles.node['stroke-width'] / 2 + 2})`)
  .attr('href', ({ logo }) => logo)
  .attr('width', styles.node.width - styles.node['stroke-width'])
  .attr('height', styles.node.height - styles.node['stroke-width'] - styles.label['font-size'] - 8)

solutions
  .append('text')
  .style('font-family', styles.label['font-family'])
  .style('font-size', styles.label['font-size'] + 'px')
  .attr('x', styles.node.width / 2)
  .attr('y', styles.node.height - 8)
  .attr('dominant-baseline', 'central')
  .attr('text-anchor', 'middle')
  .text(({ name }) => name)

effect(() => {
  solutions.style('display', showSolution.value ? 'block' : 'none')
})

Object.keys(styles.node).forEach((key) => {
  rects.style(key, styles.node[key as keyof typeof styles.node])
})

const forceLimits: Force<Node, undefined> = () => {
  data.nodes.forEach((node) => {
    const y = node.y as number
    const min = (styles.node.height + styles.node['stroke-width']) / 2
    const max = axisY.value - (styles.node.height + styles.node['stroke-width']) / 2
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

window.addEventListener(
  'resize',
  debounce(() => {
    width.value = window.innerWidth / 2
    height.value = window.innerHeight / 2
    simulation.restart()
  }, 500)
)
;(document.querySelector('#download') as HTMLButtonElement).addEventListener('click', () =>
  download(svg.node() as SVGGElement)
)
