<template>
  <a-card :bordered="false" style="width: 100%" :title="projectName">
    <a-button
      slot="extra"
      type="primary"
      @click="$tours.canvasTour.start()"
    >
      <a-icon type="info-circle" />
      Tutorial
    </a-button>

    <div class="ant-table ant-table-scroll-position-left ant-table-default ant-table-bordered">
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
                      <span v-if="!enablePersonas" style="color: red">(Complete the other fields)</span>
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

    <v-tour name="canvasTour" :steps="$options.tour.steps"></v-tour>
  </a-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import clone from 'deep-clone'
import ListManager from '~/components/ListManager.vue'
import PersonaListManager from '~/components/PersonaListManager.vue'
import tour from '~/assets/tours/canvas'

export default {
  name: 'VCanvas',

  tour,

  props: {
    projectName: String,
    canvas: [Object, Boolean],
    personas: [Promise, Array],
    enablePersonas: Boolean,
    personaAddedHandler: Function,
    personaEditedHandler: Function,
    personaDeletedHandler: Function,
  },

  components: { ListManager, PersonaListManager },

  data () {
    return {
      model: this.canvas ? clone(this.canvas) : {}
    }
  },

  watch: {
    model: {
      deep: true,
      handler () {
        this.$emit('canvasChanged', this.model)
      }
    }
  }
}
</script>

