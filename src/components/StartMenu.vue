<template>
	<transition name="window" appear>
		<div class="fulfill" v-show="show1" @click.stop="">
			<transition name="window-center" appear>
				<div v-show="show2" class="center fulfill shadow-big blurback round" style="background: rgba(0,0,0,0.2); transition: all .4s" @click="thide">
					<List ref="appList" class="fulfill" style="transform: scale(0.5); border-radius: 10px; font-size: 200%; width: auto;" title="Start" @itemClick="openApp" @click.native.stop=""></List>
				</div>
			</transition>
		</div>
	</transition>
</template>

<script>
// import Window from './Window'
import List from './List'

import Apps from '@/apps'

export default {
	name: 'StartMenu',
	components: {
		List
	},
	data() {
		return {
			show1: false,
			show2: false
		}
	},
	methods: {
		tshow() {
			this.show1 = true;
			this.show2 = true;
			// init list
			this.$refs.appList.clear();
			var apps = Apps.getAppList();
			for(var app of apps){
				this.$refs.appList.push(app.icon, app.name, {url: app.url});
			}
		},
		thide() {
			this.show1 = false;
			// this.show2 = false;
		},
		toggle(show) {
			if (show) this.tshow();
			else this.thide();
		},
		openApp(d){
			this.$os.$emit('openApp', d);
		}
	},
	// extends: Window
}
</script>

<style scoped>
.window-center-enter-to, .window-center-leave {
	opacity: 0.5;
	width: 120%;
	height: 120%;
	border-radius: 0%;
	/* rotate: 0deg; */
}

.window-center-enter {
	opacity: 0;
	width: 0%;
	height: 0%;
	margin-top: 20%;
	border-radius: 50%;
	/* rotate: -90deg; */
}

.window-center-leave-to {
	/* rotate: 90deg; */
	opacity: 0%;
	width: 0%;
	height: 0%;
}
</style>
