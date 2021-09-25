<template>
	<router-view class="fulfill">

	</router-view>
</template>

<script>
export default {
	mounted(){
		var onresize;
		window.onresize = onresize = () => this.$os.$emit('osResize', {width: document.documentElement.clientWidth, height: document.documentElement.clientHeight});
		onresize();
	}
}
</script>
