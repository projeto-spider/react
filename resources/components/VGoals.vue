<template>
  <div>
    <a-button
      type="primary"
      style="margin: 0 auto 15px; width: 400px; display: block"
      @click="$emit('create')"
    >
      Create Goal
    </a-button>

    <Draggable
      :list="goals"
      @change="$emit('changeOrder', goals.map(goal => goal.id))"
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
                    @change="() => $emit('changeTitle', goal)"
                  />

                  <br><br>

                  <a-select
                    mode="multiple"
                    placeholder="Personas"
                    :defaultValue="goal.personas ? goal.personas.map(persona => persona.id) : []"
                    style="width: 100%"
                    @select="personaId => $emit('personaSelected', goal, personaId)"
                    @deselect="personaId => $emit('personaDeselected', goal, personaId)"
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
                  <a-select
                    :defaultValue="goal.priority"
                    style="width: 120px; text-aling: center"
                    @change="value => $emit('changePriority', goal, value)"
                  >
                    <a-select-option :value="0">Low</a-select-option>
                    <a-select-option :value="1">Medium</a-select-option>
                    <a-select-option :value="2">High</a-select-option>
                  </a-select>
                </a-tooltip>
              </span>
            </li>

            <li style="width: 33.3333%;">
              <span>
                <a-select
                  :defaultValue="goal.type"
                  style="width: 120px; text-aling: center"
                  @change="type => $emit('changeType', goal, type)"
                >
                  <a-select-option :value="0">Business</a-select-option>
                  <a-select-option :value="1">Constraint</a-select-option>
                </a-select>
              </span>
            </li>

            <li style="width: 33.3333%;">
              <a-popconfirm
                title="Are you sure delete this entry?"
                @confirm="$emit('delete', goal)"
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
              @click="$emit('openJourney', goal)"
            />

            <a-button
              type="primary"
              shape="circle"
              icon="ordered-list"
              @click="$emit('open', goal)"
            />
          </div>
        </div>
      </transition-group>
    </Draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  name: 'VGoals',

  components: {
    Draggable
  },

  props: {
    goals: Array,
    personas: Array
  },

  computed: {
    itemsWithWrongPosition () {
      return this.goals.filter((goal, i, goals) => {
        const before = goals.slice(0, i)
        const after = goals.slice(i + 1)

        return !before.every(other => goal.priority <= other.priority) ||
          !after.every(other => goal.priority >= other.priority)
      })
    },
  }
}
</script>

<style>

</style>
