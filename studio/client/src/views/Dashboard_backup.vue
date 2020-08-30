<style scoped>
.addmargin {
  margin-top: 10px;
  margin-bottom: 10px;
}

.vue-logo-back {
  background-color: black;
}

.logo {
  width: 144px;
}

.fullbody {
  width: 100%;
}
.floatLeft{
  float: left;
}

.floatRight{
  float: right;
}

.noBullet{
  list-style-type:none;
}

.title {
  color: grey;
  font-size: 18px;
}



</style>


<template>
   <div class="home">
      <div class="col-md-9 centeralign">
         <div class="row" style="margin-top: 0%">
            <div class="col-md-12">
               <!-- <b-card no-body style="padding: 20px"> -->
                  <!-- <hr/> -->
                  <div class="row" >
                     <div class="col-md-8 floatRight">
                       <form class="form-inline">
                         <div class="form-group">
                        <input type="text" class="form-control" placeholder="Enter App Name" size="30" v-model="appName" required>
                         </div>
                         <div class="form-group">
                          <button  style="float:right; margin-left: 6px" type="button"
                           data-toggle="modal"
                           @click="createApp()"
                           class="btn btn-outline-primary">Create App</button>
                         </div>
                       </form>
                     </div>
                     <div class="col-md-4 floatRight">
                     </div>
                  </div>
                  <div class="row" style="margin-top: 1%;max-height: 621px;overflow: auto;">
                     <div class="col-md-6"  v-for="app in appList" :key="app">
                       <div class="card floatLeft" style="width: 40rem;text-align: left; margin-top:2%">
                          <div class="card-body">
                            <div class="row">
                              <div class="col-md-8">
                                <h5 class="card-title floatLeft"><b><a :href="'/studio/apps/'+app.appId">{{app.name}}</a></b></h5>
                              </div>
                              <div class="col-md-4">
                                <a class="btn btn-link floatRight" v-on:click="goToDetailsPage(app.appId)" style="font-weight: bold; padding-right:10px" > > </a>
                              </div>
                            </div>
                            <hr/>
                            <div class="row card-text" style="padding: 2px;">
                              <div class="col-md-8">
                                <ul>
                                <li>
                                    <b>App Id: </b>{{app.appId}}
                                </li>
                                <li>
                                    <b>App Secret: </b>{{app.appSecret}}
                                </li>
                                <li>
                                    <b># of issued credentials: </b><label>12</label>
                                </li>
                              </ul>
                              </div>
                              <div class="col-md-4">
                                <img src="https://cdn0.iconfinder.com/data/icons/web-development-47/64/feature-application-program-custom-512.png" alt="John" style="opacity: 0.5;width:70%;height: 100%;" >
                              </div>
                            </div>
                          </div>
                        </div>
                     </div>
                  </div>
               <!-- </b-card> -->
            </div>
         </div>
      </div>
   </div>
</template>


<script>
export default {
  name: "PanelPage",
  mounted() {
  },
  components: { },
  data() {
    return {
      active: 0,
      userKeys: [],
      appList: [],
      user: {},
      appName: "",
      authToken: localStorage.getItem('authToken')
    };
  },
  created() {
    const usrStr = localStorage.getItem('user')
    console.log(usrStr)
    this.user = JSON.parse(usrStr);
    console.log(this.user)
    this.userKeys = Object.keys(this.user)

    // const authToken = localStorage.getItem('authToken')

    const url = `http://${location.hostname}:9000/api/app/list`;
    fetch(url,{
        headers: {
          'x-auth-token': this.authToken
        },
        method: 'POST'
      })
    .then(res => res.json())
    .then(json => {
      if(json.status == 200){
        this.appList = json.message.list
        console.log(this.appList)
      }
    })
    .catch(e => alert(`Error: ${e.message}`))
  },
  methods: {
    gotosubpage: id => {
      this.$router.push(`${id}`);
    },
    logout(){
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem("credentials")
      localStorage.removeItem("userData")
      
      if(this.$route.params.nextUrl != null){
                    this.$router.push(this.$route.params.nextUrl)
                }else{
        this.$router.push('/studio/login')
                }
    },
    createApp(){
      if(!this.appName) alert('AppName can not be blank')
      const url = `http://${location.hostname}:9000/api/app/register`;
      console.log(this.appName)
      const appData = {
        name: this.appName
      }
      console.log(appData)
      fetch(url,{
          body: JSON.stringify(appData),
          method: 'POST',
          headers: {
            'x-auth-token': this.authToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      .then(res => res.json())
      .then(json => {
        if(json.status == 200){
          this.appList.push(json.message)
          console.log(json.message.appId)
        }
      })
      .catch(e => alert(`Error: ${e.message}`))
    },
    goToDetailsPage: function(id) {
        this.$router.push("/studio/apps/"+id);
    }

  }
};
</script>
