<template>
	<view class="content">
		<view class="top-tip" v-if="topShow">
			<view class="left">
				<image src="../../static/time.png" mode=""></image>
			</view>
			<view class="right">
				<div class="tip" v-if="isPay">交易完成</div>
				<div class="tip" v-else>等待付款</div>
				<div class="thanks">感谢您对便家的支持</div>
			</view>
			<div class="close" @click="closeTop">×</div>
		</view>
		<view class="penson-info">
			<view class="name-and-phone">
				<span class="name">维修人: 歪比巴卜</span>
				<span class="phone">{{orderInfo.callNum}}</span>
			</view>
			<view class="remark">备注: {{orderInfo.remark}}</view>
			
		</view>
		<view class="border-bottom">
			<div class="bo-for" v-for="index of 20" :key="index">
				<div class="bo-one"></div>
				<div class="bo-two"></div>
			</div>
		</view>
		<view class="content-item order-info">
			<view class="content-item-title">订单信息</view>
			<view class="info-content">
				<view class="left">
					<image :src="orderInfo.icon" mode=""></image>
				</view>
				<view class="right">
					<span>手机型号：{{orderInfo.equipmentType}}</span>
					<view class="right-content">
						<span>维修方案：</span>
						<view>
							<view class="right-list" v-for="item in orderList" :key="item._id">
								<span class="item-title">{{item.resloveName}}</span>
								<span class="item-price">价格：￥{{item.price}}</span>
							</view>	
						</view>						
					</view>									
				</view>
			</view>
			<view class="btns">
				<button open-type="contact">联系商家</button>
				<div class="empty"></div>
				<button style="color: #f24923;" v-if="isPay">申请退款</button>
			</view>
			<view class="pay-price">
				<span v-if="isPay">实付：</span>
				<span v-else>需付款：</span>
				<span style="color:#f24923">￥{{orderInfo.allPrice}}</span>
			</view>
		</view>
		<view class="content-item pays">
			<div>
				<span class="title">订单编号：</span>
				<span class="title-content">{{orderInfo.orderId}}</span>
			</div>
			<div>
				<span class="title">创建时间：</span>
				<span class="title-content">{{orderInfo.createTime | dataForm}}</span>
			</div>
			<div v-if="isPay">
				<span class="title">付款时间：</span>
				<span class="title-content">{{orderInfo.payTime | dataForm}}</span>
			</div>
		</view>
		<view class="content-item remark" v-if="remarkShow">
			<view class="content-item-title">订单备注</view>
			<Textarea class="inputs" v-model="remark" placeholder="无特别要求" placeholder-style="color: #eee; font-size: 16px;"></Textarea>
			<view class="call-phone">
				<span>联系电话：</span>
				<input type="text" v-model="callNum">
			</view>
		</view>
		<view class="pay-right" v-if="!isPay">
			<div class="btn1" @click="showRemark">修改备注</div>
			<div @click="buy">去付款</div>
		</view>
	</view>
</template>

