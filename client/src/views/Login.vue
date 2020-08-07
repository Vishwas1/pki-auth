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

</style>
<template>
  <div class="home">
    <div class="col-md-4 centeralign">
      <b-card no-body style="padding: 40px">
          <h2>Sign In</h2>
          <hr>
        <div class="row">
            <form action="#" class="col-md-12">
                <div class="form-group">
                    Username: <input type="text" class="form-control" v-model="username">
                </div>
                <div class="form-group">
                    Publickey: <input type="text" class="form-control" v-model="publicKey">
                </div>
                <div class="form-group">
                    Password: <input type="password" class="form-control" v-model="password">
                </div>
            </form>
        </div>
        <div class="row">
            <div class="col-md-6">
                <button type="button"
                        data-toggle="modal"
                        @click="login()"
                        class="btn btn-primary"
                      >Login</button>
            </div>
            <div class="col-md-6">
                Do not have account? <a href="/register">SignUp</a>
            </div>
        </div>
      </b-card>
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
  name: "Login",
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
      username: "Amit",
      password:"Amit",
      publicKey: "ak_nKiJUyQToMDCcAYx9Z52vyHCg5bXnGpovjAxfs3kp9XUHaagn"
    };
  },
  created() {},
  methods: {
    gotosubpage: id => {
      this.$router.push(`${id}`);
    },
    login(){
        const userData = {
            username: this.username,
            password: this.password,
            publicKey: this.publicKey
        }
        const url = "http://localhost:5000/api/auth/login";
        fetch(url, {
          body: JSON.stringify(userData),
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })
          .then(res => res.json())
          .then(j => {
            if(j && j.status == 500){
              return alert(`Error:  ${j.error}`);
            }
            // alert(`${j.message.m}`);
            localStorage.setItem('authToken', j.message.jwtToken)
            localStorage.setItem('user', JSON.stringify(j.message.user))
            const usrStr = localStorage.getItem('user')
            console.log(usrStr)
            if(localStorage.getItem('authToken') != null){
                if(this.$route.params.nextUrl != null){
                    this.$router.push(this.$route.params.nextUrl)
                }else{
                    this.$router.push('crypto')
                }
            }
          });
    }
  }
};
</script>
