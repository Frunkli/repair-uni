<template>	
	<view class="content">
		<div class="userinfo">
			<div class="userinfo-left">
				<div>
					<image v-if="userInfo._id" :src="userInfo.avatarUrl"></image>
					<image v-else src="../../static/用户_填充.png" mode=""></image>					
				</div>				
			</div>
			<div class="userinfo-right">
				<h1 v-if="userInfo._id">{{userInfo.nickName}}</h1>
				<h1 v-else @click="updataUserProfile">登录 ></h1>				
			</div>
		</div>
		<div class="order">
			<div class="order-item" @click="goOrder(0)">
				<image src="../../static/待付款.png" mode=""></image>
				<p>待付款</p>
				<div class="number" v-if="notPayList.length !== 0">{{notPayList.length}}</div>
			</div>
			<div class="order-item" @click="goOrder(1)">
				<image src="../../static/待维修.png" mode=""></image>
				<p>待维修</p>
				<div class="number" v-if="repairList.length !== 0">{{repairList.length}}</div>
			</div>
			<div class="order-item" @click="goOrder(2)">
				<image src="../../static/发言.png" mode=""></image>
				<p>售后/退换</p>
			</div>
			<div class="order-item" @click="goOrder(3)">
				<image src="../../static/订单.png" mode=""></image>
				<p>全部订单</p>
			</div>
		</div>
		<div class="list">
			<div class="list-item item-one" @click="callUs">
				<div class="list-item-left">联系我们</div>
				<div class="list-item-right"> > </div>
			</div><div class="list-item item-one" @click="goAddPic">
				<div class="list-item-left">添加图片</div>
				<div class="list-item-right"> > </div>
			</div>
			<div class="list-item">
				<div class="list-item-left">
					<button class="btn" open-type="contact" style="border: none">联系客服</button>
				</div>
				<div class="list-item-right"> > </div>
			</div>
		</div>
	</view>
</template>

<script>
	import cloudApi from "../../common/cloudApi.js";
	import { getOrderList, deleteOverTimeOrder } from '@/models/index.js';
	export default {
		data() {
			return {
				userInfo: {},
				notPayList: [], // 待付款
				repairList: [],  // 待维修
			}
		},
		async onLoad(options) {
			uni.login({
				provider:"weixin",
				success: (res) => {
					let code = res.code;
					
					cloudApi.call({
						name: "login",
						data: {
							code: code
						},
						success: (res) => {
							this.userInfo = res.result;
							getApp().globalData.userInfo = this.userInfo;
							getApp().globalData.openid = this.userInfo.openid
							this.getOrderInfo()
						}
					})
				}
			})
		},
		methods: {
			/** 更新用户数据 */
			updataUserProfile() {
				uni.getUserProfile({
					desc: "提示信息",
					success: (res) => {
						this.userInfo = Object.assign(this.userInfo, res.userInfo);
						getApp().globalData.openid = this.userInfo.openid;
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
			/** 联系我们 */
			callUs() {
				wx.makePhoneCall({
					phoneNumber: '137-9858-3028',
				}).catch(e => {})
			},
			goOrder(num) {
				uni.navigateTo({
					url: `/pages/orders/orders?index=${num}`
				})
			},
			goAddPic() {
				uni.navigateTo({
					url: '/pages/uploadPic/index'
				})
			},
			/** 获取我的订单 */
			getOrderInfo() {
				if (this.userInfo.openid) {
					getOrderList(this.userInfo.openid).then(res => {
						if (res.status == 200) {
							if (res.data.length) {
								const {data} = JSON.parse(JSON.stringify(res))
								let notPayList = data.filter(item => {
									return !item.orderIdInfo.isPay
								})
								let repairList = data.filter(item => {
									return item.orderIdInfo.repairStatus === 0 || item.orderIdInfo.repairStatus === 1
								})
								this.repairList = repairList;
								let time = new Date().getTime()
								notPayList.forEach(item => {
									if (Number(item.orderIdInfo.createTime) + 86400000 > time) { 
										// 未超过24小时不予处理
										this.notPayList.push(item)
									} else {
										// 超过24小时超时处理 删除超时订单
										deleteOverTimeOrder(item.orderIdInfo._id).then(resp => {
											
										})
									}
								})
								// data.forEach(item => {
								// 	let priceArr = [];
								// 	let resloveNameArr = [];
								// 	let arr = [];
								// 	priceArr = item.orderInfo.price.split(';');
								// 	resloveNameArr = item.orderInfo.resloveName.split(';');
								// 	for (let i = 0; i < priceArr.length; i++) {
								// 		arr.push({
								// 			price: priceArr[i],
								// 			resloveName: resloveNameArr[i]
								// 		})
								// 	}
								// 	this.$set(item, 'resloveArr', arr)
								// })
								// if (index == 0) {
								// 	let arr = data.filter(item => {
								// 		return !item.orderIdInfo.isPay
								// 	})
								// 	this.$refs.orderContent.list = arr.reverse()
								// } else if (index == 3) {
								// 	this.$refs.orderContent.list = data.reverse()
								// }
								
							} else {
								// this.$refs.orderContent.list = [];
							}						
						} else {
							
						}
					})
				}
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
		height: 100vh;
		overflow: hidden;
	}
	
	.userinfo {
		display: flex;
		height: 260rpx;
		width: 100%;
	}
	.userinfo-left {
		width: 40%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.userinfo-left div {
		width: 180rpx;
		height: 180rpx;
		border-radius: 50%;
		border: 1px solid #515151;
	}
	.userinfo-left div image {
		width: 180rpx;
		height: 180rpx;
		border-radius: 50%;
	}
	.userinfo-right {
		width: 70%;
		display: flex;
		align-items: center;
	}
	.userinfo-right h1 {
		font-size: 18px;
	}
	
	.order {
		height: 120rpx;
		width: 100%;
		display: flex;
		align-items: center;
	}
	.order-item {
		flex: 1;
		text-align: center;
		position: relative;
	}
	.order-item image {		
		width: 60rpx;
		height: 60rpx;
	}
	.order-item p {
		font-size: 12px;
	}
	.order-item .number {
		position: absolute;
		top: -8rpx;
		right: 45rpx;
		background-color: #ff7100;
		color: #fff;
		border-radius: 50%;
		width: 34rpx;
		height: 34rpx;
		text-align: center;
		line-height: 34rpx;
	}
	.list {
		width: 94%;
		border-radius: 4px;
		margin-left: 3%;
		background-color: #fff;
		margin-right: 3%;
		color: #666;
		margin-top: 50rpx;
	}
	.list-item {
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  height: 90rpx;
	}
	.list-item-left {
	  margin-left: 30rpx;
	}
	.list-item-right {
	  margin-right: 30rpx;
	}
	.item-one {
		border-bottom: 1px solid #eee;
	}
	.btn {
		color: #666;
		background-color: #fff;
		height: 86rpx;
		margin: 2rpx 0;
		font-size: 17px;
		padding-left: 0;
		padding-right: 486rpx;
	}
	button::after{
	  border: none;
	}

</style>
