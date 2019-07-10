<template>
  <section class="container">
    Hello World
  </section>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data () {
    return { books: false }
  },
  apollo: {
    books: gql`
      {
        books {
          title
          author
        }
      }
    `
  }
}
</script>


<style scoped>
</style>
