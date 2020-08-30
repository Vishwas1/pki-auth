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
.floatLeft{
  float: left;
}

.noBullet{
  list-style-type:none;
}

.title {
  color: grey;
  font-size: 18px;
}

.leftAlign{
  text-align: left;
}
.centerAlign{
  align-content: center;
}

.dot {
  height: 15px;
  width: 15px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
  margin-top:5px;
  float:right;
}

.tile{
  font-size: xxx-large;
  background: aliceblue;
  border-bottom: 1px solid #8080802b;
}

.fVal{
  font-size: small;
color: gray;
word-wrap: break-word
}

</style>
<template>
    <div class="row" style="padding:10px">
      <div class="col-md-6" style="margin-left:40%">
          <div class="card">
              <div class="card-header">
                Network Details <span class="dot" v-if="networkStatus.status == 'LIVE'"></span>
              </div>
              <div class="card-body leftAlign">
                <p >NETWORK
                </p><p class="fVal">Hypersign Staging Network</p>  
                <p>NODE URL
                </p><p class="fVal"><a :href="networkStatus.nodeUrl" target="_blank">{{networkStatus.nodeUrl}}</a></p>  
                <p>EXPLORER URL
                </p><p class="fVal"><a :href="networkStatus.explorerUrl" target="_blank">{{networkStatus.explorerUrl}}</a></p> 
                <p>DID COUNT
                </p><p class="fVal">{{networkStatus.didCount}}</p>  
                <p>SCHEMA COUNT
                </p><p class="fVal">{{networkStatus.schemaCount}}</p>  
              </div>
            </div> 
        </div>
      </div>
</template>

<script>
export default {
  name: "PanelPage",
  mounted() {
  },
  components: {
  },
  data() {
    return {
      active: 0,
      networkStatus: {
        status: "DOWN",
        nodeUrl: "",
        explorerUrl: "",
        schemaCount: "0",
        didCount: "0"
      },
    };
  },
  created() {
    const url = `http://localhost:5000/network/info`;
    fetch(url)
    .then(res => res.json())
    .then(json => {
      this.networkStatus = { ...json }
      console.log(this.networkStatus)
    })
    .catch(e => alert(`Error: ${e.message}`))
  },
  methods: {
    gotosubpage: id => {
      this.$router.push(`${id}`);
    }
  }
};
</script>
