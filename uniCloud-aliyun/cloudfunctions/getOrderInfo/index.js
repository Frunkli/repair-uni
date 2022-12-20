'use strict';
const unipay = require('uni-pay')
exports.main = async (event, context) => {
	const unipayIns = unipay.initWeixin({
		appId: 'wx56cfb99a229f4633',
		mchId: '1635084126',   // 商户号
		key: 'ojcfxb5mbbwf7yhcf943hqunil77kjgc'  // 商户秘钥
	})
	
	let orderInfo = await unipayIns.getOrderInfo({
		openid: event.openid,
		body: '支付测试',
		outTradeNo: event.orderId,
		totalFee: 1,   // 金额，单位分
		notifyUrl: 'https://d182cd49-8915-433c-886a-9bc554830d29.bspapp.com/http/callback'   // 支付结果通知地址
	})
	
	//返回数据给客户端
	return {
		orderInfo
	}
};
