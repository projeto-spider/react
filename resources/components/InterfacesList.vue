<template>
  <div>
    <p>
      <a-button v-if="!readOnly" type="primary" block @click="createInterface">
        Create Interface
      </a-button>
    </p>

    <a-card
      style="max-width: 640px; margin: 0 auto;"
      class="ant-card-no-padding"
    >
      <a-list item-layout="horizontal" :data-source="interfaces">
        <a-list-item
          slot="renderItem"
          slot-scope="interfac"
          class="module-item"
          :class="{ 'module-item-selected': interfac.id === openInterfaceId }"
        >
          <a-popconfirm
            v-if="!readOnly"
            slot="actions"
            title="Are you sure delete this card?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deleteInterface(interfac)"
          >
            <a href="#">Delete</a>
          </a-popconfirm>

          <a slot="actions" @click="openInterface(interfac)">Open</a>

          <a-list-item-meta>
            <template slot="title">
              <form v-if="editing === interfac" @submit.prevent="openInterface">
                <a-input
                  v-model="interfac.title"
                  size="small"
                  placeholder="Title"
                  autofocus
                  @blur="closeEditing()"
                />
              </form>

              <span
                v-else
                style="mouse: pointer"
                @click="openNameInput(interfac)"
              >
                {{ interfac.title }}
              </span>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CrcCardList',

  props: {
    openInterfaceId: {
      type: [Number, Boolean],
      default: false
    },

    readOnly: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    interfaces: [],
    editing: false
  }),

  computed: {
    ...mapGetters('project', ['currentProject'])
  },

  created() {
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
          this.$emit('updateInterfaces', interfaces)
        })
        .catch(() => {
          this.$message.error('Failed to load Classes')
        })
    },

    openNameInput(mod) {
      this.closeEditing()
      this.editing = mod
    },

    createInterface() {
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
          this.$emit('updateInterfaces', this.interfaces)
        })
        .catch(() => {
          this.$message.error('Failed to create module')
        })
    },

    // openInterface() {
    //   const { title } = this.editing
    //   const payload = { title }

    //   const { id } = this.currentProject
    //   const url = `/api/projects/${id}/interfaces/${this.editing.id}`
    //   this.$axios
    //     .$put(url, payload)
    //     .then(data => {
    //       this.$message.success(`Class ${data.title} updated`)
    //     })
    //     .catch(() => {
    //       this.$message.error('Failed to update module')
    //     })
    //   this.editing = false
    // },

    deleteInterface(mod) {
      if (this.editing === mod) {
        this.editing = false
      }

      const { id } = this.currentProject
      const url = `/api/projects/${id}/interfaces/${mod.id}`
      this.$axios
        .$delete(url)
        .then(() => {
          this.$emit('interfaceDeleted', mod)
          this.$message.warn(`Deleted ${mod.title}`)
          const index = this.interfaces.indexOf(mod)
          this.interfaces.splice(index, 1)
          this.$emit('updateInterfaces', this.interfaces)
        })
        .catch(() => {
          this.$message.error('Failed to delete module')
        })
    },

    closeEditing() {
      if (this.editing) {
        this.openInterface()
      }

      this.editing = false
    },

    openInterface(mod) {
      this.$emit('interfaceOpen', mod)
    }
  }
}
</script>

<style>
.ant-card-no-padding .ant-card-body {
  padding: 0;
}

.module-item {
  padding: 15px;
  background-color: white;
}

.module-item.module-item-selected {
  /* background-color: #dedede; */
  border: solid 1px #d6c5ff !important;
  color: white !important;
  /* margin: 15px 0; */
  position: relative;
  left: -5px;
  width: calc(100% + 10px);
}
</style>
