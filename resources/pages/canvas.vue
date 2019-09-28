<template>
  <VCanvas
    :canvas="canvas"
  />
</template>

<script>
import VCanvas from '~/components/VCanvas.vue'
import { mapGetters, mapActions } from 'vuex'
import ListManager from '~/components/ListManager.vue'
import PersonaListManager from '~/components/PersonaListManager.vue'

export default {
  name: 'CanvasPage',

  components: { VCanvas, ListManager, PersonaListManager },

  data () {
    return {
      canvas: false,
      personas: []
    }
  },

  computed: {
    ...mapGetters('project', [
      'currentProject',
      'currentStep',
      'canvasReady'
    ])
  },

  created () {
    if (!this.currentProject) {
      return this.$router.push('/projects')
    }

    this.readCanvasFromProject()

    this.$axios.$get(`/api/projects/${this.currentProject.id}/personas`)
      .then(personas => {
        this.personas = personas
      })
      .catch(() => {
        this.$message.error('Failed to load personas')
      })
  },

  methods: {
    ...mapActions('project', [
      'updateProjectCanvas'
    ]),

    readCanvasFromProject () {
      const canvas = this.currentProject.canvas || {
        problems: [],
        solutions: [],
        is: [],
        isnt: [],
        constraints: []
      }

      this.canvas = {
        problems: canvas.problems.concat(),
        solutions: canvas.solutions.concat(),
        is: canvas.is.concat(),
        isnt: canvas.isnt.concat(),
        constraints: canvas.constraints.concat()
      }
    },

    canvasChanged () {
      this.updateProjectCanvas(this.canvas)
    }
  },

  watch: {
    canvas: {
      deep: true,
      handler () {
        this.canvasChanged()
      }
    }
  }
}
</script>

