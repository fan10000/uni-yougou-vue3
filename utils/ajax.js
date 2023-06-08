// 引入 uni-ajax 模块
import ajax from '@/uni_modules/u-ajax'

// 创建请求实例
const instance = ajax.create({
	// 初始配置
	baseURL: 'https://api-hmugo-web.itheima.net/api'
})

// 添加请求拦截器
// 请求开始之前做一些事情
instance.interceptors.request.use(
	config => {
		// 在发送请求前做些什么

		// 显示 loading 提示框
		uni.showLoading({
			title: "数据加载中"
		})

		return config
	},
	error => {
		// 对请求错误做些什么

		return Promise.reject(error)
	}
)

// 添加响应拦截器
// 请求完成之后做一些事情
instance.interceptors.response.use(
	response => {
		// 对响应数据做些什么

		// 隐藏 loading 提示框
		uni.hideLoading()

		if (response.data.meta.status !== 200) {
			uni.showToast({
				title: '数据请求失败！',
				duration: 1500,
				icon: 'none'
			})
		}
		return response.data.message
	},
	error => {
		// 对响应错误做些什么

		return Promise.reject(error)
	}
)


// 导出 create 创建后的实例
export default instance