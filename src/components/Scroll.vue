<template>
	<div ref="T" class="fulfill" style="position: absolute; overflow: hidden; height: auto;" @mouseover="onOver" @mouseleave="onLeave">
		<div ref="content" style="position: relative; transition: top .1s, left .1s;" :style="{top: cTop}" @mousewheel="(event)=>mouseScroll({x: event.deltaX+0, y: event.deltaY+0})">
			<slot></slot>
		</div>
		<transition appear>
			<div ref="bar" class="bar" v-show="needScroll" style="position: absolute; background: rgba(0,0,0,0.8); right: 0px; width: 20px; border-radius: 10px; transition: opacity 0.2s;" :style="{height: bHeight, top: bTop}" @mousedown.stop="" @click.stop=""></div>
		</transition>
	</div>
</template>

<script>
export default {
	data() {
		return {
			bHeight: '100%',
			bTop: '0px',
			cTop: '0px',
			needScroll: false,
			moveScale: 5,
			nowPosY: 0,	// always positive

		}
	},
	mounted() {
		this.$refs.content.addEventListener('DOMMouseScroll', (event) => {
			this.mouseScroll({
				x: event.axis == 1 ? event.detail + 0 : 0,
				y: event.axis == 2 ? event.detail + 0 : 0
			});
		});
	},
	methods: {
		mouseScroll(d) {
			// for y
			var x = Math.sign(d.x)*this.moveScale, y = Math.sign(d.y)*this.moveScale;
			this.scrollBy(y);
		},
		scrollTo(y){
			if(y<0) y = 0;
			if(y>100) y = 100;

			// move bar
			var bTheight = this.$refs.T.offsetHeight;
			var bheight = this.$refs.bar.offsetHeight;
			this.bTop = '' + ((bTheight-bheight)*y/100) + 'px';

			// move content
			// var cTheight = this.$refs.T.offsetHeight;
			var cheight = this.$refs.content.offsetHeight;
			this.cTop = '' + ((bTheight-cheight)*y/100) + 'px';

			this.nowPosY = y;

		},
		scrollBy(y){
			this.scrollTo(this.nowPosY + y);
		},
		onOver(e) {
			var innerH = this.$refs.content.offsetHeight;
			var outerH = this.$refs.T.offsetHeight;
			if (innerH > outerH) {
				this.needScroll = true;
				this.bHeight = '' + (((outerH / innerH)*100)|0) + '%';
			} else {
				this.needScroll = false;
			}
		},
		onLeave(e) {
		}
	}
}
</script>

<style scoped>

.v-enter, .v-leave-to {
	opacity: 0;
}

</style>
