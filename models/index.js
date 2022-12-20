import {
	apiResquest
} from '../utils/http.js'

/** 存储订单信息 */
export const saveOrder = (query) => {
	return apiResquest({
		url: '/http/callback',
		method: 'POST',
		query: {
			...query
		}
	})
}

/** 未付款重新付款存储订单信息 */
export const saveOtherOrder = (query) => {
	return apiResquest({
		url: '/saveOtherOrder',
		method: 'POST',
		query: {
			...query
		}
	})
}

/** 获取全部订单 */
export const getOrderList = (query) => {
	let openid = query
	return apiResquest({
		url: `/getOrderList?openid=${openid}`,
		method: 'GET'
	})
}

/** 删除未付款超时订单 */
export const deleteOverTimeOrder = (query) => {
	let _id = query
	return apiResquest({
		url: `/deleteOverTimeOrder?_id=${_id}`,
		method: 'GET'
	})
}

/** 查看订单详情 */
export const seeOrderInfo = (query) => {
	let id = query
	return apiResquest({
		url: `/getOrderList/seeOrderInfo?id=${id}`,
		method: 'GET'
	})
}