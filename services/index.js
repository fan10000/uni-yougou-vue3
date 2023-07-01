import ajax from "@/utils/ajax.js"

/* 获取轮播图数据列表 */
export const getSwiperList = () =>
	ajax.get('/public/v1/home/swiperdata')

/*  获取分类导航的数据 */
export const getNavList = () =>
	ajax.get('/public/v1/home/catitems')

/*  获取楼层商品的数据列表 */
export const getFloorList = () =>
	ajax.get('/public/v1/home/floordata')

/*  获取分类数据列表 */
export const getCateList = () =>
	ajax.get('/public/v1/categories')

/*  根据搜索关键词，搜索商品 */
export const getSearchList = (params) =>
	ajax.get('/public/v1/goods/qsearch', params)

/*  获取商品列表搜索 */
export const getGoodsList = (params) =>
	ajax.get('/public/v1/goods/search', params)

/*  获取商品详情数据 */
export const getGoodsDetail = (params) =>
	ajax.get('/public/v1/goods/detail', params)

/*  登录凭证校验。
通过 wx.login 接口获得临时登录凭证 code 后传到开发者服务器调用此接口完成登录流程，
使用 code 换取 openid、unionid、session_key 等信息 
*/
export const getToken = (params) =>
	ajax.post('/public/v1/users/wxlogin', params)