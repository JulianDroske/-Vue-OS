<template>
	<div class="viewonly" style="text-align: center; color: white;" @mousedown.stop="">
		<dl class="fulfill">
			<dt><h1>{{title}}</h1></dt>
			<!-- <div> -->
			<Scroll style="width: 100%; height: 100%;">
				<transition-group name="list" appear>
					<dd v-for="(item,index) in items" :key="'item'+index" @click="ck(index)" class="btn btn-extend" style="position: relative;">
						<div class="center-parent fulfill">
							<img :style="{width: iconSiz, height: iconSiz}" :src="item.icon" />
							<h2>{{item.content}}</h2>
						</div>
					</dd>
				</transition-group>
			</Scroll>
			<!-- </div> -->
		</dl>
	</div>
</template>

<script>
import Scroll from './Scroll'

export default {
	name: 'List',
	props: {
		title: String
	},
	components: {
		Scroll
	},
	data() {
		return {
			items: [],
			iconSiz: '40px',
		}
	},
	methods: {
		push(icon, text, extra) {
			this.items.push({ icon, content: text, extraData: extra });
		},
		clear(index) {
			if (index == null) this.items = [];
			else this.items.splice(index, 1);
		},
		ck(index) {
			var item = this.items[index];
			this.$emit('itemClick', Object.assign({ icon: item.icon, name: item.content, index }, item.extraData));
		}
	}
}
</script>

<style scoped>
.btn {
	transition: all .5s;
}

/* .btn:hover {
	transition: all .5s;
	background-color: rgba(0,0,0,0.3);
} */

.list-enter-active,
.list-leave-active {
	transition: all 0.5s;
}

.list-enter,
.list-leave-to {
	opacity: 0;
	transform: translate(0, 100%);
}

.list-enter-to,
.list-leave {
	opacity: 1;
	margin-top: -10px;
}
</style>