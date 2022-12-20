export default {
	request(options) {
		return new Promise((resolve, reject) => {
			//书写异步操作的代码
			uni.request({
				...options,
				success: res => {
					if (options.native) {
						resolve(res) //调取接口后返回的原生数据  
					}
					if (res.status === 200) {
						resolve(res.data) //异步操作执行成功
					} else {
						console.log('接口404');
						reject(res) //异步操作执行失败
					}
				}
			})
		})
	},
	get(url, data = {}, options = {}) {
		options.url = url;
		options.data = data;
		options.method = 'get';
		return this.request(options)
	},
	post(url, data = {}, options = {}) {
		options.url = url;
		options.data = data;
		options.method = 'post';
		return this.request(options)
	}
}
