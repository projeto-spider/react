<template>
  <div>Logging out...</div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LogoutPage',

  created() {
    this.logout()
    this.$router.push('/projects')
  },

  methods: {
    ...mapActions('auth', ['logout'])
  }
}
</script>
