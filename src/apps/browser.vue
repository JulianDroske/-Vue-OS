<template>
	<div class="fulfill" style='display: flex; flex-direction: column;'>
		<div ref="bar" style="display: flex;" :style="{height: bHeight}">
			<input type="text" ref="url" class="vinput" style="width: 100%; flex: 1;" @change="changeUrl" />
			<span class="btn center-parent viewonly" style="" :style="{width: bHeight, height: bHeight}" @click.stop="bMenu">=</span>
		</div>
		<div ref="content" style="flex: 1;">
			<iframe :src="url" @load="updateUrl" class="fulfill" frameborder="0" :style="osStyle"></iframe>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Browser',
	data(){
		return {
			bHeight: '40px',
			url: 'http://bing.com',
			osStyle: this.$os.iFrameCompat
		}
	},
	mounted(){
		
	},
	methods: {
		changeUrl(ev){
			this.url = ev.target.value;
		},
		updateUrl(ev){
			this.$refs.url.value = ev.target.src;
		},
		bMenu(ev){
			this.$os.$emit('disableFrame', true);
			this.$contextmenu({
				items: [{
					label: 'About...',
					onClick() {

					}
				}],
				x: ev.clientX,
				y: ev.clientY,
				onDestroy: ()=>{
					this.$os.$emit('disableFrame', false);
				}
			});
		}
	}
}
</script>

