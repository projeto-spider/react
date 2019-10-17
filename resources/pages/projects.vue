<template>
  <a-card style="max-width: 640px; margin: 0 auto">
    <a-list item-layout="horizontal" :data-source="projects">
      <a-list-item slot="renderItem" slot-scope="project">
        <template>
          <a
            v-if="editing !== project"
            slot="actions"
            @click="openNameInput(project)"
          >
            Edit
          </a>

          <a v-else slot="actions" @click="updateProject()">
            Update
          </a>
        </template>

        <a-popconfirm
          slot="actions"
          title="Are you sure delete this project?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteProject(project)"
        >
          <a href="#">Delete</a>
        </a-popconfirm>

        <a slot="actions" @click="openProject(project)">Open</a>

        <a-list-item-meta
          :description="
            editing !== project ? descriptionForProject(project) : null
          "
        >
          <template slot="title">
            <form
              v-if="editing === project"
              class="project-form"
              @submit.prevent="updateProject"
            >
              <a-input
                v-model="project.name"
                size="small"
                placeholder="Project name"
              />
              <a-input
                v-model="project.clientName"
                size="small"
                placeholder="Client (optional)"
              />
              <a-input
                v-model="project.description"
                size="small"
                placeholder="Description (optional)"
              />
              <a-range-picker
                size="small"
                style="width: 100%"
                :default-value="[
                  project.startDate && moment(project.startDate, 'YYYY-MM-DD'),
                  project.endDate && moment(project.endDate, 'YYYY-MM-DD')
                ]"
                @change="onChangeDate"
              />

              <h4>User Story Priority Scale</h4>

              <p>
                <strong>Presets</strong>
                <a-button-group>
                  <a-button
                    type="primary"
                    @click="project.scale = presets.fibonacci.concat()"
                  >
                    Use Fibonacci
                  </a-button>
                  <a-button
                    type="primary"
                    @click="project.scale = presets.modFibonacci.concat()"
                  >
                    Use Modified Fibonacci
                  </a-button>
                </a-button-group>
              </p>

              <div
                class="ant-list ant-list-split ant-list-bordered ant-list-something-after-last-item"
                style="margin-top: 3px;"
              >
                <draggable
                  :list="project.scale || []"
                  class="list-group"
                  ghost-class="ghost"
                >
                  <div
                    v-for="(item, i) in project.scale || []"
                    :key="i"
                    class="ant-list-item"
                  >
                    <a-input v-model="project.scale[i]" size="small">
                      <a-icon
                        slot="suffix"
                        type="close-circle"
                        style="margin-top: -6px; cursor: pointer"
                        @click="() => project.scale.splice(i, 1)"
                      />
                    </a-input>
                  </div>
                </draggable>

                <div class="list-group">
                  <a-button
                    type="primary"
                    block
                    @click="project.scale.push('')"
                  >
                    New
                  </a-button>
                </div>
              </div>

              <h4>Inspection Criteria</h4>

              <p>
                <strong>Presets</strong>
                <a-button-group>
                  <a-button
                    type="primary"
                    @click="project.criteria = presets.invest.concat()"
                  >
                    Use I.N.V.E.S.T.
                  </a-button>
                </a-button-group>
              </p>

              <div
                class="ant-list ant-list-split ant-list-bordered ant-list-something-after-last-item"
                style="margin-top: 3px;"
              >
                <draggable
                  :list="project.criteria || []"
                  class="list-group"
                  ghost-class="ghost"
                >
                  <div
                    v-for="(item, i) in project.criteria || []"
                    :key="i"
                    class="ant-list-item"
                  >
                    <a-input v-model="project.criteria[i]" size="small">
                      <a-icon
                        slot="suffix"
                        type="close-circle"
                        style="margin-top: -6px; cursor: pointer"
                        @click="() => project.criteria.splice(i, 1)"
                      />
                    </a-input>
                  </div>
                </draggable>

                <div class="list-group">
                  <a-button
                    type="primary"
                    block
                    @click="project.criteria.push('')"
                  >
                    New
                  </a-button>
                </div>
              </div>
            </form>

            <span v-else style="mouse: pointer" @click="openNameInput(project)">
              {{ project.name }}
            </span>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>

    <div>
      <a-button type="primary" block @click="createProject">
        New Project
      </a-button>
    </div>
  </a-card>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapMutations } from 'vuex'
