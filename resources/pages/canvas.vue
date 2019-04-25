<template>
  <a-card :bordered="false" style="width: 100%" :title="currentProject.name">
    <div class="ant-table ant-table-scroll-position-left ant-table-default ant-table-bordered">
      <div class="ant-table-content">
        <div class="ant-table-body">
          <table v-if="canvas" style="width: 100%">
            <tbody class="ant-table-tbody">
              <tr class="ant-table-row ant-table-row-level-0">
                <td style="width: 33.33%">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>Problem</strong>
                    <ListManager v-model="canvas.problems" />
                  </span>
                </td>

                <td style="width: 33.33%">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>Solution</strong>
                    <ListManager v-model="canvas.solutions" />
                  </span>
                </td>

                <td style="width: 33.33%">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>Personas</strong>
                    <PersonaListManager />
                  </span>
                </td>
              </tr>
              <tr class="ant-table-row ant-table-row-level-0">
                <td style="width: 33.33%">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>Is is</strong>
                    <ListManager v-model="canvas.is" />
                  </span>
                </td>

                <td style="width: 33.33%">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>It isn't</strong>
                    <ListManager v-model="canvas.isnt" />
                  </span>
                </td>

                <td style="width: 33.33%">
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
  </a-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ListManager from '~/components/ListManager.vue'
import PersonaListManager from '~/components/PersonaListManager.vue'

export default {
  name: 'CanvasPage',

  components: { ListManager, PersonaListManager },

  data() {
    return {
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

