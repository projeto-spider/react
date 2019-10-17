export const ceremonies = [
  {
    name: 'Inception',
    parts: ['Product Canvas', 'Personas', 'Goal Sketch']
  },

  {
    name: 'Story Discovery',
    parts: ['Stories', 'Overall Model', 'Priorization']
  },

  {
    name: 'Refining',
    parts: ['Refining']
  },

  {
    name: 'Modeling',
    parts: [
      'Functional Modeling',
      'Interface Modeling',
      'Operational Concepts Modeling'
    ]
  },

  {
    name: 'Inspection',
    parts: ['Inspection']
  }
]

export const steps = ceremonies
  .map(ceremony => ceremony.parts.map(part => [ceremony.name, part]))
  .reduce((acc, xs) => acc.concat(xs), [])

export function validStep(step) {
  return !!steps[step]
}

export function stepName(step) {
  return steps[step]
}
