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
import VSiderListCrud from '@/components/VSiderListCrud'
import VInterfaceForm from '@/components/VInterfaceForm'

const exampleInterface = (title = 'My Interface') => ({
  id: 1,
  input: 'My Input',
  output: 'My Output',
  title,
  supplier: 'Supplier',
  internal: false
})

export default {
  name: 'Interfaces',

  components: { VSiderListCrud, VInterfaceForm },

  data: () => ({
    interfaces: [exampleInterface()],
    openInterface: false,
    currentProject: {}
  }),

  created() {
    this.loadInterfaces()
  },

  methods: {
    loadInterfaces() {},

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

      Promise.resolve(exampleInterface(title))
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

      Promise.resolve(payload)
        .then(updated => {
          Object.assign(this.openInterface, updated)
        })
        .catch(() => {
          this.$message.error('Failed to update Class')
        })
    },

    onDeleteInterface(mod) {
      if (this.editing === mod) {
        this.editing = false
      }

      Promise.resolve()
        .then(() => {
          this.$message.warn(`Deleted ${mod.title}`)
          const index = this.interfaces.indexOf(mod)
          this.interfaces.splice(index, 1)
        })
        .catch(() => {
          this.$message.error('Failed to delete module')
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
