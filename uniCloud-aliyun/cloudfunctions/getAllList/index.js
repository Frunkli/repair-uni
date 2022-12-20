'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database(); //代码块为cdb
	const dbCmd = db.command
	
	const collection = db.collection('mall_type');
	
	const typeRes = await db.collection('mall_type').get()
	
	let shopList = []
	let typeList = typeRes.data || [];
	let bool = false;
	
	for (var i = 0; i < typeList.length; i++) {
		//查询商品分类下的所属商品
		let list = await collection.where({
			navName: dbCmd.eq(typeList[i].navName)
		}).get()
		let obj = {
			name: typeList[i].navName,
			foods: list.data || []
		}
		bool = false;
		for (var j = 0; j < shopList.length; j++) {
			if (shopList[j].name == obj.name) {
				bool = true;
			}
		}
		if (!bool) {
			shopList.push(obj)
		}		
	}
	
	//返回数据给客户端
	return {
		data: shopList
	}
};
