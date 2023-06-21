import { signal } from '@preact/signals-core'

const getShowSolutionControl = () => document.querySelector('#show-solution') as HTMLInputElement

const showSolution = signal<boolean>(getShowSolutionControl().checked)

getShowSolutionControl().addEventListener('change', function (event) {
  showSolution.value = (event.target as HTMLInputElement).checked
})

export default showSolution
