<template>
  <a-layout
    id="header"
    class="layout"
  >
    <a-layout-header
      class="ant-layout-header-auth"
      :class="{ 'ant-layout-header-logged-in': isLoggedIn }"
    >
      <a-menu
        :theme="isLoggedIn ? 'dark' : 'light'"
        mode="horizontal"
        :style="{ lineHeight: '64px', 'background-color': 'rgba(0, 0, 0, 0) !important' }"
      >
        <template v-if="isLoggedIn">
          <a-menu-item key="canvas">
            Canvas
          </a-menu-item>

          <a-menu-item key="goal-sketch">
            Goal Sketch
          </a-menu-item>

          <a-menu-item key="storyboard">
            Story Board
          </a-menu-item>

          <a-menu-item key="overall-model">
            Overall Model
          </a-menu-item>
        </template>

        <template>
          <a-menu-item
            v-if="isLoggedIn"
            key="logout"
            style="float: right"
            @click="$router.push('/logout')"
          >
            Logout
          </a-menu-item>

          <template v-else>
            <a-menu-item
              key="register"
              style="float: right"
              @click="$router.push('/register')"
            >
              Register
            </a-menu-item>

            <a-menu-item
              key="login"
              style="float: right"
              @click="$router.push('/login')"
            >
              Login
            </a-menu-item>
          </template>
        </template>

      </a-menu>
    </a-layout-header>

    <a-layout-content style="padding: 0 50px">
      <div style="margin: 16px 0" />
      <nuxt />
    </a-layout-content>

    <a-layout-footer style="text-align: center">
      Projeto SPIDER - R.E.A.C.T.
    </a-layout-footer>
  </a-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      collapsed: false
    }
  },

  computed: {
    ...mapGetters('auth', [
      'isLoggedIn'
    ])
  },

  methods: {
  }
}
</script>

<style>
html, body {
  background-color: #f0f2f5 !important;
}

.ant-layout-header.ant-layout-header-auth {
  background: white;
  background-image: linear-gradient(#001529, #001529);
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size .5s, color .5s;
}

.ant-layout-header.ant-layout-header-auth.ant-layout-header-logged-in {
  background-size: 100% 100%;
}
</style>
