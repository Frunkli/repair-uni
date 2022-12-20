'use strict';
exports.main = async (event, context) => {
	const db = uniCloud.database(); //代码块为cdb
	const collection = db.collection('mall_type');
	let params = JSON.parse(event.body)
	let callback = {}
	let res;
	if (params.typeName && params.series) {
		res = await collection.where({
			navName: params.navName,
			typeName: params.typeName,
			series: params.series
		}).get()
	} else {
		if (params.typeName === '' && params.series === '') {
			res = await collection.where({
				navName: params.navName
			}).get()
		} else if (params.series === '') {
			res = await collection.where({
				navName: params.navName,
				typeName: params.typeName
			}).get()
		} else if (params.typeName === '') {
			res = await collection.where({
				navName: params.navName,
				series: params.series
			}).get()
		}
	}
	if (res.data.length) {
		callback = {
			status: 200,
			message: '',
			data: res.data
		}
	} else {
		callback = {
			status: 500,
			message: '当前查找条件无数据',
			data: []
		}
	}
	
	//返回数据给客户端
	return callback;
};

