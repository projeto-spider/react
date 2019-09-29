<template>
  <a-layout>
    <a-layout-sider style="background-color: unset" :width="360">
      <VSiderListCrud
        v-if="currentProject"
        item-label="Module"
        :items="modules"
        :open-item-id="openModule && openModule.id"
        @open="onModuleOpen"
        @create="onCreateModule"
        @update="onUpdateModule"
        @delete="onDeleteModule"
      />
    </a-layout-sider>

    <a-layout>
      <a-layout-content>
        <a-row>
          <a-col :span="openModule ? 12 : 24">
            <div v-if="!openModule" style="text-align: center">
              <h3>Open a module</h3>
            </div>
            <div v-else>
              <a-button
                type="primary"
                style="margin: 0 auto 15px; width: 400px; display: block"
                @click="addGoal()"
              >
                Create Goal
              </a-button>

              <Draggable
                v-model="goals"
                @change="onChangeOrder"
              >
                <transition-group name="goal-list">
                  <div
                    v-for="goal in goals"
                    :key="goal.id"
                    class="ant-card ant-card-bordered ant-card-hoverable"
                    style="max-width: 400px; margin: 15px auto"
                  >
                    <div class="ant-card-body">
                      <div class="ant-card-meta">
                        <div class="ant-card-meta-detail">
                          <div class="ant-card-meta-description">
                            <a-textarea
                              placeholder="Write your goal"
                              :autosize="{ minRows: 1, maxRows: 5 }"
                              v-model="goal.title"
                              @change="() => onChangeTitle(goal)"
                            />

                            <br><br>

                            <a-select
                              mode="multiple"
                              placeholder="Personas"
                              :defaultValue="goal.personas ? goal.personas.map(persona => persona.id) : []"
                              style="width: 100%"
                              @select="personaId => onSelectPersona(goal, personaId)"
                              @deselect="personaId => onDeselectPersona(goal, personaId)"
                            >
                              <a-select-option v-for="persona in personas" :key="persona.id">
                                {{ persona.name }}
                              </a-select-option>
                            </a-select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ul class="ant-card-actions">
                      <li style="width: 33.3333%;">
                        <span :class="{ 'invalid-order': itemsWithWrongPosition.includes(goal) }">
                          <a-tooltip>
                            <template v-if="itemsWithWrongPosition.includes(goal)" slot='title'>
                              <span>Wrong priority.</span>
                              <br>
                              <span>High > Medium > Low.</span>
                            </template>
                            <a-select :defaultValue="goal.priority" style="width: 120px; text-aling: center" @change="value => onChangePriority(goal, value)">
                              <a-select-option :value="0">Low</a-select-option>
                              <a-select-option :value="1">Medium</a-select-option>
                              <a-select-option :value="2">High</a-select-option>
                            </a-select>
                          </a-tooltip>
                        </span>
                      </li>

                      <li style="width: 33.3333%;">
                        <span>
                          <a-select :defaultValue="goal.type" style="width: 120px; text-aling: center" @change="value => onChangeType(goal, value)">
                            <a-select-option :value="0">Business</a-select-option>
                            <a-select-option :value="1">Constraint</a-select-option>
                          </a-select>
                        </span>
                      </li>

                      <li style="width: 33.3333%;">
                        <a-popconfirm
                          title="Are you sure delete this entry?"
                          @confirm="deleteGoal(goal)"
                          okText="Yes"
                          cancelText="No"
                        >
                          <a-button type="danger">Delete</a-button>
                        </a-popconfirm>
                      </li>
                    </ul>

                    <div class="fab-group">
                      <a-button
                        type="primary"
                        shape="circle"
                        icon="cluster"
                        @click="journeyGoal = goal"
                      />

                      <a-button
                        type="primary"
                        shape="circle"
                        icon="ordered-list"
                        @click="doOpenGoal(goal)"
                      />
                    </div>
                  </div>
                </transition-group>
              </Draggable>
            </div>
          </a-col>

          <a-col v-if="openModule" :span="12">
            <div v-if="!openGoal" style="text-align: center">
              <h3>Open a goal</h3>
            </div>
            <div v-else>
              <Backlog
                ref="backlog"
                :goal="openGoal"
                @addStory="addStory"
                @changedOrder="stories => openGoal.stories = stories"
              />
            </div>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>

    <div v-if="journeyGoal" class="diagram-modal">
      <a-button type="danger" shape="circle" icon="close" class="close-modal" @click="journeyGoal = false"></a-button>

      <Diagram
        :initial-nodes="journeyGoal.journey && journeyGoal.journey.nodes || []"
        :initial-edges="journeyGoal.journey && journeyGoal.journey.edges || []"
        @changeNetwork="onChangeJourney"
      />
      <template slot="footer">&nbsp;</template>
    </div>
  </a-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import pDebounce from 'p-debounce'
