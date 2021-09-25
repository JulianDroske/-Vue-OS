var osApps = {
	'browser': {
		icon: (()=>require('@/icons/vue.png'))(),
		title: 'Browser'
	},
	'settings': {
		icon: (()=>require('@/icons/vue.png'))(),
		title: 'Settings'
	},
	'terminal': {
		icon: (()=>require('@/icons/vue.png'))(),
		title: 'Terminal'
	},
	'terminal2': {
		icon: (()=>require('@/icons/vue.png'))(),
		title: 'Terminal'
	},
	'terminal3': {
		icon: (()=>require('@/icons/vue.png'))(),
		title: 'Terminal'
	},
	'terminal4': {
		icon: (()=>require('@/icons/vue.png'))(),
		title: 'Terminal'
	},
	'terminal5': {
		icon: (()=>require('@/icons/vue.png'))(),
		title: 'Terminal'
	},
	'terminal6': {
		icon: (()=>require('@/icons/vue.png'))(),
		title: 'Terminal'
	},
}

export default{
	getAppList(){
		var apps = [];
		for(var pkg in osApps){
			var app = osApps[pkg];
			apps.push({
				pkg,
				name: app.title,
				icon: app.icon,
				url: '/#/@/apps/'+pkg
			});
		}

		return apps;
	}
}