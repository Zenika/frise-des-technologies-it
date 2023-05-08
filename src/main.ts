import './style.css'
import { select } from 'd3-selection'
import { scaleTime } from 'd3-scale'
import { extent } from 'd3-array'

import data from './data.ts'

const width = 1400
const height = 500
const nodeRadius = 10

const nodeStrokeWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--node-stroke-width'), 10)

const svg = select('#app').append('svg:svg').attr('width', width).attr('height', height)

const nodeGroup = svg.append('g').attr('transform', `translate(${nodeRadius + nodeStrokeWidth / 2} ${height / 2})`)

const domain: [Date, Date] = extent(data.nodes.map(({ date }) => new Date(date))) as [Date, Date]

const x = scaleTime()
  .domain(domain)
  .range([0, 1400 - 2 * nodeRadius - nodeStrokeWidth])

const nodes = nodeGroup.selectAll('.node').data(data.nodes)

// enter
nodes
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', ({ date }) => x(new Date(date)))
  .attr('cy', 0)
  .attr('r', 10)
  .attr('title', ({ name }) => name)

// update
nodes.attr('cx', ({ date }) => x(new Date(date))).attr('title', ({ name }) => name)
