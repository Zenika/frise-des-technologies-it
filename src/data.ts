const data = {
  nodes: [
    { id: 'python-1', name: 'Python 1', date: '1994-01-01T00:00:00Z' },
    { id: 'python-2', name: 'Python 2', date: '2001-06-01T00:00:00Z' },
    { id: 'python-3', name: 'Python 3', date: '2008-12-01T00:00:00Z' },
    { id: 'java-1', name: 'Java 1', date: '1996-01-01T00:00:00Z' },
    { id: 'java-1.2', name: 'Java 1.2', date: '1998-12-01T00:00:00Z' },
    { id: 'java-1.4', name: 'Java 1.4', date: '2002-02-01T00:00:00Z' },
    { id: 'java-5.0', name: 'Java 5.0', date: '2004-11-01T00:00:00Z' },
    { id: 'java-8', name: 'Java 8', date: '2014-03-01T00:00:00Z' },
    { id: 'spring-1', name: 'Spring Framework 1', date: '2004-03-01T00:00:00Z' },
    { id: 'js-1', name: 'JavaScript 1', date: '1995-12-01T00:00:00Z' },
    { id: 'angular-js', name: 'AngularJS', date: '2009-01-01T00:00:00Z' },
    { id: 'jhipster', name: 'JHipster', date: '2014-01-01T00:00:00Z' },
  ],
  links: [
    { source: 'python-1', target: 'python-2' },
    { source: 'python-2', target: 'python-3' },
    { source: 'java-1', target: 'java-1.2' },
    { source: 'java-1.2', target: 'java-1.4' },
    { source: 'java-1.4', target: 'java-5.0' },
    { source: 'java-5.0', target: 'java-8' },
    { source: 'java-1.4', target: 'spring-1' },
    { source: 'js-1', target: 'angular-js' },
    { source: 'spring-1', target: 'jhipster' },
    { source: 'angular-js', target: 'jhipster' },
  ],
}

export default data
