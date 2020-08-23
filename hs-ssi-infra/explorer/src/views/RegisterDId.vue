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

  <div class="home">

    <div class="row">
      <div class="col-md-8" style="margin-left: 17%;">
        <b-card no-body style="padding: 40px">
          <div class="row">
            <form action="#" class="col-md-12 form-inline">
              <div class="form-group">                
                <input type="text" size="30" placeholder="Enter an alias" class="form-control" v-model="fullName" required />
              </div>
              <div class="form-group" style="padding-left: 10px">
                <button
                type="button"
                data-toggle="modal"
                @click="signup()"
                class="btn btn-primary"
              >Register</button>
              </div>
            </form>
          </div>
        </b-card>
      </div>
    </div>
    <div class="row" style="margin-top:1%">
     <div class="col-md-8" style="margin-left: 17%;">
       <b-card no-body style="padding: 40px; ">
       <div class="row">
       <form action="#" class="col-md-6">
              <div class="form-group">
                <label class="floatLeft">keys.json:</label>
                <textarea class="form-control" v-model="credentials" rows="6" cols="50"></textarea>
              </div>
          </form>            
          <form action="#" class="col-md-6">
              <div class="form-group">
                <label class="floatLeft">didDoc.json:</label>
                <textarea class="form-control" v-model="userData" rows="6" cols="50"></textarea>
              </div>
          </form>       
          </div>
          </b-card>
    </div>
  </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import { getUserDoc, getCredential } from "lds-sdk";

const {sha256hashStr} = require("../crypto-lib/symmetric");
export default {
  name: "RegisterDid",
  components: {
    
  },
  data() {
    return {
      active: 0,
      fullName: "Amit Kumar",
      email: "amit@gmail.com",
      telephone: "8323210123",
      publicKey: "ak_h7Hw9UD9JUPUtyZ54Es2BhFFiBo22aD2k615LtHshxpZ68dqJ",
      username: "Amit",
      password: "Amit",
      birthdate: "16/11/1992",
      jobTitle: "Engineer",
      host: location.hostname,
      credentials: "",
      userData: "",
      prevRoute: null
    };
  },
  created() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from
    })
  },
  methods: {
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
    async generateCredsDocs(){
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
    signup() {
      try {
        if(this.fullName == " ") return alert('Alias is required!');
        const url = `http://${this.host}:5000/api/did/create?name=${this.fullName}`;
        fetch(url)
          .then((res) => res.json())
          .then((j) => {
            if (j && j.status == 500) {
              return alert(`Error:  ${j.error}`);
            }
            this.credentials = JSON.stringify(j.message.keys);
            this.userData = JSON.stringify(j.message.didDoc);
            this.downloadCredentials()
            this.downloadUserDoc()
            alert('Did Successfully created. You can check on explorer. Please keep your keys safe')
          });
      } catch (e) {
        alert(e);
      }
    },
  },
};
</script>


