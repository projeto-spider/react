<template>
  <div>
    <a-button
      type="primary"
      style="margin: 0 auto 15px; width: 400px; display: block"
      @click="addStory"
    >
      Create Story
    </a-button>

    <Draggable
      v-model="stories"
      @change="onChangeOrder"
    >
      <transition-group name="goal-list">
        <UserStory
          v-for="(story, index) in stories"
          :key="story.id"
          :story="story"
          @update="updated => updateStory(updated)"
          @breakdown="() => addStory(index + 1)"
          @delete="deleteStory(story)"
        />
      </transition-group>
    </Draggable>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Draggable from 'vuedraggable'
import UserStory from '@/components/UserStory'

export default {
  name: 'Backlog',

  components: {
    UserStory,
    Draggable
  },

  props: {
    goal: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    order: [],
    stories: []
  }),

  computed: {
    ...mapGetters('project', [
      'currentProject'
    ]),

    baseGoalUrl () {
      const projectId = this.currentProject.id
      const moduleId = this.goal.moduleId
      const goalId = this.goal.id
      return `/api/projects/${projectId}/modules/${moduleId}/goals/${goalId}`
    },

    baseUrl () {
      return `${this.baseGoalUrl}/stories`
    }
  },

  created () {
    this.order = this.goal.stories
    this.loadStories()
  },

  methods: {
    loadStories () {
      this.$axios.$get(this.baseUrl)
        .then(stories => {
          const leftOutStories = this.stories.filter(story =>
            !this.order.includes(story.id)
          )

          for (let story of leftOutStories) {
            this.deleteStory(story)
          }

          this.stories = this.order
            .map(id => stories.find(story => story.id === id))
            .filter(x => x)
        })
    },

    addStory (index = 0) {
      const defaultData = {
        title: '',
        businessRules: [],
        acceptanceScenarios: []
      }

      this.$axios.$post(this.baseUrl, defaultData)
        .then(story => {
          this.stories.splice(index, 0, story)
          this.onChangeOrder()
        })
        .catch(() => {
          this.$message.error('Failed to create story')
        })
    },

    updateStory (story) {
      const url = `${this.baseUrl}/${story.id}`
      this.$axios.$put(url, story)
        .then(updated => {
          // TODO
        })
        .catch(() => {
          this.$message.error('Failed to update story')
        })
    },

    deleteStory (story) {
      this.$axios.$delete(this.baseUrl)
        .then(() => {
          const index = this.stories.findIndex(({id}) => id === story.id)

          if (index === -1) {
            return
          }

          this.stories.splice(index, 1)
          this.onChangeOrder()
        })
        .catch(() => {
          this.$message.error('Failed to delete story')
        })
    },

    onChangeOrder () {
      const stories = this.stories.map(({id}) => id)
      this.$emit('changedOrder', stories)
      return this.$axios.$put(this.baseGoalUrl, { stories })
        .then(goal => {
          // TODO
        })
    }
  }
}
</script>
