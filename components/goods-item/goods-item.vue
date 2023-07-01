<template>
	<view class="goods-item">
		<!-- 左侧图片 -->
		<view class="goods-item-left">
			<radio :checked="goods.goods_state" color="red" @click="radioClick" v-if="showRadio"></radio>
			<image class="goods-img" :src="goods.goods_small_logo || defaultPic"></image>
		</view>
		<!-- 右侧信息 -->
		<view class="goods-item-right">
			<view class="goods-name">{{goods.goods_name}} </view>
			<view class="goods-info">
				<!-- 商品价格 -->
				<view class="price">¥ {{price}}</view>
				<!-- 商品数量 -->
				<uni-number-box :min="1" :value="goods.goods_count" @change="numberChange"
					v-if="showNumBox"></uni-number-box>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed } from "vue";
	const props = defineProps({
		// 商品的信息对象
		goods: {
			type: Object,
			default (rawProps) {
				return {}
			}
		},
		// 是否展示商品标题中左侧的 radio
		showRadio: {
			type: Boolean,
			default: false
		},
		// 是否展示商品列表中的 数字输入框 uni-number-box
		showNumBox: {
			type: Boolean,
			default: false
		}
	})

	// 自定义事件
	const emit = defineEmits(['radio-change', 'number-change'])

	// 默认的空图片
	const defaultPic = '/static/images/default-pic.png'
	// 商品价格保留两位小数
	const price = computed(() => props.goods.goods_price.toFixed(2))

	// 商品勾选状态
	const radioClick = () => {
		emit('radio-change',
			// 向父组件传递参数
			{ goods_id: props.goods.goods_id, goods_state: !props.goods.goods_state })
	}
	// 商品数量
	const numberChange = (val) => {
		emit('number-change', { goods_id: props.goods.goods_id, goods_count: +val })
	}
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		width: 100%;
		box-sizing: border-box;
		padding: 14rpx;
		border-bottom: 2rpx solid #f0f0f0;

		&-left {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-right: 20rpx;

			radio {
				transform: scale(0.7);
			}

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
				font-size: 26rpx;
			}

			.goods-info {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.price {
					color: red;
					font-size: 32rpx;
				}
			}
		}
	}
</style>