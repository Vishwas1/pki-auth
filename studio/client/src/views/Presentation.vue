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
        :is-full-page="fullPage"></loading>

    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <div class="card">
          <div class="card-header">
            <b-button v-b-toggle.collapse-1 variant="link">Generate Presentation</b-button>
          </div>
          <b-collapse id="collapse-1" class="mt-2">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <form style="max-height:300px; min-height: 300px; overflow:auto; padding: 5px">
                    <div class="form-group">
                      <label class="floatLeft">Upload Verifiable Credential:</label>
                      <input ref="vcFile" type="file" class="form-control" placeholder @change="onFileChange" />
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
                    <qrcode-vue :value="signedVerifiablePresentation" :size="200" level="H"></qrcode-vue>
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
          </b-collapse>
        </div>
      </div>
    </div>

    <div class="row" style="margin-top:1%">
      <div class="col-md-12" style="text-align: left">
        <div class="card">
          <div class="card-header">
            <b-button v-b-toggle.collapse-2 variant="link">Verify Presentation</b-button>
          </div>
          <b-collapse id="collapse-2" class="mt-2">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <form style="max-height:300px; min-height: 300px; overflow:auto; padding: 5px">
                    <div class="form-group">
                      <label class="floatLeft">Upload Verifiable Presentation:</label>
                      <input ref="vpFile" type="file" class="form-control" placeholder @change="onFileChange" />
                    </div>
                  </form>
                  <div class="form-grop">
                      <hr />
                      <button class="btn btn-outline-primary btn-sm" @click="viewPresentation()">View</button>
                      <button class="btn btn-outline-danger btn-sm" @click="clear()">Clear</button>
                    </div>
                </div>
                <div class="col-md-6">
                  <form style="max-height:300px; min-height: 300px; overflow:auto; padding: 5px">
                  <div class="form-group">
                    <ul class="list-group">
                      <li class="list-group-item"><label><b>Issuer  DID:</b> {{presentationDetails.issuerDid}}</label></li>
                      <li class="list-group-item"><label><b>Subject DID:</b> {{presentationDetails.holderDid}}</label></li>
                      <li class="list-group-item"><label><b>Issuance Date:</b> {{presentationDetails.issuanceDate}}</label></li>
                      <li class="list-group-item"><label><b>Expiration Date:</b> {{presentationDetails.expirationDate}}</label></li>
                      <li class="list-group-item"><b>Claims:</b><a  @click="showClaims()" v-if="presentationDetails.claim" style="color:blue; text-decoration:underline;padding-left:5px">View / Hide claims</a>
                          <ul class="list-group" v-if="isClaims" style="padding-left:10%; padding-top:2%">
                          <li class="list-group-item" v-for="(value, key) in presentationDetails.claim">
                              <b>{{ key }}</b>: {{value}}
                            </li>
                          </ul> 
                      </li>
                       
                    </ul>
                  </div>
                  <div class="form-group" hidden>
                    <label class="floatLeft">Presentation Details:</label> 
                    <textarea class="form-control" v-model="presentationDetails" rows="10" cols="20" hidden></textarea>
                  </div>
                  </form>
                  <div class="form-grop">
                      <hr />
                      <button class="btn btn-outline-success btn-sm" @click="verifyPresentation()">Verify</button>
                  </div>
                </div>
              </div>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import { generateCredential, signCredential, generatePresentation, signPresentation, verifyPresentation } from "lds-sdk/dist/vc";
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
      signedVerifiablePresentation: {},
      presentationDetails: {},
      isClaims: false
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    showClaims(){
      if(this.isClaims) this.isClaims = false;
      else this.isClaims = true;
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
    onfileLoadSuccess (evt){
        console.log('Inside callbacl')
          const fileJSON = JSON.parse(evt.target.result);
          if (!fileJSON) this.notifyErr("Incorrect file");
          const typeArr = fileJSON["type"]
          if(typeArr.find(x => x == 'VerifiableCredential')){
            console.log('Inside callbacl: vc')
            localStorage.removeItem('credential')
            localStorage.setItem("credential", JSON.stringify(fileJSON));  
          }else if(typeArr.find(x => x == 'VerifiablePresentation')){
            console.log('Inside callbacl: vp')
            localStorage.removeItem('presentation')
            localStorage.setItem("presentation", JSON.stringify(fileJSON));  
          }else{
            this.notifyErr("Invalid file")
          }
    },
    readFile(file, cb){
      console.log('Inside reaffileDs')
      const reader = new FileReader();
      reader.onload = cb
      reader.readAsText(file);
    },
    onFileChange(event) {
      const file = event.target.files[0];
      this.readFile(file, this.onfileLoadSuccess)
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
    viewPresentation(){
      console.log('.......................................................')
      const vp = JSON.parse(localStorage.getItem("presentation"));
      if(!vp) this.notifyErr("VP is null")
      console.log(vp)
      const vc = vp.verifiableCredential[0]
      this.presentationDetails = {}
      this.presentationDetails.issuerDid = vc.issuer
      this.presentationDetails.holderDid = vc.credentialSubject.id
      this.presentationDetails.issuanceDate = vc.issuanceDate
      this.presentationDetails.expirationDate = vc.expirationDate
      this.presentationDetails.claim = vc.credentialSubject
      // this.presentationDetails.claim = JSON.stringify(vc.credentialSubject, null, 2)
      // this.presentationDetails = JSON.stringify(this.presentationDetails, null, 2)
      console.log(this.presentationDetails)
    },
    clear(){
      this.presentationDetails = "",
      localStorage.removeItem('presentation')
      localStorage.removeItem('credential')
      this.$refs.vpFile.value=null;
      this.$refs.vcFile.value=null;
      this.signedVerifiablePresentation = {}
      this.isCredentialIssued =  false
    },
    async verifyPresentation() {  
      this.isLoading = true
      try{
        const vp = JSON.parse(localStorage.getItem("presentation"));
        if(!vp) throw new Error('vp is null')
        const vc = vp.verifiableCredential[0]
        const isVerified = await verifyPresentation(
          {
            presentation: vp, 
            challenge: "test_challenge", 
            issuerDid: vc.issuer, 
            holderDid: vc.credentialSubject.id
          });
        console.log(isVerified)
        if(isVerified.verified){
          this.notifySuccess("Presentation verified")
        }else{
          this.notifyErr("Presentation can not verified")
        }
        this.isLoading = false
        this.clear()
      }catch(e){
        this.isLoading = false
        this.notifyErr(e.message)
      }
    },
  },
};
</script>


