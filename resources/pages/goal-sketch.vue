<template>
  <a-layout>
    <a-layout-sider style="background-color: unset" :width="480">
      <ModuleList
        v-if="currentProject"
        :open-module-id="openModule && openModule.id"
        @moduleOpen="onModuleOpen"
        @moduleDeleted="onModuleDelete"
      />
    </a-layout-sider>

    <a-layout>
      <a-layout-content>
        <div v-if="!openModule" style="text-align: center">
          <h3>Open a module</h3>
        </div>
        <div v-else>
          <a-button
            type="primary"
            style="margin: 15px auto; width: 400px; display: block"
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
              </div>
            </transition-group>
          </Draggable>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>

</template>

<script>
import { mapGetters } from 'vuex'
import pDebounce from 'p-debounce'
import Draggable from 'vuedraggable'
import ModuleList from '@/components/ModuleList'

export default {
  name: 'GoalSketch',

  components: { Draggable, ModuleList },

  data: () => ({
    goals: [],
    openModule: false
  }),

  computed: {
    ...mapGetters('project', [
      'currentProject'
    ]),

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

  methods: {
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

      this.$axios.$put(`${this.baseUrl}/goals/${goal.id}`, goal)
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

    onModuleOpen (mod) {
      this.order = []
      this.openModule = mod
      this.refreshGoals()
    },

    onModuleDelete (mod) {
      if (this.openModule && this.openModule.id === mod.id) {
        this.openModule = false
      }
    }
  },

  created () {
    if (!this.currentProject) {
      return this.$router.push('/projects')
    }
  }
}
</script>

<style>
.invalid-order .ant-select-selection {
  border-color: red
}
</style>

