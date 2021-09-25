<template>
	<div id="Desktop" class="fulfill" style="display: flex; flex-direction: column;" @click="closeStartMenu" @contextmenu.stop.prevent="onMenu">
		<!-- <router-view /> -->
		<div ref='windowsView' style="position: relative; width: 100%; height: 100%; z-index: 2;">
			<Window v-for="(tag,index) in windows" :key='tag.pid' :title="tag.title" :pid="tag.pid" :icon="tag.icon" :url="tag.url" :maxSiz='windowMaxSiz' :style="{'z-index': tag.zIndex}" :open="tag.open" @min='onMinWindow(index)' @close="onCloseWindow(index)" @mousedown.native="dragTop(index)"></Window>
		</div>
		<div id="bar" style="position: relative; bottom: 0px; width: 100%; background: rgba(0, 0, 0, 0.5); display: flex; flex: 1; color: white; z-index: 999;" :style="{ height: barHeight, 'border-radius': barRadius }">
			<div id="start" class="icon btn" @click.stop="toggleStartMenu" style="position: relative; background: rgba(0, 0, 0, 0.08)" :style="{ width: barHeight, height: barHeight }">
				<img src="./icons/vue.png" class="center" style="height: 60%; width: auto" alt="" />
			</div>
			<div ref="procs" style="display: flex; flex: 1; text-align: center; overflow: hidden;">
				<transition-group name='task' appear style="display: flex;">
					<div ref="task" v-for="(task,index) in windows" :key="task.pid" class="btn" style="flex: 1; width: 100vw;" :style="{height: barHeight, 'max-width': maxTskWidth}" @click="toggleWindow(index)">
						<div class="fulfill" style="display: flex;" :key="index">
							<div class='icon' style="background: none;" :style="{width: barHeight, height: barHeight}">
								<img class="fulfill" style="transform: scale(0.6);" :src="task.icon" alt="" />
							</div>
							<div class="center-parent" style="flex: 1; justify-content: normal;">
								<div>{{ task.title }}</div>
							</div>
						</div>
					</div>
				</transition-group>
			</div>
			<div id="clock" class="btn center-parent" style="margin-left: 10px; margin-right: 10px">
				<div style="text-align: center">
					{{ time }} <br /> {{ date }}
				</div>
			</div>
			<div id="2desk" class="btn" style="width: 10px; height: 100%; border-left: 1px solid white"></div>
		</div>
		<Wallpaper class="viewonly"></Wallpaper>
		<StartMenu ref="startmenu" class="center" style="position: absolute; z-index: 4;" :style="{width: sizMin, height: sizMin}"></StartMenu>
	</div>
</template>

<script>
import Wallpaper from "./components/Wallpaper.vue";
import StartMenu from './components/StartMenu.vue';
import Window from './components/Window.vue'

export default {
	name: "Desktop",
	components: {
		Wallpaper,
		StartMenu,
		Window
	},
	data() {
		var barHeight = 50;
		let dat = {
			windows: [],
			windowMaxSiz: [null, null],
			pid: 0,
			time: null,
			date: null,
			lastTop: -1,
			startMenu: false,
			sizMin: '' + Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight) + 'px'
		};

		dat['barHeight'] = '' + barHeight + 'px';
		dat['barRadius'] = '' + (barHeight / 2) | 0 + 'px';
		dat['maxTskWidth'] = '' + barHeight * 4 + 'px';

		return dat;
	},
	mounted() {
		// TODO optimize

		var setTimeDate = () => {
			var D = new Date();
			var d = [
				D.getHours(),
				D.getUTCMinutes(),
				D.getSeconds(),
				D.getFullYear(),
				D.getMonth() + 1,
				D.getDay(),
			];
			d.forEach((v, index) => {
				d[index] = v > 9 ? "" + v : "0" + v;
			});
			// this.time = `${d[0]}:${d[1]}:${d[2]}`;
			this.time = `${d[0]}:${d[1]}`;
			this.date = ` ${d[3]}/${d[4]}/${d[5]}`;
		}

		setTimeout(() => {
			setInterval(setTimeDate, 60000);
		}, (60 - new Date().getSeconds()) * 1000);

		setTimeDate();

		// window.onresize = () => {
		// 	this.sizMin = '' + Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight) + 'px';
		// }

		this.$os.$on('osResize', this.refreshSiz)

		document.onkeyup = (e) => {
			console.log(e.key, e.ctrlKey)
			switch (e.key) {
				case 'Shift':
					this.toggleStartMenu();
					break;
				case 'Escape':
					this.closeStartMenu();
			}
		}

		this.$os.$on('openApp', appName => {
			this.openApp(appName);
		})

		this.$os.$on('disableFrame', this.disFrame);
	},
	methods: {
		openApp(app) {
			this.windows.push({
				id: 'win',
				icon: app.icon,
				title: app.name,
				url: app.url,
				zIndex: 2,
				pid: this.pid++,
				open: true
			});
			this.closeStartMenu();
		},
		dragTop(i) {
			if (this.lastTop != i) {
				if (this.lastTop != -1 && this.lastTop < this.windows.length) this.windows[this.lastTop].zIndex = 2;
				this.windows[i].zIndex = 999;
				this.lastTop = i;
			}
		},
		closeStartMenu() {
			this.$refs.startmenu.toggle(this.startMenu = false);
		},
		toggleStartMenu() {
			this.$refs.startmenu.toggle(this.startMenu = !this.startMenu);
		},
		disFrame(dis) {
			this.$os.iFrameCompat['pointer-events'] = dis ? 'none' : 'all';
		},
		disableFrame() {
			// this.$os.$emit('disableFrame', true);
			this.disFrame(true);
		},
		enableFrame() {
			// this.$os.$emit('disableFrame', false);
			this.disFrame(false);
		},
		refreshSiz(siz) {
			this.sizMin = '' + Math.min(siz.width, siz.height) + 'px';
			this.windowMaxSiz = [this.$refs.windowsView.clientWidth, this.$refs.windowsView.clientHeight];
		},
		toggleWindow(index){
			this.windows[index].open = !this.windows[index].open;
		},
		onMinWindow(index){
			this.windows[index].open = false;
		},
		onCloseWindow(index) {
			this.windows.splice(index, 1);
		},
		onMenu(event) {
			this.$contextmenu({
				items: [{
					label: 'About',
					onClick() {

					}
				}],
				event
			});
			return true;
		}
	}
};
</script>
