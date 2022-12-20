'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const db = uniCloud.database(); //代码块为cdb
	const dbCmd = db.command
	const $ = dbCmd.aggregate
	const collection = db.collection('order');
	let queryStringParameters = event.queryStringParameters;
	let openid = queryStringParameters['openid'];
	let callBack = {};
	let res = null;
	
	if (event.path == '/seeOrderInfo') {
		let id = queryStringParameters['id'];
		
		res = await collection.doc(id).get()
		callBack = {
			status: 200,
			message: '',
			data: res.data[0]
		}
		return callBack
	}
	
	if (openid == '') {
		res = await db.collection('order').get()
		callBack = {
			status: 200,
			message: '',
			data: res.data.reverse()
		}
		return callBack
	} else {
		res = await collection.where({
			openid: openid
		}).get()
	}
		
	if (res.affectedDocs !== 0) {
		let data = res.data;
		let arr = [];
		data.forEach(item => {
			let orderIdInfo = {};
			let orderInfo = {};
			let payInfo = {};
			orderIdInfo.allPrice = item.allPrice;
			orderIdInfo.openid = item.openid;
			orderIdInfo.orderId = item.orderId;
			orderIdInfo.remark = item.remark;
			orderIdInfo.callNum = item.callNum;
			orderIdInfo.isPay = item.isPay;
			orderIdInfo.repairStatus = item.repairStatus;
			orderIdInfo.createTime = item.createTime;
			orderIdInfo._id = item._id;
			orderInfo.desc = item.desc;
			orderInfo.equipmentType = item.equipmentType;
			orderInfo.icon = item.icon;
			orderInfo.price = item.price;
			orderInfo.problemType = item.problemType;
			orderInfo.resloveName = item.resloveName;
			orderInfo.typeName = item.typeName;
			orderInfo.warrantyPeriod = item.warrantyPeriod;
			payInfo.appId = item.appId;
			payInfo.nonceStr = item.nonceStr;
			payInfo.package = item.package;
			payInfo.paySign = item.paySign;
			payInfo.signType = item.signType;
			payInfo.timeStamp = item.timeStamp;
			payInfo.timestamp = item.timestamp;
			let obj = {
				orderIdInfo,
				orderInfo,
				payInfo
			}
			arr.push(obj)
		})
		callBack = {
			status: 200,
			message: '',
			data: arr
		}
	}
	//返回数据给客户端
	return callBack
};
