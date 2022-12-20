<template>
	<view class="content">
		<view class="content-item order-info">
			<view class="content-item-title">门店信息</view>
			<view class="address">
				<view class="top">
					<span>百锐通科技(南水步行街店)</span>
				</view>
				<view class="bottom">
					<image class="img" src="../../static/地图.png" mode=""></image>
					<span>深圳市南山区南水路149号</span>
				</view>
				<view class="time">
					<span class="name">营业时间</span>
					<span class="clock">09:00 ~ 23:00</span>
				</view>
			</view>
		</view>
		<view class="content-item order-info">
			<view class="content-item-title">订单信息</view>
			<view class="info-content">
				<view class="left">
					<image :src="orderList[0].icon" mode=""></image>
				</view>
				<view class="right">
					<span>手机型号：{{orderList[0].equipmentType}}</span>
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
		</view>
		<view class="content-item remark">
			<view class="content-item-title">订单备注</view>
			<Textarea class="inputs" v-model="remark" placeholder="无特别要求" placeholder-style="color: #eee; font-size: 16px;"></Textarea>
			<view class="call-phone">
				<span>联系电话：</span>
				<input type="text" v-model="callNum">
			</view>
		</view>
		<view class="content-item">
			<view class="content-item-title">备注</view>
			<view style="font-size: 14px;">
				设备送修前请备份好您的资料，并准备好您的ID账号/密码，对于某些维修，需要用到您的ID/密码来还原设备；<br/>
				我们为您提供免费的资料备份服务及故障检修服务
			</view>
		</view>
		
		<view class="pay">
			<view class="pay-left">
				<span>总金额：</span>
				<span class="price">￥{{ allPrice }}</span>
				<view class="agreement">
					<checkbox value="ck" :checked="isCheck" @click="handleChange" style="transform:scale(0.7)" />
					<span>我已阅读并同意</span>
					<span class="link" @click="toAggreMent">《便家服务协议》</span>
				</view>
			</view>
			<view class="pay-right">
				<div @click="buy">下单</div>
				<!-- <div @click="testA">111</div> -->
			</view>
		</view>
	</view>
</template>

<script>
	import {
		WxPay
	} from 'yungouos-pay-uniapp-sdk'
	var that;
	import { saveOrder } from '@/models/index.js';
	export default {
		data() {
			return {
				orderList: [],
				isCheck: false,
				openid: '',
				requestStatus: false,
				remark: "",
				callNum: ''
			}
		},
		created() {
			that = this;
		},
		computed: {
			allPrice() {
				let price = 0;
				this.orderList.forEach(item => {
					price += Number(item.price)
				})
				return price
			}
		},
		methods: {
			testA() {
				let obj = {}
				for (let key in this.obj) {
					obj[key] = this.obj[key]
				}
				delete obj.id;
				delete obj.phoneId;
				delete obj._id;
			},
			/** 复选框 */
			handleChange(e) {
				this.isCheck = !this.isCheck
			},
			/** 跳转协议 */
			toAggreMent() {
				uni.navigateTo({
					url: '/pages/agreement/agreement'
				})
			},
			/** 生成订单号 */
			createOrderNum() {
				let dateTime = '';
				let yy = new Date().getFullYear();
				let MM = new Date().getMonth() + 1;
				let dd = new Date().getDate();
				let hh = new Date().getHours();
				let mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes():new Date().getMinutes();
				let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds():new Date().getSeconds();
				dateTime = 'BJ' + yy + MM + dd + hh + mm + ss + parseInt(Math.random() * 1000000);
				return dateTime;
			},
			/** 下单 */
			async buy() {
				let orderId = await this.createOrderNum()
				if (!this.callNum) {
					uni.showToast({
						icon: 'none',
						title: '请填写您的联系方式'
					})
					return
				}
				if (this.isCheck) {
					uniCloud.callFunction({
						name: 'getOrderInfo',
						data: {
							openid: this.openid,
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
									that.saveOrder(res.result.orderInfo, orderId, that.openid, true)
								},
								fail(err) {
									that.saveOrder(res.result.orderInfo, orderId, that.openid, false)
								}
							})
						},
						fail(err) {
							console.log(err)
						}
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '请勾选协议后下单'
					})
				}
			},
			/** 
			 * @param res {Object} 支付接口订单返回信息
			 * @param id  {String} 订单号
			 * @param openid {String} 
			 * @param isPay {Boolean} 是否支付成功
			 * 订单存入数据库
			 */
			saveOrder(res, id, openid, isPay) {
				let orderId = { 
					orderId: id, 
					openid: openid, 
					isPay: isPay, 
					allPrice: this.allPrice,
					remark: this.remark,
					callNum: this.callNum
				}
				let orderInfo = {}
				for (let key in this.orderList[0]) {
					orderInfo[key] = this.orderList[0][key]
				}
				delete orderInfo.id;
				delete orderInfo.phoneId;
				delete orderInfo._id;
				let nameArr = [];
				let priceArr = [];
				this.orderList.forEach(item => {
					nameArr.push(item.resloveName);
					priceArr.push(item.price);
				})
				orderInfo.resloveName = nameArr.join(';');
				orderInfo.price = priceArr.join(';');
				let params = {
					payInfo: res,
					orderIdInfo: orderId,
					orderInfo,
				}
				saveOrder(params).then(res => {
					if (res.status == 200) {
						uni.navigateTo({
							url: `/pages/orderInfo/orderInfo?id=${res.data.orderIdInfo._id}&isPay=${res.data.orderIdInfo.isPay}`
						})
					} else {
						console.log(222)
					}
				})
			},
		},
		
		onLoad(option) {
			this.orderList = JSON.parse(decodeURIComponent(option.obj));
			this.openid = getApp().globalData.openid;
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		background-color: #fff;
		position: relative;
		overflow-y: auto;
		width: 100%;
		box-sizing: border-box;
		padding-bottom: 160rpx;

		.content-item {
			background-color: #f5f7fa;
			width: 94%;
			padding: 20rpx 30rpx;
			border-radius: 10px;
			margin: 30rpx 3%;
			box-sizing: border-box;

			.content-item-title {
				width: 100%;
				font-weight: 600;
				margin-bottom: 15rpx;
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
		}
		
		.address {
			.top {
				font-size: 15px;
				margin-bottom: 6rpx;
			}
			.bottom {
				// display: flex;
				margin-bottom: 6rpx;
				.img {
					width: 35rpx;
					height: 35rpx;
					transform: translate(0, 6rpx);
					margin-right: 8rpx;
				}
				font-size: 14px;
			}
			
			.time {
				font-size: 14px;
				.name {
					margin-right: 30rpx;
				}
			}
		}

		.pay {
			width: 100%;
			border-top: 1px solid #f5f7fa;
			position: fixed;
			height: 120rpx;
			background-color: #fff;
			bottom: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.pay-left {
				margin-left: 30rpx;

				span {
					font-size: 15px;
				}

				.price {
					font-size: 18px;
					color: #043764;
				}

				.agreement {
					span {
						font-size: 13px;
					}

					.link {
						color: #043764;
					}
				}
			}

			.pay-right {
				margin-right: 30rpx;

				div {
					width: 160rpx;
					height: 70rpx;
					line-height: 70rpx;
					font-size: 17px;
					color: #fff;
					background-color: #043764;
					text-align: center;
					border-radius: 30px;
				}
			}
		}
	}
</style>