import Draggable from 'vuedraggable'

export default {
  name: 'ProjectsPage',

  middleware: 'authenticated',

  components: {
    Draggable
  },

  data: () => ({
    moment,

    rangeConfig: {
      rules: [
        {
          type: 'array',
          required: true,
          message: 'Please select time!'
        }
      ]
    },

    projects: [],

    presets: {
      fibonacci: [
        '?',
        '0',
        '1',
        '2',
        '3',
        '5',
        '8',
        '13',
        '21',
        '34',
        '55',
        '89',
        '144',
        '...'
      ],

      modFibonacci: [
        '?',
        '1/2',
        '1',
        '2',
        '3',
        '5',
        '8',
        '13',
        '40',
        '100',
        '...'
      ],

      invest: [
        'Independent',
        'Negotiable',
        'Valuable',
        'Estimable',
        'Small',
        'Testable'
      ]
    },

    editing: false
  }),

  computed: {
    ...mapGetters('project', ['currentProject'])
  },

  async created() {
    this.projects = await this.$axios.$get('/api/projects')
  },

  methods: {
    ...mapMutations('project', ['selectProject']),

    openNameInput(project) {
      if (this.editing) {
        this.updateProject()
      }

      this.editing = project
    },

    createProject() {
      const defaultName = 'R.E.A.C.T. Project'
      const defaultLike = this.projects
        .map(project => project.name)
        .filter(name => name.indexOf(defaultName) === 0)
        .map(name => name.split(' ').pop())
        .map(numberString => Number(numberString))
        .filter(x => x)
        .sort()

      const countDefaultLike = defaultLike.length
      const nextNumber = countDefaultLike ? defaultLike.pop() + 1 : 1

      const name = `${defaultName} ${nextNumber}`

      this.$axios
        .$post('/api/projects', {
          name,
          scale: this.presets.fibonacci,
          criteria: this.presets.invest
        })
        .then(project => {
          this.projects.push(project)
        })
        .catch(() => {
          this.$message.error('Failed to create project')
        })
    },

    updateProject() {
      const editing = this.editing
      const {
        name,
        clientName,
        description,
        startDate,
        endDate,
        scale,
        criteria
      } = editing
      const payload = {
        name,
        clientName,
        description,
        startDate,
        endDate,
        scale,
        criteria
      }

      this.$axios
        .$put(`/api/projects/${editing.id}`, payload)
        .then(data => {
          this.$message.success(`Project ${data.name} updated`)

          Object.assign(editing, data)

          if (this.currentProject.id === editing.id) {
            this.selectProject(editing)
          }
        })
        .catch(() => {
          this.$message.error('Failed to update project')
        })
      this.editing = false
    },

    deleteProject(project) {
      if (this.editing === project) {
        this.editing = false
      }

      this.$axios
        .$delete(`/api/projects/${project.id}`)
        .then(() => {
          this.$message.warn(`Deleted ${project.name}`)
          const index = this.projects.indexOf(project)
          this.projects.splice(index, 1)
        })
        .catch(() => {
          this.$message.error('Failed to delete project')
        })
    },

    onChangeDate(_, [startDate, endDate]) {
      if (!this.editing) {
        return
      }

      this.editing.startDate = startDate
      this.editing.endDate = endDate
    },

    openProject(project) {
      this.selectProject(project)
      this.$router.push('/canvas')
    },

    descriptionForProject(project) {
      const format = 'DD-MM-YYYY'

      const formatedStartDate = project.startDate
        ? moment(project.startDate).format(format)
        : ''
      const formatedEndDate = project.endDate
        ? moment(project.endDate).format(format)
        : ''

      const hasBothDates = formatedStartDate && formatedEndDate
      const bothDatesAreEqual = formatedStartDate === formatedEndDate

      const date =
        hasBothDates && bothDatesAreEqual
          ? `${formatedStartDate} ~ ?`
          : hasBothDates
          ? `${formatedStartDate} ~ ${formatedEndDate}`
          : formatedStartDate

      return [project.clientName, project.description, date]
        .filter(x => x)
        .join(' — ')
    }
  }
}
</script>

<style>
.project-form input {
  margin-bottom: 5px;
}
</style>
