<template>
  <a-layout>
    <a-layout-sider style="background-color: unset" :width="360">
      <VSiderListCrud
        v-if="currentProject"
        item-label="Interface"
        :items="interfaces"
        :open-item-id="openInterface && openInterface.id"
        :disable-edit="true"
        @open="onOpenInterface"
        @create="onCreateInterface"
        @delete="onDeleteInterface"
      />
    </a-layout-sider>

    <a-layout>
      <a-layout-content>
        <a-row>
          <a-col :span="24">
            <div v-if="!openInterface" style="text-align: center">
              <h3>Open an Interface</h3>
            </div>

            <div v-else>
              <VInterfaceForm
                :interface="openInterface"
                @update="onUpdateInterface"
              />
            </div>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import VSiderListCrud from '@/components/VSiderListCrud'
import VInterfaceForm from '@/components/VInterfaceForm'

export default {
  name: 'Interfaces',

  components: { VSiderListCrud, VInterfaceForm },

  data: () => ({
    interfaces: [],
    openInterface: false
  }),

  computed: {
    ...mapGetters('project', ['currentProject']),

    baseUrl() {
      if (!this.currentProject || !this.openInterface) {
        return false
      }

      return `/api/projects/${this.currentProject.id}`
    }
  },

  created() {
    if (!this.currentProject) {
      return this.$router.push('/projects')
    }

    this.loadInterfaces()
  },

  methods: {
    loadInterfaces() {
      const { id } = this.currentProject
      const url = `/api/projects/${id}/interfaces/`

      this.$axios
        .$get(url)
        .then(interfaces => {
          this.interfaces = interfaces
        })
        .catch(() => {
          this.$message.error('Failed to load interfaces')
        })
    },

    onOpenInterface(interfac) {
      this.order = []
      this.openInterface = false

      setTimeout(() => {
        this.openInterface = interfac
      }, 100)
    },

    onCreateInterface() {
      const defaultName = 'Interface'
      const defaultLike = this.interfaces
        .map(card => card.title)
        .filter(title => title.indexOf(defaultName) === 0)
        .map(title => title.split(' ').pop())
        .map(numberString => Number(numberString))
        .filter(x => x)
        .sort()

      const countDefaultLike = defaultLike.length
      const nextNumber = countDefaultLike ? defaultLike.pop() + 1 : 1

      const title = `${defaultName} ${nextNumber}`

      const { id } = this.currentProject
      const url = `/api/projects/${id}/interfaces/`
      this.$axios
        .$post(url, { title })
        .then(mod => {
          this.interfaces.push(mod)
        })
        .catch(() => {
          this.$message.error('Failed to create interface')
        })
    },

    onUpdateInterface(model) {
      if (!this.openInterface) {
        return
      }

      const payload = {
        ...model
      }

      this.$axios
        .$put(`${this.baseUrl}/interfaces/${this.openInterface.id}`, payload)
        .then(updated => {
          Object.assign(this.openInterface, updated)
        })
        .catch(() => {
          this.$message.error('Failed to update interface')
        })
    },

    onDeleteInterface(mod) {
      if (this.editing === mod) {
        this.editing = false
      }

      const { id } = this.currentProject
      const url = `/api/projects/${id}/interfaces/${mod.id}`
      this.$axios
        .$delete(url)
        .then(() => {
          this.$message.warn(`Deleted ${mod.title}`)
          const index = this.interfaces.indexOf(mod)
          this.interfaces.splice(index, 1)
        })
        .catch(() => {
          this.$message.error('Failed to delete interface')
        })
    }
  }
}
</script>

<style>
.invalid-order .ant-select-selection {
  border-color: red;
}

.fab-group {
  position: absolute;
  top: -13px;
  right: -16px;
}

.fab-group .ant-btn {
  display: block;
  margin-bottom: 3px;
}

.diagram-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
}

.close-modal {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 100;
}
</style>
