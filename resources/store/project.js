import Vue from 'vue'
import * as react from '@/react'
import { ceremonies } from '../react'

export const state = () => ({
  selected: false,
  personas: [],
  step: 0
})

export const mutations = {
  selectProject (state, project) {
    state.selected = project
    state.step = recoverStepFor(project)
  },

  updateCanvas (state, canvas) {
    Vue.set(state.selected, 'canvas', copy(canvas))
  },

  updatePersonas (state, personas) {
    state.personas = copy(personas)
  },

  nextStep (state) {
    const nextStep = Math.min(state.step + 1, react.steps.length)
    state.step = nextStep
    saveStepFor(state.selected, nextStep)
  }
}

export const getters = {
  isProjectSelected ({ selected }) {
    return !!selected
  },

  currentProject ({ selected }) {
    return selected
  },

  currentStep ({ step }) {
    return step
  },

  currentStepName ({ step }) {
    return react.stepName(step)
  },

  currentCeremony ({ step }) {
    const [ceremonyName] = react.stepName(step)
    return ceremonies.find(ceremony => ceremony.name === ceremonyName)
  },

  canContinue (state, getters) {
    const { step } = state

    if (step === 2) {
      return goalReady(state)
    }

    if (step === 1) {
      return hasPersonas(state)
    }

    if (step === 0) {
      return getters.canvasReady
    }
    return false
  },

  canvasReady ({ selected }) {
    return ['problems', 'solutions', 'is', 'isnt', 'constraints'].every(
      prop => selected.canvas && selected.canvas[prop].length > 0
    )
  }
}

export const actions = {
  updateProjectCanvas ({ state, commit }, canvas) {
    const { id } = state.selected
    commit('updateCanvas', canvas)

    return this.$axios.$put(`/api/projects/${id}`, { canvas })
  }
}

function recoverStepFor (project) {
  const key = `react-project-${project.id}-step`
  const value = localStorage.getItem(key)

  if (!isFinite(value) || !react.validStep(value)) {
    return 0
  }

  return Number(value)
}

function saveStepFor (project, step) {
  const key = `react-project-${project.id}-step`
  localStorage.setItem(key, step)
}

function hasPersonas ({ personas }) {
  return personas.length
}

function goalReady (state) {
  return false
}

function copy (data) {
  return JSON.parse(JSON.stringify(data))
}
