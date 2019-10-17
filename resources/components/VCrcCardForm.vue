<template>
  <a-card style="margin: 0 15px">
    <template slot="title">
      <a-input v-model="model.title" size="large" />
    </template>

    <a-card-grid style="width:50%;textAlign:'center'">
      <p>
        <strong>Data</strong>
        <a-textarea
          v-model="model.properties"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </p>

      <p>
        <strong>Actions</strong>
        <a-textarea
          v-model="model.actions"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </p>
    </a-card-grid>

    <a-card-grid style="width:50%;textAlign:'center'">
      <strong>Relations</strong>

      <a-select
        mode="tags"
        style="width: 100%"
        :default-value="model.relations"
        :options="crcCardsNames"
        @change="
          value => {
            model.relations = value
          }
        "
      />
    </a-card-grid>

    <a-card-grid style="width:100%;textAlign:'center'">
      <strong>Modules</strong>

      <a-select
        mode="tags"
        style="width: 100%"
        :default-value="model.modules"
        :options="moduleNames"
        @change="
          value => {
            model.modules = value
          }
        "
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
    crcCard: {
      type: Object,
      required: true
    },
    crcCards: {
      type: Array,
      required: true
    },
    modules: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    model: defaultModel()
  }),

  computed: {
    crcCardsNames() {
      return this.crcCards.map(mod => ({
        value: mod.title,
        label: mod.title
      }))
    },

    moduleNames() {
      return this.modules.map(mod => ({
        value: mod.title,
        label: mod.title
      }))
    }
  },

  watch: {
    model: {
      deep: true,

      handler: pDebounce(function onModelUpdate() {
        this.$emit('update', this.model)
      }, 100)
    }
  },

  created() {
    const { crcCard } = this

    this.model = {
      ...defaultModel(),
      title: crcCard.title,
      properties: crcCard.properties.join('\n') || '',
      actions: crcCard.actions.join('\n') || '',
      relations: crcCard.relations,
      modules: crcCard.modules
    }

    this.model.relations = this.model.relations.filter(relationName =>
      this.crcCards.some(other => other.title === relationName)
    )
    this.model.modules = this.model.modules.filter(moduleName =>
      this.modules.some(other => other.title === moduleName)
    )
  }
}
</script>

<style></style>
