<template>
	<div style='width: 100%; height: 100%;'>
		<JsTerminal class='fulfill'></JsTerminal>
	</div>
</template>

<script>

export default {
	name: 'Terminal',
	data(){
		return {
			pid: undefined
		}
	},
	mounted(){
		Focus();

		this.pid = this.$os.getWindowArgs().pid;

		register_cmd('exit', (params)=>{
			this.$os.postOut('closeWindow', this.pid);
		});

		window.exec = (cmd) => {
			window.eval(cmd);
		}

		register_cmd('jsh', (params, io)=>{
			var hint = '> ';
			io.scan(hint, (text)=>{
				if(text.trim() == '.exit'){
					io.end();
					return true;
				}
				window.println = (...args) => {
					var txt = '';
					for(var t of args){
						txt += t.toString() + '\t';
					}
					txt = txt.trim();
					io.println(txt);
				}
				io.println(hint + text);
				try{
					eval(window.exec(text));
				}catch(e){
					io.println(e);
				}
				window.println = undefined;
			})
			io.println('Welcome to the javascript single-line shell.');
			io.println('Use println() to output texts.');
			io.println('Type .exit to exit this shell.');
			io.println('');
		});
	}
}
</script>
