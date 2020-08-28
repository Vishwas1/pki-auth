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
.sm-tiles{
  float: left;
padding: 5px;
border: 1px solid #8080807d;
margin: 1%;
border-radius: 5px;
background: #f5dda71c;
color: #888b8f;
}
.sm-tiles:hover{
    float: left;
padding: 5px;
border: 1px solid #8080807d;
margin: 1%;
border-radius: 5px;
background: #f5dda7a3;;
font-style: bold ;
color: #888b8f;
}
</style>
<template>
  <div class="home">
    <div class="row">
      <div class="col-md-8" style="margin-left: 17%;">
        <div class="card" no-body style="text-align: left">
            <div class="card-header">
                <h5>Select / Create Schema</h5>
            </div>
          <div class="card-body">
              <div class="row">
                <div class="col-md-6" style="text-align: left">
                <b-form-radio-group
                            v-model="radioSelected"
                            :options="radioOptions"
                            plain
                            stacked
                            name="plain-stacked"
                            @change="onSchemaOptionChange($event)"
                            ></b-form-radio-group>
                </div>
                <div class="col-md-6" style="text-align: left">
                    <form class="form" v-if="radioSelected == 'existing'">
                        <div class="form-group">
                            <b-form-select v-model="selected" :options="selectOptions" @change="OnSchemaSelectDropDownChange($event)" size="md" class="mt-3"></b-form-select>    
                        </div>
                    </form>
                    <div v-if="radioSelected == 'create'">
                        <div class="form-group form-inline">
                            <label style="margin-right: 5%;">Schema Name:</label>
                            <input type="text" v-model="credentialName" size="30" placeholder="Enter schema Name" class="form-control">
                        </div>
                        <div class="form-group form-inline">
                            <label style="margin-right: 8%;">Add attribute:</label>
                            <input type="text" class="form-control" size="30" v-model="attributeName" placeholder="Enter attribute name">
                            <a class="btn btn-primary" style="margin-left: 2%; border-radius:30px; color:white" v-on:click="addBlankAttrBox()"> + </a>
                        </div>
                        <div class="form-group" style="max-height:200px;overflow: auto">
                            <div v-for="attr in attributes" :key="attr">
                                <div class="sm-tiles">{{attr}} <span>x</span></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <hr/>
                            <button class="btn btn-outline-primary" @click="createSchema()">Create Schema</button>
                        </div>
                    </div>
                </div>
                </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" style="margin-top:1%">
      <div class="col-md-8" style="margin-left: 17%; text-align: left">
        <div class="card">
          <div class="card-header">
            <h5>Issue Credential</h5>
          </div>
         <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                  Fill the form: 
                  <hr/>
                  <form style="max-height:300px; overflow:auto; padding: 5px">
                    <div class="form-group" v-for="attr in issueCredAttributes" :key="attr.name">
                      <label>{{attr.name}}</label>
                      <input text="" v-model="attr.value"  class="form-control" placeholder="Enter attribute value"/>
                    </div>
                  </form>
                  <hr/>
                  <button class="btn btn-outline-primary" @click="issueCredential()">Issue Credential</button>
              </div>
              <div class="col-md-6" style="padding: 30px" v-if="isCredentialIssued">
                  <div class="form-group"  style="text-align:center">
                    <qrcode-vue :value="signedVerifiableCredential" :size="200" level="H"></qrcode-vue>
                    <label class="title">Scan the QR code using Hypersign Wallet to authenticate!</label>
                  </div>
                  <div class="form-group" style="text-align:center">
                    <p><h5>OR</h5>
                    <button class="btn btn-link" @click="downloadCredentials()">Download Credential</button>
                  </div>
              </div>
            </div>
         </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import { generateCredential, signCredential } from "lds-sdk/dist/vc";
