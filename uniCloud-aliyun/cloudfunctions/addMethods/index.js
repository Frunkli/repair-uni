'use strict';
/**
 * 此函数为外部系统调用云函数对维修显示列表进行的增删改查
*/
exports.main = async (event, context) => {
	const db = uniCloud.database(); //代码块为cdb
	const dbCmd = db.command
	const $ = dbCmd.aggregate
	const collection = db.collection('repair_methods');
	
	let obj = JSON.parse(event.body);
	let callback = {};
	
	if (event.path == '/add') {
		if (obj.phoneId == 0) {
			callback = {
				status: 500,
				message: '请从设备列表的录入问题入口进入该页面并开始录入'
			}
			return callback
		}
		
		let res = await collection.add(obj)
		callback = {
			message: '添加成功',
			status: 200,
			// id: res.id
		}
	} else if (event.path == '/update') {
		let res = await collection.doc(obj._id).update({
			problemType: obj.problemType,
			resloveName: obj.resloveName,
			desc: obj.desc,
			warrantyPeriod: obj.warrantyPeriod,
			price: obj.price	
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
	}
	
	return callback
};
