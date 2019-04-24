import VuexPersistence from 'vuex-persist'

export default ({ app, store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
      modules: ['auth']
    }).plugin(store)

    app.$axios.setToken(store.state.auth.token, 'Bearer')
  })
}
