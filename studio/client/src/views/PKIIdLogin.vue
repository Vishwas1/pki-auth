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
    <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage"></loading>

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
            <div class="form-group" hidden>
              <label class="floatLeft">Upload DIDDoc:</label>
              <input
                type="file"
                class="form-control"
                placeholder
                @change="onFileChange"
                accept="*.json"
              />
            </div>
            <div class="form-group" hidden>
              <label class="floatLeft">Upload Keys:</label>
              <input type="file" class="form-control" placeholder @change="onFileChange" />
            </div>
            <div class="form-group">
              <label class="floatLeft">Enter privatekey:</label>
              <input type="text" class="form-control" placeholder="Enter privatekey" v-model="privateKey"/>
            </div>
            <div class="form-group">
              <label class="floatLeft">Enter did or publickeyId:</label>
              <input type="text" class="form-control" placeholder="Enter did or publickeyId" v-model="did"/>
            </div>
            <div class="form-group">
              <button
                type="button"
                data-toggle="modal"
                @click="login('PKI')"
                class="btn btn-outline-primary btn-sm floatLeft"
              >Login</button>
              <!-- <button
                type="button"
                data-toggle="modal"
                @click="downloadProof()"
                class="btn btn-outline-primary floatLeft"
              >View Proof</button> -->
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
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { encryptData } from '../crypto-lib/symmetric'
const {sha256hashStr} = require("../crypto-lib/symmetric");
export default {
  name: "Login",
  components: {
    QrcodeVue,
    Loading
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
      fullPage: true,
      isLoading: false,
      privateKey: "61BJKDZDiYiXqTwWPapyx59XuqXpTiqTj8ZFqivbGAmXSfyGnxeUBMCTcmWXZPUBc3Y24iA3vjNSMebjmouFMjUc",
      did: "did:hs:6af8fa78-ac40-4dd7-9ba0-b4641ef35545#z6MknoNTxEWCrhsJ29EZCzcbkBw9pjXqRLaCzBUoUKxr4Ktk",
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
    .catch(e => this.notifyErr(`Error: ${e.message}`))
  },
  mounted(){
      this.clean();
  },
  methods: {
    clean(){
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem("credentials")
      localStorage.removeItem("userData")
    },
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
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
    async generateProof() {
      console.log({did: this.did, pvkey:  this.privateKey})
      // this.credentials = JSON.parse(localStorage.getItem("credentials"));
      // console.log(this.credentials);
      // this.userData = JSON.parse(localStorage.getItem("userData"));
      // console.log(this.userData);
      if(this.did != "" && this.privateKey !=""){
        const p = await sign({
          did: this.did,
          privateKeyBase58: this.privateKey,
          challenge: this.challenge.challenge,
          domain: this.domain,
        });

        this.proof = JSON.stringify(p);
      } else {
        throw new Error("Error: did and privatekey are requried");
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
        this.notifyErr(e.message)
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
        this.clean();
        this.notifyErr(`Error: ${e.message}`);
      }
    },
    async login(type) {
      
     try{
      this.isLoading = true;
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
          this.isLoading = false;
          if (j && j.status == 500) {
            return this.notifyErr(`Error:  ${j.error}`);
          }
          
          console.log(j.message)

          localStorage.setItem("authToken", j.message.jwtToken);
          j.message.user['privateKey'] = this.privateKey
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
       this.clean();
       this.isLoading = false;
       this.notifyErr(`Error: ${e.message}`)
     }
    },
  },
};
</script>
