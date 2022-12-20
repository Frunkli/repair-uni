'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database(); //代码块为cdb
	const dbCmd = db.command
	const $ = dbCmd.aggregate
	const collection = db.collection('mall_type');
	let queryStringParameters = event.queryStringParameters
	let id = queryStringParameters['id']
	let callback = {}
	
	let res = await collection.doc(id).remove()
	
	if (res.deleted == 1) {
		callback = {
			status: 200,
			message: '删除成功'
		}
	} else {
		callback = {
			status: 500,
			message: '删除失败'
		}
	}
	
	//返回数据给客户端
	return callback

};
