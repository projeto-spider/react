<template>
  <a-layout>
    <a-layout-sider style="background-color: unset" :width="360">
      <CrcCardList
        v-if="currentProject"
        :open-crc-card-id="openCrcCard && openCrcCard.id"
        @updateCrcCards="onUpdateCrcCards"
        @crcCardOpen="onCrcCardOpen"
        @crcCardDeleted="onCrcCardDelete"
      />
    </a-layout-sider>

    <a-layout>
      <a-layout-content>
        <a-row>
          <a-col :span="24">
            <div v-if="!openCrcCard" style="text-align: center">
              <h3>Open a Class</h3>
            </div>

            <div v-else>
              <a-card style="margin: 0 15px">
                <template slot="title">
                  <a-input size="large" v-model="openCrcCard.title" @change="updateCrcCard" />
                </template>

                <a-card-grid style="width:50%;textAlign:'center'">
                  <p>
                    <strong>Data</strong>
                    <a-textarea :autosize="{ minRows: 2, maxRows: 6 }" v-model="model.properties" @change="updateCrcCard" />
                  </p>

                  <p>
                    <strong>Actions</strong>
                    <a-textarea :autosize="{ minRows: 2, maxRows: 6 }" v-model="model.actions" @change="updateCrcCard" />
                  </p>
                </a-card-grid>

                <a-card-grid style="width:50%;textAlign:'center'">
                  <strong>Relations</strong>

                  <a-select
                    mode="tags"
                    style="width: 100%"
                    :defaultValue="model.relations"
                    :options="crcCardsNames"
                    @change="value => {
                      model.relations = value
                      updateCrcCard()
                    }"
                  />
                </a-card-grid>

                <a-card-grid style="width:100%;textAlign:'center'">
                  <strong>Modules</strong>

                  <a-select
                    mode="tags"
                    style="width: 100%"
                    :defaultValue="model.modules"
                    :options="moduleNames"
                    @change="value => {
                      model.modules = value
                      updateCrcCard()
                    }"
                  />
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
import Draggable from 'vuedraggable'
import CrcCardList from '@/components/CrcCardList'
import Diagram from '@/components/Diagram'
import { setTimeout } from 'timers'

const defaultModel = () => ({
  properties: '',
  actions: '',
  relations: [],
  modules: []
})

