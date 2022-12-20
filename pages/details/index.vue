<template>
	<view class="classify">
		<!-- 分类部分 -->
		<view class="cate-left">
			<view class="type">
				<view class="type-name">{{defaultObj.typeName}}</view>
				<view class="equipment-type">{{defaultObj.equipmentType}}</view>
			</view>
			<view :class="['cate-item',activeIndex==index?'active':'']" v-for="(item,index) in typeNameList" :key="index"
				@click="changeActive(item,index)">{{item}}</view>
		</view>

		<view class="cate-right">
			<image :src="defaultObj.icon" mode=""></image>
			<view class="reslove-item" v-for="(item,index) in serviceList" :key="index">
				<view class="left"  @click="gotoBuy(item)">
					<view class="reslove-name">{{ item.resloveName }}</view>
					<view class="desc">{{ item.desc }}</view>
					<view class="warranty-period">保修期： {{ item.warrantyPeriod }}</view>
					<view class="price"><span>预估价格：</span>￥{{ item.price }}</view>
				</view>
				<view class="right">
					<view v-if="item.resloveName == '工程师咨询'"> > </view>
					<view class="add" v-else-if="!item.isClick" @click="addOptions(item, 'add')">+</view>			
					<view class="reduce" v-else @click="addOptions(item,'reduce')">-</view>
				</view>				
			</view>		
		</view>
		
		<view class="allPrice" v-if="showAllPrice">
			<view class="left">预估费用：￥{{ allPrice }}</view>
			<view class="right" @click="goAllBuy">去下单</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop: 0,
				// 初始化的分类列表
				navList: [],
				defaultObj: {},
				// 当前点击项的索引号
				activeIndex: 0,
				activeTypeIndex: 0,
				// 分类下的商品信息
				typeNameList: [],
				serviceList: [],
				carList: []
			};
		},
		computed: {
			/** 显示全部价格 */
			showAllPrice () {
				if (this.carList.length) {
					return true
				} else {
					return false
				}
			},
			/** 总价格 */
			allPrice () {
				if (this.carList.length) {
					let price = 0;
					this.carList.forEach(item => {
						price+=Number(item.price)
					})
					return price
				} else {
					return 0
				}
			}
		},
		methods: {
			/** 获取默认数据 */
			getcateList() {
				uni.request({
					url: `https://d182cd49-8915-433c-886a-9bc554830d29.bspapp.com/queryRepairMethods?id=${this.defaultObj.id}`
				}).then(res => {	
					if (res[1].data.length) {
						this.navList = res[1].data
						this.navList.push({
							problemType: '其他问题',
							resloveName: '工程师咨询',
							warrantyPeriod: '0年',
							price: '待定',
							_id: '01',
							phoneId: this.defaultObj.id
						})
						let list = []
						this.navList.forEach(item => {
							list.push(item.problemType)
						})
						list = [...new Set(list)]
						this.typeNameList = list
						this.changeActive(this.typeNameList[0], 0)
					} else {
						this.navList = [];
					}					
				})
			},
			/** 更改点击项的索引号 */
			changeActive(val, index) {
				this.activeIndex = index
				let list = []
				this.navList.forEach(item => {
					if (item.problemType == val) {
						this.$set(item, 'isClick', false)
						list.push(item)
					}
				})
				this.serviceList = JSON.parse(JSON.stringify(list));
			},
			/** 点击下单 */
			gotoBuy(val) {
				let obj = {...val, ...this.defaultObj}
				let arr = [obj]
				if (obj.price !== '待定') {
					uni.navigateTo({
						url: '/pages/confirmPay/confirmPay?obj='+ encodeURIComponent(JSON.stringify(arr))
					})
				} else {
					
				}				
			},
			/** 购物车下单 */
			goAllBuy() {
				uni.navigateTo({
					url: '/pages/confirmPay/confirmPay?obj='+ encodeURIComponent(JSON.stringify(this.carList))
				})
			},
			/** 
			 * @param obj {Object} 添加的物品 
			 * @param val {String} 标志符 （add 添加；reduce 删除）
			 * 加购物车
			 */
			addOptions(obj, val) {
				obj.isClick = !obj.isClick
				if (val == 'add') {
					let itemObj = {...obj, ...this.defaultObj}
					this.carList.push(itemObj)
				} else {
					this.carList.forEach((item, index) => {
						if (item._id == obj._id) {
							this.carList.splice(index, 1)
						}
					})
				}
				
			}
		},
		onLoad(option) {
			const {typeName, id, equipmentType, icon} = option;
			this.defaultObj = {
				typeName,
				id,
				equipmentType,
				icon
			}
			this.getcateList()
		}
	}
