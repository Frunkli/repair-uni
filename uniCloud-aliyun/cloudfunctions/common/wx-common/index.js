const appId = "wx56cfb99a229f4633";
const appSecret = "9c1115f2f03f14e49611e6a0887c3c80";

const jwt = require("jsonwebtoken");

function getToken(openid) {
	return jwt.sign({
		openid: openid
	}, appSecret, {expiresIn: 60*60*24});
}

function verifyToken(token) {
	return jwt.verify(token, appSecret);	
}

module.exports = {
	appId: appId,
	appSecret: appSecret,
	getToken: getToken,
	verifyToken: verifyToken
}
