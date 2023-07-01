<template>
	<view class="my-page">
		<!-- 头像昵称区域 -->
		<view class="top-box">
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				<image class="avatar" :src="userStore.userInfo.avatarUrl || defaultAvatarUrl"></image>
			</button>
			<!-- <view class="nickname">{{nickname}}</view> -->
			<input class="nickname" type="nickname" :value="userStore.userInfo.nickname || defaultNickname">
		</view>
		<!-- 面板的列表区域 -->
		<view class="panel-list">
			<!-- 第一个面板 -->
			<view class="panel">
				<!-- panel 的主体区域 -->
				<view class="panel-body">
					<!-- panel 的 item 项 -->
					<view class="panel-item">
						<text>8</text>
						<text>收藏的店铺</text>
					</view>
					<view class="panel-item">
						<text>14</text>
						<text>收藏的商品</text>
					</view>
					<view class="panel-item">
						<text>18</text>
						<text>关注的商品</text>
					</view>
					<view class="panel-item">
						<text>84</text>
						<text>足迹</text>
					</view>
				</view>
			</view>

			<!-- 第二个面板 -->
			<view class="panel">
				<!-- 面板的标题 -->
				<view class="panel-title">我的订单</view>
				<!-- 面板的主体 -->
				<view class="panel-body">
					<!-- 面板主体中的 item 项 -->
					<view class="panel-item">
						<image src="/static/images/my-icons/icon1.png" class="icon"></image>
						<text>待付款</text>
					</view>
					<view class="panel-item">
						<image src="/static/images/my-icons/icon2.png" class="icon"></image>
						<text>待收货</text>
					</view>
					<view class="panel-item">
						<image src="/static/images/my-icons/icon3.png" class="icon"></image>
						<text>退款/退货</text>
					</view>
					<view class="panel-item">
						<image src="/static/images/my-icons/icon4.png" class="icon"></image>
						<text>全部订单</text>
					</view>
				</view>
			</view>
			<!-- 第三个面板 -->
			<!-- 第三个面板 -->
			<view class="panel">
				<view class="panel-list-item">
					<text>收货地址</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
				<view class="panel-list-item">
					<text>联系客服</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
				<view class="panel-list-item" @click="logout">
					<text>退出登录</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { useCartStore, useUserStore } from "@/stores"
	import { onShow, onTabItemTap } from "@dcloudio/uni-app"
	import { ref } from "vue"

	// 为 tabBar 设置数字徽标
	const cartStore = useCartStore()
	cartStore.setTabBarBadge()

	const userStore = useUserStore()

	onTabItemTap((e) => {
		if (!userStore.token) {
			uni.redirectTo({
				url: '/pages/login/login'
			})
		}
		userStore.updateRedirectInfo({
			openType: 'redirectTo',
			from: '/pages/my/my'
		})
	})

	// 默认头像,昵称
	const defaultAvatarUrl = '/static/images/avatarUrl.png'
	const defaultNickname = '微信用户'

	// 自定义头像
	const onChooseAvatar = (e) => {
		const { avatarUrl } = e.detail
		userStore.updateUserInfo(avatarUrl)
		console.log(userStore.userInfo.avatarUrl)
	}

	// 退出登录
	const logout = () => {
		uni.showModal({
			title: '提示',
			content: '确认退出登录吗？',
			success(res) {
				if (res.confirm) {
					userStore.updateUserInfo('')
					userStore.updateToken('')
					userStore.updateaddress({})
				}
			}
		})
	}
</script>

<style lang="scss">
	.my-page {
		height: 100%;
		// 为整个组件的结构添加浅灰色的背景
		background-color: #f4f4f4;

		.top-box {
			height: 400rpx;
			background-color: #c00000;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.avatar-wrapper {
				width: 180rpx;
				height: 180rpx;
				border-radius: 45px;
				padding: 0;

				.avatar {
					display: block;
					width: 100%;
					height: 100%;
				}
			}

			.nickname {
				color: white;
				font-weight: bold;
				font-size: 16px;
				margin-top: 10px;
				text-align: center;
			}
		}
	}

	.panel-list {
		padding: 0 10px;
		position: relative;
		top: -10px;

		.panel {
			background-color: white;
			border-radius: 3px;
			margin-bottom: 8px;

			.panel-body {
				display: flex;
				justify-content: space-around;

				.panel-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-around;
					font-size: 13px;
					padding: 10px 0;
				}
			}
		}
	}

	.panel-list {
		padding: 0 10px;
		position: relative;
		top: -10px;

		.panel {
			background-color: white;
			border-radius: 3px;
			margin-bottom: 8px;

			.panel-title {
				line-height: 45px;
				padding-left: 10px;
				font-size: 15px;
				border-bottom: 1px solid #f4f4f4;
			}

			.panel-body {
				display: flex;
				justify-content: space-around;

				.panel-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-around;
					font-size: 13px;
					padding: 10px 0;

					.icon {
						width: 35px;
						height: 35px;
					}
				}
			}
		}
	}

	.panel-list-item {
		height: 45px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 15px;
		padding: 0 10px;
	}
</style>