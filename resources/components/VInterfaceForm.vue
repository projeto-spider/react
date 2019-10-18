<template>
  <a-card style="margin: 0 15px">
    <template slot="title">
      <a-input v-model="model.title" size="large" />
    </template>

    <a-card-grid style="width:100%;textAlign:'center'">
      <p>
        <strong>Input</strong>
        <a-textarea
          v-model="model.input"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </p>

      <p>
        <strong>Output</strong>
        <a-textarea
          v-model="model.output"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </p>

      <p>
        <strong>Supplier Component</strong>
        <a-textarea
          v-model="model.supplier"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </p>
    </a-card-grid>

    <a-card-grid style="width:100%;textAlign:'center'">
      <strong>Internal?</strong>

      <div style="float: right">
        <a-switch v-model="model.internal" />
      </div>
    </a-card-grid>

    <a-card-grid style="width: 100%">
      {{ model.internal ? 'Internal' : 'External' }}
      Interface
    </a-card-grid>
  </a-card>
</template>

<script>
import pDebounce from 'p-debounce'

const defaultModel = () => ({
  input: '',
  output: '',
  title: '',
  supplier: '',
  internal: true
})

export default {
  name: 'VInterfaceForm',

  props: {
    interface: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    model: defaultModel()
  }),

  watch: {
    model: {
      deep: true,

      handler: pDebounce(function onModelUpdate() {
        this.$emit('update', this.model)
      }, 100)
    }
  },

  created() {
    this.model = {
      ...defaultModel(),
      title: this.interface.title,
      input: this.interface.input || '',
      output: this.interface.output || '',
      supplier: this.interface.supplier || '',
      internal: Boolean(Number(this.interface.internal))
    }
  }
}
</script>

<style></style>
