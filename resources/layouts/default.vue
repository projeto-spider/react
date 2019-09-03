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
        @click="clickMenuItem"
      >
        <template v-if="isLoggedIn && isProjectSelected">
          <a-menu-item key="canvas">
            Canvas
          </a-menu-item>

          <a-menu-item key="goal-sketch" :disabled="currentStep < 2">
            Goal Sketch
          </a-menu-item>

          <a-menu-item key="backlog-page" :disabled="currentStep < 2">
            Backlog
          </a-menu-item>

          <a-menu-item key="overall-model" :disabled="currentStep < 2">
            Overall Model
          </a-menu-item>

          <a-menu-item key="interfaces" :disabled="currentStep < 2">
            Interfaces
          </a-menu-item>

          <a-menu-item key="storyboard" :disabled="currentStep < 100">
            Story Board
          </a-menu-item>
        </template>

        <template>
          <template v-if="isLoggedIn">
            <a-menu-item
              key="logout"
              style="float: right"
              @click="$router.push('/logout')"
            >
              Logout
            </a-menu-item>

            <a-menu-item

              key="projects"
              style="float: right"
              @click="$router.push('/projects')"
            >
              Projects
            </a-menu-item>
          </template>

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
      <StepManager v-if="isProjectSelected"></StepManager>
    </a-layout-content>

    <a-layout-footer style="text-align: center">
      Projeto SPIDER - R.E.A.C.T.
    </a-layout-footer>
  </a-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import StepManager from '@/components/StepManager'

export default {
  components: { StepManager },

  data () {
    return {
      collapsed: false
    }
  },

  computed: {
    ...mapGetters('auth', [
      'isLoggedIn'
    ]),

    ...mapGetters('project', [
      'isProjectSelected',
      'currentStep'
    ])
  },

  methods: {
    clickMenuItem ({key}) {
      this.$router.push(key)
    }
  }
}
</script>

<style>
html, body {
  background-color: #f0f2f5 !important;
}

.full-width-modal-open {
  overflow: hidden;
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
