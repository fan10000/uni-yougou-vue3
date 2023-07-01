import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useUserStore = defineStore('user',
	() => {
		// 用户信息(头像，昵称)
		const userInfo = ref({})
		// token
		const token = ref('')
		// 收货地址对象
		const address = ref({})
		// 重定向的 object 对象 { openType, from }
		const redirectInfo = ref()


		// 更新用户信息
		const updateUserInfo = (info) => {
			userInfo.value.avatarUrl = info
		}

		// 拼接完整地址
		const fullAddress = computed(() => {
			if (!address.value.provinceName) return ''
			return address.value.provinceName + address.value.cityName + address.value.countyName + address
				.value.detailInfo
		})

		// 更新token
		const updateToken = (newToken) => {
			token.value = newToken
		}

		// 更新收货地址
		const updateaddress = (add) => {
			address.value = add
		}

		// 更新 重定向的 object 对象
		const updateRedirectInfo = (info) => {
			redirectInfo.value = info
		}

		return {
			userInfo,
			updateUserInfo,
			token,
			updateToken,
			address,
			updateaddress,
			fullAddress,
			redirectInfo,
			updateRedirectInfo
		}
	}, {
		unistorage: true // 开启后对 state 的数据读写都将持久化
	}
)