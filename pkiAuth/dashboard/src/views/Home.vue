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

.noBullet{
  list-style-type:none;
}

</style>
<template>
  <div class="home">
    <div class="col-md-8 centeralign">
    <div class="row">
      <div class="col-md-6" >
        <h3 style="float:left">Admin Portal</h3>
      </div>
      <div class="col-md-6" >
        <!-- <h5 style="float:left">Welcome {{user.email}}! </h5> -->
        <button  style="float:right" type="button"
                        data-toggle="modal"
                        @click="logout()"
                        class="btn btn-outline-primary">Logout</button>
      </div>
    </div>
    <div class="row" style="margin-top: 2%">
      <div class="col-md-4">
        <b-card no-body style="padding: 20px">
          <h3>Your Profile:</h3>
            <hr/>
             <table class="table table-bordered">
                <tr v-for="item in userKeys" :key="item" >
                  <td v-if="user[item] != '' && item != 'password'"><span class="floatLeft">{{item}}</span></td>
                  <td v-if="user[item] != '' && item != 'password'"><span class="floatLeft">{{ user[item] }}</span></td>
                </tr>
              </table>
            
            <div>
            </div>
        </b-card>
      </div>
      <div class="col-md-8">
        <b-card no-body style="padding: 20px">
          <h3>Your Application:</h3>
            <hr/>
            
            <div class="row" >
              <div class="col-md-6 floatRight">
              </div>
              <div class="col-md-6 floatRight">
                    <input type="text" placeholder="Enter App Name" size="35" v-model="appName" required>
                    <button  style="float:right" type="button"
                        data-toggle="modal"
                        @click="createApp()"
                        class="btn btn-outline-primary">+</button>
              </div>
            </div>
            <hr/>
            <div class="row" style="max-height: 621px;overflow: auto;">
              <div class="col-md-12">
                 <ul class="noBullet">
                    <li class="floatLeft" style="margin-right: 9px;margin-bottom: 9px" v-for="app in appList" :key="app">
                      <div class="card" style="width: 25rem;text-align: left">
                        <div class="card-body">
                          <h5 class="card-title">{{app.name}}</h5>
                          <!-- <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> -->
                          <hr/>
                            <p class="card-text" style="padding: 2px;">
                              <ul>
                                <li>
                                  <b>App Id: </b><label>{{app.appId}}</label>
                                </li>
                                <li>
                                  <b>App Secret: </b><label>{{app.appSecret}}</label>
                                </li>
                                <li>
                                  <b># of Login: </b><label>12</label>
                                </li>
                              </ul>
                            </p>
                            <hr/>
                          <a href="#" class="card-link">Card link</a>
                        </div>
                      </div>
                    </li>
            </ul>
              </div>
            </div>
        </b-card>
      </div>
    </div>
      
      
    </div>
  </div>
</template>

<script>
import Hash from "@/components/Hash.vue";
import Asymmetric from "@/components/Asymmetric.vue";
import Symmetric from "@/components/Symmetric.vue";
import Introduction from "@/components/Introduction.vue";
import ZKP from "@/components/zkp.vue";
export default {
  name: "PanelPage",
  mounted() {
  },
  components: {
    Hash,
    Asymmetric,
    Symmetric,
    Introduction,
    ZKP
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
    this.user = JSON.parse(usrStr);
    this.userKeys = Object.keys(this.user)

    // const authToken = localStorage.getItem('authToken')

    const url = `http://${location.hostname}:5000/api/app/list`;
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
        this.$router.push('login')
                }
    },
    createApp(){
      if(!this.appName) alert('AppName can not be blank')
      const url = `http://${location.hostname}:5000/api/app/register`;
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
    }

  }
};
</script>
