<template>
	<div ref="T" class="fulfill" style="position: absolute; overflow: hidden; height: auto;" @mouseover="onOver" @mouseleave="onLeave" @mousedown="down" @mouseup.stop="up" @mouseenter="check()">
		<div ref="content" style="position: relative; transition: none;" :style="{top: cTop, left: cLeft}" @mousewheel="(event)=>mouseScroll({x: event.deltaX+0, y: event.deltaY+0})">
			<slot></slot>
		</div>
		<transition-group name="l" appear>
			<div ref="barX" id="barX" class="bar" key='barX' v-show="needScrollX" style="position: absolute; background: rgba(0,0,0,0.8); bottom: 10px; height: 20px; border-radius: 10px; transition: opacity 0.2s;" :style="{width: bWidth, left: bLeft}"
				@mousedown.stop.prevent="down" @mousemove.stop.prevent="move" @mouseup.stop.prevent="up" @click.stop.prevent="up"></div>
			<div ref="barY" id="barY" class="bar" key='barY' v-show="needScrollY" style="position: absolute; background: rgba(0,0,0,0.8); right: 10px; width: 20px; border-radius: 10px; transition: opacity 0.2s;" :style="{height: bHeight, top: bTop}"
				@mousedown.stop.prevent="down" @mousemove.stop.prevent="move" @mouseup.stop.prevent="up" @click.stop.prevent="up"></div>
		</transition-group>
	</div>
</template>

<script>
export default {
	data() {
		return {
			bHeight: '100%',
			bTop: '0px',
			cTop: '0px',
			bWidth: '100%',
			bLeft: '0px',
			cLeft: '0px',
			needScrollX: false,
			needScrollY: false,
			moveScale: 5,
			nowPosX: 0,
			nowPosY: 0	// always positive
		}
	},
	mounted() {
		this.$refs.content.addEventListener('DOMMouseScroll', (event) => {
			this.mouseScroll({
				x: event.axis == 1 ? event.detail + 0 : 0,
				y: event.axis == 2 ? event.detail + 0 : 0
			});
		});

		function addEvents(events) {
			events.forEach((cb, eventName) => {
				document.documentElement.addEventListener(eventName, cb);
			});
		}

		var domEvents = new Map([
            ['mousemove', this.move],
            ['mouseup', this.up],
            // ['mouseleave', this.up],
            // ['mousedown', this.down],
            ['touchmove', this.move],
            ['touchend', this.up],
            ['touchcancel', this.up],
            ['touchstart', this.down],
        ]);

        addEvents(domEvents);
	},
	methods: {
		mouseScroll(d) {
			// for y
			var x = Math.sign(d.x)*this.moveScale, y = Math.sign(d.y)*this.moveScale;
			this.scrollBy(x, y);
		},
		p2pY(pixel){
			return pixel *100 / (this.$refs.content.clientHeight - this.$refs.T.clientHeight);
		},
		p2pX(pixel){
			return pixel *100 / (this.$refs.content.clientWidth - this.$refs.T.clientWidth);
		},
		b2pX(pixel){
			return pixel * 100 / ( this.$refs.T.clientWidth - this.$refs.barX.clientWidth );
		},
		b2pY(pixel){
			return pixel * 100 / ( this.$refs.T.clientHeight - this.$refs.barY.clientHeight );
		},
		scrollTo(x, y){
			// x, y are for content, not for bar

			if(x<0) x = 0;
			if(y<0) y = 0;
			if(x>100) x = 100;
			if(y>100) y = 100;

			// move bar
			var bTwidth = this.$refs.T.clientWidth;
			var bwidth = this.$refs.barX.clientWidth;
			this.bLeft = '' + ((bTwidth-bwidth)*x/100) + 'px';
			// this.bLeft = '' + x + '%';

			var bTheight = this.$refs.T.clientHeight;
			var bheight = this.$refs.barY.clientHeight;
			this.bTop = '' + ((bTheight-bheight)*y/100) + 'px';
			// this.bTop = '' + y + '%';

			// move content

			var cwidth = this.$refs.content.clientWidth;
			this.cLeft = '' + ((bTwidth-cwidth)*x/100) + 'px';
			// this.cLeft = '' + -x + '%';

			var cheight = this.$refs.content.clientHeight;
			this.cTop = '' + ((bTheight-cheight)*y/100) + 'px';
			// this.cTop = '' + -y + '%';

			this.nowPosX = x;
			this.nowPosY = y;

		},
		scrollBy(x, y, type){
			// nowPosY is percent while y is pixel
			switch(type){
				default: this.scrollTo(this.nowPosX + x, this.nowPosY + y); break;
				case 1: this.scrollTo(this.nowPosX + this.p2pX(x), this.nowPosY + this.p2pY(y)); break;
				case 2: this.scrollTo(
					this.nowPosX + this.b2pX(x),
					this.nowPosY + this.b2pY(y)
					); break;
			}
		},
		isOnBarX(ev){
			return ev.target.id == 'barX';
		},
		isOnBarY(ev){
			return ev.target.id == 'barY';
		},
		isOnBar(ev){
			return this.isOnBarX(ev) || this.isOnBarY(ev);
		},
		down(ev){
			if(this.isOnBarX(ev)) this.barMovX = true;
			else if(this.isOnBarY(ev)) this.barMovY = true;
			else this.mov = true;
			this.startX = ev.clientX;
			this.startY = ev.clientY;
		},
		move(ev){
			// this.check();
			// var bB = this.isOnBar(ev);
			if(!this.mov && !this.barMovX && !this.barMovY) return;
			var movementX = ev.clientX - this.startX;
			var movementY = ev.clientY - this.startY;
			this.startX = ev.clientX;
			this.startY = ev.clientY;
			// if(!!this.mov == bB || this.barMov == !bB) return;
			if(ev.preventDefault) ev.preventDefault();
			if(ev.stopPropagation) ev.stopPropagation();
			// this.scrollBy(this.barMovX?movementX:-movementX, this.barMovY?movementY:-movementY, this.isOnBar(ev)+1);
			this.scrollBy(this.barMovX?movementX:-movementX, this.barMovY?movementY:-movementY, (this.barMovX || this.barMovY)+1);
		},
		up(ev){
			if(this.barMovX || this.barMovY || this.mov){
				if(ev.preventDefault) ev.preventDefault()
				if(ev.stopPropagation) ev.stopPropagation()
			}
			this.barMovX = this.barMovY = false;
			this.mov = false;
		},
		check(){
			var innerW = this.$refs.content.clientWidth;
			var outerW = this.$refs.T.clientWidth;
			if (innerW > outerW) {
				this.needScrollX = true;
				this.bWidth = '' + (((outerW / innerW)*100)|0) + '%';
			} else {
				this.needScrollX = false;
			}

			var innerH = this.$refs.content.clientHeight;
			var outerH = this.$refs.T.clientHeight;
			if (innerH > outerH) {
				this.needScrollY = true;
				this.bHeight = '' + (((outerH / innerH)*100)|0) + '%';
			} else {
				this.needScrollY = false;
			}
		},
		onOver(e) {
			this.check()
		},
		onLeave(e) {
			// this.up()
			this.check()
		}
	}
}
</script>

<style scoped>

.l-enter, .l-leave-to {
	opacity: 0;
}

</style>
