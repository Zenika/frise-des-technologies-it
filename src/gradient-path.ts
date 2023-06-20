interface Point {
  x: number
  y: number
}

/**
 * A vector has X and Y coordinates, just like a point.
 */
type Vector = Point

type Segment = [Point, Point]

interface StepPoint extends Point {
  progress: number
}

interface Chunk {
  p0: StepPoint | undefined
  p1: StepPoint
  p2: StepPoint
  p3: StepPoint | undefined
  progress: number
}

/**
 Splits an SVG path into an array of points based on a specified sample length.
 @param {SVGPathElement} path - The SVG path element to be split.
 @param {number} sampleLength - The length between each sampled point.
 @returns {StepPoint[]} An array of points representing the split path.
 */
const split: (path: SVGPathElement, sampleLength: number) => StepPoint[] = (
  path: SVGPathElement,
  sampleLength: number
) => {
  const totalLength = path.getTotalLength()
  const steps = [
    0,
    ...Array.from({ length: Math.ceil(totalLength / sampleLength) }).map((_, i) =>
      Math.min((i + 1) * sampleLength, totalLength)
    ),
  ]
  return steps.map((step) => {
    const { x, y } = path.getPointAtLength(step)
    return { x, y, progress: step / totalLength }
  })
}

/**
 * Compute chunks of adjacent step points [P0, P1, P2, P3].
 * @param {StepPoint[]} stepPoints - step points
 * @returns {Chunk[]} Chunks of four adjacent step points
 */
const chunks = (stepPoints: StepPoint[]): Chunk[] =>
  stepPoints.length > 1
    ? Array.from({ length: stepPoints.length - 1 }).map<Chunk>((_, i) => ({
        p0: stepPoints[i - 1],
        p1: stepPoints[i],
        p2: stepPoints[i + 1],
        p3: stepPoints[i + 2],
        progress: (stepPoints[i].progress + stepPoints[i + 1].progress) / 2,
      }))
    : []

/**
 * Calculates the intersection point between two lines (AB) and (CD).
 *
 * @param {Segment} [a, b] - The first line segment defined by two points [AB].
 * @param {Segment} [c, d] - The second line segment defined by two points [CD].
 * @returns {Point} - The intersection point of the two lines.
 */
const intersection = ([a, b]: Segment, [c, d]: Segment): Point => {
  const x1 = c.x
  const x3 = a.x
  const x21 = d.x - x1
  const x43 = b.x - x3
  const y1 = c.y
  const y3 = a.y
  const y21 = d.y - y1
  const y43 = b.y - y3
  const ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21)
  return { x: x1 + ua * x21, y: y1 + ua * y21 }
}

/**
 * Computes a quadrilateral wrapping segment [P1P2] which elegantly connects to previous and next quadrilaterals thanks to P0 and
 * P3 parameters.
 *
 * @param {Point|undefined} p0 - The first point of the chunk (optional).
 * @param {Point} p1 - The second point of the chunk.
 * @param {Point} p2 - The third point of the chunk.
 * @param {Point|undefined} p3 - The fourth point of the chunk (optional).
 * @param {number} width - The width of the resulting quadrilateral.
 * @returns {string} - The SVG path string representing the chunk.
 */
const drawChunk = (p0: Point | undefined, p1: Point, p2: Point, p3: Point | undefined, width: number) => {
  const perpP1P2 = perpendicular(p1, p2)
  const r = width / 2
  let a: Point = { x: p1.x + perpP1P2.x * r, y: p1.y + perpP1P2.y * r }
  let b: Point = { x: p2.x + perpP1P2.x * r, y: p2.y + perpP1P2.y * r }
  let c: Point = { x: p2.x - perpP1P2.x * r, y: p2.y - perpP1P2.y * r }
  let d: Point = { x: p1.x - perpP1P2.x * r, y: p1.y - perpP1P2.y * r }

  if (p0) {
    // clip [AB] and [DC] using average of perpP0P1 and perpP1p2
    const perpP0P1 = perpendicular(p0, p1)
    const e: Point = { x: p1.x + perpP0P1.x + perpP1P2.x, y: p1.y + perpP0P1.y + perpP1P2.y }
    a = intersection([p1, e], [a, b])
    d = intersection([p1, e], [d, c])
  }

  if (p3) {
    // clip [AB] and [DC] using average of perpP1p2 and perpP2P3
    const perpP2P3 = perpendicular(p2, p3)
    const e: Point = { x: p2.x + perpP2P3.x + perpP1P2.x, y: p2.y + perpP2P3.y + perpP1P2.y }
    b = intersection([p2, e], [a, b])
    c = intersection([p2, e], [d, c])
  }

  return `M${a.x},${a.y}L${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}Z`
}

/**
 * Compute unit vector perpendicular to segment [AB].
 * @param {Point} a - point a
 * @param {Point} b - point b
 * @returns (Vector} Unit vector perpendicular to segment [AB]
 */
const perpendicular = (a: Point, b: Point): Vector => {
  const x = a.y - b.y
  const y = b.x - a.x
  const n = Math.sqrt(x * x + y * y)
  return { x: x / n, y: y / n }
}

export { split, chunks, drawChunk }
