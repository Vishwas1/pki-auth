<template>
  <div>
    <nav>
      <router-link v-for="routes in links" 
      v-bind:key="routes.id"
      :to="`${routes.page}`"> >> {{routes.text}} </router-link>
    </nav>
  </div>
</template>

<style> 
  .spacing { 
    Margin-right: 10px; 
  } 
</style>

<script>
export default {
  name: 'Navigation',
  data() {
    return {
      links: []
    }
  },
  created() {
      const history = this.$router.history
      console.log(history)
      this.links.push({
          id: this.links.length + 1,
          text: history.current.name,
          page: history.current.path
      })
      console.log(this.links)

  }
}
</script>