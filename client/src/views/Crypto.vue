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

</style>
<template>
  <div class="home">
    <div class="col-md-8 centeralign">
    <div class="row">
      <div class="col-md-6" >
        <h3 style="float:left">Welcome {{user.username}}! </h3>
      </div>
      <div class="col-md-6" >
        <button  style="float:right" type="button"
                        data-toggle="modal"
                        @click="logout()"
                        class="btn btn-link">Logout</button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <b-card no-body style="padding: 20px">
        <b-tabs content-class="mt-3">
          <b-tab title="Introduction" active>
            <Introduction/>
          </b-tab>
          <b-tab title="Hashing">
            <Hash />
          </b-tab>
          <b-tab title="Symmetric">
            <Symmetric />
          </b-tab>
          <b-tab title="Asymmetric">
            <Asymmetric />
          </b-tab>
          <b-tab title="Zero Knowledge Proof">
            <ZKP />
          </b-tab>
        </b-tabs>
      </b-card>
      </div>
    </div>
      
      
    </div>
  </div>
</template>

<script>
import Hash from "@/components/Hash.vue";
import Asymmetric from "@/components/Asymmetric.vue";
import Symmetric from "@/components/Symmetric.vue";
import Introduction from "@/components/Introduction.vue";
import ZKP from "@/components/zkp.vue";
export default {
  name: "PanelPage",
  mounted() {
  },
  components: {
    Hash,
    Asymmetric,
    Symmetric,
    Introduction,
    ZKP
  },
  data() {
    return {
      active: 0,
      user: {}
    };
  },
  created() {
    const usrStr = localStorage.getItem('user')
    this.user = JSON.parse(usrStr);
  },
  methods: {
    gotosubpage: id => {
      this.$router.push(`${id}`);
    },
    logout(){
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      
      if(this.$route.params.nextUrl != null){
                    this.$router.push(this.$route.params.nextUrl)
                }else{
        this.$router.push('login')
                }
    }
  }
};
</script>
