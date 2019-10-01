<template>
  <div>
    <a-button
      v-if="!readOnly"
      type="primary"
      style="margin: 0 auto 15px; width: 400px; display: block"
      @click="$emit('create')"
    >
      Create Story
    </a-button>

    <Draggable
      :list="stories"
      :disabled="readOnly"
      @change="$emit('changeOrder', stories.map(story => story.id))"
    >
      <transition-group name="story-list">
        <UserStory
          v-for="(story, index) in stories"
          :key="story.id"
          :story="story"
          :wrong-position="storiesWithWrongPosition.includes(story)"
          :read-only="readOnly"
          @update="updated => $emit('update', updated)"
          @breakdown="$emit('create', index + 1)"
          @delete="$emit('delete', story)"
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
  name: 'VBacklog',

  components: {
    UserStory,
    Draggable
  },

  props: {
    goal: {
      type: Object,
      required: true
    },

    stories: Array,

    scale: Array,

    readOnly: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    storiesWithWrongPosition () {
      const scale = this.scale || []

      return this.stories.filter((story, i, stories) => {
        if (!scale.includes(story.priority)) {
          return false
        }

        const priority = scale.indexOf(story.priority)

        const priorities = stories.map(story => scale.indexOf(story.priority))
        const before = priorities
          .slice(0, i)
          .filter(x => x !== -1)
        const after = priorities
          .slice(i + 1)
          .filter(x => x !== -1)

        return !before.every(otherPriority => priority <= otherPriority) ||
          !after.every(otherPriority => priority >= otherPriority)
      })
    }
  },
}
</script>
