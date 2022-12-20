'use strict';
exports.main = async (event, context) => {
	// 把订单由未支付状态修改成已支付状态
	// 存储订单
	console.log('event : ', event)
	const db = uniCloud.database(); //代码块为cdb
	const dbCmd = db.command
	const $ = dbCmd.aggregate
	const collection = db.collection('order');
	let callBack = {}
	
	let time = { createTime: new Date().getTime(), repairStatus: 0 }
	let obj1 = {...(JSON.parse(event.body).data)}
	let obj = {...obj1.orderIdInfo, ...obj1.orderInfo, ...obj1.payInfo,  ...time}
		
	let hasOrder = await collection.where({
			orderId: obj.orderId
		}).get()
		
	if (hasOrder.data.length) {
		// 存在未支付订单
		return JSON.parse(event.body)
		let noobj = JSON.parse(event.body)
		let res = await collection.doc(noobj._id).update({
			nonceStr: noobj.nonceStr,
			package: noobj.package,
			paySign: noobj.paySign,
			signType: noobj.signType,
			timeStamp: noobj.timeStamp,
			timestamp: noobj.timestamp,
			isPay: true,
			payTime: new Date().getTime(),
			remark: noobj.remark,
			callNum: noobj.callNum
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
		
	} else {
		// 新订单
		let pays = obj.isPay ? { payTime: new Date().getTime() } : { payTime: null }
		obj = {...obj, ...pays}
		let res = await collection.add(obj)
		
		let resp = await collection.where({
			orderId: obj.orderId
		}).get()
		
		callBack = {
			status: 200,
			message: '添加成功',
			data: {
				orderIdInfo: {
					_id: resp.data[0]._id,
					allPrice: resp.data[0].allPrice,
					openid: resp.data[0].openid,
					orderId: resp.data[0].orderId,
					remark: resp.data[0].remark,
					callNum: resp.data[0].callNum,
					isPay: resp.data[0].isPay,
					repairStatus: resp.data[0].repairStatus,  // 0未维修 1维修中 2 维修完成 
					createTime: resp.data[0].createTime
				},
				orderInfo: {
					desc: resp.data[0].desc,
					equipmentType: resp.data[0].equipmentType,
					icon: resp.data[0].icon,
					price: resp.data[0].price,
					problemType: resp.data[0].problemType,
					resloveName: resp.data[0].resloveName,
					typeName: resp.data[0].typeName,
					warrantyPeriod: resp.data[0].warrantyPeriod
				}
			}
		}
	}
	
	//返回数据给客户端
	return callBack
};
