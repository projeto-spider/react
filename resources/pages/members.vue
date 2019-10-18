<template>
  <div>
    <VMembers
      :members="members"
      :current-user="currentUser"
      :handle-autocomplete="handleAutocomplete"
      @add="onAdd"
      @remove="onRemove"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VMembers from '@/components/VMembers'

export default {
  name: 'Members',

  components: {
    VMembers
  },

  data: () => ({
    members: []
  }),

  computed: {
    ...mapGetters('project', ['currentProject']),
    ...mapGetters('auth', ['currentUser'])
  },

  created() {
    if (!this.currentProject) {
      return this.$router.push('/projects')
    }

    this.loadMembers()
  },

  methods: {
    loadMembers() {
      const { id } = this.currentProject
      const url = `/api/projects/${id}/members/`

      this.$axios
        .$get(url)
        .then(members => {
          this.members = members
        })
        .catch(() => {
          this.$message.error('Failed to load members')
        })
    },

    onAdd(node) {
      const user = node.data.attrs['data-user']

      const { id } = this.currentProject
      const url = `/api/projects/${id}/members/`
      this.$axios
        .$post(url, { id: user.id })
        .then(() => {
          this.members.push(user)
        })
        .catch(() => {
          this.$message.error('Failed to add member')
        })
    },

    onRemove(member) {
      if (!member || !member.id) {
        return
      }
      const { id } = this.currentProject
      const url = `/api/projects/${id}/members/${member.id}`

      this.$axios
        .$delete(url)
        .then(() => {
          if (member.id === this.currentUser.id) {
            return this.$router.push('/projects')
          }

          const index = this.members.indexOf(member)
          if (index !== -1) {
            this.members.splice(index, 1)
          }
        })
        .catch(() => {
          this.$message.error('Failed to delete member')
        })
    },

    handleAutocomplete(query) {
      const url = '/api/users'
      return this.$axios.$get(url, { query: { query } })
    }
  }
}
</script>
