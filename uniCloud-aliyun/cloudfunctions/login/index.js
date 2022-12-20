'use strict';

const { appId, appSecret, getToken } = require("wx-common")
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	// jscode2session
	
	const db = uniCloud.database();
	
	const { code } = event;
	
	const res = await uniCloud.httpclient.request(
		"https://api.weixin.qq.com/sns/jscode2session?appid="+appId+"&secret="+appSecret+"&js_code="+code+"&grant_type=authorization_code",
		{
			dataType:"json"
		}
	)
	console.log(res,appId,appSecret)
	
	const openid = res.data.openid;
	
	let dbRes = await db.collection("users").where({
		openid: openid
	}).get();
	
	const token = getToken(openid);
	
	let userData;
	
	if (dbRes.affectedDocs <= 0) {
		userData = {
			openid: openid,
			nickName: '微信用户',
			avatarUrl: ""
		}
		
		await db.collection("users").add(userData)
		
	} else {
		userData = dbRes.data[0];
	}
	
	// delete userData['openid'];
	userData["token"] = token;
	
	//返回数据给客户端
	return userData
};
