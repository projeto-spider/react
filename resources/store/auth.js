export const state = () => ({
  token: false,
  user: false
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },

  setToken(state, token) {
    state.token = token
  }
}

export const getters = {
  isLoggedIn({ token }) {
    return !!token
  },

  currentUser({ user }) {
    return user
  }
}

export const actions = {
  login({ commit }, { email, password }) {
    return this.$axios
      .$post('/api/login', { email, password })
      .then(async ({ token }) => {
        this.$axios.setToken(token, 'Bearer')
        const user = await this.$axios.$get('/api/me')
        commit('setToken', token)
        commit('setUser', user)
      })
  },

  register({ dispatch }, { email, name, password }) {
    return this.$axios
      .$post('/api/users', { email, name, password })
      .then(() => {
        return dispatch('login', { email, password })
      })
  },

  logout({ commit }) {
    commit('setToken', false)
    commit('setUser', false)
  }
}
