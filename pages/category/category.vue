<template>
	<view>
		<!-- 搜索栏 -->
		<view class="search-container" @click="goSearch">
			<uni-search-bar placeholder="搜索" :radius="100" bgColor="#fff" readonly></uni-search-bar>
		</view>


		<!-- 商品分类滚动区域 -->
		<view class="scroll-container">
			<!-- 左侧滚动区域 -->
			<scroll-view scroll-y class="left-scroll-view" :style="windowHeight">
				<view v-for="(item,i) in cateList" :key="item.car_id"
					:class="['left-item',i === navIndex ? 'active' : '']" @click="changedIndex(i)">
					{{item.cat_name}}
				</view>
			</scroll-view>

			<!-- 右侧滚动区域 -->
			<scroll-view scroll-y class="right-scroll-view" :style="windowHeight" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="item2 in cateLevel2" :key="item2.car_id">
					<view class="cate-lv2-title"> {{item2.cat_name}} </view>
					<!-- 三级商品分类列表 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="item3 in item2.children" :key="item3.car_id"
							@click="gotoGoodsList(item3)">
							<image :src="item3.cat_icon"></image>
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

	</view>
</template>

<script setup>
	import { ref } from "vue"
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { getCateList } from "@/services"
	import { useCartStore } from "@/stores"

	const goSearch = () => {
		uni.navigateTo({
			url: '/subpkg/search/search'
		})
	}

	// 获取可使用窗口高度
	const windowHeight = ref('')
	const loadWindowHeight = () => {
		windowHeight.value = { height: uni.getSystemInfoSync().windowHeight - 50 + 'px' }
	}

	// 获取分类数据列表
	// 一级数据
	const cateList = ref([])
	// 初始化时默认的二级数据
	const cateLevel2 = ref([])
	const loadCateList = async () => {
		const res = await getCateList()
		cateList.value = res
		cateLevel2.value = res[0].children
	}

	// 初始化 一级分类导航的选中状态 - 改变样式
	const navIndex = ref(0)
	// 竖向滚动条位置
	const scrollTop = ref(0)

	// 一级分类导航点击事件
	const changedIndex = (i) => {
		navIndex.value = i
		// 更新二级分类数据
		cateLevel2.value = cateList.value[i].children
		// 切换一级分类后重置滚动条位置
		scrollTop.value = scrollTop.value === 0 ? 1 : 0
	}
	// 三级分类商品点击事件
	const gotoGoodsList = (item3) => {
		uni.navigateTo({
			url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
		})
	}

	onLoad(() => {
		loadWindowHeight()
		loadCateList()
	})
	// 为 tabBar 设置数字徽标
	const store = useCartStore()
	store.setTabBarBadge()
</script>

<style lang="scss">
	.uni-searchbar {
		background-color: #F8F8F8;
	}

	.search-container {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.scroll-container {
		display: flex;
	}

	.left-scroll-view {
		width: 240rpx;

		.left-item {
			text-align: center;
			line-height: 120rpx;
			background-color: #f7f7f7;
			font-size: 28rpx;
		}

		.active {
			background-color: #fff;
			position: relative;

			&::before {
				content: '';
				display: block;
				height: 60rpx;
				width: 6rpx;
				background-color: red;
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}

	.right-scroll-view {
		.cate-lv2-title {
			text-align: center;
			font-size: 28rpx;
			font-weight: bold;
			padding: 30rpx 0;
		}

		.cate-lv3-list {
			display: flex;
			flex-wrap: wrap;

			.cate-lv3-item {
				display: flex;
				width: 33.33%;
				flex-direction: column;
				align-items: center;
				margin-bottom: 20rpx;

				image {
					width: 120rpx;
					height: 120rpx;
				}

				text {
					font-size: 24rpx;
				}
			}
		}
	}
</style>