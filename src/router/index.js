import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  routes:[{
    path:'/music',component:require('../components/music')
  },{
    path:'/tip',component:require('../components/tip')
  },{
    path:'/',redirect:'/music'
  },{
    path:'*',redirect:'/music'
  }]
})


export default router