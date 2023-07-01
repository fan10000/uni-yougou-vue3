<template>
	<view>
		<view class="login-container">
			<!-- 提示登录的图标 -->
			<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
			<!-- 登录按钮 -->
			<button type="primary" class="btn-login" @click="login">一键登录</button>
			<!-- 登录提示 -->
			<view class="tips-text">登录后尽享更多权益</view>
		</view>
	</view>
</template>

<script setup>
	import { getToken } from "@/services"
	import { useUserStore } from "@/stores"

	const userStore = useUserStore()

	const login = async () => {
		/* 调用微信登录接口 */
		await uni.login({
			/* 接口调用成功的回调函数 */
			success(res) {
				if (res.code) {
					/* 发起网络请求，使用 code 换取 openid、unionid、session_key 等信息 */
					// 请求参数
					// const loginResult = getToken(res.code)
					uni.showToast({
						title: '登录成功'
					})
					userStore.updateToken(res.code)
					// 判断 store 中的 redirectInfo 是否为 空
					// 如果不为 空，则登录成功之后，需要重新导航到对应的页面
					navigateBack()
				} else {
					uni.showToast({
						title: '登录失败',
						icon: "error"
					})
				}
			}
		})
	}
	const navigateBack = () => {
		// redirectInfo 不为 空，并且导航方式为 redirectTo
		if (userStore.redirectInfo && userStore.redirectInfo.openType === 'redirectTo') {
			uni.switchTab({
				url: userStore.redirectInfo.from,
				complete() {
					userStore.updateRedirectInfo(null)
				}
			})
		}
	}
</script>

<style lang="scss">
	.login-container {
		// 登录盒子的样式
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;

		// 绘制登录盒子底部的半椭圆造型
		&::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}

		// 登录按钮的样式
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #c00000;
		}

		// 按钮下方提示消息的样式
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>