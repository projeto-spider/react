<template>
  <div
    class="ant-list ant-list-split ant-list-bordered ant-list-something-after-last-item persona-list"
    style="margin-top: 10px"
  >
    <div class="ant-spin-nested-loading">
      <div class="ant-spin-container">
        <div v-for="(persona, i) in model" :key="i" class="ant-list-item">
          <div class="ant-list-item-content ant-list-item-content-single">
            <div style="display: flex; width: 100%;">
              <div>{{ persona.name }}</div>

              <div style="margin-left: auto">
                <a-popconfirm
                  slot="actions"
                  title="Are you sure delete this entry?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deletePersona(persona)"
                >
                  <a-button shape="circle" icon="delete" size="small" />
                </a-popconfirm>

                <a-button
                  shape="circle"
                  icon="edit"
                  size="small"
                  @click="openPersona(persona)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-button type="dashed" block :disabled="disabled" @click="addPersona()">
      Add
    </a-button>

    <a-modal
      v-model="modalOpen"
      centered
      :width="960"
      :after-close="closeModal"
      @ok="closeModal"
    >
      <div
        class="ant-table ant-table-scroll-position-left ant-table-default ant-table-bordered"
      >
        <div class="ant-table-content">
          <div class="ant-table-body">
            <table v-if="editingPersona" style="width: 100%">
              <tbody class="ant-table-tbody">
                <tr class="ant-table-row ant-table-row-level-0">
                  <td style="width: 50%">
                    <span class="ant-table-row-indent indent-level-0">
                      <p>
                        <strong data-v-step="personas-1">Name</strong>
                        <a-input
                          v-model="editingPersona.name"
                          :auto-focus="true"
                        />
                      </p>

                      <p>
                        <strong data-v-step="personas-2">Role</strong>
                        <a-input v-model="editingPersona.role" />
                      </p>
                    </span>
                  </td>

                  <td style="width: 50%">
                    <span
                      class="ant-table-row-indent indent-level-0"
                      data-v-step="personas-3"
                    >
                      <strong>Profile / Behaviors</strong>
                      <ListManager v-model="editingPersona.data.profile" />
                    </span>
                  </td>
                </tr>

                <tr class="ant-table-row ant-table-row-level-0">
                  <td style="width: 50%">
                    <span
                      class="ant-table-row-indent indent-level-0"
                      data-v-step="personas-4"
                    >
                      <strong>Expectations</strong>
                      <ListManager v-model="editingPersona.data.expectations" />
                    </span>
                  </td>

                  <td style="width: 50%">
                    <span
                      class="ant-table-row-indent indent-level-0"
                      data-v-step="personas-5"
                    >
                      <strong>Goals</strong>

                      <a-list
                        bordered
                        :data-source="editingPersona.goals || []"
                      >
                        <a-list-item slot="renderItem" slot-scope="item">{{
                          item.title
                        }}</a-list-item>
                      </a-list>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <v-tour name="personasTour" :steps="$options.tour.steps" />
      </div>

      <template slot="footer">
        <a-button
          slot="extra"
          type="primary"
          @click="$tours.personasTour.start()"
        >
          <a-icon type="info-circle" /> Tutorial
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import ListManager from '~/components/ListManager.vue'
import pDebounce from 'p-debounce'
import clone from 'deep-clone'
import tour from '~/assets/tours/persona'

export default {
  name: 'PersonaListManager',

  tour,

  components: { ListManager },

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    personas: {
      type: [Promise, Array],
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
      model: [],
      modalOpen: false,
      editingPersona: false
    }
  },

  watch: {
    editingPersona: {
      deep: true,

      handler: pDebounce(function editingPersonaWatcher() {
        this.updatePersona(this.editingPersona)
      }, 500)
    },

    model: {
      deep: true,

      handler() {
        this.$emit('personasChanged', this.model)
      }
    }
  },

  async created() {
    const personas = Promise.resolve(this.personas).then(result =>
      Array.isArray(result) ? clone(result) : []
    )

    this.model = await personas
  },

  methods: {
    closeModal() {
      this.modalOpen = false
      this.editingPersona = false
    },

    addPersona() {
      const defaultData = {
        name: 'Unnamed Persona',
        role: 'Persona Role'
      }

      this.personaAddedHandler(defaultData)
        .then(persona => {
          this.model.push(persona)
          this.openPersona(persona)
        })
        .catch(() => {
          this.$message.error('Failed to create persona')
        })
    },

    openPersona(persona) {
      this.editingPersona = persona
      this.modalOpen = true
    },

    updatePersona(persona) {
      if (!persona || !persona.id) {
        return
      }

      const payload = { ...persona }
      payload.goals = undefined

      this.personaEditedHandler(persona, payload).catch(() => {
        this.$message.error('Failed to update persona')
      })
    },

    deletePersona(persona) {
      this.personaDeletedHandler(persona)
        .then(() => {
          const index = this.model.indexOf(persona)
          if (index !== -1) {
            this.model.splice(index, 1)
          }
        })
        .catch(() => {
          this.$message.error('Failed to delete persona')
        })
    }
  }
}
</script>

<style>
.v-step {
  z-index: 100;
}
</style>
