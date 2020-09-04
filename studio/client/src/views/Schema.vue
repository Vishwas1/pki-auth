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
  <div class="home marginLeft marginRight">
    <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage"></loading>

    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <div class="card">
          <div class="card-header">
            <b-button v-b-toggle.collapse-1 variant="link">Create Schema</b-button>
          </div>
          <b-collapse id="collapse-1" class="mt-2">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group form-inline">
                    <label style="margin-right: 8%">Schema Name:</label>
                    <input
                      type="text"
                      v-model="credentialName"
                      size="30"
                      placeholder="Enter schema name"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group form-inline">
                    <label style="margin-right: 12%">Description:</label>
                    <textarea
                      v-model="credentialDescription"
                      rows="5"
                      cols="29"
                      placeholder="Enter description"
                      class="form-control"
                    ></textarea>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group form-inline">
                    <label style="margin-right: 5%">Add attribute:</label>
                    <input
                      type="text"
                      class="form-control"
                      size="30"
                      v-model="attributeName"
                      placeholder="Enter attribute name"
                    />
                    <a
                      class="btn btn-primary"
                      style="margin-left: 2%; border-radius:30px; color:white"
                      v-on:click="addBlankAttrBox()"
                    >+</a>
                  </div>
                  <div class="form-group" style="min-height:150px;max-height:150px;overflow: auto">
                    <div v-for="attr in attributes" :key="attr">
                      <div class="sm-tiles">
                        {{attr}}
                        <span>x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <hr/>
                  <button class="btn btn-outline-primary btn-sm" @click="createSchema()">Create</button>
                </div>
              </div>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>
    <div class="row" style="margin-top: 2%;">
      <div class="col-md-12">        
        <table class="table">
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
              <th>
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" :id="row.id" />
                  <label class="custom-control-label" :for="row.id">{{row.id}}</label>
                </div>
              </th>
              <td>{{row.credentialName}}</td>
              <!-- <td>{{row.attributes}}</td> -->
              <td
                style="word-wrap: break-word;min-width: 200px;max-width: 200px;"
              >{{row.attributes}}</td>
              <td>{{row.version}}</td>
              <td>{{row.owner}}</td>
            </tr>
          </tbody>
        </table>
        <!-- </div> -->
        <!-- </div> -->
      </div>
      <!-- </div> -->
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
      showSchema: true,
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
      schemaList: [],
      credentialDescription: "",
      fullPage: true,
      isLoading: false
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);
    this.fetchSchemas();
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
    fetchSchemas() {
      const url = `http://localhost:5000/api/schema/list`;
      fetch(url)
        .then((res) => res.json())
        .then((j) => {
          if (j.status != 200) throw new Error(j.error);
          this.schemaList = j.message;
          if (this.schemaList && this.schemaList.length > 0) {
            this.schemaList = this.schemaList.filter(
              (x) => x.owner === this.user.id
            );
          }
        })
        .catch((e) => this.notifyErr(`Error: ${e.message}`));
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
      this.attributes = [];
      this.issueCredAttributes = [];
      this.selected = null;
      this.credentialName = "";
    },
    OnSchemaSelectDropDownChange(event) {
      if (event) {
        this.issueCredAttributes = [];
        this.schemaMap[event].forEach((e) => {
          this.issueCredAttributes.push({
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
        JSON.stringify(this.signedVerifiableCredential),
        "vc.json"
      );
    },
    createSchema() {
        
      this.isLoading = true
      if (this.credentialName == "")
        return this.notifyErr("Error: SchemaName can not be blank");
      if (this.attributes.length == 0)
        return this.notifyErr("Error: Atleast one attribute is requreeid");
      const url = `http://localhost:5000/api/schema/create`;
      const schemaData = {
        name: this.credentialName,
        owner: this.user.id,
        attributes: this.attributes,
        description: this.credentialDescription,
      };
      let headers = {
        "Content-Type": "application/json",
      };
      fetch(url, {
        method: "POST",
        body: JSON.stringify(schemaData),
        headers,
      })
        .then((res) => res.json())
        .then((j) => {
          if (j.status === 200) {
            this.notifySuccess("Credential successfull created");
            this.credentialName = j.message.credentialName;
            this.schemaList.push({
              ...j.message,
            });
            this.schemaMap[j.message.id] = this.attributes;
            this.isLoading = false
          } else {
            this.isLoading = false
            this.notifyErr(`Error: ${j.error}`);
          }
        });
    },
  },
};
</script>


