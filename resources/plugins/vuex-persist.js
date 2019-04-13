import VuexPersistence from 'vuex-persist'

export default ({ app, store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
    }).plugin(store)

    app.$axios.setToken(store.state.auth.token, 'Bearer')
  })
}
