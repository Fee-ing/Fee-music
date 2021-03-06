import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'

import './assets/css/reset.css'
import './assets/iconfont/iconfont.css'
import './assets/css/common.css'
import './assets/css/pace-theme-minimal.css'

import './assets/js/pace.min.js'
import Func from './assets/js/common.js'

Vue.use(VueResource)

Vue.config.productionTip = false

let isPhone = (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))
let isRightVersion = Func.explorerVersion()

router.beforeEach((to, from, next) => {
	if (isPhone && to.path !== '/tip') {
	    next({path: '/tip', query: {type: '1'}}) 
  	} else if(!isRightVersion && to.path !== '/tip') {
    	next({path: '/tip', query: {type: '2'}})
  	} else {
  		next()
  	}
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})