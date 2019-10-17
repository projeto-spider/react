<template>
  <VCanvas
    project-name="Fake Project"
    :canvas="canvas"
    :personas="personasPromise"
    enable-personas
    :persona-added-handler="addPersona"
    :persona-edited-handler="editPersona"
    :persona-deleted-handler="deletePersona"
    @canvasChanged="onCanvasChanged"
    @personasChanged="onPersonasChanged"
  />
</template>

<script>
import VCanvas from '~/components/VCanvas.vue'
import { mapGetters } from 'vuex'

const fakePersona = rest => ({
  id: 1,
  projectId: 1,
  name: 'Unnamed Persona',
  role: 'Persona Role',
  data: {
    profile: ['Likes this'],
    expectations: ['Expect this'],
    goals: []
  },
  created_at: '2019-10-10 05:30:58',
  updated_at: '2019-10-10 05:30:59',
  ...rest
})

export default {
  name: 'CanvasPage',

  components: { VCanvas },

  data() {
    return {
      canvas: false,
      personas: [],
      personasPromise: null
    }
  },

  computed: {
    ...mapGetters('project', ['currentProject', 'currentStep', 'canvasReady'])
  },

  created() {
    this.readCanvasFromProject()

    const personas = [fakePersona()]

    this.personasPromise = Promise.resolve(personas)
      // this.$axios.$get(`/api/projects/${this.currentProject.id}/personas`)
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
    // ...mapActions('project', [
    //   'updateProjectCanvas'
    // ]),

    // ...mapMutations('project', [
    //   'updatePersonas'
    // ]),

    readCanvasFromProject() {
      this.canvas = {
        problems: ['Example Problem'],
        solutions: ['Example Solution'],
        is: ['It is this'],
        isnt: ['It isnt this'],
        constraints: ['Should be like this']
      }
    },

    onCanvasChanged() {
      // this.updateProjectCanvas(canvas)
    },

    addPersona() {
      return Promise.resolve(fakePersona())
      // return this.$axios.$post(`/api/projects/${this.currentProject.id}/personas`, persona)
    },

    editPersona(persona, payload) {
      return Promise.resolve(Object.assign({}, persona, payload))
      // return this.$axios.$put(`/api/projects/${this.currentProject.id}/personas/${persona.id}`, payload)
    },

    deletePersona() {
      return Promise.resolve()
      // return this.$axios.$delete(`/api/projects/${this.currentProject.id}/personas/${persona.id}`)
    },

    onPersonasChanged() {
      // this.updatePersonas(personas)
      // this.personas = personas
    }
  }
}
</script>
