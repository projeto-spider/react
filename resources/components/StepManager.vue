<template>
  <div style="position: fixed; bottom: 15px; right: 15px">
    <a-button-group>
      <a-button
        type="primary"
        icon="menu-unfold"
        @click="modalVisible = true"
      />
      <a-button disabled style="cursor: default; color: black">
        {{ currentStepName[0] }} - {{ currentStepName[1] }}
      </a-button>
      <a-button
        type="primary"
        :disabled="!canContinue"
        icon="caret-right"
        @click="nextStep"
      />
    </a-button-group>

    <div
      v-show="modalVisible"
      class="ant-modal-mask"
      style="background-color: rgba(0, 0, 0, 0.75)"
      @click="modalVisible = false"
    />

    <div
      v-show="modalVisible"
      class="ant-modal-wrap ant-modal-progress"
      @click="modalVisible = false"
    >
      <a-steps
        progress-dot
        :current="ceremoniesCount"
        class="animated fadeInUp"
        style="animation-delay: .2s"
      >
        <a-step
          v-for="(ceremony, i) in ceremonies"
          :key="i"
          :title="ceremony.name"
        />
      </a-steps>

      <div style="margin: 50px auto 0">
        <a-steps
          v-if="openCeremony"
          direction="vertical"
          :current="ceremoniesPartCount"
          class="animated fadeInUp"
          style="animation-delay: .3s"
        >
          <a-step
            v-for="(step, i) in openCeremony.parts"
            :key="i"
            :title="step"
          />
        </a-steps>
      </div>

      <a-button
        type="primary"
        class="btn-continue"
        @click="modalVisible = false"
      >
        Hide
      </a-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { ceremonies } from '@/react'

export default {
  name: 'StepManager',

  data: () => ({
    ceremonies,
    modalVisible: false,
    openCeremonyIndex: 0
  }),

  computed: {
    ...mapGetters('project', [
      'currentCeremony',
      'currentStepName',
      'canContinue'
    ]),

    openCeremony() {
      return this.ceremonies.find(
        ceremony => ceremony.name === this.currentCeremony.name
      )
    },

    ceremoniesCount() {
      const currentCeremonyIndex = this.ceremonies.indexOf(this.openCeremony)
      return currentCeremonyIndex
    },

    ceremoniesPartCount() {
      const currentPartIndex = this.openCeremony.parts.indexOf(
        this.currentStepName[1]
      )
      return currentPartIndex
    }
  },

  watch: {
    currentStepName() {
      this.modalVisible = true
    }
  },

  mounted() {
    this.openCeremonyIndex = ceremonies.indexOf(this.currentCeremony)
  },

  methods: {
    ...mapMutations('project', ['nextStep'])
  }
}
</script>

<style>
.ant-modal-wrap.ant-modal-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 20px;
}

.ant-modal-wrap.ant-modal-progress .ant-steps-item-content > * {
  color: white !important;
}

.ant-modal-progress .btn-continue {
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
