<template>
	<view>
		<view class="tabs">
		 <view 
		  class="uni-tab-item" 
		  v-for="(tab,index) in tabBars"
		  :key="tab.id"
		 >
		  <text 
		   class="uni-tab-item-title"
		   :class="{tabActive: tabIndex==tab.id}"
		   @click="changeTab(tab.id)"
		  >
		   {{tab.name}}
		   <span class="tab-item-title-line"></span>
		   
		  </text>
		 </view>
		</view>
		<!-- 每个tab标题对应的具体组件内容 -->
		<orderContent ref="orderContent"></orderContent>
	</view>
</template>
 
<script>
	import orderContent from './component/orderContent.vue';
	import { getOrderList } from '@/models/index.js';
	export default {
		components:{
			orderContent
		},
		data() {
			return {
				tabIndex: 0,
				tabBars: [
					{
						id: 0,
						name: '待付款'
					},
					{
						id: 1,
						name: '待维修'
					},
					{
						id: 5,
						name: '维修中'
					},
					{
						id: 2,
						name: '售后/退换'
					},
					{
						id: 3,
						name: '全部订单'
					}
				],
				openid: ''
			}
		},
		watch: {
			tabIndex(newVal, oldVal) {
				this.getOrderInfo(newVal)
			}
		},
		methods:{
			/** 切换上方tab */
			changeTab(index) {
				this.tabIndex = index
			},
			/**
			 * @param index {Number} 订单类型
			 * 获取订单信息
			 */
			getOrderInfo(index) {
				if (this.openid) {
					getOrderList(this.openid).then(res => {
						if (res.status == 200) {
							if (res.data.length) {
								const {data} = JSON.parse(JSON.stringify(res))
								data.forEach(item => {
									let priceArr = [];
									let resloveNameArr = [];
									let arr = [];
									priceArr = item.orderInfo.price.split(';');
									resloveNameArr = item.orderInfo.resloveName.split(';');
									for (let i = 0; i < priceArr.length; i++) {
										arr.push({
											price: priceArr[i],
											resloveName: resloveNameArr[i]
										})
									}
									this.$set(item, 'resloveArr', arr)
								})
								if (index == 0) {
									let arr = data.filter(item => {
										return !item.orderIdInfo.isPay
									})
									this.$refs.orderContent.list = arr.reverse()
								} else if (index == 3) {
									this.$refs.orderContent.list = data.reverse()
								} else if (index == 1) {
									// 待维修
									let arr = data.filter(item => {
										return item.orderIdInfo.repairStatus === 0 && item.orderIdInfo.isPay
									})
									this.$refs.orderContent.list = arr.reverse()
								} else if (index == 5) {
									// 维修中
									let arr = data.filter(item => {
										return item.orderIdInfo.repairStatus === 1
									})
									this.$refs.orderContent.list = arr.reverse()
								}
								
							} else {
								this.$refs.orderContent.list = [];
							}						
						} else {
							
						}
					})
				}
			}
		},
		onLoad(option) {
			this.tabIndex = option.index
			this.openid = getApp().globalData.openid;
		}
	}
</script>
 
<style>
	.tabs{
	 display: flex;
	 flex: 1;
	 flex-direction: row;
	 overflow-x: scroll;
	 height: 100%;
	}
	.uni-tab-item{
	 width: 100%;
	 white-space: nowrap;
	 line-height: 80rpx;
	 height: 80rpx;
	 /* border-bottom: 1px solid #eee; */
	}
	.uni-tab-item-title{
	 color: #969696;
	 font-weight: bold;
	 font-size: 16px;
	 font-weight: 400;
	 width: 150rpx;
	 display: inline-block;
	 text-align: center;
	 color: #555;
	}
	.tabActive{
	 /* color: #043764; */
	 color: rgba(2,55,100,0.6);
	 font-weight: 500;
	 position: relative;
	}
	.tabActive ::after {
		content: '';
		width: 96%;
		height: 5rpx;
		border-radius: 6rpx;
		/* background-color: #043764; */
		background-color: skyblue;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 0rpx;
		z-index: 2;
	}
	.tabActive .tab-item-title-line{
	 display: block;
	 border-bottom: 4rpx solid #fede33;
	 border-top: 4rpx solid #fede33;
	 width: 86rpx;
	 margin: 0 auto;
	 border-radius: 40rpx;
	 margin-top: -10px;
	 background-color: #FEDE33;
	 box-sizing: border-box;
	}
</style>