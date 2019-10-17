<template>
  <div>
    <a-button type="primary" @click="showModal">
      Open Modal
    </a-button>

    <div
      v-show="visible"
      class="ant-modal-mask"
      style="background-color: rgba(0, 0, 0, 0.75)"
    />

    <div v-show="visible" class="ant-modal-wrap">
      <a-steps
        progress-dot
        :current="3"
        class="animated fadeInUp"
        style="animation-delay: .2s"
      >
        <a-step title="Inception" />
        <a-step title="Story Discovery" />
        <a-step title="Refining" />
        <a-step title="Modeling" />
        <a-step title="Inspection" />
      </a-steps>

      <div style="margin: 50px auto 0">
        <a-steps
          direction="vertical"
          :current="2"
          class="animated fadeInUp"
          style="animation-delay: .3s"
        >
          <a-step title="Functional Modeling" />
          <a-step title="Interface Modeling" />
          <a-step title="Operational Concepts Modeling" />
        </a-steps>
      </div>

      <a-button type="primary" class="btn-continue" @click="handleContinue">
        Continue
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressPage',

  data() {
    return {
      visible: false
    }
  },

  methods: {
    showModal() {
      this.visible = true
    },

    handleContinue() {
      this.visible = false
    }
  }
}
</script>

<style>
.ant-modal-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 20px;
}

.ant-modal-wrap .ant-steps-item-content > * {
  color: white !important;
}

.btn-continue {
  position: fixed;
  bottom: 30px;
  right: 30px;
}

/* Animation */
/* Source: https://codepen.io/themechills/pen/dMamgG/ */

@keyframes fadeInUp {
  from {
    transform: translate3d(0, 40px, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@-webkit-keyframes fadeInUp {
  from {
    transform: translate3d(0, 40px, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.animatedFadeInUp {
  opacity: 0;
}

.fadeInUp {
  opacity: 0;
  animation-name: fadeInUp;
}
</style>
