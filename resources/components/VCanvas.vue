<template>
  <a-card :bordered="false" style="width: 100%" :title="projectName">
    <a-button slot="extra" type="primary" @click="$tours.canvasTour.start()">
      <a-icon type="info-circle" />
      Tutorial
    </a-button>

    <div
      class="ant-table ant-table-scroll-position-left ant-table-default ant-table-bordered"
    >
      <div class="ant-table-content">
        <div class="ant-table-body">
          <table v-if="model" style="width: 100%">
            <tbody class="ant-table-tbody">
              <tr class="ant-table-row ant-table-row-level-0">
                <td style="width: 33.33%" data-v-step="1">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>Problem</strong>
                    <ListManager v-model="model.problems" />
                  </span>
                </td>

                <td style="width: 33.33%" data-v-step="2">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>Solution</strong>
                    <ListManager v-model="model.solutions" />
                  </span>
                </td>

                <td style="width: 33.33%" data-v-step="3">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>Constraints</strong>
                    <ListManager v-model="model.constraints" />
                  </span>
                </td>
              </tr>
              <tr class="ant-table-row ant-table-row-level-0">
                <td style="width: 33.33%" data-v-step="4">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>Is is</strong>
                    <ListManager v-model="model.is" />
                  </span>
                </td>

                <td style="width: 33.33%" data-v-step="5">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>It isn't</strong>
                    <ListManager v-model="model.isnt" />
                  </span>
                </td>

                <td style="width: 33.33%" data-v-step="6">
                  <span class="ant-table-row-indent indent-level-0">
                    <strong>
                      <span>Personas</span>
                      <span v-if="!enablePersonas" style="color: red"
                        >(Complete the other fields)</span
                      >
                    </strong>

                    <PersonaListManager
                      :disabled="!enablePersonas"
                      :personas="personas"
                      :persona-added-handler="personaAddedHandler"
                      :persona-edited-handler="personaEditedHandler"
                      :persona-deleted-handler="personaDeletedHandler"
                      @personasChanged="$emit('personasChanged', $event)"
                    />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <v-tour name="canvasTour" :steps="$options.tour.steps" />
  </a-card>
</template>

<script>
import clone from 'deep-clone'
import ListManager from '~/components/ListManager.vue'
import PersonaListManager from '~/components/PersonaListManager.vue'
import tour from '~/assets/tours/canvas'

export default {
  name: 'VCanvas',

  tour,

  components: { ListManager, PersonaListManager },

  props: {
    projectName: {
      type: String,
      required: true
    },
    canvas: {
      type: [Object, Boolean],
      required: true
    },
    personas: {
      type: [Promise, Array],
      required: true
    },
    enablePersonas: {
      type: Boolean,
      required: true
    },
    personaAddedHandler: {
      type: Function,
      required: true
    },
    personaEditedHandler: {
      type: Function,
      required: true
    },
    personaDeletedHandler: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      model: this.canvas ? clone(this.canvas) : {}
    }
  },

  watch: {
    model: {
      deep: true,
      handler() {
        this.$emit('canvasChanged', this.model)
      }
    }
  }
}
</script>