</script>

<style lang="scss" scoped>
	.classify {
		background-color: #fff;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-between;
		.cate-left {
			width: 30%;
			height: 100vh;
			overflow: auto;
			background-color: #f5f7fa;
			.type {
				margin-bottom: 10rpx;
				padding-top: 20rpx;
				margin-left: 12%;
				.type-name {
					color: #303133;
					font-size: 30px;
					font-weight: 700;
				}
				.equipment-type {
					font-size: 14px;
					color: #303133;
				}
			}
			.cate-item {
				width: 75%;
				line-height: 80rpx;
				margin-left: 12%;
				text-align: center;
				box-sizing: border-box;
				background-color: #edeff2;
				color: #9b9da4;
				border-radius: 8px;
				font-size: 13px;
				margin-top: 28rpx;
			}

			.active {
				width: 80%;
				line-height: 90rpx;
				background-color: #043764;
				color: #fff;
				font-size: 14px;
				margin-left: 10%;
				font-weight: 500;
			}
		}

		.cate-right {
			width: 70%;
			height: 100vh;
			overflow-x: hidden;
			overflow-y: auto;
			.reslove-item {
				// background-color: #00d8c8;
				margin-left: 30rpx;
				display: flex;
				border-bottom: 1px solid #f6f6f7;
				.left {
					width: 94%;
					.reslove-name {
						margin-top: 25rpx;
						font-size: 17px;
						font-weight: 600;
						color: #303133;
					}
					.desc {
						font-size: 11px;
						color: #9b9da4;
						margin-top: 8rpx;
					}
					.warranty-period {
						font-size: 11px;
						color: #9b9da4;
						margin-top: 8rpx;
						margin-bottom: 8rpx;
					}
					.price {
						color: #043764;
						font-size: 17px;
						font-weight: 600;
						margin-bottom: 25rpx;
						span {
							color: #303133;
							font-size: 15px;
							font-weight: 400;
						}
					}
				}
				.right {
					display: flex;
					align-items: center;
					transform: translate(0, 20rpx);
					color: #9b9da4;
					margin-right: 15rpx;
					.add {
						background-color: #043764;
						color: #fff;
						text-align: center;
						width: 35rpx;
						height: 35rpx;
						line-height: 28rpx;
						border-radius: 50%;
					}
					.reduce {
						background-color: #f72728;
						color: #fff;
						text-align: center;
						width: 35rpx;
						height: 35rpx;
						line-height: 28rpx;
						border-radius: 50%;
					}
				}
			}
		}
		
		.allPrice {
			position: fixed;
			bottom: 50rpx;
			left: 6%;
			width: 88%;
			height: 100rpx;
			background-color: #fff;
			display: flex;
			align-items: center;
			border-radius: 50rpx;
			.left {
				width: 70%;
				// text-align: center;
				padding-left: 80rpx;
				line-height: 100rpx;
				background-color: #eee;
				border-radius: 50rpx 0rpx 0rpx 50rpx;
			}
			.right {
				width: 30%;
				text-align: center;
				background-color: #00d8c8;
				line-height: 100rpx;
				border-radius: 0rpx 50rpx 50rpx 0rpx;
				color: #fff;
				height: 100rpx;
			}
		}
	}
</style>

