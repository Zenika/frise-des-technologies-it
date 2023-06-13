import { range } from 'd3-array'

interface Point extends Array<number> {
  t?: number
}

interface Points extends Array<Point> {
  t?: number
}

/**
 * Sample the SVG path uniformly with the specified precision.
 * @param path
 * @param precision
 */
const samples: (path: SVGPathElement, precision: number) => Point[] = (path: SVGPathElement, precision: number) => {
  const n = path.getTotalLength(),
    t = [0]
  let i = 0
  while ((i += precision) < n) t.push(i)
  t.push(n)
  return t.map(function (t) {
    const p = path.getPointAtLength(t)
    const a: Point = [p.x, p.y]
    a.t = t / n
    return a
  })
}

/**
 * Compute quads of adjacent points [p0, p1, p2, p3].
 * @param points
 */
const quads = (points: Points) => {
  return range(points.length - 1).map((i) => {
    const a: Points = [points[i - 1], points[i], points[i + 1], points[i + 2]]
    a.t = ((points[i].t as number) + (points[i + 1].t as number)) / 2
    return a
  })
}

// Compute stroke outline for segment p12.
const lineJoin = (p0: Point, p1: Point, p2: Point, p3: Point, width: number) => {
  const u12 = perp(p1, p2)
  const r = width / 2
  let a = [p1[0] + u12[0] * r, p1[1] + u12[1] * r]
  let b = [p2[0] + u12[0] * r, p2[1] + u12[1] * r]
  let c = [p2[0] - u12[0] * r, p2[1] - u12[1] * r]
  let d = [p1[0] - u12[0] * r, p1[1] - u12[1] * r]

  if (p0) {
    // clip ad and dc using average of u01 and u12
    const u01 = perp(p0, p1)
    const e = [p1[0] + u01[0] + u12[0], p1[1] + u01[1] + u12[1]]
    a = lineIntersect(p1, e, a, b)
    d = lineIntersect(p1, e, d, c)
  }

  if (p3) {
    // clip ab and dc using average of u12 and u23
    const u23 = perp(p2, p3),
      e = [p2[0] + u23[0] + u12[0], p2[1] + u23[1] + u12[1]]
    b = lineIntersect(p2, e, a, b)
    c = lineIntersect(p2, e, d, c)
  }

  return 'M' + a + 'L' + b + ' ' + c + ' ' + d + 'Z'
}

// Compute intersection of two infinite lines ab and cd.
function lineIntersect(a: Point, b: Point, c: Point, d: Point) {
  const x1 = c[0]
  const x3 = a[0]
  const x21 = d[0] - x1
  const x43 = b[0] - x3
  const y1 = c[1]
  const y3 = a[1]
  const y21 = d[1] - y1
  const y43 = b[1] - y3
  const ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21)
  return [x1 + ua * x21, y1 + ua * y21]
}

/**
 * Compute unit vector perpendicular to p01.
 * @param p0
 * @param p1
 */
const perp = (p0: Point, p1: Point) => {
  const u01x = p0[1] - p1[1],
    u01y = p1[0] - p0[0],
    u01d = Math.sqrt(u01x * u01x + u01y * u01y)
  return [u01x / u01d, u01y / u01d]
}
