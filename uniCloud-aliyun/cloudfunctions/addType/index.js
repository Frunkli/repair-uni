'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event.body)
	const db = uniCloud.database(); //代码块为cdb
	const dbCmd = db.command
	const $ = dbCmd.aggregate
	const collection = db.collection('mall_type');
	
	// let queryStringParameters = event.body.queryStringParameters
	let obj1 = JSON.parse(event.body)
	let currentObj = {
		equId: new Date().getTime(),
		createTime: new Date().getTime(),
		icon: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d182cd49-8915-433c-886a-9bc554830d29/944504b2-7d27-4fb7-8cf7-cf9caa4329bb.jpg'
	}
	let obj = {... obj1, ...currentObj}
	
	let equipmentType = obj.equipmentType
	
	let callback = {}
	let isHasRes = await collection.where({
			equipmentType: equipmentType
		}).get()
	if (isHasRes.data.length) {
		callback = {
			message: '商品分类重复',
			status: 500
		}
	} else {		
		let res = await collection.add(obj)
		//返回数据给客户端
		callback = {
			message: '添加成功',
			status: 200,
			// id: res.id
		}
	}
	//返回数据给客户端
	return callback
};
