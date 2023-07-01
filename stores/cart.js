import { defineStore } from "pinia"
import { computed, ref, watch } from "vue"
import { onShow } from "@dcloudio/uni-app"

export const useCartStore = defineStore(
	'cart',
	() => {
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含6个属性，商品 ID 、名称 、价格 、数量 、小图标 、选中状态
		// {goods_id，goods_name，goods_price，goods_count，goods_small_logo，goods_state}
		const cart = ref([])

		/* 统计购物车中商品的总数量 */
		const total = computed(() => {
			// reduce() 的用处——计算数组所有元素的总和，语法：reduce(callbackFn, initialValue)
			return cart.value.reduce((total, item) => total += item.goods_count, 0)
		})
		/* 勾选商品的总数量 */
		const checkedGoodsCount = computed(() => cart.value.filter(x => x.goods_state).reduce((total, item) =>
			total += item.goods_count, 0))
		/* 勾选商品的总价格 */
		const checkedGoodsPrice = computed(() => cart.value.filter(x => x.goods_state).reduce((total, item) =>
			total += item.goods_count * item.goods_price, 0).toFixed(2))


		/* 添加到购物车的方法 */
		const addCart = (goods) => {
			// goods 是要添加到购物车的数据对象
			// 根据提交的商品 id 查询购物车有没有这个商品，
			// 有则返回查找到的商品数据，无则返回 undefind
			const findResult = cart.value.find(x => x.goods_id === goods.goods_id)
			if (!findResult) {
				cart.value.push(goods)
			} else {
				findResult.goods_count++
			}
		}



		// 更新购物车中商品的勾选状态
		const updateGoodsState = (goods) => {
			// 根据 id 查找 购物车商品
			const findResult = cart.value.find(x => x.goods_id === goods.goods_id)
			if (findResult) findResult.goods_state = goods.goods_state
		}

		// 更新购物车中商品的数量
		const updateGoodsCount = (goods) => {
			const findResult = cart.value.find(x => x.goods_id === goods.goods_id)
			if (findResult) findResult.goods_count = goods.goods_count
		}
		// 全选与反选
		const updateCheckAll = (newState) => {
			cart.value.forEach(x => x.goods_state = newState)
		}

		// 删除商品
		const removeGoods = (goods) => {
			cart.value = cart.value.filter(x => x.goods_id !== goods.goods_id)
		}

		/* 为 tabBar 设置数字徽标 */
		const setTabBarBadge = () => {
			const setBadge = () => {
				// 显示与隐藏购物车右上角的数字徽标
				if (checkedGoodsCount.value > 0) {
					uni.setTabBarBadge({
						// 索引
						index: 2,
						// 内容：text 的值必需是字符串
						text: checkedGoodsCount.value + ''
					})
				} else {
					uni.removeTabBarBadge({
						index: 2,
					})
				}
			}
			// 页面显示时
			onShow(() => {
				setBadge()
			})

			// 侦听商品勾选总数量，当变化时，判断是否在 tabbar 页，是则重新加载
			watch(checkedGoodsCount, () => {
				// if (getCurrentPages().length === 1) setBadge()
				getCurrentPages().length === 1 && setBadge()
			})
		}

		return {
			cart,
			total,
			addCart,
			checkedGoodsCount,
			checkedGoodsPrice,
			updateGoodsState,
			updateGoodsCount,
			updateCheckAll,
			removeGoods,
			setTabBarBadge
		}
	}, {
		unistorage: true // 开启后对 state 的数据读写都将持久化
	}
)