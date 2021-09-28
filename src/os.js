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
	components: {
		OS
	},
	template: '<OS/>',
	beforeCreate() {
		var os = Vue.prototype.$os = Object.assign(this, {
			iFrameCompat: {
				'pointer-events': 'auto',
				'border-radius': '8px'
			},
			postOut(msg, data){
				window.parent.window.postMessage({msg, data}, '*');
			},
			postIn(element, msg, data){
				element.contentWindow.postMessage({msg, data}, '*');
			},
			appendWindowArg(url, key, value){
				url = url.toString();
				var pre = '?';
				if(url.endsWith('?')){
					pre = '&'
				}
				return url + pre + encodeURIComponent(key) + '=' + encodeURIComponent(value);
			},
			getWindowArgs(){
				var url = window.location.toString();
				var args = url.replace(new RegExp('\\S*\\?', 'g'), '').split('&');
				var obj = {};
				args.forEach(function(v, i){
					var o = v.split('=');
					obj[decodeURIComponent(o[0])] = decodeURIComponent(o[1]);
				})
				return obj;
			}
		});

		os.$on('disableFrame', (b)=>{
			os.iFrameCompat['pointer-events'] = b ? 'none' : 'all';
		})
	}
})
