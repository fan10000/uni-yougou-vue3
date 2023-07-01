<template>
	<view>
		<view class="cart-page" v-if="store.cart.length !== 0">
			<!-- 收货地址 -->
			<my-address></my-address>
			<!-- 商品列表标题 -->
			<view class="cart-title">
				<uni-icons type="shop" size="18"></uni-icons>
				<text class="cart-title-text">购物车</text>
			</view>
			<!-- 商品列表 -->
			<uni-swipe-action>
				<view v-for="item in store.cart" :key="item.goods_id">
					<uni-swipe-action-item :right-options="options" @click="swipeActionClick(item)">
						<goods-item :goods="item" :showRadio="true" :showNumBox="true" @radio-change="radioChange"
							@number-change="numberChange"></goods-item>
					</uni-swipe-action-item>
				</view>
			</uni-swipe-action>

			<!-- 结算组件 -->
			<my-settle></my-settle>
		</view>

		<view class="cart-empty" v-else>
			<image class="empty-img" src="/static/images/cart/cart_empty@2x.png"></image>
			<text class="empty-text">空空如也~</text>
		</view>
	</view>
</template>

<script setup>
	import { useCartStore } from "@/stores"
	import { onShow } from "@dcloudio/uni-app"
	import { ref } from "vue";

	const store = useCartStore()
	// 为 tabBar 设置数字徽标
	store.setTabBarBadge()

	// 监听子组件的 radio-change 事件
	const radioChange = (e) => {
		store.updateGoodsState(e)
	}
	const numberChange = (e) => {
		store.updateGoodsCount(e)
	}

	// 滑动选项配置
	const options = ref([{
		text: '删除',
		style: {
			backgroundColor: 'red'
		}
	}])
	// 点击滑动选项删除商品
	const swipeActionClick = (e) => {
		store.removeGoods(e)
	}
</script>

<style lang="scss">
	.cart-page {
		padding-bottom: 100rpx;

		.cart-title {
			display: flex;
			align-items: center;
			height: 80rpx;
			font-size: 28rpx;
			border-bottom: 2rpx solid #efefef;
			padding-left: 20rpx;

			&-text {
				margin-left: 20rpx;
			}
		}
	}

	.cart-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 300rpx;

		.empty-img {
			width: 180rpx;
			height: 180rpx;
		}

		.empty-text {
			font-size: 24rpx;
			color: gray;
			margin-top: 30rpx;
		}
	}
</style>