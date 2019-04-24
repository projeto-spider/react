export const state = () => ({
  selected: false
})

export const mutations = {
  selectProject (state, project) {
    state.selected = project
  }
}

export const getters = {
  isProjectSelected ({ selected }) {
    return !!selected
  },

  currentProject ({ selected }) {
    return selected
  }
}

export const actions = {
  updateProjectCanvas ({ state, commit }, canvas) {
    const { id } = state.selected

    return this.$axios.$put(`/api/projects/${id}`, { canvas })
  }
}
