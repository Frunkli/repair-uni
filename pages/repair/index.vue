<template>
	<view class="classify">
		<!-- 分类部分 -->
		<view class="cate-left">
			<view :class="['cate-item',activeIndex==index?'active':'']" v-for="(item,index) in navList" :key="index"
				@click="changeActive(index)">{{item.name}}</view>
		</view>

		<view class="cate-right">
			<view class="buttons">
				<span :class="['typeBtn', activeTypeIndex == index ? 'activeTypeBtn' : '']" 
					v-for="(item, index) in typeNameList" 
					:key="index"
					@click="changeType(index, item.typeName)"
				>{{item.typeName}}</span>
			</view>
			<view class="contents">
				<view class="content" v-for="val in serviceList" :key="item">					
					<view class="content-header">-- {{val}} --</view>
					<view class="cate-contents">
						<view class="cate-content" v-for="(item,index) in goodsList" :key="index" v-if="item.series == val" @click="getto(item)">
							<image :src="item.icon" mode=""></image>
							<view class="cate-text">{{item.equipmentType}}</view>
						</view>
					</view>					
				</view>
			</view>			
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
				// 当前点击项的索引号
				activeIndex: 0,
				activeTypeIndex: 0,
				// 分类下的商品信息
				goodList: [],
				goodsList: [],
				typeNameList: [],
				serviceList: []
			};
		},
		methods: {
			/** 获取默认数据 */
			getcateList() {
				uni.request({
					url: 'https://d182cd49-8915-433c-886a-9bc554830d29.bspapp.com/getAllList'
				}).then(res => {
					console.log(res)
					this.navList = res[1].data.data;
					this.changeActive(0)
				})
			},
			//更改点击项的索引号
			changeActive(i) {
				this.activeIndex = i
				// 已经获取到索引号
				this.goodList = this.navList[i].foods
				let list = [];
				this.goodList.forEach(item => {
					if (list.every(val => item.typeName !== val.typeName)) {
						list.push({
							typeName: item.typeName,
							list: []
						})
					}
				})
				list.forEach(item => {
					this.goodList.forEach(val => {
						if (item.typeName == val.typeName) item.list.push(val)
					})
				})
				this.typeNameList = list;
				this.changeType(0, this.typeNameList[0].typeName)
			},
			/** 更换当前当行下品牌 */
			changeType(index, val) {
				this.activeTypeIndex = index;
				let list = [];
				let serviceList = [];
				this.goodList.forEach(item => {
					if (item.typeName == val) {
						list.push(item)
					}
				})
				list.forEach(item => serviceList.push(item.series))
				this.goodsList = list;
				this.serviceList = [...new Set(serviceList)];
			},
			//点击搜索框跳转到搜索页面
			getto(it) {
				console.log(it)
				uni.navigateTo({
					url: `/pages/details/index?id=${it._id}&typeName=${it.typeName}&equipmentType=${it.equipmentType}&icon=${it.icon}`
				})
			},
		},
		onLoad() {
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
			width: 200rpx;
			height: 100vh;
			overflow: auto;
			background-color: #f5f7fa;

			.cate-item {
				width: 100%;
				color: #686a6e;
				height: 100rpx;
				line-height: 100rpx;
				// padding-left: 30rpx;
				text-align: center;
				box-sizing: border-box;
			}

			.active {
				background-color: #FFFFFF;
				color: #043764;
				position: relative;
				// padding-left: 30rpx;
				box-sizing: border-box;

				&::before {
					content: '';
					display: block;
					width: 5rpx;
					border-radius: 6rpx;
					height: 50rpx;
					background-color: #043764;
					position: absolute;
					left: 5rpx;
					top: 30rpx;
				}
			}
		}

		.cate-right {
			width: 80%;
			height: 100vh;
			overflow-y: auto;
			.buttons {
				display: flex;
				width: 100%;
				overflow-x: auto !important; 
				margin: 20rpx 0;
				.typeBtn {
					width: 150rpx !important;
					flex-shrink: 0;
					text-align: center;
					line-height: 60rpx;
					margin: 10rpx;
					height: 60rpx;
					color: #65676b;
					background-color: #f7f7f7;
					border-radius: 50px;
					border: 1px solid #f7f7f7;
					font-size: 12px;
				}
				.activeTypeBtn {
					background-color: #ecfffd;
					border: 1px solid #043764;
					color: #043764;
				}
			}
			.contents {
				width: 100%;
				.content {
					width: 100%;
					.content-header {
						width: 100%;
						height: 60rpx;
						line-height: 60rpx;
						text-align: center;
						color: #686a6e;
						font-weight: 500;
						font-size: 13px;
					}
					.cate-contents {
						display: flex;
						flex-wrap: wrap;
						.cate-content {
							// float: left;
							width: 28%;
							height: 185rpx;
							text-align: center;
							margin: 20rpx 0 0 15rpx;
							padding: 5rpx;
							// background: #f1f1f1;
							border-radius: 20rpx;
							image {
								width: 100rpx;
								height: 100rpx;
							}
							.cate-text {
								font-size: 12px;
								color: #6b6c70;
							}
						}
					}					
				}				
			}
			
		}
	}
</style>

