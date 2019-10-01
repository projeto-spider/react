<template>
  <div>
    <p>
      <a-button v-if="!readOnly" type="primary" block @click="$emit('create')">
        Create {{ itemLabel }}
      </a-button>
    </p>

    <a-card style="max-width: 640px; margin: 0 auto;" class="ant-card-no-padding">
      <a-list
        itemLayout="horizontal"
        :dataSource="items"
      >
        <a-list-item
          slot="renderItem"
          slot-scope="item"
          class="list-item"
          :class="{ 'list-item-selected': item.id === openItemId }"
        >
          <template v-if="!readOnly && !disableEdit">
            <a slot="actions"
              v-if="editing !== item"
              @click="openNameInput(item)"
            >
              Edit
            </a>

            <a slot="actions"
              v-else
              @click="emitUpdate()"
            >
              Update
            </a>
          </template>

          <a-popconfirm
            v-if="!readOnly"
            slot="actions"
            title="Are you sure delete this item?"
            @confirm="() => {
              if (editing === item) {
                this.editing = false
              }

              $emit('delete', item)
            }"
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Delete</a>
          </a-popconfirm>

          <a slot="actions" @click="$emit('open', item)">Open</a>

          <a-list-item-meta>
            <template slot="title">
              <form
                v-if="editing === item"
                @submit.prevent="emitUpdate()"
              >
                <a-input
                  size="small"
                  placeholder="Title"
                  v-model="item.title"
                  @blur="closeEditing()"
                  autofocus
                />
              </form>

              <span v-else style="mouse: pointer" @click="openNameInput(item)">
                {{ item.title }}
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
  name: 'VSiderListCrud',

  props: {
    itemLabel: String,

    items: Array,

    openItemId: {
      type: [Number, Boolean],
      default: false
    },

    readOnly: {
      type: Boolean,
      default: false
    },

    disableEdit: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    editing: false,
    editingTitle: ''
  }),

  computed: {
    ...mapGetters('project', [
      'currentProject'
    ])
  },

  methods: {
    openNameInput (item) {
      this.closeEditing()
      this.editingTitle = item.title
      this.editing = item
    },

    emitUpdate (item) {
      if (this.editing) {
        this.$emit('update', this.editing, this.editingTitle)
        this.closeEditing()
      }
    },

    closeEditing () {
      this.editing = false
      this.editingTitle = ''
    }
  }
}
</script>

<style>
.ant-card-no-padding .ant-card-body {
  padding: 0;
}

.list-item {
  padding: 15px;
  background-color: white;
}

.list-item.list-item-selected {
  /* background-color: #dedede; */
  border: solid 1px #d6c5ff !important;
  color: white !important;
  /* margin: 15px 0; */
  position: relative;
  left: -5px;
  width: calc(100% + 10px);
}
</style>
