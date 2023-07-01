<template>
	<view class="settle-container">
		<!-- 全选 -->
		<label class="radio" @click="changeAllState">
			<radio :checked="isFullCheck" color="red">
				<text>全选</text>
			</radio>
		</label>

		<!-- 合计 -->
		<view class="amount">
			合计：<text class="amount-text">¥ {{cart.checkedGoodsPrice}}</text>
		</view>

		<!-- 结算按钮 -->
		<button class="but-settle" type="default" size="mini" @click="settlement">结算
			{{cart.checkedGoodsCount}}</button>
	</view>
</template>

<script setup>
	import { useCartStore, useUserStore } from "@/stores"
	import { computed, ref } from "vue";

	const cart = useCartStore()
	const user = useUserStore()
	// 是否全选
	const isFullCheck = computed(() => cart.total === cart.checkedGoodsCount)
	// 实现全选/反选
	const changeAllState = () => cart.updateCheckAll(!isFullCheck.value)

	// 结算按钮点击事件
	const settlement = () => {
		/* 1.判断是否勾选了商品 */
		if (!cart.checkedGoodsCount) return uni.showToast({
			title: '请选择要结算的商品！',
			icon: "none"
		})
		/* 2.判断是否选择了收货地址 */
		if (!user.fullAddress) return uni.showToast({
			title: '请选择收货地址！',
			icon: "none"
		})
		/* 用户没有登录, 则调用 delayNavigate() 进行倒计时的导航跳转 */
		if (!user.token) return delayNavigate()
	}


	// 延时器的秒数
	const seconds = ref(3)
	// 定时器的ID
	const time = ref()
	// 展示倒计时的提示消息
	const showTips = (n) => {
		uni.showToast({
			icon: "none",
			title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
			mask: true,
			duration: 1500
		})
	}
	// 延迟导航到登录页
	const delayNavigate = () => {
		// 重置秒数
		seconds.value = 3
		// 展示提示消息
		showTips(seconds.value)
		// 创建计时器,记录计时器ID
		time.value = setInterval(() => {
			// 秒数自减
			seconds.value--
			// 判断秒数是否 <= 0
			if (seconds.value <= 0) {
				// 清除定时器
				clearInterval(time.value)
				// 跳转登录页
				uni.redirectTo({
					url: '/pages/login/login',
					// 记录跳转信息
					success() {
						user.updateRedirectInfo({
							openType: 'redirectTo',
							from: '/pages/cart/cart'
						})
					}
				})
				// 终止后续代码运行
				return
			}
			// 更新提示消息
			showTips(seconds.value)
		}, 1000)
	}
</script>

<style lang="scss">
	.settle-container {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: white;
		box-sizing: border-box;
		padding: 0 14rpx;
		font-size: 28rpx;

		radio {
			transform: scale(0.8);
		}

		.amount {
			flex: 2;
			text-align: end;
			margin: 0 20rpx;

			.amount-text {
				color: red;
			}
		}

		.but-settle {
			color: #fff;
			border-radius: 200rpx;
			background: linear-gradient(90deg, #FF8A18, #EF1224)
		}
	}
</style>