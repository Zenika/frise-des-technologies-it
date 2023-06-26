import { computed, effect, signal } from '@preact/signals-core'
import { extent } from 'd3-array'
import { axisBottom } from 'd3-axis'
import { drag as d3Drag } from 'd3-drag'
import type { Force, Simulation } from 'd3-force'
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX } from 'd3-force'
import { interpolateRgb } from 'd3-interpolate'
import { scaleLinear, scaleTime } from 'd3-scale'
import { select } from 'd3-selection'
import { curveBumpX, line as d3Line } from 'd3-shape'
import { timeYear } from 'd3-time'
import { zoom as d3Zoom } from 'd3-zoom'
import { addYears } from 'date-fns'

import { toggleGrid, toggleSolution } from './controls.ts'
import { default as rawData } from './data.ts'
import debounce from './debounce.ts'
import download from './download.ts'
import { chunks, drawChunk, split } from './gradient-path.ts'
import './style.css'
import type { Data, Link, Node } from './types.ts'

const zoomFactor = signal(1)

const width = signal(window.innerWidth / zoomFactor.value)
const height = signal(window.innerHeight / zoomFactor.value)

const refresh = () => {
  width.value = window.innerWidth / zoomFactor.value
  height.value = window.innerHeight / zoomFactor.value
  simulation.restart()
}

const axisY = computed(() => height.value - 20)

const styles = {
  node: {
    fill: 'white',
    height: 50,
    stroke: 'black',
    'stroke-width': 3,
    width: 36,
  },
  label: {
    'font-family': 'sans-serif',
    'font-size': 5,
  },
  link: {
    fill: 'none',
    opacity: 0.6,
    'stroke-width': 10,
  },
}

const svg = select('#app')
  .append<SVGSVGElement>('svg:svg')
  .attr('preserveAspectRatio', 'xMidYMid meet')
  .attr('pointer-events', 'all')

effect(() => {
  svg.attr('viewBox', `0 0 ${width.value} ${height.value}`)
})

svg
  .append('rect')
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .attr('width', '100%')
  .attr('height', '100%')
  .call(
    d3Zoom<SVGRectElement, unknown>()
      .scaleExtent([0.1, 2])
      .on('zoom', (event) => {
        zoomFactor.value = event.transform.k
        refresh()
      })
  )

const content = svg
  .append('g')
  .attr('transform', `translate(${(styles.node.width + styles.node['stroke-width']) / 2}, 0)`)

const timeline = content.append('g')
const grid = content.append('g')

const graph = content.append('g')

const linksGroup = graph.append('g')
const nodesGroup = graph.append('g')

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
        addYears(date, i === 0 ? -2 : 2)
      )
    : [new Date(0), new Date()]
)

effect(() => {
  xScale.range([0, width.value - styles.node.width - styles.node['stroke-width']])
  timeline.attr('transform', `translate(0, ${axisY.value})`).call(axisBottom(xScale).ticks(timeYear.every(2)))

  grid
    .attr('transform', `translate(0, ${axisY.value})`)
    .style('opacity', 0.1)
    .style('stroke-dasharray', 2)
    .style('display', toggleGrid.value ? 'block' : 'none')
    .call(
      axisBottom(xScale)
        .tickSizeInner(-axisY.value)
        .tickSizeOuter(0)
        .tickValues(data.nodes.map(({ date }) => date))
        .tickFormat(() => '')
    )
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
  .attr('transform', `translate(${styles.node['stroke-width'] * 2}, ${styles.node['stroke-width'] / 2 + 2})`)
  .attr('href', ({ logo }) => logo)
  .attr('width', styles.node.width - styles.node['stroke-width'] * 4)
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
  solutions.style('display', toggleSolution.value ? 'block' : 'none')
})

Object.keys(styles.node).forEach((key) => {
  rects.style(key, styles.node[key as keyof typeof styles.node])
})

const yMin = (styles.node.height + styles.node['stroke-width']) / 2
const yMax = computed(() => axisY.value - (styles.node.height + styles.node['stroke-width']) / 2)
const clamp = (y: number) => (y < yMin ? yMin : y > yMax.value ? yMax.value : y)
const forceLimits: Force<Node, undefined> = () => {
  data.nodes.forEach((node) => {
    const y = node.y as number
    node.y = clamp(y)
  })
}

const selectAllLinks = () =>
  // we need to specify the Element type in generic as it cannot be inferred by the selector
  linksGroup.selectAll<SVGElementTagNameMap['path'], Link>('.link')

const selectAllGradientCandidateLinks = () =>
  selectAllLinks().filter(({ source, target }) => source.color !== target.color)

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
      .style('stroke', ({ source }) => source.color)
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
    selectAllGradientCandidateLinks()
      .remove()
      .each(function ({ source, target }) {
        const data = chunks(split(this, 1))

        const colorRange = [source.color, target.color]
        const colorScale = scaleLinear<string>().domain([0, 1]).range(colorRange).interpolate(interpolateRgb)

        selectAllGradientCandidateLinks()
          .data(data)
          .join('path')
          .classed('gradient', true)
          .style('fill', (d) => colorScale(d.progress))
          .style('opacity', styles.link.opacity)
          .attr('d', ({ p0, p1, p2, p3 }) => drawChunk(p0, p1, p2, p3, styles.link['stroke-width']))
      })
  })
const drag = (simulation: Simulation<Node, undefined>) =>
  d3Drag<SVGElementTagNameMap['g'], Node>()
    .on('start', function () {
      select(this).classed('fixed', true)
    })
    .on('drag', (event, d) => {
      d.fy = clamp(event.y)
      simulation.alpha(1).restart()
    })

nodes.call(drag(simulation)).on('click', function (_, d) {
  delete d.fy
  select(this).classed('fixed', false)
})

window.addEventListener(
  'resize',
  debounce(() => {
    refresh()
  }, 500)
)
;(document.querySelector('#download') as HTMLButtonElement).addEventListener('click', () =>
  download(svg.node() as SVGGElement)
)
