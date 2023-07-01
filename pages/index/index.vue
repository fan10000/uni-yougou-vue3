<template>
	<view>
		<!-- 上导航栏 -->
		<view class="navbar">
			<uni-nav-bar fixed :border="false" statusBar :height="navHeight" :left-width="navWidth"
				:right-width="navWidth">
				<template #left>
					<view class="logo"><text>优购商城</text></view>
				</template>
				<view class="input-view">
					<uni-icons type="search" size="18"></uni-icons>
					<input type="text" placeholder-class="input-placeholder" placeholder="输入搜索关键词" disabled
						:style="{height:inputHeight}" @click="goSearch">
				</view>
			</uni-nav-bar>
		</view>
		<!--上导航栏 -->

		<!-- 轮播图 -->
		<swiper indicator-dots indicator-active-color="#fff" autoplay circular interval="3000" duration="1000">
			<swiper-item v-for="item in swiperList" :key="item.goods_id">
				<navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id='item.goods_id'`">
					<image mode="widthFix" lazy-load="true" :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 轮播图 -->

		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="item in navList" :key="item.name" @click="navClickHandler(item)">
				<image class="nav-img" :src="item.image_src"></image>
			</view>
		</view>
		<!-- 分类导航 区域-->

		<!-- 楼层区域 -->
		<view class="floor-list">
			<!-- 楼层 item 项 -->
			<view class="floor-item" v-for="item in floorList" :key="item.name">
				<!-- 楼层标题 -->
				<image class="floor-title" mode="widthFix" :src="item.floor_title.image_src"></image>
				<!-- 楼层图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧大图区域 -->
					<navigator class="letf-img-box" :url="item.product_list[0].url">
						<image mode="widthFix" :src="item.product_list[0].image_src"
							:style="{width:item.product_list[0].image_width + 'rpx'}"></image>
					</navigator>
					<!-- 右侧小图区域 -->
					<view class="right-img-box">
						<template v-for="(item2,i2) in item.product_list" :key="item2.name">
							<navigator class="right-img-item" :url="item2.url" v-if="i2 !== 0">
								<image mode="widthFix" :style="{width:item2.image_width + 'rpx'}"
									:src="item2.image_src">
								</image>
							</navigator>
						</template>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from "vue"
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { getSwiperList, getNavList, getFloorList } from "@/services"
	import { useCartStore } from "@/stores"

	// //导航栏高度
	const navHeight = ref('')
	// 导航栏左右两侧宽度
	const navWidth = ref('')
	// 搜索栏高度
	const inputHeight = ref('')

	const navbarStyle = () => {
		let menuButtonInfo = uni.getMenuButtonBoundingClientRect() //自定义后的小程序胶囊按钮的布局位置信息
		navHeight.value = menuButtonInfo.height + (menuButtonInfo.top - 20) * 2 + 'px'
		inputHeight.value = menuButtonInfo.height + 'px'
		navWidth.value = menuButtonInfo.width + 'px'
	}

	// 获取轮播图数据列表
	const swiperList = ref([])
	const loadSwiperList = async () => {
		const res = await getSwiperList()
		swiperList.value = res
	}
	// 获取分类导航的数据
	const navList = ref([])
	const loadNavList = async () => {
		const res = await getNavList()
		navList.value = res
	}
	// 获取楼层商品的数据列表
	const floorList = ref([])
	const loadFloorList = async () => {
		const res = await getFloorList()
		// 通过双层 forEach 循环，处理 URL 地址
		res.forEach(floor => {
			floor.product_list.forEach(prod => {
				prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
			})
		})
		floorList.value = res
	}

	onLoad(() => {
		loadSwiperList()
		loadNavList()
		loadFloorList()
		navbarStyle()
	})
	// 跳转到搜索页
	const goSearch = () => {
		uni.navigateTo({
			url: '/subpkg/search/search'
		})
	}
	// 分类导航跳转
	const navClickHandler = (item) => {
		if (item.name === '分类') {
			uni.switchTab({
				url: '/pages/category/category'
			})
		}
	}

	// 为 tabBar 设置数字徽标
	const store = useCartStore()
	store.setTabBarBadge()
</script>

<style lang="scss">
	.navbar {
		position: sticky;
		z-index: 999;
		left: 0;
		top: 0;
		background-color: white;

		.uni-navbar__header {
			align-items: center;
		}

		.logo {
			text {
				font-size: 32rpx;
				font-weight: bold;
			}
		}

		.input-view {
			display: flex;
			align-items: center;
			width: 100%;
			background: #F7F8FA;
			border-radius: 20rpx;

			uni-icons {
				margin: 0 8rpx;
			}

			.input-placeholder {
				font-size: 28rpx;
				color: #A9A6A6;
			}

		}
	}

	swiper {
		height: 340rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floor-title {
		width: 100%;
		display: flex;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10rpx;

		.right-img-box {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
		}
	}
</style>