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
    <div class="row">
      <div class="col-md-4" style="margin-left: 17%;">
        <b-card no-body style="padding: 40px">
          <h2>Sign Up</h2>
          <hr />
          <div class="row">
            <form action="#" class="col-md-12">
              <div class="form-group">
                Full Name:
                <input type="text" class="form-control" v-model="fullName" required />
              </div>
              <div class="form-group">
                Email:
                <input type="email" class="form-control" v-model="email" required />
              </div>
              <div class="form-group">
                Phone Number:
                <input type="text" class="form-control" v-model="telephone" required />
              </div>
              <div class="form-group">
                Birth Date:
                <input type="text" class="form-control" v-model="birthdate" required />
              </div>
              <div class="form-group">
                Job Title:
                <input type="text" class="form-control" v-model="jobTitle" required />
              </div>
            </form>
          </div>
          <div class="row">
            <div class="col-md-6">
              <button
                type="button"
                data-toggle="modal"
                @click="generateCredsDocs()"
                class="btn btn-primary"
              >Generate Documents</button>
            </div>
            <div class="col-md-3">
              <button
                type="button"
                data-toggle="modal"
                @click="signup()"
                class="btn btn-primary"
              >Signup</button>
            </div>
            <div class="col-md-3">
              Back to
              <button type="button" class="btn btn-link" @click="$router.back()">Login</button>
            </div>
          </div>
        </b-card>
      </div>
      <div class="col-md-4">
        <b-card no-body style="padding: 40px">
          <h2>Documents</h2>
          <hr />
          <div class="row">
            <form action="#" class="col-md-12">
              <div class="form-group">
                <label class="floatLeft">credentials.json:</label>
                <textarea class="form-control" v-model="credentials" rows="6" cols="50"></textarea>
              </div>
              <div class="form-group floatLeft">
                <button
                type="button"
                data-toggle="modal"
                @click="downloadCredentials()"
                class="btn btn-primary"
              >Download</button>
              </div>
          </form>
          </div>
          <div class="row">
            <form action="#" class="col-md-12">
              <div class="form-group">
                <label class="floatLeft">userDoc.json:</label>
                <textarea class="form-control" v-model="userData" rows="6" cols="50"></textarea>
              </div>
              <div class="form-group floatLeft">
                <button
                type="button"
                data-toggle="modal"
                @click="downloadUserDoc()"
                class="btn btn-primary"
              >Download</button>
              </div>
          </form>
          </div>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import { getUserDoc, getCredential } from "lds-sdk";
const {sha256hashStr} = require("../crypto-lib/symmetric");
export default {
  name: "Register",
  components: {},
  data() {
    return {
      active: 0,
      fullName: "Amit Kumar",
      email: "amit@gmail.com",
      telephone: "8323210123",
      publicKey: "ak_h7Hw9UD9JUPUtyZ54Es2BhFFiBo22aD2k615LtHshxpZ68dqJ",
      username: "Amit",
      password: "Amit",
      birthdate: "16/11/1992",
      jobTitle: "Engineer",
      host: location.hostname,
      credentials: "",
      userData: "",
      prevRoute: null
    };
  },
  created() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from
    })
  },
  methods: {
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
    async generateCredsDocs(){
      const userData = {
        name: this.fullName,
        email: this.email,
        telephone: this.phoneNumber,
        birthdate: this.birthdate,
        jobTitle: this.jobTitle,
      };
      const userDoc = await getUserDoc(userData);
      this.userData = JSON.stringify(userDoc);

      const creds = await getCredential(this.fullName);
      this.credentials = JSON.stringify(creds);
    },
    forceFileDownload(data, fileName) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    },
    downloadCredentials() {
      this.forceFileDownload(this.credentials, "credentials.json");
    },
    downloadUserDoc() {
      this.forceFileDownload(this.userData, "userDoc.json");
    },
    signup() {
      try {
        if(this.credentials == "" || this.credentials === "") throw new Error("Click on 'Generate Document' button to first generate crypto credentials")

        const creds = JSON.parse(this.credentials);
        const userData = {
          id: "",
          fname: "",
          lname: "",
          phoneNumber: "",
          username: "",
          password: "",
          email: "",
          publicKey: creds.keys.publicKey.publicKeyBase58,
          privateKey: creds.keys.publicKey.publicKeyBase58,
          hash: sha256hashStr(this.userData)
        };
        const url = `http://${this.host}:5000/api/auth/register`;
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
            // go back to the previous page where it came from 
            this.$router.back()
          });
      } catch (e) {
        alert(e);
      }
    },
  },
};
</script>


