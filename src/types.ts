import type { SimulationNodeDatum } from 'd3-force'

export interface Node extends SimulationNodeDatum {
  id: number
  name: string
  date: Date
}

export interface Link {
  source: Node
  target: Node
}

export interface Data {
  nodes: Node[]
  links: Link[]
}
