// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import Desktop from './Desktop'
import OS from './OS'
import router from './router'
import './stylesheet/main.css'

require('./dists/index')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#App',
  router,
  components: { OS },
  template: '<OS/>',
  beforeCreate(){
	  Vue.prototype.$os = this;
	  Vue.prototype.$os.iFrameCompat = {
		'pointer-events': 'auto'
	}
  }
})
