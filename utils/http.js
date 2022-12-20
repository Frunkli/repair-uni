import {
	config
} from '../config.js'

export const apiResquest = (prams) => { 
	//prams: 调用的接口API的参数
	
	// 判断请求类型
	let headerData = {
		'content-type': 'application/json'
	}

	let dataObj = null
	
	// 请求头携带token
	if (prams.method === "GET") {
		headerData = {
			'content-type': 'application/json',
			'token': uni.getStorageSync('token')
		}
	} else {
		dataObj = {
			'data': prams.query,
			'token': uni.getStorageSync('token')
		}
	}
	return new Promise((resolve, reject) => {
		// 拼接请求地址
		let url = config.base_url + prams.url;
		uni.showLoading({
			title: '加载中',
			mask: true
		})
		return uni.request({
			url: url,
			data: dataObj,
			method: prams.method,
			header: headerData,
			success: (res) => {
				// console.log('请求成功')
				uni.hideLoading()
				//成功返回码
				// if (res.data.status != 200) {
				// 	uni.showToast({
				// 		title: '获取数据失败:' + res.data.message,
				// 		duration: 1000,
				// 		icon: "none"
				// 	})
				// 	return;
				// }
				resolve(res.data);
			},
			fail: (err) => {
				// console.log('请求失败')
				reject(err);
				console.log(err)
				uni.hideLoading()
			},
			complete: () => {
				// console.log('请求完成')
				uni.hideLoading()
			}
		});
	})
}
