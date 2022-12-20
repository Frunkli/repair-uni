'use strict';
const { verifyToken } = require("wx-common");

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	const { userInfo, token } = event;
	
	const db = uniCloud.database();
	const dbCmd = db.command;
	
	const payload = verifyToken(token);
	
	// 对一个数据项更新
	const dbRes = await db.collection("users").where({
		openid: dbCmd.eq(payload.openid)
	}).update({
		nickName: userInfo.nickName,
		openid: userInfo.openid,
		avatarUrl: userInfo.avatarUrl,
		gender: userInfo.gender,
		country: userInfo.country,
		province: userInfo.province,
		city: userInfo.city
	})
	
	//返回数据给客户端
	return dbRes.data
};
