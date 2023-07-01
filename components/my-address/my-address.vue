<template>
	<view>
		<!-- 选择收货地址 -->
		<view class="address-choose-box" v-if="JSON.stringify(store.address) === '{}'">
			<button class="button" type="primary" size="mini" @click="chooseAddress">请选择收货地址+</button>
		</view>
		<!-- 收货信息 -->
		<view class="address-info-box" @click="chooseAddress" v-else>
			<view class="row1">
				<view class="col-left">
					<view class="name">收件人：{{store.address.userName}} </view>
				</view>
				<view class="col-right">
					<view class="mobile">电话：{{store.address.telNumber}}</view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<view class="col-left">收件地址：</view>
				<view class="col-right">{{store.fullAddress}}</view>
			</view>
		</view>
		<!-- 底部线条 -->
		<image class="address-border" src="/static/images/cart/cart_border@2x.png"></image>
	</view>
</template>

<script setup>
	import { useUserStore } from "@/stores"

	const store = useUserStore()

	// 选择收货地址
	const chooseAddress = () => {
		// 调用小程序选择收货地址API
		uni.chooseAddress({
			success(res) {
				if (res.errMsg === 'chooseAddress:ok') {
					store.updateaddress(res)
				}

			},
			fail(err) {
				// 调用失败，用户没有授权
				if (err.errMsg === 'chooseAddress:fail auth deny') {
					// 重新发起收货地址的授权

					// 调用 uni 的 弹窗提示API
					uni.showModal({
						content: '检测到您没有打开地址权限，是否去设置打开？',
						confirmText: '确认',
						cancelText: '取消',
						success(res) {
							if (res.cancel) {
								return uni.$showMsg('您取消了地址授权！')
							}
							if (res.confirm) {
								// 调起客户端小程序设置界面
								return uni.openSetting({
									success(settingRes) {
										if (settingRes.authSetting['scope.address']) {
											return uni.$showMsg('授权成功，请选择地址')
										}
										if (!settingRes.authSetting['scope.address']) {
											return uni.$showMsg('您取消了地址授权！')
										}
									}

								})
							}
						}

					})
				}

			}
		})
	}
</script>

<style lang="scss">
	.address-choose-box {
		height: 180rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.address-info-box {
		height: 180rpx;
		font-size: 24rpx;
		padding: 0 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.row1 {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.col-right {
				display: flex;
			}
		}

		.row2 {
			display: flex;
			align-items: center;
			margin-top: 20rpx;

			.col-left {
				white-space: nowrap;
			}
		}
	}

	.address-border {
		display: block;
		width: 100%;
		height: 10rpx;
	}
</style>