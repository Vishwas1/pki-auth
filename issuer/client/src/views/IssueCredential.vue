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
                            <!-- <label>Please select schema</label> -->
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
                            <!-- <b-list-group v-for="attr in attributes" :key="attr">
                                <b-list-group-item button>{{attr}}</b-list-group-item>
                            </b-list-group> -->
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
                    <div class="form-group" v-for="attr in issueCredAttributes" :key="attr">
                      <label>{{attr}}</label>
                      <input text="" class="form-control" placeholder="Enter attribute value"/>
                    </div>
                  </form>
                  <hr/>
                  <button class="btn btn-outline-primary" @click="issueCredential()">Issue Credential</button>
              </div>
              <div class="col-md-6">
                
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
import { getUserDoc, getCredential } from "lds-sdk";

const { sha256hashStr } = require("../crypto-lib/symmetric");
export default {
  name: "IssueCredential",
  components: {},
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
      radioOptions: [
        { text: "Create new schema", value: "create" },
        { text: "Select existing schema", value: "existing" },
      ],
      selected: null,
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
    },
    OnSchemaSelectDropDownChange(event){
        console.log(event)
        if(event){
          this.issueCredAttributes = this.schemaMap[event] 
        }else{
          this.issueCredAttributes = []
        }
        
    },
    async generateCredsDocs() {
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
      this.forceFileDownload(this.credentials, "keys.json");
    },
    downloadUserDoc() {
      this.forceFileDownload(this.userData, "didDoc.json");
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
                this.issueCredAttributes = JSON.parse(j.message.attributes)
                this.selectOptions.push({
                  value: j.message.id,
                  text: `${j.message.credentialName} | ${j.message.id}`
                })
            }else{
                alert(`Error: ${j.error}`)
            }
        })
    },
    issueCredential(){
      
    },
    signup() {
      try {
        if (this.fullName == " ") return alert("Alias is required!");
        const url = `http://${this.host}:5000/api/did/create?name=${this.fullName}`;
        fetch(url)
          .then((res) => res.json())
          .then((j) => {
            if (j && j.status == 500) {
              return alert(`Error:  ${j.error}`);
            }
            this.credentials = JSON.stringify(j.message.keys);
            this.userData = JSON.stringify(j.message.didDoc);
            this.downloadCredentials();
            this.downloadUserDoc();
            alert(
              "Did Successfully created. You can check on explorer. Please keep your keys safe"
            );
          });
      } catch (e) {
        alert(e);
      }
    },
  },
};
</script>


