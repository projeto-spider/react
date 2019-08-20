<template>
  <div>
    <p>
      <a-button v-if="!readOnly" type="primary" block @click="createModule">
        Create Module
      </a-button>
    </p>

    <a-card style="max-width: 640px; margin: 0 auto;" class="ant-card-no-padding">
      <a-list
        itemLayout="horizontal"
        :dataSource="modules"
      >
        <a-list-item
          slot="renderItem"
          slot-scope="mod"
          class="module-item"
          :class="{ 'module-item-selected': mod.id === openModuleId }"
        >
          <template v-if="!readOnly">
            <a slot="actions"
              v-if="editing !== mod"
              @click="openNameInput(mod)"
            >
              Edit
            </a>

            <a slot="actions"
              v-else
              @click="updateModule()"
            >
              Update
            </a>
          </template>

          <a-popconfirm
            v-if="!readOnly"
            slot="actions"
            title="Are you sure delete this module?"
            @confirm="deleteModule(mod)"
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Delete</a>
          </a-popconfirm>

          <a slot="actions" @click="openModule(mod)">Open</a>

          <a-list-item-meta>
            <template slot="title">
              <form
                v-if="editing === mod"
                @submit.prevent="updateModule"
              >
                <a-input
                  size="small"
                  placeholder="Title"
                  v-model="mod.title"
                  @blur="closeEditing()"
                  autofocus
                />
              </form>

              <span v-else style="mouse: pointer" @click="openNameInput(mod)">
                {{ mod.title }}
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
  name: 'ModuleList',

  props: {
    openModuleId: {
      type: [Number, Boolean],
      default: false
    },

    readOnly: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    modules: [],
    editing: false
  }),

  computed: {
    ...mapGetters('project', [
      'currentProject'
    ])
  },

  created () {
    this.loadModules()
  },

  methods: {
    loadModules () {
      const { id } = this.currentProject
      const url = `/api/projects/${id}/modules/`

      this.$axios.$get(url)
        .then(modules => {
          this.modules = modules
        })
        .catch(() => {
          this.$message.error('Failed to load modules')
        })
    },

    openNameInput (mod) {
      this.closeEditing()
      this.editing = mod
    },

    createModule () {
      const defaultName = 'Module'
      const defaultLike = this.modules
        .map(project => project.title)
        .filter(title => title.indexOf(defaultName) === 0)
        .map(title => title.split(' ').pop())
        .map(numberString => Number(numberString))
        .filter(x => x)
        .sort()

      const countDefaultLike = defaultLike.length
      const nextNumber = countDefaultLike
        ? defaultLike.pop() + 1
        : 1

      const title = `${defaultName} ${nextNumber}`

      const { id } = this.currentProject
      const url = `/api/projects/${id}/modules/`
      this.$axios.$post(url, { title })
        .then(mod => {
          this.modules.push(mod)
        })
        .catch(() => {
          this.$message.error('Failed to create module')
        })
    },

    updateModule () {
      const { title } = this.editing
      const payload = { title }

      const { id } = this.currentProject
      const url = `/api/projects/${id}/modules/${this.editing.id}`
      this.$axios.$put(url, payload)
        .then(data => {
          this.$message.success(`Module ${data.title} updated`)
        })
        .catch(() => {
          this.$message.error('Failed to update module')
        })
      this.editing = false
    },

    deleteModule (mod) {
      if (this.editing === mod) {
        this.editing = false
      }

      const { id } = this.currentProject
      const url = `/api/projects/${id}/modules/${mod.id}`
      this.$axios.$delete(url)
        .then(() => {
          this.$emit('moduleDeleted', mod)
          this.$message.warn(`Deleted ${mod.title}`)
          const index = this.modules.indexOf(mod)
          this.modules.splice(index, 1)
        })
        .catch(() => {
          this.$message.error('Failed to delete module')
        })
    },

    closeEditing () {
      if (this.editing) {
        this.updateModule()
      }

      this.editing = false
    },

    openModule (mod) {
      this.$emit('moduleOpen', mod)
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
