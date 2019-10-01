<template>
  <a-card style="margin: 0 15px">
    <template slot="title">
      <a-input size="large" v-model="model.title" />
    </template>

    <a-card-grid style="width:50%;textAlign:'center'">
      <p>
        <strong>Data</strong>
        <a-textarea :autosize="{ minRows: 2, maxRows: 6 }" v-model="model.properties" />
      </p>

      <p>
        <strong>Actions</strong>
        <a-textarea :autosize="{ minRows: 2, maxRows: 6 }" v-model="model.actions" />
      </p>
    </a-card-grid>

    <a-card-grid style="width:50%;textAlign:'center'">
      <strong>Relations</strong>

      <a-select
        mode="tags"
        style="width: 100%"
        :defaultValue="model.relations"
        :options="crcCardsNames"
        @change="value => {
          model.relations = value
        }"
      />
    </a-card-grid>

    <a-card-grid style="width:100%;textAlign:'center'">
      <strong>Modules</strong>

      <a-select
        mode="tags"
        style="width: 100%"
        :defaultValue="model.modules"
        :options="moduleNames"
        @change="value => {
          model.modules = value
        }"
      />
    </a-card-grid>
  </a-card>
</template>

<script>
import pDebounce from 'p-debounce'

const defaultModel = () => ({
  properties: '',
  actions: '',
  relations: [],
  modules: []
})

export default {
  name: 'VCrcCardForm',

  props: {
    crcCard: Object,
    crcCards: Array,
    modules: Array,
  },

  data: () => ({
    model: defaultModel()
  }),

  computed: {
    crcCardsNames () {
      return this.crcCards.map(mod => ({
        value: mod.title,
        label: mod.title
      }))
    },

    moduleNames () {
      return this.modules.map(mod => ({
        value: mod.title,
        label: mod.title
      }))
    }
  },

  created () {
    const { crcCard } = this

    this.model = {
      ...defaultModel(),
      title: crcCard.title,
      properties: crcCard.properties.join('\n') || '',
      actions: crcCard.actions.join('\n') || '',
      relations: crcCard.relations,
      modules: crcCard.modules,
    }

    this.model.relations = this.model.relations.filter(relationName =>
      this.crcCards.some(other => other.title === relationName)
    )
    this.model.modules = this.model.modules.filter(moduleName =>
      this.modules.some(other => other.title === moduleName)
    )
  },

  watch: {
    model: {
      deep: true,

      handler: pDebounce(function onModelUpdate () {
        this.$emit('update', this.model)
      }, 100)
    }
  }
}
</script>

<style>

</style>
