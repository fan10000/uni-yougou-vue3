<template>
	<view class="goods-item">
		<!-- 左侧图片 -->
		<view class="goods-item-left">
			<image class="goods-img" :src="goods.goods_small_logo || defaultPic"></image>
		</view>
		<!-- 右侧信息 -->
		<view class="goods-item-right">
			<view class="goods-name">{{goods.goods_name}} </view>
			<view class="goods-info">
				<view class="price">¥ {{price}}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed } from "vue";
	const props = defineProps({
		goods: {
			type: Object,
			default (rawProps) {
				return {}
			}
		}
	})
	// 默认的空图片
	const defaultPic = '/static/images/default-pic.png'
	// 商品价格保留两位小数
	const price = computed(() => props.goods.goods_price.toFixed(2))
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		border-bottom: 2rpx solid #f0f0f0;

		&-left {
			margin-right: 20rpx;

			.goods-img {
				display: block;
				width: 200rpx;
				height: 200rpx;
			}
		}

		&-right {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 24rpx;
			}

			.goods-info {
				.price {
					color: red;
					font-size: 32rpx;
				}
			}
		}
	}
</style>