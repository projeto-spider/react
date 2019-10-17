<template>
  <a-layout>
    <a-layout-sider style="background-color: unset" :width="360">
      <VSiderListCrud
        v-if="currentProject"
        item-label="Module"
        :items="modules"
        :open-item-id="openModule && openModule.id"
        read-only
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
              <VGoals
                :goals="goals"
                :personas="personas"
                read-only
                @create="onCreateGoal"
                @changeTitle="onChangeGoalTitle"
                @changePriority="onChangeGoalPriority"
                @changeType="onGoalChangeType"
                @delete="onDeleteGoal"
                @open="onOpenGoal"
                @changeOrder="onChangeGoalsOrder"
                @personaSelected="onGoalPersonaSelected"
                @personaDeselected="onGoalPersonaDeselected"
                @openJourney="onOpenJourney"
              />
            </div>
          </a-col>

          <a-col v-if="openModule" :span="12">
            <div v-if="!openGoal" style="text-align: center">
              <h3>Open a goal</h3>
            </div>
            <div v-else>
              <VBacklog
                :goal="openGoal"
                :stories="stories"
                :scale="currentProject.scale"
                read-only
                @create="onCreateStory"
                @update="onUpdateStory"
                @delete="onDeleteStory"
                @changeOrder="onChangeStoriesOrder"
              />
            </div>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>

    <div v-if="journeyGoal" class="diagram-modal">
      <a-button
        type="danger"
        shape="circle"
        icon="close"
        class="close-modal"
        @click="journeyGoal = false"
      />

      <Diagram
        :initial-nodes="
          (journeyGoal.journey && journeyGoal.journey.nodes) || []
        "
        :initial-edges="
          (journeyGoal.journey && journeyGoal.journey.edges) || []
        "
        @changeNetwork="onChangeJourney"
      />
      <template slot="footer">
        &nbsp;
      </template>
    </div>
  </a-layout>
</template>

<script>
import pDebounce from 'p-debounce'
import VSiderListCrud from '@/components/VSiderListCrud'
import VGoals from '@/components/VGoals'
import Diagram from '@/components/Diagram'
import VBacklog from '@/components/VBacklog'
import { setTimeout } from 'timers'

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

const fakeModule = rest => ({
  id: 1,
  projectId: 1,
  title: 'Module 1',
  goals: [2, 1],
  created_at: '2019-10-10 00:11:36',
  updated_at: '2019-10-10 02:31:06',
  ...rest
})

const fakeGoal = rest => ({
  id: 3,
  moduleId: 1,
  title: '',
  priority: 0,
  type: 0,
  journey: {
    nodes: [],
    edges: []
  },
  stories: [1],
  created_at: '2019-10-10 05:44:59',
  updated_at: '2019-10-10 05:44:59',
  ...rest
})

const fakeStory = rest => ({
  id: 1,
  goalId: 3,
  title: '',
  priority: '',
  isSystem: 0,
  businessRules: [],
  acceptanceScenarios: [],
  created_at: '2019-10-10 05:45:48',
  updated_at: '2019-10-10 05:45:48',
  ...rest
})

