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
      <div class="col-md-8 marginLeft">
         <div class="row" style="margin-top: 2%">
            <div class="col-md-8">
                 <ul class="leftAlign">
                   <li class="form-group">
                     <label class="title">UserId: </label>
                     <label class=""> {{user.id}}</label>
                   </li>
                   <li class="form-group">
                     <label class="title">Email: </label>
                     <label class="">{{user.email}}</label>
                   </li>
                   <li class="form-group">
                     <label class="title">Phone Number: </label>
                     <label class=""> {{user.phoneNumber}}</label>
                   </li>
                   <li class="form-group">
                     <label class="title">PublicKey: </label>
                     <label class="">{{user.publicKey}}</label>
                   </li>
                   <li class="form-group">
                     <label class="title">Network: </label>
                     <label class=""><a href="http://localhost:5001/" target="_blank">HS-Staging</a></label>
                   </li>
                 </ul>
            </div>
            <div class="col-md-4 centeralign">
              <img src="https://cdn1.iconfinder.com/data/icons/female-avatars-vol-1/256/female-portrait-avatar-profile-woman-sexy-afro-2-512.png" alt="John" style="width:100%;height: 53%;" >
              <h2>{{user.fname}}</h2>
            </div>
         </div>
      </div>
   </div>
</template>


<script>
export default {
  name: "Profile",
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
