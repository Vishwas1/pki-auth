<style scoped>
.logo {
  /* width: 144px; */
  padding-top: 1.5%;
  padding-left: 25px;
}
</style>
<template>
  <div id="app">
    <div class="row">
      <div class="col-md-9 centeralign logo">
        <!-- <h3><img class="logo" src="https://forum.aeternity.com/uploads/db0917/original/1X/543f494a818af66690a1298689af3fdd0c6389a1.png"> | Laboratory</h3> -->
        <h2 class="leftAlign">HyperSign Studio</h2>
        <h6
          class="leftAlign"
          style="color:grey; font-style: italic;"
        >A portal for issuer to issue credentials on Hypersign Identity network!</h6>
        <hr style="opacity: 1.5" />
      </div>
      <div class="col-md-9 rightAlign marginLeft" v-if="$router.history.current.name != 'PKIIdLogin'">
        <button @click="goToNextPage(m.name)"  class="btn btn-link" v-for="m in menu" :key="m.name">{{m.name}}</button>
        <hr style="opacity: 1.5" />
      </div>
    </div>
    <router-view />
    <notifications group="foo" />
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


<script>
export default {
  data(){
    return {
      menu: [
        { 
          name: "Dashboard",  
          path: "/studio/dashboard",
          isShow: true,
        },
        { 
          name: "Schema",  
          path: "/studio/schema",
          isShow: true,
        },
        { 
          name: "Credentials",  
          path: "/studio/credential",
          isShow: true,
        },
        { 
          name: "Presentation",  
          path: "/studio/presentation",
          isShow: true,
        },
        {
          name: "Logout",
          path: "/studio/login",
          isShow: true,
        },
      ]
    }
  },
  methods: {
    logout(){
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem("credentials")
      localStorage.removeItem("userData")
    },
    goToNextPage(route){
      const r = this.menu.find(x => x.name === route)
      if(r.name === "Logout") this.logout()
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