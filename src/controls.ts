import { signal } from '@preact/signals-core'

const getToggleSolutionControl = () => document.querySelector('#toggle-solution') as HTMLInputElement
export const toggleSolution = signal<boolean>(getToggleSolutionControl().checked)
getToggleSolutionControl().addEventListener('change', (event) => {
  toggleSolution.value = (event.target as HTMLInputElement).checked
})

const getToggleGridControl = () => document.querySelector('#toggle-grid') as HTMLInputElement
export const toggleGrid = signal<boolean>(getToggleGridControl().checked)
getToggleGridControl().addEventListener('change', (event) => {
  toggleGrid.value = (event.target as HTMLInputElement).checked
})
