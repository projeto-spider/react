<template>
  <a-layout id="header" class="layout">
    <a-layout-header
      class="ant-layout-header-auth"
      :class="{ 'ant-layout-header-logged-in': isLoggedIn }"
    >
      <a-menu
        :theme="isLoggedIn ? 'dark' : 'light'"
        mode="horizontal"
        :style="{
          lineHeight: '64px',
          'background-color': 'rgba(0, 0, 0, 0) !important'
        }"
        @click="clickMenuItem"
      >
        <template v-if="showMenu">
          <a-menu-item key="canvas">
            Canvas
          </a-menu-item>

          <a-menu-item
            key="goal-sketch"
            :disabled="!insideFake && currentStep < 2"
          >
            Goal Sketch
          </a-menu-item>

          <a-menu-item
            key="backlog-page"
            :disabled="!insideFake && currentStep < 2"
          >
            Backlog
          </a-menu-item>

          <a-menu-item
            key="overall-model"
            :disabled="!insideFake && currentStep < 2"
          >
            Overall Model
          </a-menu-item>

          <a-menu-item
            key="interfaces"
            :disabled="insideFake && currentStep < 2"
          >
            Interfaces
          </a-menu-item>

          <a-menu-item
            key="inspection"
            :disabled="!insideFake && currentStep < 2"
          >
            Inspection
          </a-menu-item>

          <a-menu-item
            key="inspection-backlog"
            :disabled="!insideFake && currentStep < 2"
          >
            Inspection Backlog
          </a-menu-item>
        </template>

        <template>
          <template v-if="isLoggedIn">
            <a-menu-item
              key="logout"
              style="float: right"
              @click="$router.push({ name: 'logout' })"
            >
              Logout
            </a-menu-item>

            <a-menu-item
              key="projects"
              style="float: right"
              @click="$router.push({ name: 'projects' })"
            >
              Projects
            </a-menu-item>
          </template>

          <template v-else>
            <a-menu-item
              key="register"
              style="float: right"
              @click="$router.push({ name: 'register' })"
            >
              Register
            </a-menu-item>

            <a-menu-item
              key="login"
              style="float: right"
              @click="$router.push({ name: 'login' })"
            >
              Login
            </a-menu-item>
          </template>
        </template>
      </a-menu>
    </a-layout-header>

    <a-layout-content style="padding: 0 10px">
      <div style="margin: 16px 0" />
      <nuxt />
      <StepManager v-if="isProjectSelected" />
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

  data() {
    return {
      collapsed: false
    }
  },

  computed: {
    ...mapGetters('auth', ['isLoggedIn']),

    ...mapGetters('project', ['isProjectSelected', 'currentStep']),

    insideFake() {
      return this.$route.fullPath.includes('/fake')
    },

    showMenu() {
      if (this.insideFake) {
        return true
      }

      return this.isLoggedIn && this.isProjectSelected
    }
  },

  methods: {
    clickMenuItem({ key }) {
      const special = ['login', 'register', 'projects', 'logout']

      if (special.includes(key) && this.insideFake) {
        return this.$router.push(`../${key}`)
      }

      this.$router.push(key)
    }
  }
}
</script>

<style>
html,
body {
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
  transition: background-size 0.5s, color 0.5s;
}

.ant-layout-header.ant-layout-header-auth.ant-layout-header-logged-in {
  background-size: 100% 100%;
}
</style>
