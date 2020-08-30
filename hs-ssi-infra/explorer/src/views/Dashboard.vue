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
</style>
<template>
  <div class="home">
    <Dashboard/>
  </div>
</template>

<script>
import Dashboard from "@/components/Dashboard.vue";
export default {
  name: "PanelPage",
  mounted() {
  },
  components: {
    Dashboard
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
    const url = `http://${location.hostname}:5000/network/info`;
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
