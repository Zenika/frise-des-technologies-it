import './style.css'
import { select } from 'd3-selection'
import { scaleTime } from 'd3-scale'
import { extent } from 'd3-array'
import { curveBumpX, line as d3Line } from 'd3-shape'
import { axisBottom } from 'd3-axis'
import { timeYear } from 'd3-time'
import { drag as d3Drag } from 'd3-drag'

import data, { Node } from './data.ts'
import { forceCollide, forceManyBody, forceSimulation, forceX, Simulation } from 'd3-force'

data.nodes.sort(() => 0.5 - Math.random())

const width = 1920 / 2
const height = 1080 / 2

const nodeStrokeWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--node-stroke-width'), 10)
const nodeRadius = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--node-radius'), 10)

const svgSelection = select('#app')
  .append('svg:svg')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', `0 0 ${width} ${height}`)
  .attr('pointer-events', 'all')

const graphGroupSelection = svgSelection
  .append('g')
  .attr('transform', `translate(${nodeRadius + nodeStrokeWidth / 2} ${height / 2 + nodeRadius + nodeStrokeWidth / 2})`)

const linkGroupSelection = graphGroupSelection.append('g')
const nodeGroupSelection = graphGroupSelection.append('g')

const axisGroupSelection = svgSelection.append('g')

const { links } = data

const nodes: Node[] = data.nodes.map(({ date, ...rest }) => ({ date: new Date(date), ...rest }))
const nodeMap = nodes.reduce((acc, node) => {
  acc.set(node.id, node)
  return acc
}, new Map<number, Node>())
const xDomain: [Date, Date] = extent(data.nodes.map(({ date }) => new Date(date))) as [Date, Date]

const x = scaleTime()
  .domain(xDomain)
  .range([0, width - 2 * nodeRadius - nodeStrokeWidth])

axisGroupSelection.attr('transform', `translate(0, ${height - 20})`).call(axisBottom(x).ticks(timeYear.every(3)))

const line = d3Line().curve(curveBumpX)

const nodeX = (d: Node) => x(d.date)

const simulation = forceSimulation<Node>(nodes)
  .force('charge', forceManyBody<Node>().strength(-1))
  .force('x', forceX<Node>().x(nodeX).strength(1))
  .force(
    'collision',
    forceCollide()
      .radius(() => nodeRadius * 5)
      .strength(1)
  )
  .on('tick', ticked)

const linkSelection = linkGroupSelection.selectAll('.link').data(links).join('svg:path').classed('link', true)

const nodeSelection = nodeGroupSelection
  .selectAll('.node')
  .data(nodes)
  .join('svg:circle')
  .classed('node', true)
  .attr('r', 10)
  .attr('title', ({ name }) => name)

function ticked() {
  linkSelection.attr('d', (d) => {
    const source = nodeMap.get(d.source) as Node
    const target = nodeMap.get(d.target) as Node
    return line([
      [nodeX(source), source.y as number],
      [nodeX(target), target.y as number],
    ])
  })
  nodeSelection.attr('cx', nodeX).attr('cy', (d) => d.y as number)
}
function drag(simulation: Simulation<Node, undefined>) {
  return d3Drag()
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
}

nodeSelection.call(drag(simulation))
