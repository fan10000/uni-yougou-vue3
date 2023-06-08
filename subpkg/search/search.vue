<template>
	<view>
		<!-- 搜索栏 -->
		<view class="search-container">
			<uni-search-bar placeholder="请输入搜索内容" :radius="100" bgColor="#fff" :focus="true" cancelButton="none"
				v-model="searchValue" @input="input"></uni-search-bar>
		</view>

		<!-- 搜索结果列表 -->
		<view class="search-list" v-if="searchResults.length !== 0">
			<view class="search-item" v-for="item in searchResults" :key="item.goods_id"
				@click="goDetail(item.goods_id)">
				<view class="goods_name">
					{{item.goods_name}}
				</view>
				<uni-icons type="arrow-right" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clearHistory"></uni-icons>
			</view>
			<view class="history-list">
				<uni-tag v-for="(item,i) in historys" :key="i" :text="item" @click="goGoodsList(item)"></uni-tag>
			</view>
		</view>

	</view>
</template>

<script setup>
	import { computed, ref } from "vue";
	import { onLoad } from "@dcloudio/uni-app"
	import { getSearchList } from "@/services/index.js"

	// 搜索栏绑定值
	const searchValue = ref('')
	// 搜索关键词
	const keyword = ref('')
	// 定时器 的返回值
	let timer
	// 搜索结果列表
	const searchResults = ref([])
	// 搜索历史记录
	const historyList = ref([])

	onLoad(() => {
		historyList.value = JSON.parse(uni.getStorageSync('keyword') || '[]')
	})

	// 搜索框防抖处理
	const input = (e) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			keyword.value = e
			loadSearchList()
		}, 500)
	}

	// 根据搜索关键词，搜索商品列表
	const loadSearchList = async () => {
		if (keyword.value === '') {
			searchResults.value = []
			return
		}
		const res = await getSearchList({ query: keyword.value })
		searchResults.value = res
		saveHistoryList()
	}
	// 保存搜索历史记录到本地
	const saveHistoryList = () => {
		// 解决关键词重复
		// 创建一个 Set 对象，Set对象是值的集合，Set 中的元素是唯一的 
		const set = new Set(historyList.value)
		// 保持关键词的唯一，先删后增
		set.delete(keyword.value)
		set.add(keyword.value)
		// 将 set 对象 转化成数组
		historyList.value = Array.from(set)
		// 调用 uni.setStorageSync(key,value)---同步保存关键词到本地缓存
		uni.setStorageSync("keyword", JSON.stringify(historyList.value))
	}

	// 逆转 搜索关键 的顺序，后搜索的要显示在前面
	const historys = computed(() => {
		return [...historyList.value].reverse()
	})

	// 清空搜索历史记录
	const clearHistory = () => {
		historyList.value = []
		uni.setStorageSync('keyword', '[]')
	}

	// 商品搜索结果点击跳转事件
	const goDetail = (goods_id) => {
		uni.navigateTo({
			url: '/subpkg/goods_detail/goods_detail?goods_id' + goods_id
		})
	}
	// 搜索历史记录点击事件
	const goGoodsList = (keyword) => {
		uni.navigateTo({
			url: '/subpkg/goods_list/goods_list?query' + keyword
		})
	}
</script>

<style lang="scss">
	.uni-searchbar {
		background-color: #F8F8F8;
	}

	.search-container {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.search-list {
		padding: 0 20rpx;

		.search-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 24rpx;
			padding: 26rpx 0;
			padding-bottom: 2rpx solid #efefef;

			.goods_name {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-right: 6rpx;
			}
		}
	}

	.history-box {
		padding: 0 20rpx;

		.history-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 80rpx;
			font-size: 26rpx;
			border-bottom: 2rpx solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			uni-tag {
				margin: 10rpx;
			}
		}
	}
</style>