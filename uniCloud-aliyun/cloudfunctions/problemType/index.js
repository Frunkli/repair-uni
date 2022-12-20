'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	const db = uniCloud.database(); //代码块为cdb
	const dbCmd = db.command;
	const collection = db.collection('problemType');
	let callback = {};
	
	if (event.path == '/add') {
		let obj = JSON.parse(event.body);
		let isHasRes = await collection.where({
				name: obj.name
			}).get()
		if (isHasRes.data.length) {
			callback = {
				message: '问题分类重复',
				status: 500
			}
		} else {
			let res = await collection.add(obj);
			callback = {
				status: 200,
				message: '添加成功'
			}
		}		
	} else if (event.path == '/query') {
		const problemRes = await db.collection('problemType').get()
		let problemList = problemRes.data || [];
		callback = {
			status: 200,
			data: problemList
		}
	}
	//返回数据给客户端
	return callback
};
