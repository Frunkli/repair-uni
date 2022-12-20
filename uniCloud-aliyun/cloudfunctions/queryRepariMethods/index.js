'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const db = uniCloud.database(); //代码块为cdb
	const dbCmd = db.command
	const $ = dbCmd.aggregate
	const collection = db.collection('repair_methods');
	let queryStringParameters = event.queryStringParameters
	let id = queryStringParameters['id']
	
	
	let res = await collection.where({
		phoneId: id
	}).get()
	
	
	//返回数据给客户端
	return res.data
};