import Draggable from 'vuedraggable'
import VSiderListCrud from '@/components/VSiderListCrud'
import Diagram from '@/components/Diagram'
import Backlog from '@/components/Backlog'
import { setTimeout } from 'timers'

export default {
  name: 'GoalSketch',

  components: { Draggable, VSiderListCrud, Diagram, Backlog },

  data: () => ({
    modules: [],
    goals: [],
    openModule: false,
    openGoal: false,
    journeyGoal: false
  }),

  computed: {
    ...mapGetters('project', [
      'currentProject'
    ]),

    ...mapState('project', {
      personas: state => state.personas ? state.personas : []
    }),

    itemsWithWrongPosition () {
      return this.goals.filter((goal, i, goals) => {
        const before = goals.slice(0, i)
        const after = goals.slice(i + 1)

        return !before.every(other => goal.priority <= other.priority) ||
          !after.every(other => goal.priority >= other.priority)
      })
    },

    baseUrl () {
      if (!this.currentProject || !this.openModule) {
        return false
      }

      return `/api/projects/${this.currentProject.id}/modules/${this.openModule.id}`
    }
  },

  created () {
    if (!this.currentProject) {
      return this.$router.push('/projects')
    }

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

  methods: {
    onModuleOpen (mod) {
      this.order = []
      this.openModule = mod
      this.openGoal = false
      this.refreshGoals()
    },

    onCreateModule () {
      const defaultName = 'Module'
      const defaultLike = this.modules
        .map(project => project.title)
        .filter(title => title.indexOf(defaultName) === 0)
        .map(title => title.split(' ').pop())
        .map(numberString => Number(numberString))
        .filter(x => x)
        .sort()

      const countDefaultLike = defaultLike.length
      const nextNumber = countDefaultLike
        ? defaultLike.pop() + 1
        : 1

      const title = `${defaultName} ${nextNumber}`

      const { id } = this.currentProject
      const url = `/api/projects/${id}/modules/`
      this.$axios.$post(url, { title })
        .then(mod => {
          this.modules.push(mod)
        })
        .catch(() => {
          this.$message.error('Failed to create module')
        })
    },

    onUpdateModule (mod, title) {
      const payload = { title }

      const { id } = this.currentProject
      const url = `/api/projects/${id}/modules/${mod.id}`

      this.$axios.$put(url, payload)
        .then(data => {
          this.$message.success(`Module ${data.title} updated`)
        })
        .catch(() => {
          this.$message.error('Failed to update module')
        })
    },

    onDeleteModule(mod) {
      const { id } = this.currentProject
      const url = `/api/projects/${id}/modules/${mod.id}`

      this.$axios.$delete(url)
        .then(() => {
          if (this.openModule && this.openModule.id === mod.id) {
            this.openModule = false
          }

          this.$message.warn(`Deleted ${mod.title}`)
          const index = this.modules.indexOf(mod)
          this.modules.splice(index, 1)
        })
        .catch(() => {
          this.$message.error('Failed to delete module')
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

    updateGoal (goal) {
      if (!goal || !goal.id) {
        return
      }

      const payload = {...goal}
      payload.personas = undefined
      this.$axios.$put(`${this.baseUrl}/goals/${goal.id}`, payload)
        .catch(() => {
          this.$message.error('Failed to update goal')
        })
    },

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

    refreshGoals () {
      this.order = this.openModule.goals

      return this.$axios.$get(`${this.baseUrl}/goals`)
        .then(goals => {
          this.goals = goals

          const leftOutGoals = this.goals.filter(goal =>
            !this.order.includes(goal.id)
          )

          for (let goal of leftOutGoals) {
            this.deleteGoal(goal)
          }

          this.goals = this.order
            .map(id => this.goals.find(goal => goal.id === id))
            .filter(x => x)
        })
        .catch(() => {
          this.$message.error('Failed to load goals')
        })
    },

    onChangeOrder () {
      const goals = this.goals.map(({id}) => id)
      return this.$axios.$put(this.baseUrl, { goals })
        .then(mod => {
          Object.assign(this.openModule, mod)
        })
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

