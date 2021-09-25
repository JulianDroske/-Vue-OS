import Vue from 'vue'
import Router from 'vue-router'
import Desktop from '@/Desktop'
import Apps from '@/apps'

Vue.use(Router)

var routes = [
	{
		path: '/',
		name: 'Desktop',
		component: Desktop
	}
]


function initApps(){
	var apps = Apps.getAppList();
	for(var app of apps){
		routes.push({
			path: '/@/apps/'+app.pkg,
			name: app.name,
			component: (function(pkg){return ()=>import('@/apps/'+pkg);})(app.pkg)
		})
	}
}
initApps();

export default new Router({
//   mode: 'history',
  routes
})
