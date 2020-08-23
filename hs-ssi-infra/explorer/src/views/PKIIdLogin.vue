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
    <!-- <div class="col-md-4" style="margin-left: 17%;">
      <b-card no-body style="padding: 40px">
        <h2>Basic Authentication</h2>
        <hr />
        <div class="row">
          <form action="#" class="col-md-12">
            <div class="form-group">
              <input type="text" class="form-control" v-model="username" placeholder="Username" />
            </div>
            <div class="form-group">
              <input type="password" class="form-control" v-model="password" placeholder="Password" />
            </div>
          </form>
        </div>
        <div class="row">
          <div class="col-md-6">
            <button
              type="button"
              data-toggle="modal"
              @click="login('BASIC')"
              class="btn btn-primary floatLeft"
            >Login</button>
          </div>
          <div class="col-md-6 floatRight">
            Do not have account?
            <a href="/register">SignUp</a>
          </div>
        </div>
      </b-card>
    </div> -->
    <div class="col-md-4" style="margin-left: 34%">
      <b-card no-body style="padding: 40px">
        <h2>User Login</h2>
        <hr />
        <div class="row">
          <form action="#" class="col-md-12">
            <div class="form-group">
              <qrcode-vue :value="QRCodeValue" :size="200" level="H"></qrcode-vue>
              <label>Scan this QR code to authenticate!</label>
            </div>
            <hr />
            <h2>Or</h2>
            <div class="form-group">
              <label class="floatLeft">Upload User Doc:</label>
              <input
                type="file"
                class="form-control"
                placeholder
                @change="onFileChange"
                accept="*.json"
              />
            </div>
            <div class="form-group">
              <label class="floatLeft">Upload Credentials:</label>
              <input type="file" class="form-control" placeholder @change="onFileChange" />
            </div>
          </form>
        </div>
        <div class="row">
          <div class="col-md-3">
            <button
              type="button"
              data-toggle="modal"
              @click="downloadProof()"
              class="btn btn-primary floatLeft"
            >View Proof</button>
          </div>
          <div class="col-md-3">
            <button
              type="button"
              data-toggle="modal"
              @click="login('PKI')"
              class="btn btn-primary floatLeft"
            >Login</button>
          </div>
          <div class="col-md-6 floatRight">
            Do not have account?
            <a href="/register_pki">SignUp</a>
          </div>
        </div>
      </b-card>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import { getChallange } from "lds-sdk";
import QrcodeVue from "qrcode.vue";
import { sign } from "lds-sdk";
import { encryptData } from '../crypto-lib/symmetric'
const {sha256hashStr} = require("../crypto-lib/symmetric");
export default {
  name: "Login",
  components: {
    QrcodeVue,
  },
  data() {
    return {
      active: 0,
      username: "",
      password: "",
      host: location.hostname,
      challenge: "dddd",
      domain: location.host,
      QRCodeValue: this.$route.query,
      credentials: {},
      userData: {},
      proof: "",
    };
  },
  created(){
    const url = `http://${this.host}:5000/api/auth/challenge`;
    fetch(url)
    .then(res => res.json())
    .then(json => {
      if(json.status == 200){
        this.challenge = json.message
      }
    })
    .catch(e => alert(`Error: ${e.message}`))
  },
  mounted(){

  },
  methods: {
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
    async generateProof() {
      this.credentials = JSON.parse(localStorage.getItem("credentials"));
      this.userData = JSON.parse(localStorage.getItem("userData"));
      if((this.credentials && this.credentials['controller']) != null && (this.userData != null &&  this.userData['@context']) ){
        const p = await sign({
          doc: this.userData,
          privateKeyBase58: this.credentials.keys.privateKeyBase58,
          publicKey: this.credentials.keys.publicKey,
          challenge: this.challenge.challenge,
          domain: this.domain,
        });
        this.proof = JSON.stringify(p);
      } else {
        throw new Error("Both files are needed for generating proof");
      }
    },
    forceFileDownload(data, fileName) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    },
    async downloadProof() {
      await this.generateProof();
      this.forceFileDownload(this.proof, "proof.json");
    },
    onFileChange(event) {
      try {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = readSuccess;
        function readSuccess(evt) {
          const fileJSON = JSON.parse(evt.target.result);
          if (!fileJSON) throw new Error("Incorrect file");
          if (fileJSON["controller"]) {
            localStorage.setItem("credentials", JSON.stringify(fileJSON));
          } else if (fileJSON["@context"]) {
            localStorage.setItem("userData", JSON.stringify(fileJSON));
          } else {
            throw new Error("Incorrect file");
          }
        }
        reader.readAsText(file);
      } catch (e) {
        alert(`Error: ${e.message}`);
      }
    },
    async login(type) {
     try{
      let url = "";
      let headers = {
        "Content-Type": "application/json"
      }
      if (type === "PKI") {
        url = `http://${this.host}:5000/api/auth/login_pki?type=PKI`;
        headers['x-auth-token'] = this.challenge.JWTChallenge;
        await this.generateProof();
      } else {
        url = `http://${this.host}:5000/api/auth/login`;
      }
      const userData = {
        username: this.username,
        password: this.password != "" ? sha256hashStr(this.password): this.password,
        proof: this.proof,
        controller: this.credentials ? this.credentials.controller: {},
        publicKey: this.credentials && this.credentials.keys ? this.credentials.keys.publicKey: {},
        challenge: this.challenge? this.challenge.challenge: "",
        domain: this.domain,
      };
      
      fetch(url, {
        body: JSON.stringify(userData),
        method: "POST",
        headers: headers,
      })
        .then((res) => res.json())
        .then((j) => {
          if (j && j.status == 500) {
            return alert(`Error:  ${j.error}`);
          }
          
          console.log(this.$route.query)
          console.log(j.message)
          const encryptedUserData = encryptData(this.$route.query.appId, JSON.stringify(j.message.user))
          const redirect_uri = this.$route.query.redirect_uri + '?userData=' + encryptedUserData
          window.location.href = redirect_uri; 

          // localStorage.setItem("authToken", j.message.jwtToken);
          // localStorage.setItem("user", JSON.stringify(j.message.user));
          // if (localStorage.getItem("authToken") != null) {
          //   if (this.$route.params.nextUrl != null) {
          //     this.$router.push(this.$route.params.nextUrl);
          //   } else {
          //     this.$router.push("crypto");
          //   }
          // }
        });
     }catch(e){
       alert(`Error: ${e.message}`)
     }
      
    },
  },
};
</script>