export default {
  name: 'OverallModel',

  components: { Draggable, CrcCardList, Diagram },

  data: () => ({
    modules: [],
    crcCards: [],
    goals: [],
    openCrcCard: false,
    openGoal: false,
    journeyGoal: false,
    model: defaultModel()
  }),

  computed: {
    ...mapGetters('project', [
      'currentProject'
    ]),

    ...mapState('project', {
      personas: state => state.personas ? state.personas : []
    }),

    moduleNames () {
      return this.modules.map(mod => ({
        value: mod.title,
        label: mod.title
      }))
    },

    crcCardsNames () {
      return this.crcCards.map(mod => ({
        value: mod.title,
        label: mod.title
      }))
    },

    itemsWithWrongPosition () {
      return this.goals.filter((goal, i, goals) => {
        const before = goals.slice(0, i)
        const after = goals.slice(i + 1)

        return !before.every(other => goal.priority <= other.priority) ||
          !after.every(other => goal.priority >= other.priority)
      })
    },

    baseUrl () {
      if (!this.currentProject || !this.openCrcCard) {
        return false
      }

      return `/api/projects/${this.currentProject.id}`
    }
  },

  methods: {
    loadModules () {
      const { id } = this.currentProject
      const url = `/api/projects/${id}/modules/`

      this.$axios.$get(url)
        .then(modules => {
          this.modules = modules
        })
        .catch(() => {
          this.$message.error('Failed to load modules')
        })
    },

    addGoal () {
      const defaultData = {
        title: ''
      }

      this.$axios.$post(`${this.baseUrl}/goals`, defaultData)
        .then(goal => {
          this.goals.unshift(goal)
          this.onChangeOrder()
        })
        .catch(() => {
          this.$message.error('Failed to create goal')
        })
    },

    updateCrcCard: pDebounce(function updateCrcCard () {
      if (!this.openCrcCard) {
        return
      }

      const crcCard = this.openCrcCard

      const payload = {
        ...crcCard,
        properties: this.model.properties.split('\n'),
        actions: this.model.actions.split('\n'),
        relations: this.model.relations,
        modules: this.model.modules
      }

      this.$axios.$put(`${this.baseUrl}/crc-cards/${crcCard.id}`, payload)
        .then(updated => {
          Object.assign(this.openCrcCard, updated)
        })
        .catch(() => {
          this.$message.error('Failed to update Class')
        })
    }, 500),

    deleteGoal (goal) {
      if (!goal || !goal.id) {
        return
      }

      this.$axios.$delete(`${this.baseUrl}/goals/${goal.id}`)
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

    onChangeTitle: pDebounce(function onChangeTitle (goal, value) {
      this.updateGoal(goal)
    }, 500),

    onChangePriority (goal, value) {
      goal.priority = value
      this.updateGoal(goal)
    },

    onChangeType (goal, value) {
      goal.type = value
      this.updateGoal(goal)
    },

    onChangeOrder () {
      const goals = this.goals.map(({id}) => id)
      return this.$axios.$put(this.baseUrl, { goals })
        .then(mod => {
          Object.assign(this.openCrcCard, mod)
        })
    },

    onUpdateCrcCards (crcCards) {
      this.crcCards = crcCards
    },

    onCrcCardOpen (crcCard) {
      this.order = []
      this.openCrcCard = false

      setTimeout(() => {
        this.openCrcCard = crcCard
        this.model = defaultModel()
        this.model.properties = crcCard.properties.join('\n') || ''
        this.model.actions = crcCard.actions.join('\n') || ''
        this.model.relations = crcCard.relations
        this.model.modules = crcCard.modules
        this.fixRefs()
      }, 100)
    },

    fixRefs () {
      this.model.relations = this.model.relations.filter(relationName =>
        this.crcCards.some(other => other.title === relationName)
      )
      this.model.modules = this.model.modules.filter(moduleName =>
        this.modules.some(other => other.title === moduleName)
      )
    },

    onCrcCardDelete (mod) {
      if (this.openCrcCard && this.openCrcCard.id === mod.id) {
        this.openCrcCard = false
      } else if (this.openCrcCard) {
        const card = this.openCrcCard
        this.openCrcCard = false

        setTimeout(() => {
          this.fixRefs()
          this.openCrcCard = card
        }, 100)
      }
    },

    onSelectPersona (goal, personaId) {
      return this.$axios.$post(`${this.baseUrl}/goals/${goal.id}/personas`, { personaId })
        .catch(() => {
          this.$message.error('Failed to add persona to goal')
        })
    },

    onDeselectPersona (goal, personaId) {
      return this.$axios.$delete(`${this.baseUrl}/goals/${goal.id}/personas/${personaId}`)
        .catch(() => {
          this.$message.error('Failed to delete persona goal')
        })
    },

    onChangeJourney (journey) {
      if (!this.journeyGoal) {
        return
      }

      const goal = this.journeyGoal

      this.$axios.$put(`${this.baseUrl}/goals/${this.journeyGoal.id}`, { journey }, { progress: false })
        .then(({ journey }) => {
          goal.journey = journey
        })
        .catch(() => {
          this.$message.error('Failed to update journey')
        })
    },

    doOpenGoal (goal) {
      this.openGoal = false

      setTimeout(() => this.openGoal = goal, 1)
    }
  },

  created () {
    if (!this.currentProject) {
      return this.$router.push('/projects')
    }

    this.loadModules()
  }
}
</script>

<style>
.invalid-order .ant-select-selection {
  border-color: red
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
}

.close-modal {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 100;
}
</style>

