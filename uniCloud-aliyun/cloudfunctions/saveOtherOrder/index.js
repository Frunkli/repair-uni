'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database(); //代码块为cdb
	const dbCmd = db.command
	const $ = dbCmd.aggregate
	const collection = db.collection('order');
	let callBack = {}
	
	let obj = JSON.parse(event.body).data
	
	let res = await collection.doc(obj._id).update({
		nonceStr: obj.nonceStr,
		package: obj.package,
		paySign: obj.paySign,
		signType: obj.signType,
		timeStamp: obj.timeStamp,
		timestamp: obj.timestamp,
		isPay: true,
		payTime: new Date().getTime(),
		remark: obj.remark,
		callNum: obj.callNum
	})
	
	if (res.updated == 1) {
		callBack = {
			status: 200,
			message: '修改成功'
		}
	} else {
		callBack = {
			status: 500,
			message: '修改失败'
		}
	}
	
	return callBack
};
