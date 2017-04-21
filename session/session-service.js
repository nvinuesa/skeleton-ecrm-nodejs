const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const async = require('async');
const LRU = require('lru-cache');
const redis = require("redis");

const env = module.exports.env = process.env.NODE_ENV || 'dev';
const conf = require('../config/' + env + '.js');
const ProfileService = require('../profile/profile-service');

const cacheOptions = {
	max: 1024 * 1024 * 5,
	maxAge: conf.jwt.expiration * 1000 // maximum age in ms
};
const memoryStore = LRU(cacheOptions);

function generateToken(session, next) {
	jwt.sign(session, conf.jwt.secret, {expiresIn: conf.jwt.expiration, jwtid: uuid.v4()}, (err, token) => {
		if (err) {
			return next(err);
		}
		return next(null, token);
	});
}

function checkPassword(profile, password, next) {

	const encryptedPassword = profile.password;
	if (encryptedPassword) {
		bcrypt.compare(password, encryptedPassword, (err, res) => {
			if (err) {
				return next(err);
			}
			return next(null, profile, res);
		});
	}
}

exports.login = function (email, password, next) {

	async.waterfall([
			function (callback) {
				ProfileService.getWithPasswordByEmail(email, callback);
			},
			function (profile, callback) {
				checkPassword(profile, password, callback);
			},
			function (profile, res, callback) {
				if (!res) {
					const err = new Error('invalid_credentials');
					err.status = 400;
					return callback(err);
				}
				let session = {
					name: profile.name,
					email: profile.email,
					id: profile._id
				};
				generateToken(session, callback);
			}
		],
		function (err, token) {
			return next(err, token);
		}
	);
};

exports.isTokenRevoked = function (email, tokenId, callback) {

	if (conf.redis) {
		// If redis is defined in the conf files

		const port = conf.redis.port || '6379'; // Redis default port
		const host = conf.redis.host || 'localhost';

		const client = redis.createClient(port, host);
		client.get(email, function (err, reply) {
			callback(err, reply === tokenId);
		})
	} else {
		//	Else we use the mem cache

		const reply = memoryStore.get(email);
		callback(null, reply === tokenId);
	}
};

exports.logout = function (email, tokenId, next) {

	if (conf.redis) {
		// If redis is defined in the conf files

		const port = conf.redis.port || '6379'; // Redis default port
		const host = conf.redis.host || 'localhost';

		const client = redis.createClient(port, host);
		client.set(email, tokenId, function (err) {
			next(err);
		})
	} else {
		//	Else we use the mem cache

		memoryStore.set(email, tokenId);
		next(null);
	}
};
