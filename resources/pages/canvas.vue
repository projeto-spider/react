<template>
  <VCanvas
    :project-name="currentProject.name"
    :canvas="canvas"
    :personas="personasPromise"
    :enable-personas="currentStep >= 1"
    :persona-added-handler="addPersona"
    :persona-edited-handler="editPersona"
    :persona-deleted-handler="deletePersona"
    @canvasChanged="onCanvasChanged"
    @personasChanged="onPersonasChanged"
  />
</template>

<script>
import VCanvas from '~/components/VCanvas.vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import ListManager from '~/components/ListManager.vue'
import PersonaListManager from '~/components/PersonaListManager.vue'

export default {
  name: 'CanvasPage',

  components: { VCanvas, ListManager, PersonaListManager },

  data () {
    return {
      canvas: false,
      personas: [],
      personasPromise: null
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

    this.personasPromise = this.$axios.$get(`/api/projects/${this.currentProject.id}/personas`)
      .then(personas => {
        this.personas = personas
        return personas
      })
      .catch(() => {
        this.$message.error('Failed to load personas')
        return []
      })
  },

  methods: {
    ...mapActions('project', [
      'updateProjectCanvas'
    ]),

    ...mapMutations('project', [
      'updatePersonas'
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

    onCanvasChanged (canvas) {
      this.updateProjectCanvas(canvas)
    },

    addPersona (persona) {
      return this.$axios.$post(`/api/projects/${this.currentProject.id}/personas`, persona)
    },

    editPersona (persona, payload) {
      return this.$axios.$put(`/api/projects/${this.currentProject.id}/personas/${persona.id}`, payload)
    },

    deletePersona (persona) {
      return this.$axios.$delete(`/api/projects/${this.currentProject.id}/personas/${persona.id}`)
    },

    onPersonasChanged(personas) {
      this.updatePersonas(personas)
      // this.personas = personas
    }
  }
}
</script>

