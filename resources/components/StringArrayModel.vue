<template>
  <div>
    <div
      v-for="(item, index) in items"
      :key="index"
    >
      <a-icon
        v-if="!disabled"
        class="dynamic-delete-button"
        type="minus-circle-o"
        :disabled="items.length === 1"
        @click="remove(index)"
      />
      <a-textarea
        :autosize="{ minSize: 1 }"
        :placeholder="placeholder"
        style="width: 90%; margin-right: 8px; margin-bottom: 5px;"
        :class="className"
        v-model="items[index]"
        :disabled="disabled"
      />
    </div>

    <a-button
      v-if="!disabled"
      type="dashed"
      style="width: 100%"
      @click="() => items.push('')"
    >
      <a-icon type="plus" /> {{ addText }}
    </a-button>
  </div>
</template>

<script>
import pDebounce from 'p-debounce'

export default {
  name: 'StringArrayModel',

  props: {
    value: {
      type: Array,
      default: () => ['']
    },

    placeholder: {
      type: String,
      required: false
    },

    addText: {
      type: String,
      default: 'Add'
    },

    className: {
      type: String,
      required: false,
      default: ''
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    items: []
  }),

  created () {
    // clone
    this.items = this.value.concat()

    if (this.items.length === 0) {
      this.items.push('')
    }
  },

  methods: {
    remove (index) {
      this.items.splice(index, 1)
    }
  },

  watch: {
    items: {
      deep: true,
      handler: pDebounce(function emit (value) {
        this.$emit('input', value)
      }, 500)
    }
  }
}
</script>


<style>
.dynamic-delete-button {
  cursor: pointer;
  float: right;
  font-size: 24px;
  color: #999;
  transition: all .3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
