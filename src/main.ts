import './style.css'
import { select } from 'd3-selection'
import { scaleLinear, scaleTime } from 'd3-scale'
import { extent } from 'd3-array'
import { curveBumpX, line as d3Line } from 'd3-shape'

import data, { Node } from './data.ts'

data.nodes.sort(() => 0.5 - Math.random())

const width = 1920 / 2
const height = 1080 / 2

const nodeStrokeWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--node-stroke-width'), 10)
const nodeRadius = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--node-radius'), 10)

const svgSelection = select('#app')
  .append('svg:svg')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', `0 0 ${width} ${height}`)

const graphGroupSelection = svgSelection
  .append('g')
  .attr('transform', `translate(${nodeRadius + nodeStrokeWidth / 2} ${nodeRadius + nodeStrokeWidth / 2})`)

const linkGroupSelection = graphGroupSelection.append('g')
const nodeGroupSelection = graphGroupSelection.append('g')
// .attr('transform', `translate(${nodeRadius + nodeStrokeWidth / 2} ${nodeRadius + nodeStrokeWidth / 2})`)

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

const y = scaleLinear().domain([0, nodes.length]).range([0, height])

const line = d3Line().curve(curveBumpX)

const linkSelection = linkGroupSelection.selectAll('.link').data(links)
const nodeSelection = nodeGroupSelection.selectAll('.node').data(nodes)

const nodeX = (d: Node) => x(d.date)

const nodeY = (_: Node, i: number) => y(i)

linkSelection
  .enter()
  .append('svg:path')
  .classed('link', true)
  .attr('d', (d) => {
    const source = nodeMap.get(d.source) as Node
    const target = nodeMap.get(d.target) as Node
    return line([
      [nodeX(source), nodeY(source, nodes.indexOf(source))],
      [nodeX(source), nodeY(source, nodes.indexOf(source))],
      [nodeX(target), nodeY(target, nodes.indexOf(target))],
      [nodeX(target), nodeY(target, nodes.indexOf(target))],
    ])
  })

nodeSelection
  .enter()
  .append('svg:circle')
  .classed('node', true)
  .attr('cx', nodeX)
  .attr('cy', nodeY)
  .attr('r', 10)
  .attr('title', ({ name }) => name)
