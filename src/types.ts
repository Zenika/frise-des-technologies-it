import type { SimulationNodeDatum } from 'd3-force'

export interface Node extends SimulationNodeDatum {
  id: string
  name: string
  date: Date
  color: string
  logo: string
}

export interface Link {
  source: Node
  target: Node
}

export interface Data {
  nodes: Node[]
  links: Link[]
}
