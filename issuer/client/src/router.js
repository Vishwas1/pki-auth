import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import PKIIdLogin from './views/PKIIdLogin.vue'
import Register from './views/Register.vue'
import Register_PKI from './views/Register_pki.vue'
import Customers from './views/Customers.vue'
import CustomerDetails from './views/CustomerDetails.vue'
import Crypto from './views/Crypto.vue'
import Home from './views/Home.vue'
import fetch from 'node-fetch'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/studio/login'
    },
    {
      path: '/studio',
      redirect: '/studio/login'
    },
    {
      path: '/studio/login',
      name: 'PKIIdLogin',
      component: PKIIdLogin
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/studio/register',
      name: 'register',
      component: Register
    },
    {
      path: '/register_pki',
      name: 'register_pki',
      component: Register_PKI
    },
    {
      path: '/customers',
      name: 'customers',
      component: Customers
    },
    {
      path: '/customerdetails/:id',
      name: 'customerdetails',
      component: CustomerDetails
    },
    {
      path: '/dashboard/home',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      } 
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)){
    const authToken = localStorage.getItem('authToken')
    if(authToken){
      const url = `http://${location.hostname}:5000/api/auth/verify`
      fetch(url,{
        headers: {
          'x-auth-token': authToken
        },
        method: 'POST'
      }).then(res => res.json())
      .then(json => {
        if(json.status == 403){
          next({
            path: '/dashboard/login',
            params: { nextUrl:  to.fullPath}
          })  
        }else{
          next()
        }
      })
      .catch((e)=> {
        next({
          path: '/dashboard/login',
          params: { nextUrl:  to.fullPath}
        })
      })
    }else{
      next()
    }
  }else{
    next()
  }
})
export default router
