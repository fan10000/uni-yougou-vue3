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