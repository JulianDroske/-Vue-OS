<template src="./terminal/index.html"></template>

<script>


export default {
	name: 'JsTerminal',
	mounted(){
		require('./terminal/terminal.js');

		update_user_title('/');
	}
}
</script>

<style src="./terminal/terminal.css"></style>
