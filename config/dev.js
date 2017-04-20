module.exports = {
	mongo: {
		url: 'mongodb://127.0.0.1:27017/ecrm'
	},
	log: {
		level: 'dev'
	},
	jwt: {
		secret: 'secret',
		expiration: 86400 // 24hs = 86400 sec
	}
};
