<template>
  <div>
    <a-button
      type="primary"
      style="margin: 15px auto; width: 400px; display: block"
      @click="addGoal()"
    >
      Create
    </a-button>

    <div
      v-for="(goal, i) in goals"
      :key="i"
      class="ant-card ant-card-bordered ant-card-hoverable"
      style="max-width: 400px; margin: 15px auto"
    >
      <div class="ant-card-body">
        <div class="ant-card-meta">
          <div class="ant-card-meta-detail">
            <div class="ant-card-meta-description">
              <a-textarea
                placeholder="Conteúdo"
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
          <span>
            <a-select :defaultValue="goal.priority" style="width: 120px; text-aling: center" @change="value => onChangePriority(goal, value)">
              <a-select-option :value="0">Low</a-select-option>
              <a-select-option :value="1">Medium</a-select-option>
              <a-select-option :value="2">High</a-select-option>
            </a-select>
          </span>
        </li>

        <li style="width: 33.3333%;">
          <span>
            <a-select :defaultValue="goal.type" style="width: 120px; text-aling: center" @change="value => onChangeType(goal, value)">
              <a-select-option :value="0">Business</a-select-option>
              <a-select-option :value="1">Constrant</a-select-option>
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
            <a-button type="danger">Danger</a-button>
          </a-popconfirm>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import pDebounce from 'p-debounce'

export default {
  name: 'GoalSketch',

  data: () => ({
    goals: []
  }),

  computed: {
    ...mapGetters('project', [
      'currentProject'
    ])
  },

  methods: {
    addGoal () {
      const defaultData = {
        title: ''
      }

      this.$axios.$post(`/api/projects/${this.currentProject.id}/goals`, defaultData)
        .then(goal => {
          this.goals.unshift(goal)
        })
        .catch(() => {
          this.$message.error('Failed to create goal')
        })
    },

    updateGoal (goal) {
      if (!goal || !goal.id) {
        return
      }

      this.$axios.$put(`/api/projects/${this.currentProject.id}/goals/${goal.id}`, goal)
        .catch(() => {
          this.$message.error('Failed to update goal')
        })
    },

    deleteGoal (goal) {
      if (!goal || !goal.id) {
        return
      }

      this.$axios.$delete(`/api/projects/${this.currentProject.id}/goals/${goal.id}`)
        .then(() => {
          const index = this.goals.indexOf(goal)
          if (index !== -1) {
            this.goals.splice(index, 1)
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
    }
  },

  created () {
    if (!this.currentProject) {
      return this.$router.push('/projects')
    }

    this.$axios.$get(`/api/projects/${this.currentProject.id}/goals`)
      .then(goals => {
        this.goals = goals
      })
      .catch(() => {
        this.$message.error('Failed to load goals')
      })
  }
}
</script>
