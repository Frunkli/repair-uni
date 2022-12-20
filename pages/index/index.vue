<template>
	<view class="content">
		<div class="search">
			<input type="text" placeholder="占位placeholder,需更改" />
			<div class="search-btn">搜索</div>
		</div>
		<div class="my-phone">
			<div class="my-phone-left">
				<image src="../../static/1571656510063_.pic.jpg" mode="heightFix"></image>
				<div>{{ phoneName }}</div>
			</div>
			<div class="my-phone-right">
				<div class="entry">选择其他设备型号 ></div>
			</div>
		</div>
		<view class="page-section swiper">
			<view>
				<swiper :indicator-dots="indicatorDots" :indicator-color="indicatorColor"
					:indicator-active-color="indicatorActiveColor" :autoplay="autoplay" :interval="interval"
					:duration="duration">
					<swiper-item v-for="(item, index) in swipperList" :key="index">
						<view>
							<!-- <image src="{{item}}" mode="widthFix" style="width: 750rpx;"></image> -->
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="repair">
			<view class="repair-item" v-for="item in repairClassList" :key="item.id" @click="test">
				<image src="../../static/1571656510063_.pic.jpg" mode="widthFix"></image>
				<span>手机维修</span>
			</view>
		</view>

		<!-- 服务流程 -->
		<view class="flowPath">
			<view class="flow-path-title">
				<view class="emp"></view>
				服务流程
			</view>
			<view class="flow-path-main">
				<view class="flow-path-top">
					<view class="top-item">
						<image class="img" src="../../static/文本.png"></image>
						<view>在线预约</view>
					</view>
					<view class="to">
						<image src="../../static/右箭头.png"></image>
					</view>
					<view class="top-item">
						<image class="img" src="../../static/电话_填充.png"></image>
						<view>客服致电</view>
					</view>
					<view class="to">
						<image src="../../static/右箭头.png"></image>
					</view>
					<view class="top-item">
						<image class="img" src="../../static/上门服务.png"></image>
						<view>按约服务</view>
					</view>
					<view class="to">
						<image src="../../static/右箭头.png"></image>
					</view>
					<view class="top-item">
						<image class="img" src="../../static/对话.png"></image>
						<view>报价维修</view>
					</view>
				</view>
				<view class="to-bottom">
					<image src="../../static/下箭头.png"></image>
				</view>
				<view class="flow-path-top">
					<view class="top-item">
						<image class="img" src="../../static/花 花朵 清新.png"></image>
						<view>客户评价</view>
					</view>
					<view class="to-bot">
						<image src="../../static/左箭头.png"></image>
					</view>
					<view class="top-item">
						<image class="img" src="../../static/维修1.png"></image>
						<view>完成服务</view>
					</view>
					<view class="to-bot">
						<image src="../../static/左箭头.png"></image>
					</view>
					<view class="top-item">
						<image class="img" src="../../static/文本.png"></image>
						<view>提供报价单</view>
					</view>
					<view class="to-bot">
						<image src="../../static/左箭头.png"></image>
					</view>
					<view class="top-item">
						<image class="img" src="../../static/出纳付款.png"></image>
						<view>修好付费</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cloudApi from "../../common/cloudApi.js"
	export default {
		data() {
			return {
				phoneName: '', // 本机机型
				userInfo: {}, // 用户信息
				indicatorDots: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				indicatorColor: "#292b40",
				indicatorActiveColor: "#ffffff",
				swipperList: [
					'../../static/1.jpeg',
					'../../static/2.jpeg',
					'../../static/3.jpeg',
				],
				repairClassList: [{
						id: 0,
						name: '手机维修',
						icon: '../../static/1571656510063_.pic.jpg'
					},
					{
						id: 1,
						name: '电脑维修',
						icon: '../../static/1571656510063_.pic.jpg'
					}
				]
			}
		},
		onLoad() {
			this.getSystemInfoForMyPhone()
		},
		methods: {
			/** 更新用户数据 */
			updataUserProfile() {
				uni.getUserProfile({
					desc: "提示信息",
					success: (res) => {
						console.log(res);
						this.userInfo = Object.assign(this.userInfo, res.userInfo);
						console.log(this.userInfo)
						cloudApi.call({
							name: "updateUserInfo",
							data: {
								userInfo: this.userInfo
							}
						})
					}
				})
			},
			/** 获取本机机型 */
			getSystemInfoForMyPhone() {
				uni.getSystemInfo({
					success: (res) => {
						if (res) {
							this.phoneName = res.deviceModel
						}
					},
					fail: (err) => {
						this.phoneName = '其他机型'
					}
				})
			},
			handlechange(e) {
				this.mycurrent = e.detail.current
			},
			test() {
				let obj = {
					a: 1,
					b: 2,
					c: [{
						a: 1,
						b: 2
					}]
				}
				uniCloud.callFunction({
					name: 'connectpc',
					data: obj
				}).then(res => {
					console.log(res)
				})
			}

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		background-color: #eee;
		width: 100%;
		/* height: 100vh; */
		overflow: hidden;
		color: #666;
	}

	.search {
		position: relative;
		width: 92%;
		margin-left: 4%;
		margin-right: 4%;
		margin-top: 20rpx;
		height: 80rpx;
	}

	.search input {
		background-color: #fff;
		position: absolute;
		top: 0;
		width: 92%;
		height: 80rpx;
		border-radius: 30px;
		padding-left: 50rpx;
	}

	.search-btn {
		color: #fff;
		background-color: #043764;
		position: absolute;
		top: 10rpx;
		right: 20rpx;
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 30px;
	}

	.my-phone {
		width: 96%;
		display: flex;
		margin-left: 2%;
		background-color: #fff;
		border-radius: 20px;
		margin-top: 40rpx;
		justify-content: space-around;
	}

	.my-phone-left {
		height: 200rpx;
		padding-top: 20rpx;
		padding-left: 20rpx;
		display: flex;
	}

	.my-phone-left image {
		height: 160rpx;
		border-radius: 10px;
	}

	.my-phone-left div {
		margin-left: 15rpx;
		margin-top: 15rpx;
	}

	.my-phone-right .entry {
		font-size: 12px;
		margin-top: 160rpx;
	}

	.banner {
		width: 750rpx;
		height: 388rpx;
		background-color: #0f0f27;
	}

	swiper {
		height: 388rpx;
	}

	.banner .swiper {
		width: 750rpx;
		height: 388rpx !important;
	}

	.banner .swiper-item {
		width: 750rpx;
		height: 388rpx !important;
	}

	.banner .swiper-item image {
		display: block;
	}

	.repair {
		width: 100%;
		height: 200rpx;
		display: flex;
		justify-content: space-between;
		justify-content: center;
		background-color: #fff;
		width: 96%;
		margin-left: 2%;
	}

	.repair-item {
		margin: 35rpx auto;
	}

	.repair-item image {
		width: 100rpx;

	}

	.repair-item span {
		font-size: 13px;
		display: block;
	}

	.flowPath .img {
		width: 60rpx;
		height: 70rpx;
	}

	.top-item {
		text-align: center;
	}

	.flowPath {
		width: 100%;
		font-size: 14px;
		/* color: #333; */
		margin-bottom: 80rpx;
	}

	.flow-path-top {
		width: 100%;
		display: flex;
		justify-content: space-around;
	}

	.to image {
		width: 40rpx;
		height: 40rpx;
		transform: translate(0, -20rpx);
	}

	.to-bot image {
		width: 40rpx;
		height: 35rpx;
		transform: translate(10rpx, -10rpx);
	}

	.to-bottom image {
		width: 35rpx;
		height: 35rpx;
	}

	.to-bottom {
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-right: 50rpx;
	}

	.to {
		display: flex;
		align-items: center;
	}

	.to-bot {
		display: flex;
		align-items: center;
	}

	.flow-path-title {
		font-size: 18px;
		display: flex;
	}

	.emp {
		width: 20rpx;
		height: 45rpx;
		background-color: #006d74;
		margin-right: 10rpx;
		margin-bottom: 40rpx;
	}
</style>