<script>
	import { seeOrderInfo, saveOtherOrder } from '@/models/index.js';
	export default {
		data() {
			return {
				id: '',
				isPay: false,
				userInfo: {},
				orderInfo: {},
				orderList: [],
				callNum: '',
				remark: '',
				remarkShow: false,
				topShow: true,
			};
		},
		methods: {
			showRemark() {
				this.remarkShow = true;
			},
			closeTop() {
				this.topShow = false;
			},
			/** 获取订单信息 */
			getInfo() {
				seeOrderInfo(this.id).then(res => {
					if (res.status == 200) {
						const data = JSON.parse(JSON.stringify(res.data))
						let nameArr = data.resloveName.split(';')
						let priceArr = data.price.split(';')
						let obj = {
							resloveName: '',
							price: ''
						}
						for(let i = 0; i < nameArr.length; i++) {
							let obj1 = JSON.parse(JSON.stringify(obj))
							obj1.resloveName = nameArr[i];
							obj1.price = priceArr[i];
							this.orderList.push(obj1);
						}
						this.orderInfo = data
					}
				})
			},
			/** 未付款订单付款 */
			buy() {
				let orderId = this.orderInfo.orderId;
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
								that.saveOrder(res.result.orderInfo, orderId, openid, true)
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
			/**
			 * @param res {Object} 支付接口订单返回信息
			 * @param id  {String} 订单号
			 * @param openid {String} 
			 * @param isPay {Boolean} 是否支付成功
			 * 订单存入数据库
			 */
			saveOrder(res, id, openid, isPay) {
				let params = JSON.parse(JSON.stringify(this.orderInfo));
				params.remark = this.remark !== '' ? this.remark : params.remark
				params.callNum = this.callNum !== '' ? this.callNum : params.callNum
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
		onLoad(option) {
			this.id = option.id;
			this.isPay = option.isPay == 'false' ? false : true;
			this.getInfo()
			this.userInfo = getApp().globalData.userInfo;
		}
	}
</script>

<style lang="less">
.content {
	background-color: #f5f5f5;
	position: relative;
	overflow-y: auto;
	width: 100%;
	box-sizing: border-box;
	padding-bottom: 160rpx;
	height: 100vh;
	overflow: scroll;
	font-size: 14px;
	.top-tip {
		width: 100%;
		background-color: #fff7e5;
		display: flex;
		height: 150rpx;
		align-items: center;
		color: #666;
		position: relative;
		.left {
			height: 150rpx;
			width: 120rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 80rpx;
				height: 80rpx;
			}
		}
		.close {
			font-size: 16px;
			position: absolute;
			top: 15rpx;
			right: 20rpx;
		}
	}
	.penson-info {
		padding: 20rpx;
		background-color: #fff;
		.name-and-phone {	
			margin-bottom: 5rpx;
			.name {
				margin-right: 40rpx;
			}
		}
		
	}
	.border-bottom {
		display: flex;
		transform: translate(-10px,0px);
		.bo-for {
			display: flex;
			div {  
				width: 25rpx;   
				height: 12rpx;   
				transform:skew(-30deg); /*设置倾斜度为-30*/   
				-webkit-transform: skew(-30deg);   
				-moz-transform: skew(-30deg);   
				-o-transform:skew(-30deg);   
				-ms-transform:skew(-30deg);   
				background-color: #f24923;   
				margin-right: 10rpx; 
			}
			.bo-one {
				background-color: #00b6db;
			}
		}
	}
	.content-item {
		background-color: #fff;
		// width: 94%;
		padding: 20rpx 30rpx;
		// border-radius: 10px;
		margin: 30rpx 0;
		box-sizing: border-box;
	
		.content-item-title {
			width: 100%;
			font-weight: 600;
			margin-bottom: 15rpx;
		}
	}
	.order-info {
			.info-content {
				display: flex;

				.left {
					width: 170rpx;
					height: 170rpx;
					background-color: #fff;
					overflow: hidden;

					image {
						width: 170rpx;
						height: 170rpx;
					}
				}

				.right {
					span {
						margin-left: 40rpx;
						display: block;
						font-size: 15px;
						color: #666;
					}
					.right-content {
						display: flex;
						.right-list {
							.item-title{
								color: #333;
								margin-left: 0;
							}
							.item-price {
								margin-left: 0;
								font-size: 11px;
							}
						}
					}
				}
			}
			.btns {
				display: flex;
				justify-content: flex-end;
				padding: 10rpx 0;
				.empty {
					width: 30rpx;
					height: 1rpx;
				}
				button {
					display: inline-block;
					width: 160rpx;
					height: 60rpx;
					line-height: 60rpx;
					font-size: 14px;
					padding: 0 20rpx;
					border: #e2e2e2;
					margin: 0 !important;
				}			
			}
			.pay-price {
				display: flex;
				justify-content: flex-end;
			}
		}
	.remark {
		.inputs {
			background-color: #fcfcfc;
			border: 1px solid #eeeeee;
			height: 150rpx;
			width: 100%;
			border-radius: 8px;
			padding: 20rpx;
			box-sizing: border-box;
		}
		.call-phone {
			display: flex;
			width: 100%;
			padding-top: 20rpx;
			span {
				font-size: 14px;
				color: #666;
			}
			input {
				// background-color: #eeeeee;
				border-bottom: 1px solid #666;
			}
		}
	}
	.pays {
		color: #6b6b6b;
	}
	.pay-right {
				margin-right: 30rpx;
width: 100%;
			border-top: 1px solid #eee;
			position: fixed;
			height: 100rpx;
			background-color: #f5f5f5;
			bottom: 0;
			display: flex;
			justify-content: flex-end;
			align-items: center;
				div {
					width: 160rpx;
					height: 60rpx;
					line-height: 60rpx;
					font-size: 14px;
					color: #fff;
					background-color: #043764;
					border: 1px solid #fff;
					text-align: center;
					border-radius: 30px;
					margin-right: 20rpx;
				}
				.btn1 {
					background-color: #fff;
					color: #043764;
					border: 1px solid #043764;
				}
			}
}
</style>
