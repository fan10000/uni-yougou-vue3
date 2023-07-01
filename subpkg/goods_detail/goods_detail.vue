<template>
	<view class="goods-detail-page" v-if="goodsDetail.goods_name">
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" indicator-active-color="#fff" :interval="3000" :duration="1000" :autoplay="true"
			:circular="true">
			<swiper-item v-for="(item,i) in goodsDetail.pics" :key="i" @click="preview(i)">
				<image :src="item.pics_big"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息 -->
		<view class="goods-info">
			<view class="price">
				¥ {{price}}
			</view>
			<view class="goods-info-body">
				<view class="goods-name">
					{{goodsDetail.goods_name}}
				</view>
				<!-- 收藏按钮 -->
				<view class="favBtn" @click="favClick">
					<uni-icons :type="checked ? 'star-filled' : 'star'" size="18"
						:color="checked ? 'red' : 'gray'"></uni-icons>
					<text>{{checked ? '已收藏' : '收藏'}}</text>
				</view>
			</view>
			<view class="yf">
				运费：-- {{store.cart.length}}
			</view>
		</view>
		<!-- 商品详情信息 -->
		<rich-text :nodes="goodsDetail.goods_introduce"></rich-text>
		<!-- 商品导航组件 -->
		<view class="goods-nav">
			<uni-goods-nav :options="options" :button-group="buttonGroup" :fill="true" @click="onClick"
				@buttonClick="buttonClick"></uni-goods-nav>
		</view>
	</view>
</template>

<script setup>
	import { computed, ref, watch, watchEffect } from "vue"
	import { onLoad } from "@dcloudio/uni-app"
	import { getGoodsDetail } from "@/services"
	import { useCartStore } from "@/stores"

	// 商品详情数据
	const goodsDetail = ref([])
	// 
	const loadGoodsDetail = async (id) => {
		const res = await getGoodsDetail({ goods_id: id })
		// 解决商品图文中图片底部空白间隙，webp格式的图片在 iOS 社备无法显示
		res.goods_introduce = res.goods_introduce.replace(/<img/g,
			'<img style="display:block;"').replace(/webp/g, 'jpg')
		goodsDetail.value = res
	}

	onLoad((option) => {
		loadGoodsDetail(option.goods_id)

	})
	// 点击轮播图预览图片
	const preview = (i) => {
		uni.previewImage({
			current: i,
			urls: goodsDetail.value.pics.map(x => x.pics_big)
		})
	}

	// 商品价格保留两位小数
	const price = computed(() => goodsDetail.value.goods_price.toFixed(2))

	// 收藏状态
	const checked = ref(false)
	// 收藏按钮点击事件
	const favClick = () => {
		checked.value = !checked.value
		if (checked.value) {
			uni.showToast({
				title: '恭喜，收藏宝贝成功',
				icon: "none"
			})
		} else {
			uni.showToast({
				title: '取消收藏宝贝成功',
				icon: "none"
			})
		}
	}

	// 商品导航组件左侧参数
	const options = ref([{
		icon: 'chat',
		text: '客服'
	}, {
		icon: 'shop',
		text: '店铺',
		infoBackgroundColor: '#007aff',
		infoColor: "#f5f5f5"
	}, {
		icon: 'cart',
		text: '购物车',
		info: 0
	}])
	// 商品导航组件右侧按钮组参数
	const buttonGroup = ref([{
			text: '加入购物车',
			backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
			color: '#fff'
		},
		{
			text: '立即购买',
			backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
			color: '#fff'
		}
	])
	// 商品导航组件左侧点击事件
	const onClick = (e) => {
		// e = {index,content}
		if (e.content.text === '购物车') {
			uni.switchTab({
				url: '/pages/cart/cart'
			})
		}
	}
	// 商品导航组件右侧按钮组点击事件
	const buttonClick = (e) => {
		// e = {index,content}
		if (e.content.text === '加入购物车') {
			// 创建一个商品的信息对象
			const goods = {
				// 商品 ID
				goods_id: goodsDetail.value.goods_id,
				// 名称
				goods_name: goodsDetail.value.goods_name,
				// 价格
				goods_price: goodsDetail.value.goods_price,
				// 数量
				goods_count: 1,
				// 图片
				goods_small_logo: goodsDetail.value.goods_small_logo,
				// 选中状态
				goods_state: true,
			}
			store.addCart(goods)
		}
	}
	// 使用存储库 cart 购物车信息
	const store = useCartStore()

	// 侦听 购物车 商品总数量的变化
	/* watchEffect() 自动跟踪回调的响应式依赖 */
	watchEffect(
		() => {
			// 通过 find() 方法 查找到购物车按钮的配置项
			const findResult = options.value.find(x => x.text === '购物车')
			if (findResult) {
				findResult.info = store.total
			}
		}
	)
</script>

<style lang="scss">
	.goods-detail-page {
		padding-bottom: 100rpx;

		swiper {
			height: 750rpx;

			image {
				height: 100%;
				width: 100%;
			}
		}
	}

	.goods-info {
		padding: 20rpx;
		padding-right: 0;

		.price {
			color: red;
			font-size: 36rpx;
			margin: 20rpx 0;
		}

		.goods-info-body {
			display: flex;
			justify-content: space-between;

			.goods-name {
				font-size: 26rpx;
				margin-right: 20rpx;
			}

			.favBtn {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 240rpx;
				font-size: 24rpx;
				border-left: 2rpx solid #efefef;
				color: gray;
			}
		}

		.yf {
			font-size: 24rpx;
			margin: 20rpx 0;
			color: gray;
		}
	}

	.goods-nav {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
	}
</style>