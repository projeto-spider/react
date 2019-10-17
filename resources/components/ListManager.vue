<template>
  <div
    class="ant-list ant-list-split ant-list-bordered ant-list-something-after-last-item"
    style="margin-top: 10px"
  >
    <div class="ant-spin-nested-loading">
      <div class="ant-spin-container">
        <div v-for="(item, i) in items" :key="i" class="ant-list-item">
          <div class="ant-list-item-content ant-list-item-content-single">
            <a-input
              v-if="editing === i"
              ref="addInput"
              v-model="editingText"
              auto-focus
              placeholder="Enter to add. Leave blank to cancel"
              @keypress.enter="finishEditing(i, editingText)"
            />

            <div v-else style="display: flex; width: 100%;">
              <div @click="editItem(i)">
                {{ item }}
              </div>

              <div style="margin-left: auto">
                <a-popconfirm
                  slot="actions"
                  title="Are you sure delete this entry?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteItem(i)"
                >
                  <a-button shape="circle" icon="delete" size="small" />
                </a-popconfirm>

                <a-button
                  shape="circle"
                  icon="edit"
                  size="small"
                  @click="editItem(i)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-button v-if="showButton" type="dashed" block @click="add()">
      Add
    </a-button>
  </div>
</template>

<script>
export default {
  name: 'ListManager',

  props: {
    value: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      items: Array.isArray(this.value) ? this.value.concat() : [],
      showButton: true,
      editingText: '',
      editing: false
    }
  },

  methods: {
    add(config = {}) {
      const showButton =
        typeof config.showButton === undefined ? false : config.showButton

      if (this.editing) {
        return
      }

      this.showButton = showButton
      this.items.push('')
      this.editItem(this.items.length - 1)

      this.updateItems()
    },

    editItem(index) {
      this.editingText = this.items[index]
      this.editing = index

      setTimeout(() => {
        const $input =
          this.$refs.addInput &&
          this.$refs.addInput[0] &&
          this.$refs.addInput[0].$el

        if ($input && $input.focus) {
          $input.focus()
        }
      }, 1)
    },

    stopEditing() {
      this.showButton = true
      this.editing = false
      this.editingText = ''
      this.updateItems()
    },

    updateItems() {
      this.$emit('input', this.items)
    },

    finishEditing(index, text) {
      if (this.items.length < index) {
        return
      }

      if (text.length > 0) {
        this.items[index] = text

        const shouldAddAfter = !this.showButton

        this.stopEditing()

        if (shouldAddAfter) {
          this.add()
        }

        return
      }

      this.items.splice(index, 1)
      this.stopEditing()
    },

    deleteItem(i) {
      this.items.splice(i, 1)
      this.updateItems()
    }
  }
}
</script>
