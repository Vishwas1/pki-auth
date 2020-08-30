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

.noBullet {
  list-style-type: none;
}

.title {
  color: grey;
  font-size: 18px;
}
.dot {
  height: 15px;
  width: 15px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
  margin-top: 5px;
  float: right;
}

.tile {
  font-size: xxx-large;
  background: aliceblue;
  border-bottom: 1px solid #8080802b;
  min-width: 240px;
  min-height: 100px;
}
.fVal {
  font-size: small;
  color: gray;
  word-wrap: break-word;
}
</style>


<template>  
  <div class="row">
    <div class="col-md-12" style="margin-top:2%; margin-bottom:7%">
      <div class="row">
        <div class="col-md-5">
          <div class="card">
            <div class="card-body tile">{{schemaCount}}</div>
            <div class="card-header">Authored Schemas</div>
          </div>
        </div>
        <div class="col-md-5" style="margin-left:15%">
          <div class="card">
            <div class="card-body tile">{{credentialCount}}</div>
            <div class="card-header">Issued Credentials</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12 leftAlign">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <img
                src="https://cdn1.iconfinder.com/data/icons/female-avatars-vol-1/256/female-portrait-avatar-profile-woman-sexy-afro-2-512.png"
                alt="John"
                style="width:100%;height: 100%;"
              />
            </div>
            <div class="col-md-8" style="flex-wrap: wrap; padding:20px">
              <p>DID</p>
              <p class="fVal">{{user.id}}</p>
              <p v-if="user.email">Email: {{user.email}}</p>
              <p v-if="user.phoneNumber">Phone Number: {{user.phoneNumber}}</p>
              <p>PUBLIC KEY</p>
              <p class="fVal">{{user.publicKey}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Profile",
  mounted() {},
  components: {},
  data() {
    return {
      active: 0,
      userKeys: [],
      appList: [],
      schemaCount: 0,
      credentialCount: 0,
      user: {
        id: "",
        publicKey: "",
        email: "",
        phoneNumber: "",
        fname: "",
      },
      authToken: localStorage.getItem("authToken"),
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    console.log(usrStr);
    this.user = { ...JSON.parse(usrStr) };
    console.log(this.user);
    this.userKeys = Object.keys(this.user);
    this.pollData()
  },
  methods: {
    fetchData(url,options){
      return fetch(url, options)
            .then((res) => res.json())
            .then((j) => {              
              return j.message
            })
            .catch((e) => alert(`Error: ${e.message}`));
    },
    pollData(){
      let url = `http://localhost:5000/api/schema/list`;
      let options = {}
      this.fetchData(url).then(data => {
        if (data && data.length > 0) {
          data = data.filter(
            (x) => x.owner === this.user.id
          );
          this.schemaCount = data.length;
        }
      })

      url = "http://localhost:9000/api/credential/list"
      options  = {
          method: "GET",
          headers: {'x-auth-token': this.authToken}
        }
      this.fetchData(url,options).then(data => {
        if (data) {
          this.credentialCount = data.count;
        }
      })
    },
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
  },
};
</script>