import QrcodeVue from "qrcode.vue";
const { sha256hashStr } = require("../crypto-lib/symmetric");
export default {
  name: "IssueCredential",
  components: {QrcodeVue},
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
      isCredentialIssued:  false,
      signedVerifiableCredential: "",
      credentials: JSON.parse(localStorage.getItem("credentials")),
      subjectDid: "did:hs:AmitKumar",
      radioOptions: [
        { text: "Create new schema", value: "create" },
        { text: "Select existing schema", value: "existing" },
      ],
      selected: null,
      attributeValues:{},
      authToken: localStorage.getItem('authToken'),
    selectOptions: [
      {value: null, text: "Please select a schema"}
    ],
    schemaMap: {}
    };
  },
  created() {
      const usrStr = localStorage.getItem('user')
      this.user = JSON.parse(usrStr);
      this.fetchSchemas()
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    fetchSchemas(){
      const url = `http://localhost:5000/api/schema/list`
      fetch(url)
      .then(res => res.json())
      .then(j => {
        if(j.status != 200) throw new Error(j.error)
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
          console.log(this.schemaMap)
        }
      })
      .catch(e => alert(`Error: ${e.message}`))
    },
    fetchData(url, option){
      fetch(url)
      .then(res => res.json())
      .then(j => {
        if(j.status != 200) throw new Error(j.error)
        return j.message
      })
      .catch(e => alert(`Error: ${e.message}`))
    },
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
    addBlankAttrBox(){
        console.log(this.attributes)
        if(this.attributeName != " "){
            this.attributes.push(this.attributeName)
            this.attributeName = " "
        }
    },
    onSchemaOptionChange(event){
       console.log(event)
        this.attributes = []
        this.issueCredAttributes = []
        this.selected = null
        this.credentialName = ""
    },
    OnSchemaSelectDropDownChange(event){
        console.log(event)
        if(event){
          this.issueCredAttributes = []
          this.schemaMap[event].forEach(e => {
            this.issueCredAttributes.push({
              type: "text",
              name: e,
              value: ""
            })  
          })
        }else{
          this.issueCredAttributes = []
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
      this.forceFileDownload(JSON.stringify(this.signedVerifiableCredential), "vc.json");
    },
    createSchema(){
        console.log(this.credentialName)
        if(this.credentialName == "") return alert("Error: SchemaName can not be blank")
        if(this.attributes.length == 0) return alert("Error: Atleast one attribute is requreeid")
        console.log('Inside created schema')
        console.log(this.user)

        const url = `http://localhost:5000/api/schema/create`
        const schemaData  = {
                name: this.credentialName,
                owner: this.user.id,
                attributes: this.attributes
            }
        let headers = {
        "Content-Type": "application/json"
      }
        console.log(schemaData)
        fetch(url,{
            method: "POST",
            body: JSON.stringify(schemaData),
            headers
        }).then(res => res.json())
        .then(j => {
            if(j.status === 200){
                alert('Credential successfull created')
                this.credentialName = j.message.credentialName
                
                // JSON.parse(j.message.attributes).forEach(e => {
                //     this.issueCredAttributes.push({
                //       type: "text",
                //       name: e,
                //       value: ""
                //     })  
                //  })
               this.schemaMap[j.message.id] = this.attributes
                this.selectOptions.push({
                  value: j.message.id,
                  text: `${j.message.credentialName} | ${j.message.id}`
                })
                this.radioSelected = "existing"
            }else{
                alert(`Error: ${j.error}`)
            }
        })
    },
    generateAttributeMap(){
      let attributesMap = []
      if(this.issueCredAttributes.length > 0){
        this.issueCredAttributes.forEach(e => {
          attributesMap[e.name] = e.value;
        })
      }

      return attributesMap;
    },

    getCredentials (attributesMap){
      const schemaUrl = `http://localhost:5000/api/schema/get/${this.selected}`
        return generateCredential(schemaUrl, {
            subjectDid: this.subjectDid,
            issuerDid: this.credentials.publicKey.id,
            expirationDate: new Date().toISOString(),
            attributesMap
        }).then(signedCred => {
          return signedCred;
        })
    },

    signCredentials(credential){
      return signCredential(credential, this.credentials)
      .then(signedCredential => {
        return signedCredential
      })
    },
    async issueCredential(){
      console.log(this.issueCredAttributes)
      // generateAttributeMap

      const attributeMap = await this.generateAttributeMap()

      const verifiableCredential = await this.getCredentials(attributeMap)
      // signCredentials
      const signedVerifiableCredential = await this.signCredentials(verifiableCredential)
      this.signedVerifiableCredential = signedVerifiableCredential
      
      const url = "http://localhost:9000/api/credential/issue"
      const headers = {
        "Content-Type": "application/json",
        'x-auth-token': this.authToken
      }
      const body = {
        subject: this.subjectDid,
        schemaId: this.selected,
        dataHash: signedVerifiableCredential,
        appId: "appI123"
      }

      fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      })
      .then(res => res.json())
      .then(j => {
        if(j.status != 200) throw new Error(`Error: ${j.error}`)
        if(j.status === 200){
          console.log('Credential issued')
          console.log(j.message)
          this.isCredentialIssued = true;
          this.onSchemaOptionChange(null)
          this.radioSelected = "create"
        }
      })
      .catch(e => alert(`Error: ${e.message}`))
    },
  },
};
</script>


