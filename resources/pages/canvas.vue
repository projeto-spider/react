<template>
  <a-card :bordered="false" style="width: 100%" :title="currentProject.name">
    <a-button
      slot="extra"
      type="primary"
      @click="$tours.canvasTour.start()"
    >
      <a-icon type="info-circle" /> Tutorial
    </a-button>
    <div class="ant-table ant-table-scroll-position-left ant-table-default ant-table-bordered">
      <div class="ant-table-content">
        <div class="ant-table-body">
          <table v-if="canvas" style="width: 100%">
            <tbody class="ant-table-tbody">
              <tr class="ant-table-row ant-table-row-level-0">
                <td style="width: 33.33%" data-v-step="1">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>Problem</strong>
                    <ListManager v-model="canvas.problems" />
                  </span>
                </td>

                <td style="width: 33.33%" data-v-step="2">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>Solution</strong>
                    <ListManager v-model="canvas.solutions" />
                  </span>
                </td>

                <td style="width: 33.33%" data-v-step="6">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>Personas</strong>
                    <PersonaListManager />
                  </span>
                </td>
              </tr>
              <tr class="ant-table-row ant-table-row-level-0">
                <td style="width: 33.33%" data-v-step="3">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>Is is</strong>
                    <ListManager v-model="canvas.is" />
                  </span>
                </td>

                <td style="width: 33.33%" data-v-step="4">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>It isn't</strong>
                    <ListManager v-model="canvas.isnt" />
                  </span>
                </td>

                <td style="width: 33.33%" data-v-step="5">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>Constraints</strong>
                    <ListManager v-model="canvas.constraints" />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <v-tour name="canvasTour" :steps="tour.steps"></v-tour>
  </a-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ListManager from '~/components/ListManager.vue'
import PersonaListManager from '~/components/PersonaListManager.vue'

const tour = {
  steps: [
    {
      target: '[data-v-step="1"]',
      content: `
        Define what's the <strong>problem you're trying to solve</strong>.<br>
        <em>"Manage finances in my workplace"</em>, <em>"The bank lack some mobile features"</em>
      `
    },

    {
      target: '[data-v-step="2"]',
      content: `
        What are your <strong>possible solutions</strong>?<br>
        <em>"Build a better mobile app"</em>, <em>"Enhance the current desktop app"</em>
      `
    },

    {
      target: '[data-v-step="3"]',
      content: `
        Here we state <strong>what we aim</strong> to make of our product<br>
        <em>"A mobile app"</em>, <em>"An offline-ready app"</em>
      `
    },

    {
      target: '[data-v-step="4"]',
      content: `
        Now we state <strong>what we don't want</strong> our product to be<br>
        <em>"A desktop app"</em>, <em>"An app that only work online"</em>
      `
    },

    {
      target: '[data-v-step="5"]',
      content: `
        Define <strong>rules</strong> to make guidelines over the development<br>
        <em>"Should work in modern browsers"</em>, <em>"Must have support for touch-screen"</em>
      `
    },

    {
      target: '[data-v-step="6"]',
      content: `
        For the next step we define <strong>personifications</strong> of possible users<br>
        <em>"John Doe, Bank Manager"</em>, <em>"Jane Doe, Bank Client"</em>
      `
    }
  ]
}

export default {
  name: 'CanvasPage',

  components: { ListManager, PersonaListManager },

  data() {
    return {
      tour,
      canvas: false,
      personas: []
    }
  },

  computed: {
    ...mapGetters('project', [
      'currentProject'
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

