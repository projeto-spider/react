<template>
  <a-alert
    type="warning"
    class="user-story"
  >
    <template slot="message">
      US-{{ String(story.id).padStart(2, '0') }}

      <a-button-group style="float: right">
        <a-button
          :type="showDetails ? undefined : 'primary'"
          size="small"
          icon="eye"
          @click="showDetails = !showDetails"
        />
        <a-button
          v-show="model.title.length > 0"
          size="small"
          icon="scissor"
          @click="$emit('breakdown', story)"
        />
        <a-popconfirm
          title="Are you sure delete this story?"
          okText="Yes"
          cancelText="No"
          placement="bottom"
          @confirm="$emit('delete')"
        >
          <a-button
            type="danger"
            size="small"
            icon="delete"
          />
        </a-popconfirm>
      </a-button-group>
    </template>

    <template slot="description">
      <a-textarea
        placeholder="As a < type of user >, I want < some goal > so that < some reason >."
        :autosize="{ minSize: 2 }"
        class="user-story-text-area"
        v-model="model.title"
        @input="update"
      />

      <div v-show="showDetails">
        <p>
          <strong>Business Rules</strong>
          <StringArrayModel
            v-model="model.businessRules"
            add-text="Add Business Rule"
            placeholder="Only do < action > when < condition >"
            className="user-story-text-area"
            @input="update"
          />
        </p>

        <p>
          <strong>Acceptance Scenarios</strong>
          <StringArrayModel
            v-model="model.acceptanceScenarios"
            add-text="Add Acceptance Scenario"
            :placeholder="`GIVEN < state >
WHEN < condition >
THEN < expectation >`"
            className="user-story-text-area"
            @input="update"
          />
        </p>
      </div>
    </template>
  </a-alert>
</template>

<script>
import StringArrayModel from '@/components/StringArrayModel'
import pDebounce from 'p-debounce'

export default {
  name: 'UserStory',

  components: {
    StringArrayModel
  },

  props: {
    story: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    showDetails: false,
    model: {}
  }),

  created () {
    this.model = JSON.parse(JSON.stringify(this.story))
  },

  methods: {
    update: pDebounce(function update () {
      this.$emit('update', this.model)
    }, 500)
  }
}
</script>

<style>
.user-story {
  margin-bottom: 10px;
  transition: all 0.3s;
}

.user-story .user-story-text-area {
  resize: none;
  border: none;
  background-color: rgba(0, 0, 0, 0);
}
</style>
