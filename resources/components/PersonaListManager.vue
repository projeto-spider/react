<template>
  <div
    class="ant-list ant-list-split ant-list-bordered ant-list-something-after-last-item"
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
                        <strong>Name</strong>
                        <a-input v-model="editingPersona.name" :auto-focus="true" />
                      </p>

                      <p>
                        <strong>Role</strong>
                        <a-input v-model="editingPersona.role" />
                      </p>
                    </span>
                  </td>

                  <td style="width: 50%">
                    <span class="ant-table-row-indent indent-level-0">
                      <strong>Profile / Behaviors</strong>
                      <ListManager v-model="editingPersona.data.profile" />
                    </span>
                  </td>
                </tr>

                <tr class="ant-table-row ant-table-row-level-0">
                  <td style="width: 50%">
                    <span class="ant-table-row-indent indent-level-0">
                      <strong>Expectations</strong>
                      <ListManager v-model="editingPersona.data.expectations" />
                    </span>
                  </td>

                  <td style="width: 50%">
                    <span class="ant-table-row-indent indent-level-0">
                      <strong>Goals</strong>
                      <ListManager v-model="editingPersona.data.goals" />
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ListManager from '~/components/ListManager.vue'
import pDebounce from 'p-debounce'

export default {
  name: 'PersonaListManager',

  components: { ListManager },

  data () {
    return {
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
    }
  }
}
</script>
