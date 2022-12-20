<template>
	<view class="bgc">
		<view class="content">
			原因：<input type="text" v-model="query.reason">
			金额：<input type="text" v-model="query.price">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				query: {
					reason: '',
					price: '',
				}
			};
		}
	}
</script>

<style lang="less">
.bgc {
	background-color: #f1f1ff;
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	.content {
		width: 96%;
		margin-left: 2%;
	}
}
</style>
