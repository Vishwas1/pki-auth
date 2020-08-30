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
   <div class="home marginRight marginLeft">
     <h3 class="leftAlign">Welcome, {{user.id}} !</h3>
     <div class="row">
      <div class="col-md-6">
          <Profile/>
      </div>
      <div class="col-md-6">
        <Dashboard/>
      </div>
     </div>    
   </div>
</template>


<script>
import Dashboard from '@/components/Dashboard.vue'
import Profile from '@/components/Profile.vue'
export default {
  name: "PanelPage",
  mounted() {
  },
  components: { 
    Dashboard,
    Profile
  },
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
      }
    })
    .catch(e => this.notifyErr(`${e.message}`))
  },
  methods: {
    notifySuccess(msg){
      this.$notify({
          group: 'foo',
          title: 'Information',
          type: 'success',
          text: msg
        });
    },
    notifyErr(msg){
      this.$notify({
          group: 'foo',
          title: 'Error',
          type: 'error',
          text: msg
        });
    },
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
      if(!this.appName) this.notifyErr('AppName can not be blank')
      const url = `http://${location.hostname}:9000/api/app/register`;
      const appData = {
        name: this.appName
      }
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
          this.notifySuccess("App successfully created")
        }
      })
      .catch(e => {
        this.notifyErr(e.message)
      })
    },
    goToDetailsPage: function(id) {
        this.$router.push("/studio/apps/"+id);
    }

  }
};
</script>
