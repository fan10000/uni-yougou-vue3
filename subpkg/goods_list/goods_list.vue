<template>
	<view class="goods-list-page">
		<view v-for="item in goodsList" :key="item.goods_id" @click="gotoDetail(item)">
			<goods-item :goods="item"></goods-item>
		</view>
	</view>
</template>

<script setup>
	import { ref } from "vue"
	import { onLoad, onReachBottom, onPullDownRefresh } from "@dcloudio/uni-app"
	import { getGoodsList } from "@/services/index.js"


	// 请求参数对象
	const params = ref({
		// 关键字
		query: '',
		// 分类
		cid: '',
		// 页码
		pagenum: 1,
		// 页容量
		pagesize: 10
	})

	onLoad((option) => {
		// 将页面接收到的参数转存
		params.value.query = option.query || ''
		params.value.cid = option.cid || ''
		loadGoodsList()
	})

	// 商品列表数据
	const goodsList = ref([])
	// 数据总数
	const total = ref(0)
	// 设置节流阀,是否正在请求数据
	const isloading = ref(false)

	// 获取商品列表
	const loadGoodsList = async (cb) => {
		isloading.value = true
		const res = await getGoodsList(params.value)
		isloading.value = false
		// 获取数据后，按需调用 cb 回调函数，停止当前页面下拉刷新
		cb && cb()
		goodsList.value = [...goodsList.value, ...res.goods]
		total.value = res.total
	}

	// 页面滚动到底部的事件
	onReachBottom(() => {
		// // 判断是否还有下一页数据
		if (params.value.pagenum * params.value.pagesize >= total.value) return uni.showToast({
			title: '没有更多了'
		})
		// 根据节流阀状态判断是否在请求数据，如果是，则不再发起请求
		if (isloading.value) return
		// 页码自增 +1
		params.value.pagenum++
		// 重新获取商品列表
		loadGoodsList()
	})
	// 页面下拉刷新事件
	onPullDownRefresh(() => {
		// 重置数据
		params.value.pagenum = 1
		total.value = 0
		isloading.value = false
		goodsList.value = []
		// 重新获取商品列表，在获取数据后停止当前页面下拉刷新
		loadGoodsList(() => uni.stopPullDownRefresh())
	})
	// 点击商品跳转到详情页
	const gotoDetail = (item) => {
		uni.navigateTo({
			url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
		})
	}
</script>

<style lang="scss">

</style>