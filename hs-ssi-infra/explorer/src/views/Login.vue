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
.marginLeft
{
margin-left: 13%
}
.marginRight
{
margin-right: 12%
}
</style>
<template>
  <!-- <div class="home"> -->
  <div class="row">
    <div class="col-md-9 marginRight marginLeft">
      <div class="row">
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-3">
              <button
                type="button"
                data-toggle="modal"
                @click="getList('DID')"
                class="btn btn-link floatLeft"
              >Did</button>
              <button
                type="button"
                data-toggle="modal"
                @click="getList('SCHEMA')"
                class="btn btn-link floatLeft"
                style="margin-left: 2px"
              >Schema</button>
            </div>
            <div class="col-md-6">
              <form class="form-inline" >
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter did or schemaId to search"
                    size="70"
                  />
                </div>
              </form>
            </div>
            <div class="col-md-3">
              <div class="form-group">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12" style="padding: 10px">
          <div class="row">
            <div class="col-md-12" id="didTable" v-if="showDid">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>DID</th>
                    <th>Alias</th>
                    <th>DID Document</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in didList" :key="row">
                    <td><a :href="'http://localhost:5000/api/did/resolve/'+row.did" target="_blank">{{row.did}}</a></td>
                    <td>{{row.name}}</td>
                    <td
                      style="word-wrap: break-word;min-width: 700px;max-width: 700px;"
                    >{{row.didDoc}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-md-12" id="schemaTable" v-if="showSchema">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>credentialName</th>
                    <th>attributes</th>
                    <th>version</th>
                    <th>owner</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="row in schemaList" :key="row">
                    <th scope="row"><a :href="'http://localhost:5000/api/schema/get/'+row.id" target="_blank">{{row.id}}</a></th>
                    <td>{{row.credentialName}}</td>
                    <td>{{row.attributes}}</td>
                    <td>{{row.version}}</td>
                    <td>{{row.owner}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import { getChallange } from "lds-sdk";
import QrcodeVue from "qrcode.vue";
import { sign } from "lds-sdk";
const { sha256hashStr } = require("../crypto-lib/symmetric");
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
      didList: [],
      schemaList: [],
      showDid: true,
      showSchema: false,
    };
  },
  created() {
    this.getList("DID");
  },
  mounted() {},
  methods: {
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
    async getList(type) {
      let url = "";
      if (type === "DID") {
        url = `http://${this.host}:5000/api/did/list`;
      } else {
        url = `http://${this.host}:5000/api/schema/list`;
      }

      const resp = await fetch(url);
      const j = await resp.json();
      if (j && j.status == 500) {
        return alert(`Error:  ${j.error}`);
      }

      if (type == "DID") {
        this.didList = j.message;
        this.showDid = true;
        this.showSchema = false;
      } else {
        this.schemaList = j.message;
        this.showDid = false;
        this.showSchema = true;
      }
    },
    async generateProof() {
      this.credentials = JSON.parse(localStorage.getItem("credentials"));
      this.userData = JSON.parse(localStorage.getItem("userData"));
      if (
        (this.credentials && this.credentials["controller"]) != null &&
        this.userData != null &&
        this.userData["@context"]
      ) {
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
      // await this.generateProof();
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
      try {
        let url = "";
        let headers = {
          "Content-Type": "application/json",
        };
        if (type === "PKI") {
          url = `http://${this.host}:5000/api/auth/login_pki?type=PKI`;
          headers["x-auth-token"] = this.challenge.JWTChallenge;
          await this.generateProof();
        } else {
          url = `http://${this.host}:5000/api/auth/login`;
        }
        const userData = {
          username: this.username,
          password:
            this.password != "" ? sha256hashStr(this.password) : this.password,
          proof: this.proof,
          controller: this.credentials ? this.credentials.controller : {},
          publicKey:
            this.credentials && this.credentials.keys
              ? this.credentials.keys.publicKey
              : {},
          challenge: this.challenge ? this.challenge.challenge : "",
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
            console.log("Validated");
            localStorage.setItem("authToken", j.message.jwtToken);
            localStorage.setItem("user", JSON.stringify(j.message.user));
            if (localStorage.getItem("authToken") != null) {
              if (this.$route.params.nextUrl != null) {
                this.$router.push(this.$route.params.nextUrl);
              } else {
                this.$router.push("home");
              }
            }
          });
      } catch (e) {
        alert(`Error: ${e.message}`);
      }
    },
  },
};
</script>
