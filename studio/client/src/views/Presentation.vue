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

.card-header {
  background: aliceblue;
  padding: 0px;
}
</style>
<template>
  <div class="home marginLeft marginRight">
    <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :on-cancel="onCancel"
        :is-full-page="fullPage"></loading>

    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <div class="card">
          <div class="card-header">
            <button class="btn">Generate Presentation</button>
          </div>
          <!-- <b-collapse id="collapse-1" class="mt-2"> -->
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <form style="max-height:300px; min-height: 300px; overflow:auto; padding: 5px">
                    <div class="form-group">
                      <label class="floatLeft">Upload Verifiable Credential:</label>
                      <input type="file" class="form-control" placeholder @change="onFileChange" />
                    </div>
                    <div class="form-group" v-for="attr in issueCredAttributes" :key="attr.name">
                      <label>{{attr.name}}</label>
                      <input
                        text
                        v-model="attr.value"
                        class="form-control"
                        placeholder="Enter attribute value"
                      />
                    </div>
                  </form>
                  <hr />
                  <button class="btn btn-outline-primary btn-sm" @click="generatePresentation()">Generate</button>
                </div>
                <div class="col-md-6" style="padding: 30px" v-if="isCredentialIssued">
                  <div class="form-group" style="text-align:center">
                    <qrcode-vue :value="signedVerifiableCredential" :size="200" level="H"></qrcode-vue>
                    <label class="title">Scan the QR code using Hypersign Wallet to authenticate!</label>
                  </div>
                  <div class="form-group" style="text-align:center">
                    <p></p>
                    <h5>OR</h5>
                    <button class="btn btn-link" @click="downloadCredentials()">Download Credential</button>
                  </div>
                </div>
              </div>
            </div>
          <!-- </b-collapse> -->
        </div>
      </div>
    </div>
    <!-- <div class="row" style="margin-top: 2%;">
      <div class="col-md-12">
        <table class="table">
          <thead>
            <tr>
              <th>id</th>
              <th>schemaId</th>
              <th>issuer</th>
              <th>subject</th>
              <th>dataHash</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in vcList" :key="row">
              <th scope="row">
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" :id="row.id" />
                  <label class="custom-control-label" :for="row.id">{{row.id}}</label>
                </div>
              </th>
              <td>{{row.schemaId}}</td>
              <td>{{row.issuer}}</td>
              <td>{{row.subject}}</td>
              <td>{{row.dataHash}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div> -->
  </div>
</template>

<script>
import fetch from "node-fetch";
import { generateCredential, signCredential, generatePresentation, signPresentation } from "lds-sdk/dist/vc";
import QrcodeVue from "qrcode.vue";
const { sha256hashStr } = require("../crypto-lib/symmetric");
export default {
  name: "Presentation",
  components: { QrcodeVue },
  data() {
    return {
      active: 0,
      host: location.hostname,
      user: {},
      prevRoute: null,
      attributeName: "",
      attributes: [],
      issueCredAttributes: [],
      radioSelected: "create",
      credentialName: "",
      isCredentialIssued: false,
      signedVerifiableCredential: "",
      credentials: JSON.parse(localStorage.getItem("credentials")),
      subjectDid: "did:hs:AmitKumar",
      radioOptions: [
        { text: "Create new schema", value: "create" },
        { text: "Select existing schema", value: "existing" },
      ],
      selected: null,
      attributeValues: {},
      authToken: localStorage.getItem("authToken"),
      selectOptions: [{ value: null, text: "Please select a schema" }],
      schemaMap: {},
      vcList : [],
      schemaList: [],
      fullPage: true,
      isLoading: false,
      holderDid: "did:hs:8b915133-cb8b-4151-9a63-1b91f702297f",
      signedVerifiablePresentation: {}
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);
    console.log(this.user)
    this.getList('SCHEMA')
    this.getList('CREDENTIAL')
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
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
    async getList(type) {
      let url = "";
      let options = {}
      if(type === "SCHEMA"){
        url = `http://localhost:5000/api/schema/list`;
        options  = {
          method: "GET"
        }
      }else{
        url = `http://localhost:9000/api/credential/list`;
        options  = {
          method: "GET",
          headers: {'x-auth-token': this.authToken}
        }
      }
      
      const resp = await fetch(url, options);
      const j = await resp.json();
      if (j && j.status == 500) {
        return this.notifyErr(`Error:  ${j.error}`);
      }
      if(type === "SCHEMA"){
        const schemaList = j.message
        if(schemaList && schemaList.length > 0){
          schemaList.forEach(s => {
            if(s.owner != this.user.id) return
            this.schemaMap[s.id] = JSON.parse(s.attributes)
            this.selectOptions.push({
              value: s.id,
              text: `${s.credentialName} | ${s.id}`
            })
          });
        }
      }else{
        this.vcList = j.message.list;
      }
    },
    fetchData(url, option) {
      fetch(url)
        .then((res) => res.json())
        .then((j) => {
          if (j.status != 200) throw new Error(j.error);
          return j.message;
        })
        .catch((e) => this.notifyErr(`Error: ${e.message}`));
    },
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
    addBlankAttrBox() {
      if (this.attributeName != " ") {
        this.attributes.push(this.attributeName);
        this.attributeName = " ";
      }
    },
    onSchemaOptionChange(event) {
      console.log(event);
      this.attributes = [];
      this.issueCredAttributes = [];
      this.selected = null;
      this.credentialName = "";
    },
    OnSchemaSelectDropDownChange(event) {
      console.log(event);
      if (event) {
        this.issueCredAttributes = [];
        const id = this.issueCredAttributes.length;
        this.schemaMap[event].forEach((e) => {
          this.issueCredAttributes.push({
            id: id + event,
            type: "text",
            name: e,
            value: "",
          });
        });
      } else {
        this.issueCredAttributes = [];
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
    downloadCredentials() {
      this.forceFileDownload(
        JSON.stringify(this.signedVerifiablePresentation),
        "vp.json"
      );
    },
    onFileChange(event) {
      try {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = readSuccess;
        function readSuccess (evt) {
          localStorage.removeItem('credential')
          const fileJSON = JSON.parse(evt.target.result);
          if (!fileJSON) throw new Error("Incorrect file");
          const typeArr = fileJSON["type"]
          if(!typeArr.find(x => x == 'VerifiableCredential')){
            throw new Error("Incorrect VC");
          }
          localStorage.setItem("credential", JSON.stringify(fileJSON));
        }
        reader.readAsText(file);
      } catch (e) {
        this.clean();
        this.notifyErr(`Error: ${e.message}`);
      }
    },
    generateAttributeMap() {
      let attributesMap = [];
      if (this.issueCredAttributes.length > 0) {
        this.issueCredAttributes.forEach((e) => {
          attributesMap[e.name] = e.value;
        });
      }
      return attributesMap;
    },

    getCredentials(attributesMap) {
      const schemaUrl = `http://localhost:5000/api/schema/get/${this.selected}`;
      return generateCredential(schemaUrl, {
        subjectDid: this.holderDid,
        issuerDid: this.user.publicKey,
        expirationDate: new Date().toISOString(),
        attributesMap,
      }).then((signedCred) => {
        return signedCred;
      });
    },

    signCredentials(credential) {
      return signCredential(credential, this.user.publicKey, this.user.privateKey).then(
        (signedCredential) => {
          return signedCredential;
        }
      );
    },
    async generatePresentation() {  
      this.isLoading = true
      try{
        const vc = JSON.parse(localStorage.getItem("credential"));
        if(!vc) throw new Error('VC is null')
        const vp_unsigned = await generatePresentation(vc, this.user.id);
        const vp_signed = await signPresentation(vp_unsigned, this.user.id, this.user.privateKey, "test_challenge")
        this.signedVerifiablePresentation = vp_signed;
        this.isLoading = false
        this.isCredentialIssued = true;
        this.notifySuccess("Presentation generated and sigend")
        localStorage.removeItem('credential')
      }catch(e){
        this.isLoading = false
        this.notifyErr(e.message)
      }
    },
  },
};
</script>


