const data = {
  nodes: [
    { id: 0, name: 'Python 1', date: '1994-01-01T00:00:00Z' },
    { id: 1, name: 'Python 2', date: '2001-06-01T00:00:00Z' },
    { id: 2, name: 'Python 3', date: '2008-12-01T00:00:00Z' },
    { id: 3, name: 'Java 1', date: '1996-01-01T00:00:00Z' },
    { id: 4, name: 'Java 1.2', date: '1998-12-01T00:00:00Z' },
    { id: 5, name: 'Java 1.4', date: '2002-02-01T00:00:00Z' },
    { id: 6, name: 'Java 5.0', date: '2004-11-01T00:00:00Z' },
    { id: 7, name: 'Java 8', date: '2014-03-01T00:00:00Z' },
    { id: 8, name: 'Spring Framework 1', date: '2004-03-01T00:00:00Z' },
    { id: 9, name: 'JavaScript 1', date: '1995-12-01T00:00:00Z' },
    { id: 10, name: 'AngularJS', date: '2009-01-01T00:00:00Z' },
    { id: 11, name: 'JHipster', date: '2014-01-01T00:00:00Z' },
  ],
  links: [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 3, target: 4 },
    { source: 4, target: 5 },
    { source: 5, target: 6 },
    { source: 6, target: 7 },
    { source: 5, target: 8 },
    { source: 9, target: 10 },
    { source: 8, target: 11 },
    { source: 10, target: 11 },
  ],
}

export interface RawNode {
  id: number
  name: string
  date: string
}

export interface Node extends Omit<RawNode, 'date'> {
  date: Date
}

export default data
