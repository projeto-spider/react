<template>
  <div style="max-width: 640px; margin: 0 auto" class="has-maxed-input">
    <a-auto-complete
      :data-source="autocomplete"
      style="width: 200px"
      @select="
        (_value, node) => {
          $emit('add', node)
          clearInput()
        }
      "
      @search="handleSearch"
    >
      <a-input
        class="autocomplete-input"
        placeholder="Search email"
        style="width: 100%"
      />
      <template slot="dataSource">
        <a-select-option
          v-for="user in autocomplete"
          :key="user.email"
          :data-user="user"
        >
          {{ user.email }}
        </a-select-option>
      </template>
    </a-auto-complete>

    <a-list item-layout="horizontal" :data-source="members">
      <a-list-item slot="renderItem" slot-scope="member">
        <a-popconfirm
          slot="actions"
          title="Are you sure?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="$emit('remove', member)"
        >
          <a>
            {{ member.id === currentUser.id ? 'Leave' : 'Remove' }}
          </a>
        </a-popconfirm>

        <a-list-item-meta :description="member.email">
          <a slot="title" href="https://vue.ant.design/">{{ member.name }}</a>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
export default {
  name: 'VMembers',

  props: {
    members: {
      type: Array,
      required: true
    },

    currentUser: {
      type: Object,
      required: true
    },

    handleAutocomplete: {
      type: Function,
      default: () => []
    }
  },

  data: () => ({
    autocomplete: []
  }),

  methods: {
    handleSearch(query) {
      return this.handleAutocomplete(query).then(({ data }) => {
        const alreadyThere = new Set(this.members.map(user => user.id))
        this.autocomplete = data.filter(user => !alreadyThere.has(user.id))
      })
    },

    clearInput() {
      const $input = this.$el.querySelector('.autocomplete-input')
      // This timeout is needed. Idk why
      setTimeout(() => {
        $input.value = ''
      }, 100)
    }
  }
}
</script>

<style scoped>
.has-maxed-input .ant-select,
.autocomplete-input {
  width: 100% !important;
}
</style>
