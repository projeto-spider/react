'use strict'

const resolve = require('path').resolve

module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'R.E.A.C.T.',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Requirements Evolution in Agile ContexT'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Global CSS
   */
  css: ['~assets/css/main.css'],
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#744d82' },
  /*
   ** Render settings
   */
  render: { ssr: false },
  /*
   ** Point to resources
   */
  srcDir: resolve(__dirname, '..', 'resources'),
  /*
   ** Plugin settings
   */
  plugins: [
    { src: '~/plugins/vuex-persist', ssr: false },
    '~/plugins/tour',
    '~/plugins/antd'
  ],
  /*
   ** Plugin settings
   */
  modules: ['@nuxtjs/axios', '@nuxtjs/apollo'],
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'http://localhost:4000',
        wsEndpoint: 'ws://localhost:4000' // optional
      }
    }
  }
}
