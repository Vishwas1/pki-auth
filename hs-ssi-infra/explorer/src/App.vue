<style scoped>
.logo {
  /* width: 144px; */
  padding-top: 1.5%;
  padding-left: 25px;
}
.leftAlign {
  text-align: left;
}

.rightAlign {
  text-align: right;
}

.marginLeft
{
margin-left: 13%
}
.marginRight
{
margin-right: 12%
}
</style>
<template>
  <div id="app">
    <div class="row">
      <div class="col-md-9 centeralign logo">
        <!-- <h3><img class="logo" src="https://forum.aeternity.com/uploads/db0917/original/1X/543f494a818af66690a1298689af3fdd0c6389a1.png"> | Laboratory</h3> -->
        <h2 class="leftAlign">HyperSign Identity Explorer</h2>
        <h6
          class="leftAlign"
          style="color:grey; font-style: italic;"
        >DID Explorer for Hypersign Identity network!</h6>
        <hr style="opacity: 1.5" />
      </div>
      <div class="col-md-9 marginRight marginLeft rightAlign" v-if="$router.history.current.name != 'PKIIdLogin'">
        <button @click="goToNextPage(m.name)"  class="btn btn-link" v-for="m in menu" :key="m.name">{{m.name}}</button>
        <hr style="opacity: 1.5" />
      </div>
    </div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.centeralign {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>

<script>
export default {
  name: 'app',
  data(){
    return {
      menu: [
        { 
          name: "Dashboard",  
          path: "/explorer/login",
          isShow: true,
        },
        { 
          name: "Get DID",  
          path: "/explorer/newdid",
          isShow: true,
        },
        { 
          name: "Studio",  
          isShow: true,
        }
      ]
    }
  },
  methods: {
    goToNextPage(route){
      const r = this.menu.find(x => x.name === route)
      if(r.name === "Studio") {
        window.location.href = "http://localhost:9001/"
      }
      this.$router.push(r.path)
      if(this.$route.params.nextUrl != null){
                    this.$router.push(this.$route.params.nextUrl)
                }else{
        this.$router.push(r.path)
                }
    }
  }
}
</script>


