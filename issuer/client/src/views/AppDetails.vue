<style scoped>

.addmargin {
    margin-top: 10px;
    margin-bottom: 10px;
}

.vue-logo-back {
    background-color: black;
}

</style>

<template>

<div class="home">
    <div class="card" v-if="appDetails.id">
        <div class="card-header">
            App Details
        </div>
        <div class="card-body">
            <h5 class="card-title">{{appDetails.name}}</h5>
            <p class="card-text">appId : {{appDetails.id}}</p>
            <p class="card-text">appSecret : {{appDetails.appSecret}}</p>
            <p class="card-text">isActive : {{appDetails.isActive}}</p>
            <p class="card-text">userId : {{appDetails.userId}}</p>
        </div>
    </div>
</div>
</template>
<script>
// @ is an alias to /src
import fetch from 'node-fetch'
export default {
    name: 'appdetails',
    mounted() {
        console.log('Inside app details')
        if(this.$route.params.appId){
            const url = `http://localhost:9000/api/app/${this.$route.params.appId}`
            console.log(url)
            fetch(url)
            .then(res => res.json())
            .then(j => {
                this.appDetails = j.message;
            })
            .catch(e =>  alert(e.message))
        }else{
            console.error('Param id is not defined')
        }
        
    },
    data() {
        return {
            appDetails: {},
            vcList: []
        }
    },
    methods: {
        goToMainPage: function() {
            this.$router.push("/customers");
        }
    }
}

</script>
