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
.floatLeft {
  float: left;
}
.floatRight {
  float: right;
}
</style>
<template>
  <div class="home">
    <div class="col-md-4 centeralign">
      <b-card no-body style="padding: 40px">
        <h2>Admin Registration</h2>
        <hr>
        <div class="row">
          <form action="#" class="col-md-12">
            <div class="form-group">
              Full Name:
              <input type="text" class="form-control" v-model="fullName" />
            </div>
            <div class="form-group">
              Email:
              <input type="email" class="form-control" v-model="email" />
            </div>
            <div class="form-group">
              Phone Number:
              <input type="text" class="form-control" v-model="phno" />
            </div>
            <div class="form-group">
              <!-- Public Key: -->
              <input type="text" class="form-control" v-model="publicKey" hidden/>
            </div>
            <div class="form-group">
              Username:
              <input type="text" class="form-control" v-model="username" />
            </div>
            <div class="form-group">
              Password:
              <input type="password" class="form-control" v-model="password" />
            </div>
          </form>
        </div>
        <div class="row">
          <div class="col-md-6">
            <button
              type="button"
              data-toggle="modal"
              @click="signup()"
              class="btn btn-primary"
            >Signup</button>
          </div>
          <div class="col-md-6">
            Back to
            <a href="/dashboard/login">Login</a>
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
const {sha256hashStr} = require("../crypto-lib/symmetric");
export default {
  name: "Register",
  components: {
    
  },
  data() {
    return {
      active: 0,
      fullName: "Amit Kumar",
      email: "amit@gmail.com",
      phno: "8323210123",
      publicKey: "",
      username: "Amit",
      password: "Amit",
      host: location.hostname
    };
  },
  created() {},
  methods: {
    gotosubpage: id => {
      this.$router.push(`${id}`);
    },
    signup(){
      try {
        const userData = {
          id: "",
          fname: this.fullName,
          lname: this.fullName,
          phoneNumber: this.phno,
          username: this.username,
          password: sha256hashStr(this.password),
          email: this.email,
          publicKey: this.publicKey,
          privateKey: this.publicKey
        };
        const url = `http://${this.host}:5000/api/auth/register`;
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
            this.$router.push('login')
          });
      } catch (e) {
        alert(e);
      }
    }
  }
};
</script>


