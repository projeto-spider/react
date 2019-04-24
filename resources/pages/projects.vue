<template>
  <a-card style="max-width: 640px; margin: 0 auto">
    <a-list
      itemLayout="horizontal"
      :dataSource="projects"
    >
      <a-list-item slot="renderItem" slot-scope="project">
        <template>
          <a slot="actions"
            v-if="editing !== project"
            @click="openNameInput(project)"
          >
            Edit
          </a>

          <a slot="actions"
            v-else
            @click="updateProject()"
          >
            Update
          </a>
        </template>

        <a-popconfirm
          slot="actions"
          title="Are you sure delete this project?"
          @confirm="deleteProject(project)"
          okText="Yes"
          cancelText="No"
        >
          <a href="#">Delete</a>
        </a-popconfirm>

        <a slot="actions" @click="openProject(project)">Open</a>

        <a-list-item-meta
          :description="editing !== project ? descriptionForProject(project) : null"
        >
          <template slot="title">
            <form
              v-if="editing === project"
              @submit.prevent="updateProject"
              class="project-form"
            >
              <a-input size="small" placeholder="Basic usage" v-model="project.name" />
              <a-input size="small" placeholder="Client (optional)" v-model="project.clientName" />
              <a-input size="small" placeholder="Description (optional)" v-model="project.description" />
              <a-range-picker size="small" style="width: 100%" @change="onChangeDate" :defaultValue="[project.startDate && moment(project.startDate, 'YYYY-MM-DD'), project.endDate && moment(project.endDate, 'YYYY-MM-DD')]" />
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
import { mapMutations } from 'vuex'

export default {
  name: 'ProjectsPage',

  middleware: 'authenticated',

  data: () => ({
    moment,

    rangeConfig: {
      rules: [{
        type: 'array',
        required: true,
        message: 'Please select time!'
      }]
    },

    projects: [],

    editing: false
  }),

  async created () {
    this.projects = await this.$axios.$get('/api/projects')
  },

  methods: {
    ...mapMutations('project', [
      'selectProject'
    ]),

    openNameInput (project) {
      if (this.editing) {
        this.updateProject()
      }

      this.editing = project
    },

    createProject () {
      const defaultName = 'R.E.A.C.T. Project'
      const defaultLike = this.projects
        .map(project => project.name)
        .filter(name => name.indexOf(defaultName) === 0)
        .map(name => name.split(' ').pop())
        .map(numberString => Number(numberString))
        .filter(x => x)
        .sort()

      const countDefaultLike = defaultLike.length
      const nextNumber = countDefaultLike
        ? defaultLike.pop() + 1
        : 1

      const name = `${defaultName} ${nextNumber}`

      this.$axios.$post('/api/projects', { name })
        .then(project => {
          this.projects.push(project)
        })
        .catch(() => {
          this.$message.error('Failed to create project')
        })
    },

    updateProject () {
      const { name, clientName, description, startDate, endDate } = this.editing
      const payload = {name, clientName, description, startDate, endDate}

      this.$axios.$put(`/api/projects/${this.editing.id}`, payload)
        .then(data => {
          this.$message.success(`Project ${data.name} updated`)
        })
        .catch(() => {
          this.$message.error('Failed to update project')
        })
      this.editing = false
    },

    deleteProject (project) {
      if (this.editing === project) {
        this.editing = false
      }

      this.$axios.$delete(`/api/projects/${project.id}`)
        .then(() => {
          this.$message.warn(`Deleted ${project.name}`)
          const index = this.projects.indexOf(project)
          this.projects.splice(index, 1)
        })
        .catch(() => {
          this.$message.error('Failed to delete project')
        })
    },

    onChangeDate (_, [startDate, endDate]) {
      if (!this.editing) {
        return
      }

      this.editing.startDate = startDate
      this.editing.endDate = endDate
    },

    openProject (project) {
      this.selectProject(project)
      this.$router.push('/canvas')
    },

    descriptionForProject (project) {
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
        hasBothDates && bothDatesAreEqual ? `${formatedStartDate} ~ ?` :
        hasBothDates ? `${formatedStartDate} ~ ${formatedEndDate}` :
        formatedStartDate

      return [
        project.clientName,
        project.description,
        date
      ]
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
