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
.title{
  color: grey
}
</style>
<template>
  <div class="row">
    <div class="col-md-8" style="margin-left: 17%">
      <b-card no-body style="padding: 40px">
        <div class="row">
          <form action="#" class="col-md-6">
            <div class="form-group"  style="border-right: 1px solid #8080804f;">
              <qrcode-vue :value="QRCodeValue" :size="200" level="H"></qrcode-vue>
              <label class="title">Scan the QR code using Hypersign Wallet to authenticate!</label>
            </div>
          </form>
          <form action="#" class="col-md-6" style="padding:6px">
            <div class="form-group">
              <label class="floatLeft">Upload DIDDoc:</label>
              <input
                type="file"
                class="form-control"
                placeholder
                @change="onFileChange"
                accept="*.json"
              />
            </div>
            <div class="form-group">
              <label class="floatLeft">Upload Keys:</label>
              <input type="file" class="form-control" placeholder @change="onFileChange" />
            </div>
            <div class="form-group">
              <button
                type="button"
                data-toggle="modal"
                @click="login('PKI')"
                class="btn btn-primary floatLeft"
              >Login</button>
              <button
                type="button"
                data-toggle="modal"
                @click="downloadProof()"
                class="btn btn-outline-primary floatLeft"
              >View Proof</button>
              Do not have account?
              <a href="http://localhost:5001/explorer/newdid" target="_blank">Create DID</a>
            </div>
          </form>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
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
    const url = `http://${this.host}:9000/api/auth/challenge`;
    console.log(url)
    fetch(url)
    .then(res => res.json())
    .then(json => {
      console.log(json);
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
      console.log(this.credentials);
      this.userData = JSON.parse(localStorage.getItem("userData"));
      console.log(this.userData);
      if((this.credentials && this.credentials['privateKeyBase58']) != null && (this.userData != null &&  this.userData['@context']) ){
        const p = await sign({
          doc: this.userData,
          privateKeyBase58: this.credentials.privateKeyBase58,
          publicKey: this.credentials.publicKey,
          challenge: this.challenge.challenge,
          domain: this.domain,
        });
        this.proof = JSON.stringify(p);
      } else {
        throw new Error("Error: Both files are needed for generating proof");
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
      try{
        await this.generateProof();
        this.forceFileDownload(this.proof, "proof.json");
      }catch(e){
        alert(e.message)
      }
    },
    onFileChange(event) {
      try {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = readSuccess;
        function readSuccess (evt) {
          const fileJSON = JSON.parse(evt.target.result);
          if (!fileJSON) throw new Error("Incorrect file");
          if (fileJSON["privateKeyBase58"]) {
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
        url = `http://${this.host}:9000/api/auth/login_pki?type=PKI`;
        headers['x-auth-token'] = this.challenge.JWTChallenge;
        await this.generateProof();
      } else {
        url = `http://${this.host}:9000/api/auth/login`;
      }
      const userData = {
        username: this.username,
        password: this.password != " " ? sha256hashStr(this.password): this.password,
        proof: this.proof,
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
          
          console.log(j.message)

          localStorage.setItem("authToken", j.message.jwtToken);
          localStorage.setItem("user", JSON.stringify(j.message.user));
          if (localStorage.getItem("authToken") != null) {
            if (this.$route.params.nextUrl != null) {
              this.$router.push(this.$route.params.nextUrl);
            } else {
              this.$router.push("dashboard");
            }
          }
          //const encryptedUserData = encryptData(this.$route.query.appId, JSON.stringify(j.message.user))
          //const redirect_uri = this.$route.query.redirect_uri + '?userData=' + encryptedUserData
          //window.location.href = redirect_uri; 
        });
     }catch(e){
       alert(`Error: ${e.message}`)
     }
    },
  },
};
</script>
