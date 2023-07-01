import App from './App'
import * as Pinia from "pinia"
import { createUnistorage } from "./uni_modules/pinia-plugin-unistorage/index.js"

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	// 状态管理器，创建 pinia 实例
	const store = Pinia.createPinia()
	// pinia 持久化 插件
	store.use(createUnistorage())
	// 使用 pinia 中间件
	app.use(store)
	return {
		app,
		// 此处必须将 Pinia 返回
		Pinia
	}
}
// #endif