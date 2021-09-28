<template>
	<!-- <transition name="outwindow" appear> -->
		<DragResize :isActive='true' ref="outwindow" v-show="open" v-on:resizing='resize' v-on:dragging='resize'
			@touchstart.native="disableFrame(true);sizeReset();enableSizAnim(false);" @mousedown.native="()=>{if(!maxed){disableFrame(true);sizeReset();enableSizAnim(false);}}" @stickClickDown="disableFrame(true);sizeReset();enableSizAnim(false)"
		    @touchend.native="disableFrame(false);enableSizAnim()" @mouseup.native="disableFrame(false);enableSizAnim()" @stickClickUp="disableFrame(false);enableSizAnim()"
			class="shadow viewonly" style="position: absolute; border: 2px solid grey; border-radius: 10px; background: rgba(200, 200, 255, 0.2);">
			<!-- <DragResize :isActive='true' v-if="border" v-on:resizing='resize' v-on:dragging='resize' class="shadow viewonly" style="position: absolute; border: 2px solid grey; border-radius: 10px; background: rgba(200, 200, 255, 0.2);"> -->
			<transition name='window' appear>
				<div class="window-frame" v-show='show' style="width: 100%; display: flex; flex-direction: column;">
					<div ref="titleBar" style="display: flex; width: 100%;" :style="{height: barHeight}" @dblclick="max"  @contextmenu.stop.prevent="onMenu">
						<div ref="icon" class='icon' style="background: none;" :style="{width: barHeight, height: barHeight}">
							<img class="fulfill" style="transform: scale(0.6)" :src="icon" alt="" />
						</div>
						<div class="center-parent" style="flex: 1;">
							<div ref='title'>{{ title }}</div>
						</div>
						<div ref="min" :style="{width: barHeight, height: barHeight}" class="center-parent btn" style="position: relative;" @mousedown.stop="" @dblclick.stop="" @click="enableSizAnim(),min()">
							<div class="btn center" style="background: yellow; width: 45%; height: 45%; border-radius: 50%; border: 1px solid black;"></div>
						</div>
						<div ref="max" :style="{width: barHeight, height: barHeight}" class="center-parent btn" style="position: relative;" @mousedown.stop="" @dblclick.stop="" @click.stop="enableSizAnim(),max()">
							<div class="btn center" style="background: green; width: 45%; height: 45%; border-radius: 50%; border: 1px solid black;"></div>
						</div>
						<div ref="cls" :style="{width: barHeight, height: barHeight}" class="center-parent btn" style="position: relative;" @mousedown.stop="" @dblclick.stop="" @click.stop="enableSizAnim(),close()">
							<div class="btn center" style="background: red; width: 45%; height: 45%; border-radius: 50%; border: 1px solid black;"></div>
						</div>
					</div>
					<div ref="content" style="flex: 1; border-radius: 8px; background: rgba(0,0,0,0.1);">
						<!-- <transition name='outwindow' appear> -->
							<iframe ref="body" v-show="content" :src="Src" frameborder="0" class="fulfill" style="border-radius: inherit;" :style="osStyle"></iframe>
						<!-- </transition> -->
					</div>
				</div>
			</transition>
			<div class='fulfill blurback' style="position: absolute; top: 0; z-index: -1; border-radius: inherit;"></div>
		</DragResize>
	<!-- </transition> -->
</template>

<script>
// import DragResize from 'vue-drag-resize'

export default {
	name: 'Window',
	data() {
		return {
			barHeight: '40px',
			show: true,
			// open: true,
			content: false,
			// visib: true,
			frame: false,
			maxed: false,
			Src: '',
			osStyle: this.$os.iFrameCompat
		}

	},
	components: {

	},
	props: {
		title: String,
		icon: String,
		url: String,
		pid: Number,
		maxSiz: Array,
		open: Boolean
	},
	mounted() {

		// register &touch events

		// function addEvents(events) {
		// 	events.forEach((cb, eventName) => {
		// 		document.documentElement.addEventListener(eventName, cb);
		// 	});
		// }

		// var domEvents = new Map([
        //     ['mousemove', this.move],
        //     ['mouseup', this.up],
        //     ['mouseleave', this.up],
        //     ['mousedown', this.deselect],
        //     ['touchmove', this.move],
        //     ['touchend', this.up],
        //     ['touchcancel', this.up],
        //     ['touchstart', this.up],
        // ]);

        // addEvents(domEvents);


		setTimeout(() => {
			this.content = true;
			this.Src = this.$os.appendWindowArg(this.url, 'pid', this.pid);
			// this.$os.postIn(this.$refs.body, 'PID', this.pid);
		}, 200);
		this.$refs.outwindow.maxWidth = this.maxSiz[0];
		this.$refs.outwindow.maxHeight = this.maxSiz[1];

		this.$on('requireClose', ()=>{
			this.close();
		})
	},
	// computed() {
	// },
	methods: {
		resize(rect) {
			// this.width = Math.min(rect.width, this.maxSiz[0]);
			// this.height = Math.min(rect.height, this.maxSiz[1]);
			// this.left = rect.left;
			// this.top = rect.top;
			if(!this.maxed) this.$refs.body.style.height = '' + (rect.height - 40) + 'px';
		},
		close() {
			// this.show = false;

			this.$refs.body.style.transition = 'height 0.2s';
			this.$refs.body.style.height = '0px';

			// this.visib = false;
			setTimeout(() => {
				this.show = false;
				setTimeout(() => {
					this.$emit('close');
				}, 200);
			}, 200);
		},
		max() {
			if (!this.maxed) {
				this.$refs.outwindow.cusWidth = '100%';
				this.$refs.outwindow.cusHeight = '100%';
				this.$refs.outwindow.cusLeft = '0px';
				this.$refs.outwindow.cusTop = '0px';
				this.$refs.body.style.height = null;
				this.maxed = true;
			} else this.sizeReset();
		},
		min() {
			// this.visib = false;
			this.$emit('min');
		},
		disableFrame(b) {
			this.$os.$emit('disableFrame', b);
		},
		sizeReset() {
			this.$refs.outwindow.cusWidth = this.$refs.outwindow.cusHeight = this.$refs.outwindow.cusLeft = this.$refs.outwindow.cusTop = null;
			this.$refs.body.style.height = null;
			this.maxed = false;
		},
		enableSizAnim(b = true) {
			this.$refs.outwindow.transition = b ? 'all .1s' : 'none';
		},
		onMenu(event){
			this.$contextmenu({
				items: [
					{ label: 'PID: '+this.pid }
				],
				event
			});
		}
	}
}
</script>

<style scoped>
/* .outwindow-enter-active,
.outwindow-leave-active {
	transition: opacity .2s;
} */

.outwindow {
	transition: opacity .2s;
}

.outwindow-enter,
.outwindow-leave-to {
	opacity: 0;
}

.outwindow-enter-to,
.outwindow-leave {
	opacity: 1;
}
</style>
