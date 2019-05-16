<template>
  <div
    class="ant-list ant-list-split ant-list-bordered ant-list-something-after-last-item persona-list"
    style="margin-top: 10px"
  >
    <div class="ant-spin-nested-loading">
      <div class="ant-spin-container">
        <div v-for="(persona, i) in personas" :key="i" class="ant-list-item">
          <div class="ant-list-item-content ant-list-item-content-single">
            <div style="display: flex; width: 100%;">
              <div>{{ persona.name }}</div>

              <div style="margin-left: auto">
                <a-popconfirm
                  slot="actions"
                  title="Are you sure delete this entry?"
                  @confirm="deletePersona(persona)"
                  okText="Yes"
                  cancelText="No"
                >
                  <a-button
                    shape="circle"
                    icon="delete"
                    size="small"
                  />
                </a-popconfirm>

                <a-button
                  @click="openPersona(persona)"
                  shape="circle"
                  icon="edit"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-button
      @click="addPersona()"
      type="dashed"
      block
      :disabled="disabled"
    >
      Add
    </a-button>

    <a-modal
      centered
      v-model="modalOpen"
      @ok="closeModal"
      :width="960"
      :afterClose="closeModal"
    >
      <div class="ant-table ant-table-scroll-position-left ant-table-default ant-table-bordered">
        <div class="ant-table-content">
          <div class="ant-table-body">
            <table v-if="editingPersona" style="width: 100%">
              <tbody class="ant-table-tbody">
                <tr class="ant-table-row ant-table-row-level-0">
                  <td style="width: 50%">
                    <span class="ant-table-row-indent indent-level-0">
                      <p>
                        <strong data-v-step="personas-1">Name</strong>
                        <a-input v-model="editingPersona.name" :auto-focus="true" />
                      </p>

                      <p>
                        <strong data-v-step="personas-2">Role</strong>
                        <a-input v-model="editingPersona.role" />
                      </p>
                    </span>
                  </td>

                  <td style="width: 50%">
                    <span class="ant-table-row-indent indent-level-0" data-v-step="personas-3">
                      <strong>Profile / Behaviors</strong>
                      <ListManager v-model="editingPersona.data.profile" />
                    </span>
                  </td>
                </tr>

                <tr class="ant-table-row ant-table-row-level-0">
                  <td style="width: 50%">
                    <span class="ant-table-row-indent indent-level-0" data-v-step="personas-4">
                      <strong>Expectations</strong>
                      <ListManager v-model="editingPersona.data.expectations" />
                    </span>
                  </td>

                  <td style="width: 50%">
                    <span class="ant-table-row-indent indent-level-0" data-v-step="personas-5">
                      <strong>Goals</strong>
                      <ListManager v-model="editingPersona.data.goals" />
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <v-tour name="personasTour" :steps="tour.steps"></v-tour>
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
import { mapGetters, mapMutations } from 'vuex'
import ListManager from '~/components/ListManager.vue'
import pDebounce from 'p-debounce'

const tour = {
  steps: [
    {
      target: '[data-v-step="personas-1"]',
      content: `
        Give a <strong>fake name</strong> for this person.<br>
        <em>"John Doe"</em>, <em>"Jane Doe"</em>
      `
    },

    {
      target: '[data-v-step="personas-2"]',
      content: `
        What's their <strong>job</strong> in this app?<br>
        <em>"Visitor"</em>, <em>"Client"</em>
      `
    },

    {
      target: '[data-v-step="personas-3"]',
      content: `
        Stabilish <strong>character</strong> for this person<br>
        <em>"Client for 27 years"</em>, <em>"Uses her smartphone a lot"</em>
      `
    },

    {
      target: '[data-v-step="personas-4"]',
      content: `
        Define <strong>your aim</strong> for the app to impact in your client<br>
        <em>"Solve common banking problems"</em>, <em>"No need to go to the bank for simple transactions"</em>
      `
    },

    {
      target: '[data-v-step="personas-5"]',
      content: `
        What's the <strong>endgame</strong> for the client<br>
        <em>"Make transactions in their phone"</em>, <em>"Play a fun game"</em>
      `
    }
  ]
}

export default {
  name: 'PersonaListManager',

  components: { ListManager },

  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      tour,

      personas: [],

      modalOpen: false,
      editingPersona: false
    }
  },

  computed: {
    ...mapGetters('project', [
      'currentProject'
    ])
  },

  created () {
    this.$axios.$get(`/api/projects/${this.currentProject.id}/personas`)
      .then(personas => {
        this.personas = personas
      })
      .catch(() => {
        this.$message.error('Failed to load personas')
      })
  },

  methods: {
    ...mapMutations('project', [
      'updatePersonas'
    ]),

    closeModal () {
      this.modalOpen = false
      this.editingPersona = false
    },

    addPersona () {
      const defaultData = {
        name: 'Unnamed Persona',
        role: 'Persona Role'
      }

      this.$axios.$post(`/api/projects/${this.currentProject.id}/personas`, defaultData)
        .then(persona => {
          this.personas.push(persona)
          this.openPersona(persona)
        })
        .catch(() => {
          this.$message.error('Failed to create persona')
        })
    },

    openPersona (persona) {
      this.editingPersona = persona
      this.modalOpen = true
    },

    updatePersona (persona) {
      if (!persona || !persona.id) {
        return
      }

      this.$axios.$put(`/api/projects/${this.currentProject.id}/personas/${persona.id}`, persona)
        .catch(() => {
          this.$message.error('Failed to update persona')
        })
    },

    deletePersona (persona) {
      this.$axios.$delete(`/api/projects/${this.currentProject.id}/personas/${persona.id}`)
        .then(() => {
          const index = this.personas.indexOf(persona)
          if (index !== -1) {
            this.personas.splice(index, 1)
          }
        })
        .catch(() => {
          this.$message.error('Failed to delete persona')
        })
    }
  },

  watch: {
    editingPersona: {
      deep: true,

      handler: pDebounce(function editingPersonaWatcher () {
        this.updatePersona(this.editingPersona)
      }, 500)
    },

    personas: {
      deep: true,

      handler () {
        this.updatePersonas(this.personas)
      }
    }
  }
}
</script>

<style>
.v-step {
  z-index: 100;
}
</style>
