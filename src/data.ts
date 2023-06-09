const nodes = [
  {id: 'Python-1', name: 'Python 1', date: '1994-01-01T00:00:00Z', color: '#3774a3', logo: 'assets/python-1.svg'},
  {id: 'Python-2', name: 'Python 2', date: '2001-06-01T00:00:00Z', color: '#3774a3', logo: 'assets/python-1.svg'},
  {id: 'Python-3', name: 'Python 3', date: '2008-12-01T00:00:00Z', color: '#3774a3', logo: 'assets/python-3.svg'},
  {id: 'Java-1', name: 'Java 1', date: '1996-01-01T00:00:00Z', color: '#49509c', logo: 'assets/java-1.svg'},
  {id: 'Java-1.2', name: 'Java 1.2', date: '1998-12-01T00:00:00Z', color: '#49509c', logo: 'assets/java-1.svg'},
  {id: 'Java-1.4', name: 'Java 1.4', date: '2002-02-01T00:00:00Z', color: '#49509c', logo: 'assets/java-1.svg'},
  {id: 'Java-5.0', name: 'Java 5.0', date: '2004-11-01T00:00:00Z', color: '#49509c', logo: 'assets/java-5.svg'},
  {id: 'Java-8', name: 'Java 8', date: '2014-03-01T00:00:00Z', color: '#49509c', logo: 'assets/java-5.svg'},
  {id: 'Java-11', name: 'Java 11', date: '2018-09-01T00:00:00Z', color: '#49509c', logo: 'assets/java-5.svg'},
  {id: 'Java-17', name: 'Java 17', date: '2021-09-01T00:00:00Z', color: '#49509c', logo: 'assets/java-5.svg'},
  {id: 'Scala-1.0', name: 'Scala 1.0', date: '2003-01-01T00:00:00Z', color: '#de3423ff', logo: 'assets/scala.svg'},
  {id: 'Scala-2.0', name: 'Scala 2.0', date: '2006-03-01T00:00:00Z', color: '#de3423ff', logo: 'assets/scala.svg'},
  {id: 'Scala-3.0', name: 'Scala 3.0', date: '2021-05-01T00:00:00Z', color: '#de3423ff', logo: 'assets/scala.svg'},
  {id: 'Kotlin-1.0', name: 'Kotlin 1.0', date: '2016-02-01T00:00:00Z', color: '#c711e1ff', logo: 'assets/kotlin.svg'},
  {id: 'Kotlin-1.3', name: 'Kotlin 1.3', date: '2018-10-01T00:00:00Z', color: '#c711e1ff', logo: 'assets/kotlin.svg'},
  {id: 'Kotlin-1.7', name: 'Kotlin 1.7', date: '2022-06-01T00:00:00Z', color: '#c711e1ff', logo: 'assets/kotlin.svg'},
  {id: 'Spring-1.0', name: 'Spring 1.0', date: '2004-03-01T00:00:00Z', color: '#d2fa46', logo: 'assets/spring.svg'},
  {id: 'Spring-2.x', name: 'Spring 2.x', date: '2006-10-01T00:00:00Z', color: '#d2fa46', logo: 'assets/spring.svg'},
  {id: 'Spring-3.x', name: 'Spring 3.x', date: '2009-12-01T00:00:00Z', color: '#d2fa46', logo: 'assets/spring.svg'},
  {id: 'Spring-4.x', name: 'Spring 4.x', date: '2013-12-01T00:00:00Z', color: '#d2fa46', logo: 'assets/spring.svg'},
  {id: 'Spring-5.0', name: 'Spring 5.0', date: '2017-09-01T00:00:00Z', color: '#d2fa46', logo: 'assets/spring.svg'},
  {id: 'SpringBoot-1.0', name: 'SpringBoot 1.0', date: '2014-04-01T00:00:00Z', color: '#6db33fff', logo: 'assets/spring-boot.svg'},
  {id: 'SpringBoot-2.0', name: 'SpringBoot 2.0', date: '2021-05-01T00:00:00Z', color: '#6db33fff', logo: 'assets/spring-boot.svg'},
  {id: 'SpringBoot-3.0', name: 'SpringBoot 3.0', date: '2022-11-01T00:00:00Z', color: '#6db33fff', logo: 'assets/spring-boot.svg'},
  {id: 'PHP-1', name: 'PHP 1', date: '1995-05-01T00:00:00Z', color: '#777bb3', logo: 'assets/elephpant.svg'},
  {id: 'PHP-3', name: 'PHP 3', date: '1998-06-01T00:00:00Z', color: '#777bb3', logo: 'assets/elephpant.svg'},
  {id: 'PHP-5', name: 'PHP 5', date: '2004-07-01T00:00:00Z', color: '#777bb3', logo: 'assets/elephpant.svg'},
  {id: 'PHP-7', name: 'PHP 7', date: '2015-12-01T00:00:00Z', color: '#777bb3', logo: 'assets/elephpant.svg'},
  {id: 'PHP-8', name: 'PHP 8', date: '2020-11-01T00:00:00Z', color: '#777bb3', logo: 'assets/elephpant.svg'},
  {id: 'Ruby-1', name: 'Ruby 1', date: '1996-12-01T00:00:00Z', color: '#a81501', logo: 'assets/ruby.svg'},
  {id: 'Ruby-2', name: 'Ruby 2', date: '2013-02-01T00:00:00Z', color: '#a81501', logo: 'assets/ruby.svg'},
  {id: 'Ruby-3', name: 'Ruby 3', date: '2020-12-01T00:00:00Z', color: '#a81501', logo: 'assets/ruby.svg'},
  {id: 'Fortran-1', name: 'Fortran 1', date: '1957-04-01T00:00:00Z', color: '#734f96', logo: 'assets/fortran.svg'},
  {id: 'Fortran-2', name: 'Fortran 2', date: '1958-01-01T00:00:00Z', color: '#734f96', logo: 'assets/fortran.svg'},
  {id: 'Fortran-66', name: 'Fortran 66', date: '1966-03-01T00:00:00Z', color: '#734f96', logo: 'assets/fortran.svg'},
  {id: 'Fortran-77', name: 'Fortran 77', date: '1978-04-01T00:00:00Z', color: '#734f96', logo: 'assets/fortran.svg'},
  {id: 'Fortran-90', name: 'Fortran 90', date: '1991-01-01T00:00:00Z', color: '#734f96', logo: 'assets/fortran.svg'},
  {id: 'Fortran-2003', name: 'Fortran 2003', date: '2004-05-01T00:00:00Z', color: '#734f96', logo: 'assets/fortran.svg'},
  {id: 'Fortran-2008', name: 'Fortran 2008', date: '2010-09-01T00:00:00Z', color: '#734f96', logo: 'assets/fortran.svg'},
  {id: 'Fortran-2018', name: 'Fortran 2018', date: '2018-11-01T00:00:00Z', color: '#734f96', logo: 'assets/fortran.svg'},
  {id: 'Javascript-1', name: 'Javascript 1', date: '1995-12-01T00:00:00Z', color: '#e4a126', logo: 'assets/js.svg'},
  {id: 'Javascript-ECMA-262', name: 'Javascript ECMA-262', date: '1997-06-01T00:00:00Z', color: '#e4a126', logo: 'assets/js.svg'},
  {id: 'Javascript-ECMAScript_5', name: 'Javascript ECMAScript 5', date: '2009-12-01T00:00:00Z', color: '#e4a126', logo: 'assets/js.svg'},
  {id: 'Javascript-ECMAScript_6', name: 'Javascript ECMAScript 6', date: '2015-06-01T00:00:00Z', color: '#e4a126', logo: 'assets/js.svg'},
  {id: 'Node.js-0.10', name: 'Node.js 0.10', date: '2013-03-01T00:00:00Z', color: '#689f63', logo: 'assets/nodejs.svg'},
  {id: 'Node.js-0.12', name: 'Node.js 0.12', date: '2015-02-01T00:00:00Z', color: '#689f63', logo: 'assets/nodejs.svg'},
  {id: 'Node.js-io.js', name: 'Node.js io.js', date: '2014-12-01T00:00:00Z', color: '#f2df61', logo: 'assets/iojs.svg'},
  {id: 'Node.js-4', name: 'Node.js 4', date: '2015-09-01T00:00:00Z', color: '#689f63', logo: 'assets/nodejs.svg'},
  {id: 'Node.js-8', name: 'Node.js 8', date: '2017-05-01T00:00:00Z', color: '#689f63', logo: 'assets/nodejs.svg'},
  {id: 'Node.js-10', name: 'Node.js 10', date: '2018-04-01T00:00:00Z', color: '#689f63', logo: 'assets/nodejs.svg'},
  {id: 'Node.js-16', name: 'Node.js 16', date: '2021-04-01T00:00:00Z', color: '#689f63', logo: 'assets/nodejs.svg'},
  {id: 'Node.js-18', name: 'Node.js 18', date: '2022-04-01T00:00:00Z', color: '#689f63', logo: 'assets/nodejs.svg'},
  {id: 'Deno-1.0.0', name: 'Deno 1.0.0', date: '2020-05-01T00:00:00Z', color: '#000000', logo: 'assets/deno.svg'},
  {id: 'Express.js-0.12', name: 'Express.js 0.12', date: '2010-11-01T00:00:00Z', color: 'gray', logo: 'assets/expressjs.svg'},
  {id: 'Express.js-4.18.2', name: 'Express.js 4.18.2', date: '2022-10-01T00:00:00Z', color: 'gray', logo: 'assets/expressjs.svg'},
  {id: 'Socket.IO-0.3.8', name: 'Socket.IO 0.3.8', date: '2010-12-01T00:00:00Z', color: '#25c2a0', logo: 'assets/socket-io.svg'},
  {id: 'Typescript-0.8', name: 'Typescript 0.8', date: '2012-10-01T00:00:00Z', color: '#3178c6', logo: 'assets/typescript.svg'},
  {id: 'Ada-80', name: 'Ada 80', date: '1980-02-01T00:00:00Z', color: '#005a00', logo: 'assets/ada.svg'},
  {id: 'Pascal-70', name: 'Pascal 70', date: '1970-07-01T00:00:00Z', color: '##1b5e99', logo: 'assets/pascal.svg'},
  {id: 'Perl-1.0', name: 'Perl 1.0', date: '1987-12-01T00:00:00Z', color: '#004065', logo: 'assets/perl.svg'},
  {id: 'C-C', name: 'C C', date: '1973-01-01T00:00:00Z', color: '#a9bacd', logo: 'assets/c.svg'},
  {id: 'C-K&R', name: 'C K&R', date: '1978-02-01T00:00:00Z', color: '#a9bacd', logo: 'assets/c.svg'},
  {id: 'C-ANSI', name: 'C ANSI', date: '1990-12-01T00:00:00Z', color: '#a9bacd', logo: 'assets/c.svg'},
  {id: 'C-C99', name: 'C C99', date: '1999-12-01T00:00:00Z', color: '#a9bacd', logo: 'assets/c.svg'},
  {id: 'C-C11', name: 'C C11', date: '2011-12-01T00:00:00Z', color: '#a9bacd', logo: 'assets/c.svg'},
  {id: 'C-C17', name: 'C C17', date: '2018-06-01T00:00:00Z', color: '#a9bacd', logo: 'assets/c.svg'},
  {id: 'C++-1985', name: 'C++ 1985', date: '1983-07-01T00:00:00Z', color: '#00599c', logo: 'assets/cplusplus.svg'},
  {id: 'Cobol-60', name: 'Cobol 60', date: '1959-09-01T00:00:00Z', color: 'Fortran-2', logo: 'assets/cobol.svg'},
  {id: 'Lisp-1', name: 'Lisp 1', date: '1960-04-01T00:00:00Z', color: 'gray', logo: 'assets/lisp.svg'},
  {id: 'Assembleur-1947', name: 'Assembleur 1947', date: '1949-07-01T00:00:00Z', color: '#0000bf', logo: 'assets/assembly.svg'},
  {id: 'jquery-1.0', name: 'jquery 1.0', date: '2006-08-01T00:00:00Z', color: '#0868ac', logo: 'assets/jquery.svg'},
  {id: 'Dojo-1.0', name: 'Dojo 1.0', date: '2005-03-01T00:00:00Z', color: '#9b2da6', logo: 'assets/dojo.svg'},
  {id: 'Angular-1', name: 'Angular 1', date: '2010-10-01T00:00:00Z', color: '#dd1b16', logo: 'assets/angularjs.svg'},
  {id: 'Angular-2', name: 'Angular 2', date: '2016-09-01T00:00:00Z', color: '#dd0031', logo: 'assets/angular2.svg'},
  {id: 'JHipster-1', name: 'JHipster 1', date: '2013-10-01T00:00:00Z', color: '#4189c6', logo: 'assets/jhipster.svg'},
  {id: 'KnockoutJS-1', name: 'KnockoutJS 1', date: '2010-07-01T00:00:00Z', color: '#e42e16', logo: 'assets/knockout-js.svg'},
  {id: 'Docker-1', name: 'Docker 1', date: '2013-03-01T00:00:00Z', color: '#2496ed', logo: 'assets/docker.svg'},
  {id: 'kubernetes-1.0', name: 'kubernetes 1.0', date: '2015-07-01T00:00:00Z', color: '#326ce5', logo: 'assets/kubernetes.svg'},
  {id: 'Helm-1.0', name: 'Helm 1.0', date: '2016-02-01T00:00:00Z', color: '#0f1689', logo: 'assets/helm.svg'},
  {id: 'Scrum-1993', name: 'Scrum 1993', date: '1993-07-01T00:00:00Z', color: '#355064', logo: 'assets/scrum.svg'},
  {id: 'XtremeProgramming-1', name: 'XtremeProgramming 1', date: '1996-03-01T00:00:00Z', color: 'gray', logo: 'assets/extreme-programming.svg'},
  {id: 'Safe-1', name: 'Safe 1', date: '2011-07-01T00:00:00Z', color: '#033947', logo: 'assets/safe.svg'},
  {id: 'manifeste_agile-0', name: 'manifeste agile 0', date: '2001-02-01T00:00:00Z', color: '#e7d2cf', logo: 'assets/manifeste_agile.jpg'},
  {id: 'vcs-git', name: 'vcs git', date: '2005-04-01T00:00:00Z', color: '#f05133', logo: 'assets/git.svg'},
  {id: 'vcs-github', name: 'vcs github', date: '2008-02-01T00:00:00Z', color: 'gray', logo: 'assets/github.svg'},
  {id: 'vcs-gitlab', name: 'vcs gitlab', date: '2014-07-01T00:00:00Z', color: '#e24329', logo: 'assets/gitlab.svg'},
]
const links = [
  {source: 'Python-1', target: 'Python-2'},
  {source: 'Python-2', target: 'Python-3'},
  {source: 'Java-1', target: 'Java-1.2'},
  {source: 'Java-1.2', target: 'Java-1.4'},
  {source: 'Java-1.4', target: 'Java-5.0'},
  {source: 'Java-5.0', target: 'Java-8'},
  {source: 'Java-8', target: 'Java-11'},
  {source: 'Java-11', target: 'Java-17'},
  {source: 'Scala-1.0', target: 'Scala-2.0'},
  {source: 'Scala-2.0', target: 'Scala-3.0'},
  {source: 'Kotlin-1.0', target: 'Kotlin-1.3'},
  {source: 'Kotlin-1.3', target: 'Kotlin-1.7'},
  {source: 'Spring-1.0', target: 'Spring-2.x'},
  {source: 'Spring-2.x', target: 'Spring-3.x'},
  {source: 'Spring-3.x', target: 'Spring-4.x'},
  {source: 'Spring-4.x', target: 'Spring-5.0'},
  {source: 'SpringBoot-1.0', target: 'SpringBoot-2.0'},
  {source: 'SpringBoot-2.0', target: 'SpringBoot-3.0'},
  {source: 'PHP-1', target: 'PHP-3'},
  {source: 'PHP-3', target: 'PHP-5'},
  {source: 'PHP-5', target: 'PHP-7'},
  {source: 'PHP-7', target: 'PHP-8'},
  {source: 'Ruby-1', target: 'Ruby-2'},
  {source: 'Ruby-2', target: 'Ruby-3'},
  {source: 'Fortran-1', target: 'Fortran-2'},
  {source: 'Fortran-2', target: 'Fortran-66'},
  {source: 'Fortran-66', target: 'Fortran-77'},
  {source: 'Fortran-77', target: 'Fortran-90'},
  {source: 'Fortran-90', target: 'Fortran-2003'},
  {source: 'Fortran-2003', target: 'Fortran-2008'},
  {source: 'Fortran-2008', target: 'Fortran-2018'},
  {source: 'Javascript-1', target: 'Javascript-ECMA-262'},
  {source: 'Javascript-ECMA-262', target: 'Javascript-ECMAScript_5'},
  {source: 'Javascript-ECMAScript_5', target: 'Javascript-ECMAScript_6'},
  {source: 'Node.js-0.10', target: 'Node.js-0.12'},
  {source: 'Node.js-0.12', target: 'Node.js-io.js'},
  {source: 'Node.js-io.js', target: 'Node.js-4'},
  {source: 'Node.js-4', target: 'Node.js-8'},
  {source: 'Node.js-8', target: 'Node.js-10'},
  {source: 'Node.js-10', target: 'Node.js-16'},
  {source: 'Node.js-16', target: 'Node.js-18'},
  {source: 'Express.js-0.12', target: 'Express.js-4.18.2'},
  {source: 'C-C', target: 'C-K&R'},
  {source: 'C-K&R', target: 'C-ANSI'},
  {source: 'C-ANSI', target: 'C-C99'},
  {source: 'C-C99', target: 'C-C11'},
  {source: 'C-C11', target: 'C-C17'},
  {source: 'Angular-1', target: 'Angular-2'},
  {source: 'vcs-git', target: 'vcs-github'},
  {source: 'vcs-github', target: 'vcs-gitlab'},
  {source: 'C-ANSI', target: 'Python-1'},
  {source: 'Java-1.4', target: 'Scala-1.0'},
  {source: 'Java-8', target: 'Kotlin-1.0'},
  {source: 'Java-1.4', target: 'Spring-1.0'},
  {source: 'Spring-4.x', target: 'SpringBoot-1.0'},
  {source: 'Javascript-ECMAScript_5', target: 'Node.js-0.10'},
  {source: 'Node.js-10', target: 'Deno-1.0.0'},
  {source: 'Node.js-0.10', target: 'Express.js-0.12'},
  {source: 'Node.js-io.js', target: 'Socket.IO-0.3.8'},
  {source: 'Javascript-ECMAScript_5', target: 'Typescript-0.8'},
  {source: 'Pascal-70', target: 'Ada-80'},
  {source: 'C-K&R', target: 'Perl-1.0'},
  {source: 'Fortran-2', target: 'Cobol-60'},
  {source: 'C-K&R', target: 'C++-1985'},
  {source: 'Javascript-ECMA-262', target: 'jquery-1.0'},
  {source: 'Javascript-ECMA-262', target: 'Dojo-1.0'},
  {source: 'Javascript-ECMAScript_5', target: 'Angular-1'},
  {source: 'Spring-3.x', target: 'JHipster-1'},
  {source: 'Javascript-ECMAScript_5', target: 'KnockoutJS-1'},
  {source: 'Docker-1', target: 'kubernetes-1.0'},
  {source: 'kubernetes-1.0', target: 'Helm-1.0'},
  {source: 'manifeste_agile-0', target: 'Safe-1'},
  {source: 'XtremeProgramming-1', target: 'manifeste_agile-0'},
  {source: 'C-C99', target: 'vcs-git'},
  {source: 'vcs-git', target: 'vcs-github'},
  {source: 'vcs-git', target: 'vcs-gitlab'},
  {source: 'Angular-1', target: 'JHipster-1'},
  {source: 'Ruby-1', target: 'vcs-github'},
  {source: 'Ruby-2', target: 'vcs-gitlab'},
]
const data = {nodes: nodes, links: links}
export default data
