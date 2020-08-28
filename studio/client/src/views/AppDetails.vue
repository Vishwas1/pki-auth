<style scoped>
.addmargin {
  margin-top: 10px;
  margin-bottom: 10px;
}

.vue-logo-back {
  background-color: black;
}
.floatRight {
  float: right;
}
.buttonClicked{
  background:white;
  font-weight: bold;
  border: 1px solid #80808091;
}
</style>

<template>
  <div class="row">
    <div class="col-md-8" style="margin-left: 17%">
      <div class="row">
        <div class="col-md-4">
          <div class="card" v-if="appDetails.id">
            <div class="card-header">
              <h5>{{appDetails.name}}</h5>
            </div>
            <div class="card-body" style="text-align: left">
              <p class="card-text">
                <b>AppId:</b>
                {{appDetails.id}}
              </p>
              <p class="card-text">
                <b>AppSecret:</b>
                {{appDetails.appSecret}}
              </p>
              <p class="card-text">
                <b>IsActive:</b>
                {{appDetails.isActive}}
              </p>
              <p class="card-text">
                <b>UserId:</b>
                {{appDetails.userId}}
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-12">
              <div class="row" style="background: #b5bbc63b none repeat scroll 0% 0%;
margin-top: 2px;
padding: 10px 10px 0px 10px;
border: 1px solid #8080803b;
border-radius: 3px;">
                <div class="col-md-4">
                  <button
                    type="button"
                    data-toggle="modal"
                    @click="getList('DID')"
                    v-bind:class="{ buttonClicked: showVc }"
                    class="btn btn-link floatLeft"
                  >Credential</button>
                  <button
                    type="button"
                    data-toggle="modal"
                    @click="getList('SCHEMA')"
                    v-bind:class="{ buttonClicked: showSchema }"
                    class="btn btn-link floatLeft"
                    style="margin-left: 1px"
                  >Schema</button>
                </div>
                <div class="col-md-5">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter did or schemaId to search"
                    size="50"
                  />
                </div>
                <div class="col-md-3">
                  <button @click="goToCreateIssuePage()"  class="btn btn-link floatRight">Issue</button>
                  <!-- <b-button class="floatRight" v-b-modal.modal-lg variant="link">ISSUE</b-button>
                  <b-modal id="modal-lg" size="lg" title="Create Credential">
                    <div class="row">
                      <div class="col-md-12">
                        <form class="form">
                            <div class="form-group">

                            </div>
                        </form>
                      </div>
                    </div>
                    <div class="row"></div>
                  </b-modal> -->
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12" style="padding: 10px">
              <div class="row">
                <div class="col-md-12" v-if="showVc">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>subject</th>
                        <th>issuer</th>
                        <th>schemaId</th>
                        <th>dataHash</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in vcList" :key="row">
                        <th scope="row">{{row.id}}</th>
                        <td>{{row.issuer}}</td>
                        <td>{{row.schemaId}}</td>
                        <td>{{row.dataHash}}</td>
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
                        <th scope="row">{{row.id}}</th>
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
// @ is an alias to /src
import fetch from "node-fetch";
export default {
  name: "appdetails",
  mounted() {
    console.log("Inside app details");
    if (this.$route.params.appId) {
      const url = `http://localhost:9000/api/app/${this.$route.params.appId}`;
      console.log(url);
      
      fetch(url,{
        method: "GET",
        headers: {'x-auth-token': this.authToken}
      })
        .then((res) => res.json())
        .then((j) => {
          this.appDetails = j.message;
          this.getList("SCHEMA");
        })
        .catch((e) => alert(e.message));
    } else {
      console.error("Param id is not defined");
    }
  },
  created() {
    this.authToken = localStorage.getItem('authToken');
  },
  data() {
    return {
      appDetails: {},
      vcList: [],
      schemaList: [],
      showSchema: true,
      showVc: false,
      credIssueUri: ""
    };
  },
  methods: {
    goToCreateIssuePage (){
       this.$router.push(`/studio/apps/${this.appDetails.id}/issue`);
    },
    goToMainPage: function () {
      
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
        return alert(`Error:  ${j.error}`);
      }
      if(type === "SCHEMA"){
        this.schemaList = j.message;
        this.schemaList = this.schemaList.filter(
          (x) => x.owner == this.appDetails.userId
        ); //.map(x => x.attributes = JSON.parse(x.attributes))

        console.log(this.schemaList);
        this.showVc = false;
        this.showSchema = true;
      }else{
        this.vcList = j.message.list;
        console.log(this.vcList);
        this.showVc = true;
        this.showSchema = false;
      }
      
    },
  },
};
</script>
