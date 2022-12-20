'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database(); //代码块为cdb
	const dbCmd = db.command
	const $ = dbCmd.aggregate
	const collection = db.collection('order');
	
	let callback = {}
	let params = JSON.parse(event.body);
	
	let res = await collection.doc(params._id).update({
		repairStatus: params.repairStatus
	})
	
	if (res.updated == 1) {
		callback = {
			status: 200,
			message: '修改成功'
		}
	} else {
		callback = {
			status: 500,
			message: '修改失败'
		}
	}
	
	//返回数据给客户端
	return callback
};
