<template>
  <a-layout>
    <a-layout-sider style="background-color: unset" :width="360">
      <InterfacesList
        v-if="currentProject"
        :open-interface-id="openInterface && openInterface.id"
        @updateInterface="onUpdateInterfaces"
        @interfaceOpen="onInterfaceOpen"
        @interfaceDeleted="onInterfaceDelete"
      />
    </a-layout-sider>

    <a-layout>
      <a-layout-content>
        <a-row>
          <a-col :span="24">
            <div v-if="!openInterface" style="text-align: center">
              <h3>Open an Interface</h3>
            </div>

            <div v-else>
              <a-card style="margin: 0 15px">
                <template slot="title">
                  <a-input
                    v-model="openInterface.title"
                    size="large"
                    @change="updateInterface"
                  />
                </template>

                <a-card-grid style="width:100%;textAlign:'center'">
                  <p>
                    <strong>Input</strong>
                    <a-textarea
                      v-model="openInterface.input"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                      @change="updateInterface"
                    />
                  </p>

                  <p>
                    <strong>Output</strong>
                    <a-textarea
                      v-model="openInterface.output"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                      @change="updateInterface"
                    />
                  </p>

                  <p>
                    <strong>Supplier Component</strong>
                    <a-textarea
                      v-model="openInterface.supplier"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                      @change="updateInterface"
                    />
                  </p>
                </a-card-grid>

                <a-card-grid style="width:100%;textAlign:'center'">
                  <strong>Type</strong>

                  <div style="float: right">
                    <a-switch
                      v-model="openInterface.internal"
                      @change="updateInterface"
                    />
                  </div>
                </a-card-grid>

                <a-card-grid style="width: 100%">
                  {{ openInterface.internal ? 'Internal' : 'External' }}
                  Interface
                </a-card-grid>
              </a-card>
            </div>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import pDebounce from 'p-debounce'
import InterfacesList from '@/components/InterfacesList'
import { setTimeout } from 'timers'

const defaultModel = () => ({
  properties: '',
  actions: '',
  relations: [],
  modules: []
})

