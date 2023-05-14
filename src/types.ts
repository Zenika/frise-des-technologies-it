import { SimulationNodeDatum } from 'd3-force'

export interface Node extends SimulationNodeDatum {
  id: number
  name: string
  date: Date
}

export interface Link {
  source: number
  target: number
}

export interface Data {
  nodes: Node[]
  links: Link[]
}

export type NodeSelection = SVGCircleElement
