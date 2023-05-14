import { extent } from 'd3-array'
import { axisBottom } from 'd3-axis'
import type { DraggedElementBaseType } from 'd3-drag'
import { drag as d3Drag } from 'd3-drag'
import { forceCollide, forceManyBody, forceSimulation, forceX } from 'd3-force'
import type { Simulation } from 'd3-force'
import { scaleTime } from 'd3-scale'
import { select } from 'd3-selection'
import { curveBumpX, line as d3Line } from 'd3-shape'
import { timeYear } from 'd3-time'

import { default as rawData } from './data.ts'
import './style.css'
import type { Data, Node } from './types.ts'

const width = 1920 / 2
const height = 1080 / 2

const nodeStrokeWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--node-stroke-width'), 10)
const nodeRadius = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--node-radius'), 10)

const svg = select('#app')
  .append('svg:svg')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', `0 0 ${width} ${height}`)
  .attr('pointer-events', 'all')

const graph = svg
  .append('g')
  .attr('transform', `translate(${nodeRadius + nodeStrokeWidth / 2} ${height / 2 + nodeRadius + nodeStrokeWidth / 2})`)

const linksGroup = graph.append('g')
const nodesGroup = graph.append('g')

const axis = svg.append('g')

const data: Data = {
  ...rawData,
  nodes: rawData.nodes.map(({ date, ...rest }) => ({ date: new Date(date), ...rest })),
}
const nodeMap = data.nodes.reduce((acc, node) => {
  acc.set(node.id, node)
  return acc
}, new Map<number, Node>())

const xDomain: [Date, Date] =
  data.nodes.length >= 2 ? (extent(data.nodes.map(({ date }) => date)) as [Date, Date]) : [new Date(0), new Date()]

const xScale = scaleTime()
  .domain(xDomain)
  .range([0, width - 2 * nodeRadius - nodeStrokeWidth])

axis.attr('transform', `translate(0, ${height - 20})`).call(axisBottom(xScale).ticks(timeYear.every(3)))

const line = d3Line().curve(curveBumpX)

const x = (d: Node) => xScale(d.date)

const links = linksGroup.selectAll('.link').data(data.links).join('svg:path').classed('link', true)

const nodes = nodesGroup
  .selectAll<SVGCircleElement, Node>('.node')
  .data<Node>(data.nodes)
  .join<SVGCircleElement>('svg:circle')
  .classed('node', true)
  .attr('r', 10)
  .attr('title', ({ name }) => name)

const ticked = () => {
  links.attr('d', (d) => {
    const source = nodeMap.get(d.source) as Node
    const target = nodeMap.get(d.target) as Node
    return line([
      [x(source), source.y as number],
      [x(target), target.y as number],
    ])
  })
  nodes.attr('cx', x).attr('cy', (d) => d.y as number)
}

const simulation: Simulation<Node, undefined> = forceSimulation<Node>(data.nodes)
  .force('charge', forceManyBody<Node>().strength(-1))
  .force('x', forceX<Node>().x(x).strength(1))
  .force(
    'collision',
    forceCollide()
      .radius(() => nodeRadius * 5)
      .strength(1)
  )
  .on('tick', ticked)

const drag = <GElement extends DraggedElementBaseType, Datum>(simulation: Simulation<Node, undefined>) =>
  d3Drag<GElement, Datum>()
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

nodes.call(drag<SVGCircleElement, Node>(simulation))