export default {
  name: 'OverallModel',

  components: { InterfacesList },

  data: () => ({
    modules: [],
    interfaces: [],
    goals: [],
    openInterface: false,
    openGoal: false,
    journeyGoal: false,
    model: defaultModel()
  }),

  computed: {
    ...mapGetters('project', ['currentProject']),

    ...mapState('project', {
      personas: state => (state.personas ? state.personas : [])
    }),

    moduleNames() {
      return this.modules.map(mod => ({
        value: mod.title,
        label: mod.title
      }))
    },

    interfacesNames() {
      return this.interfaces.map(mod => ({
        value: mod.title,
        label: mod.title
      }))
    },

    itemsWithWrongPosition() {
      return this.goals.filter((goal, i, goals) => {
        const before = goals.slice(0, i)
        const after = goals.slice(i + 1)

        return (
          !before.every(other => goal.priority <= other.priority) ||
          !after.every(other => goal.priority >= other.priority)
        )
      })
    },

    baseUrl() {
      if (!this.currentProject || !this.openInterface) {
        return false
      }

      return `/api/projects/${this.currentProject.id}`
    }
  },

  created() {
    if (!this.currentProject) {
      return this.$router.push('/projects')
    }

    this.loadModules()
  },

  methods: {
    loadModules() {
      const { id } = this.currentProject
      const url = `/api/projects/${id}/modules/`

      this.$axios
        .$get(url)
        .then(modules => {
          this.modules = modules
        })
        .catch(() => {
          this.$message.error('Failed to load modules')
        })
    },

    addGoal() {
      const defaultData = {
        title: ''
      }

      this.$axios
        .$post(`${this.baseUrl}/goals`, defaultData)
        .then(goal => {
          this.goals.unshift(goal)
          this.onChangeOrder()
        })
        .catch(() => {
          this.$message.error('Failed to create goal')
        })
    },

    updateInterface: pDebounce(function updateInterface() {
      if (!this.openInterface) {
        return
      }

      const interfac = this.openInterface

      const payload = {
        ...interfac
      }

      this.$axios
        .$put(`${this.baseUrl}/interfaces/${interfac.id}`, payload)
        .then(updated => {
          Object.assign(this.openInterface, updated)
        })
        .catch(() => {
          this.$message.error('Failed to update Class')
        })
    }, 500),

    deleteGoal(goal) {
      if (!goal || !goal.id) {
        return
      }

      this.$axios
        .$delete(`${this.baseUrl}/goals/${goal.id}`)
        .then(() => {
          const index = this.goals.indexOf(goal)
          if (index !== -1) {
            this.goals.splice(index, 1)
            this.onChangeOrder()
          }
        })
        .catch(() => {
          this.$message.error('Failed to delete goal')
        })
    },

    onChangeTitle: pDebounce(function onChangeTitle(goal) {
      this.updateGoal(goal)
    }, 500),

    onChangePriority(goal, value) {
      goal.priority = value
      this.updateGoal(goal)
    },

    onChangeType(goal, value) {
      goal.type = value
      this.updateGoal(goal)
    },

    onChangeOrder() {
      const goals = this.goals.map(({ id }) => id)
      return this.$axios.$put(this.baseUrl, { goals }).then(mod => {
        Object.assign(this.openInterface, mod)
      })
    },

    onUpdateInterfaces(interfaces) {
      this.interfaces = interfaces
    },

    onInterfaceOpen(interfac) {
      this.order = []
      this.openInterface = false

      setTimeout(() => {
        this.openInterface = interfac
        this.model = defaultModel()
        this.model.properties = interfac.properties.join('\n') || ''
        this.model.actions = interfac.actions.join('\n') || ''
        this.model.relations = interfac.relations
        this.model.modules = interfac.modules
        this.fixRefs()
      }, 100)
    },

    fixRefs() {
      this.model.relations = this.model.relations.filter(relationName =>
        this.interfaces.some(other => other.title === relationName)
      )
      this.model.modules = this.model.modules.filter(moduleName =>
        this.modules.some(other => other.title === moduleName)
      )
    },

    onInterfaceDelete(mod) {
      if (this.openInterface && this.openInterface.id === mod.id) {
        this.openInterface = false
      } else if (this.openInterface) {
        const card = this.openInterface
        this.openInterface = false

        setTimeout(() => {
          this.fixRefs()
          this.openInterface = card
        }, 100)
      }
    },

    onSelectPersona(goal, personaId) {
      return this.$axios
        .$post(`${this.baseUrl}/goals/${goal.id}/personas`, { personaId })
        .catch(() => {
          this.$message.error('Failed to add persona to goal')
        })
    },

    onDeselectPersona(goal, personaId) {
      return this.$axios
        .$delete(`${this.baseUrl}/goals/${goal.id}/personas/${personaId}`)
        .catch(() => {
          this.$message.error('Failed to delete persona goal')
        })
    },

    onChangeJourney(journey) {
      if (!this.journeyGoal) {
        return
      }

      const goal = this.journeyGoal

      this.$axios
        .$put(
          `${this.baseUrl}/goals/${this.journeyGoal.id}`,
          { journey },
          { progress: false }
        )
        .then(({ journey }) => {
          goal.journey = journey
        })
        .catch(() => {
          this.$message.error('Failed to update journey')
        })
    },

    doOpenGoal(goal) {
      this.openGoal = false

      setTimeout(() => (this.openGoal = goal), 1)
    }
  }
}
</script>

<style>
.invalid-order .ant-select-selection {
  border-color: red;
}

.fab-group {
  position: absolute;
  top: -13px;
  right: -16px;
}

.fab-group .ant-btn {
  display: block;
  margin-bottom: 3px;
}

.diagram-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
}

.close-modal {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 100;
}
</style>
