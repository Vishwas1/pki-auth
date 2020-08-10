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
  <!-- <div class="home"> -->
    <div class="row">
      <div class="col-md-4" style="margin-left: 17%;">
        <b-card no-body style="padding: 40px">
          <h2>Basic Authentication</h2>
          <hr />
          <div class="row">
            <form action="#" class="col-md-12">
              <div class="form-group">
                <input type="text" class="form-control" v-model="username" placeholder="Username" />
              </div>
              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  v-model="password"
                  placeholder="Password"
                />
              </div>
            </form>
          </div>
          <div class="row">
            <div class="col-md-6">
              <button
                type="button"
                data-toggle="modal"
                @click="login()"
                class="btn btn-primary floatLeft"
              >Login</button>
            </div>
            <div class="col-md-6 floatRight">
              Do not have account?
              <a href="/register">SignUp</a>
            </div>
          </div>
        </b-card>
      </div>
      <div class="col-md-4">
        <b-card no-body style="padding: 40px">
          <h2>PKI Authentication</h2>
          <hr />
          <div class="row">
            <form action="#" class="col-md-12">
              <div class="form-group">
                <input type="text" class="form-control" v-model="publicKey" placeholder="PublicKey" />
              </div>
              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  v-model="privateKey"
                  placeholder="PrivateKey"
                />
              </div>
            </form>
          </div>
          <div class="row">
            <div class="col-md-6">
              <button
                type="button"
                data-toggle="modal"
                @click="login()"
                class="btn btn-primary floatLeft"
              >Login</button>
            </div>
            <div class="col-md-6 floatRight">
              Do not have account?
              <a href="/register">SignUp</a>
            </div>
          </div>
        </b-card>
      </div>
    </div>
  <!-- </div> -->
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
    ZKP,
  },
  data() {
    return {
      active: 0,
      username: "",
      password: "",
      host: location.hostname,
    };
  },
  created() {},
  methods: {
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
    login() {
      const userData = {
        username: this.username,
        password: this.password,
      };
      const url = `http://${this.host}:5000/api/auth/login`;
      fetch(url, {
        body: JSON.stringify(userData),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((j) => {
          if (j && j.status == 500) {
            return alert(`Error:  ${j.error}`);
          }
          localStorage.setItem("authToken", j.message.jwtToken);
          localStorage.setItem("user", JSON.stringify(j.message.user));
          const usrStr = localStorage.getItem("user");
          if (localStorage.getItem("authToken") != null) {
            if (this.$route.params.nextUrl != null) {
              this.$router.push(this.$route.params.nextUrl);
            } else {
              this.$router.push("crypto");
            }
          }
        });
    },
  },
};
</script>
