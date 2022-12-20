<template>
	<view class="list">
		<view class="order-list" v-if="list.length">
			<view class="order-item" v-for="(item, index) in list" :key="index">
				<view class="order-item-top" @click="goDetail(item)">
					<view class="order-item-left">
						<image :src="item.orderInfo.icon" mode=""></image>
					</view>
					<view class="order-item-middle">
						<view class="title">{{item.orderInfo.equipmentType}}</view>
						<view class="content" v-for="(val, index) in item.resloveArr" :key="index">
							<span style="margin-right: 10rpx;"> {{val.resloveName}}&nbsp;&nbsp;&nbsp;</span>
							<span class="price">￥{{val.price}}</span>
						</view>
					</view>
					<view class="order-item-right">
						<span>￥{{item.orderIdInfo.allPrice}}</span>
					</view>
				</view>
				<view class="item-btn">
					<div class="btn" @click="buy(item)" v-if="!item.orderIdInfo.isPay">去付款</div>
					<div class="btn" @click="backMoney(item)" v-if="item.orderIdInfo.isPay && item.orderIdInfo.repairStatus === 0">申请退款</div>
					<div class="btn" v-if="item.orderIdInfo.isPay && item.orderIdInfo.repairStatus !== 0">进度查询</div>
					<div class="btn empty"></div>
				</view>
			</view>
		</view>
		<view class="emptys" v-else>
			<image src="../../../static/暂无数据.png" mode=""></image>
			<p>暂无订单</p>
		</view>
	</view>
</template>

<script>
	import { saveOtherOrder } from '@/models/index.js';
	export default {
		name: "orderContents",
		data() {
			return {
				list: [],
				userInfo: {}
			}
		},
		onLoad(option) {
			this.userInfo = getApp().globalData.userInfo;
		},
		methods: {
			goDetail(val) {
				uni.navigateTo({
					url: `/pages/orderInfo/orderInfo?id=${val.orderIdInfo._id}&isPay=${val.orderIdInfo.isPay}`
				})
			},
			/** 未付款订单付款 */
			buy(item) {
				let obj = {...item.orderIdInfo, ...item.orderInfo, ...item.payInfo}
				let orderId = item.orderIdInfo.orderId;
				let openid = this.userInfo.openid;
				let that = this;
				uniCloud.callFunction({
					name: 'getOrderInfo',
					data: {
						openid: openid,
						orderId,
					}, //支付所需要的参数，用于向云函数传递
					success(res) {
						uni.requestPayment({
							// #ifdef APP-PLUS
							provider: ‘wxpay’ // App端此参数必填，可以通过uni.getProvider获取
							// #endif
							// #ifdef APP-PLUS || MP-ALIPAY
							orderInfo: res.result.orderInfo,
							// #endif
							...res.result.orderInfo,
							success(resp) {
								that.saveOrder(res.result.orderInfo, orderId, openid, true, obj)
							},
							fail(err) {
								uni.showToast({
									title: '支付失败',
									icon: "none"
								})
								// that.saveOrder(res.result.orderInfo, orderId, this.userInfo.openid.openid, false)
							}
						})
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			/** 申请退款 */
			backMoney(val) {
				console.log(val)
			},
			/**
			 * @param res {Object} 支付接口订单返回信息
			 * @param id  {String} 订单号
			 * @param openid {String} 
			 * @param isPay {Boolean} 是否支付成功
			 * @param obj {Object} 当前行数据
			 * 订单存入数据库
			 */
			saveOrder(res, id, openid, isPay, obj) {
				let params = JSON.parse(JSON.stringify(obj));
				// 替换支付信息res => obj
				// params.remark = this.remark !== '' ? this.remark : params.remark
				// params.callNum = this.callNum !== '' ? this.callNum : params.callNum
				saveOtherOrder(params).then(resp => {
					if (resp.status == 200) {
						this.getInfo()
						// uni.navigateTo({
						// 	url: `/pages/orderInfo/orderInfo?id=${this.id}&isPay=true`
						// })
					} else {
						console.log(222)
					}
				})
			},
		},
		// onShow() {
		// 	console.log(this.tabIndex)
		// }
	}
</script>

<style lang="scss" scoped>
	.list {
		background-color: #f1f1f1;
		height: 100vh;
		overflow-y: scroll;
		.order-list {
			padding-top: 20rpx;
			border-radius: 20rpx;
			margin-bottom: 50rpx;
			.order-item {
				background-color: #ffffff;
				width: 96%;
				margin: 0 2%;
				margin-bottom: 15rpx;
				padding-top: 15rpx;
				border-radius: 15rpx;
				.order-item-top {
					display: flex;
					.order-item-left {
						width: 170rpx;
						height: 170rpx;
						background-color: #fff;
						overflow: hidden;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-left: 20rpx;
						image {
							width: 150rpx;
							height: 150rpx;
							border-radius: 20rpx;
						}
					}
					
					.order-item-middle {
						margin-top: 15rpx;
						margin-left: 20rpx;
						width: 380rpx;
						.title {
							font-weight: 600;
							font-size: 16px;
						}
						.content {
							span {
								color: #9d9d9d;
								font-size: 14px;
							}
							.price {
								transform: translate(5rpx,0);
							}
						}
					}
					
					.order-item-right {
						margin-top: 15rpx;
						width: 150rpx;
						position: relative;
						span {
							position: absolute;
							right: 40rpx;
							top: 30rpx;
							font-weight: 600;
							font: 15px/1.5 Tahoma,Helvetica,Arial,'宋体',sans-serif;
						}
					}
				}
				.item-btn {
					width: 100%;
					// height: 60rpx;
					display: flex;
					justify-content: flex-end;
					padding: 15rpx 20rpx 15rpx 0;
					box-shadow: border-box;
					.btn {
						height: 50rpx;
						line-height: 50rpx;
						border: 1px solid #003368;
						padding: 3rpx 20rpx;
						border-radius: 50rpx;
						margin-left: 15rpx;
					}
					.empty {
						width: 5rpx;
						height: 10rpx;
						padding: 0;
						opacity: 0;
					}
				}
				
			}		
		}
		.emptys {
			margin: 0 auto;
			width: 300rpx;
			height: 300rpx;
			image {
				width: 300rpx;
				height: 300rpx;
				margin-top: 20vh;
				transform: translate(-10rpx,0rpx);
			}
			p {
				text-align: center;
				font-size: 18px;
			}
		}
	}
</style>