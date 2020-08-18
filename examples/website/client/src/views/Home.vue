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

</style>
<template>
  <div class="home">
    <div class="col-md-8 centeralign">
    <div class="row">
      <div class="col-md-6" >
        <h3 style="float:left">Welcome {{user.email}}! </h3>
      </div>
      <div class="col-md-6" >
        <button  style="float:right" type="button"
                        data-toggle="modal"
                        @click="logout()"
                        class="btn btn-link">Logout</button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <b-card no-body style="padding: 20px">
          <h3>You Profile:</h3>
          <ul class="list-group list-group-flush">
            <li class="list-group-item floatLeft" v-for="item in userKeys" :key="item">
                <b>{{item}}</b>: {{user[item]}}
            </li>
          </ul>
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
      user: {},
      authToken: null
    };
  },
  created() {
    const query = this.$router.history.current.query
    this.authToken = query['authToken']
    this.user = JSON.parse(query['data'])
    localStorage.setItem('authToken', this.authToken);
    localStorage.setItem('user', this.user);
    this.userKeys = Object.keys(this.user)
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
    }
  }
};
</script>