export default {
  name: 'GoalSketch',

  components: { VSiderListCrud, VGoals, VBacklog, Diagram },

  data: () => ({
    modules: [],
    goals: [],
    stories: [],
    openModule: false,
    openGoal: false,
    journeyGoal: false,
    currentProject: {
      scale: [
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
      ]
    },
    personas: [
      fakePersona({
        id: 1,
        name: 'John Doe'
      }),

      fakePersona({
        id: 2,
        name: 'Jane Doe'
      })
    ]
  }),

  computed: {
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
      if (!this.currentProject || !this.openModule) {
        return false
      }

      return `/api/projects/${this.currentProject.id}/modules/${this.openModule.id}`
    },

    baseGoalUrl() {
      if (!this.baseUrl || !this.openGoal) {
        return false
      }

      const { id } = this.openGoal
      return `${this.baseUrl}/goals/${id}`
    },

    baseUrlStories() {
      if (!this.baseGoalUrl) {
        return false
      }

      return `${this.baseGoalUrl}/stories`
    }
  },

  created() {
    // if (!this.currentProject) {
    //   return this.$router.push('/projects')
    // }

    this.modules = [fakeModule()]

    // const { id } = this.currentProject
    // const url = `/api/projects/${id}/modules/`

    // this.$axios.$get(url)
    //   .then(modules => {
    //     this.modules = modules
    //   })
    //   .catch(() => {
    //     this.$message.error('Failed to load modules')
    //   })
  },

  methods: {
    // Modules

    onModuleOpen(mod) {
      this.order = []
      this.openModule = mod
      this.openGoal = false
      this.refreshGoals()
    },

    onCreateModule() {
      // const defaultName = 'Module'
      // const defaultLike = this.modules
      //   .map(project => project.title)
      //   .filter(title => title.indexOf(defaultName) === 0)
      //   .map(title => title.split(' ').pop())
      //   .map(numberString => Number(numberString))
      //   .filter(x => x)
      //   .sort()

      // const countDefaultLike = defaultLike.length
      // const nextNumber = countDefaultLike ? defaultLike.pop() + 1 : 1

      // const title = `${defaultName} ${nextNumber}`

      // const { id } = this.currentProject
      // const url = `/api/projects/${id}/modules/`
      // this.$axios.$post(url, { title })
      Promise.resolve(fakeModule())
        .then(mod => {
          this.modules.push(mod)
        })
        .catch(() => {
          this.$message.error('Failed to create module')
        })
    },

    onUpdateModule() {
      // const payload = { title }
      // const { id } = this.currentProject
      // const url = `/api/projects/${id}/modules/${mod.id}`
      // this.$axios.$put(url, payload)
      //   .then(data => {
      //     this.$message.success(`Module ${data.title} updated`)
      //   })
      //   .catch(() => {
      //     this.$message.error('Failed to update module')
      //   })
    },

    onDeleteModule() {
      return Promise.resolve()
      // const { id } = this.currentProject
      // const url = `/api/projects/${id}/modules/${mod.id}`

      // this.$axios.$delete(url)
      //   .then(() => {
      //     if (this.openModule && this.openModule.id === mod.id) {
      //       this.openModule = false
      //     }

      //     this.$message.warn(`Deleted ${mod.title}`)
      //     const index = this.modules.indexOf(mod)
      //     this.modules.splice(index, 1)
      //   })
      //   .catch(() => {
      //     this.$message.error('Failed to delete module')
      //   })
    },

    // Goals

    onCreateGoal() {
      // const defaultData = {
      //   title: ''
      // }

      // this.$axios.$post(`${this.baseUrl}/goals`, defaultData)
      Promise.resolve(
        fakeGoal({
          id: Math.random()
        })
      )
        .then(goal => {
          this.goals.unshift(goal)
          this.updateGoalsOrder()
        })
        .catch(() => {
          this.$message.error('Failed to create goal')
        })
    },

    onChangeGoalTitle: pDebounce(function onChangeGoalTitle(goal) {
      this.updateGoal(goal)
    }, 500),

    onChangeGoalPriority(goal, value) {
      goal.priority = value
      this.updateGoal(goal)
    },

    onGoalChangeType(goal, value) {
      goal.type = value
      this.updateGoal(goal)
    },

    onDeleteGoal(goal) {
      if (!goal || !goal.id) {
        return
      }

      // this.$axios.$delete(`${this.baseUrl}/goals/${goal.id}`)
      Promise.resolve()
        .then(() => {
          const index = this.goals.indexOf(goal)
          if (index !== -1) {
            this.goals.splice(index, 1)
            this.updateGoalsOrder()
          }
        })
        .catch(() => {
          this.$message.error('Failed to delete goal')
        })
    },

    onGoalPersonaSelected() {
      // return this.$axios.$post(`${this.baseUrl}/goals/${goal.id}/personas`, { personaId })
      //   .catch(() => {
      //     this.$message.error('Failed to add persona to goal')
      //   })
    },

    onGoalPersonaDeselected() {
      // return this.$axios.$delete(`${this.baseUrl}/goals/${goal.id}/personas/${personaId}`)
      //   .catch(() => {
      //     this.$message.error('Failed to delete persona goal')
      //   })
    },

    updateGoal() {
      // if (!goal || !goal.id) {
      //   return
      // }
      // const payload = {...goal}
      // payload.personas = undefined
      // this.$axios.$put(`${this.baseUrl}/goals/${goal.id}`, payload)
      //   .catch(() => {
      //     this.$message.error('Failed to update goal')
      //   })
    },

    onOpenGoal(goal) {
      this.openGoal = false

      setTimeout(() => {
        this.openGoal = goal
        this.refreshStories()
      }, 1)
    },

    refreshGoals() {
      this.order = this.openModule.goals

      // return this.$axios.$get(`${this.baseUrl}/goals`)
      return Promise.resolve([
        fakeGoal({
          id: 1
        }),

        fakeGoal({
          id: 2
        })
      ])
        .then(goals => {
          this.goals = goals

          const leftOutGoals = this.goals.filter(
            goal => !this.order.includes(goal.id)
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

    updateGoalsOrder() {
      const order = this.goals.map(({ id }) => id)
      return this.onChangeGoalsOrder(order)
    },

    onChangeGoalsOrder() {
      // return this.$axios.$put(this.baseUrl, { goals: order })
      //   .then(mod => {
      //     Object.assign(this.openModule, mod)
      //   })
      //   .catch(() => {
      //     this.$message.error('Failed to save goals order')
      //   })
    },

    onOpenJourney(goal) {
      this.journeyGoal = goal
    },

    onChangeJourney() {
      // goal.journey = journey
      // if (!this.journeyGoal) {
      //   return
      // }
      // const goal = this.journeyGoal
      // this.$axios.$put(`${this.baseUrl}/goals/${this.journeyGoal.id}`, { journey }, { progress: false })
      //   .then(({ journey }) => {
      //     goal.journey = journey
      //   })
      //   .catch(() => {
      //     this.$message.error('Failed to update journey')
      //   })
    },

    // Backlog

    refreshStories() {
      const goal = this.openGoal
      const order = goal.stories

      // this.$axios.$get(this.baseUrlStories)
      Promise.resolve([fakeStory()]).then(stories => {
        const leftOutStories = this.stories.filter(
          story => !order.includes(story.id)
        )

        for (let story of leftOutStories) {
          this.deleteStory(story)
        }

        this.stories = order
          .map(id => stories.find(story => story.id === id))
          .filter(x => x)
      })
    },

    onCreateStory(index = 0) {
      // const defaultData = {
      //   title: '',
      //   priority: '',
      //   businessRules: [],
      //   acceptanceScenarios: []
      // }

      // this.$axios.$post(this.baseUrlStories, defaultData)
      Promise.resolve(fakeStory())
        .then(story => {
          this.stories.splice(index, 0, story)
          this.onChangeStoriesOrder()
        })
        .catch(() => {
          this.$message.error('Failed to create story')
        })
    },

    onUpdateStory() {
      // const url = `${this.baseUrlStories}/${story.id}`
      // this.$axios.$put(url, story)
      //   .then(updated => {
      //     const original = this.stories.find(some => some.id === story.id)
      //     if (original) {
      //       Object.assign(original, updated)
      //     }
      //   })
      //   .catch(() => {
      //     this.$message.error('Failed to update story')
      //   })
    },

    onDeleteStory() {
      // const url = `${this.baseUrlStories}/${story.id}`
      // this.$axios.$delete(url)
      //   .then(() => {
      //     const index = this.stories.findIndex(({id}) => id === story.id)
      //     if (index === -1) {
      //       return
      //     }
      //     this.stories.splice(index, 1)
      //     this.onChangeStoriesOrder()
      //   })
      //   .catch(() => {
      //     this.$message.error('Failed to delete story')
      //   })
    },

    onChangeStoriesOrder() {
      // return this.$axios.$put(this.baseGoalUrl, { stories: order })
      //   .then(goal => {
      //     // TODO
      //   })
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
  z-index: 100;
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
