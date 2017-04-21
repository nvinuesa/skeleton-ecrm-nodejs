const SessionService = require('./session-service');
const env = module.exports.env = process.env.NODE_ENV || 'dev';
const conf = require('../config/' + env + '.js');
const jwt = require('jsonwebtoken');

function requestValidation(req) {

	// Validate the profile received in the body of the request
	req.checkBody('password', 'Password can not be empty').notEmpty();
	req.checkBody('email', 'Profile\'s email can not be empty').notEmpty();
	req.sanitize('password').escape();
	req.sanitize('email').escape();
	req.sanitize('password').trim();
	req.sanitize('email').trim();
}


exports.login = function (req, res, next) {
	requestValidation(req);
	const err = req.validationErrors();
	// Check if there are any validation errors in the received profile, else save it
	if (err) {
		return next(err);
	} else {
		const email = req.body.email;
		const password = req.body.password;
		SessionService.login(email, password, (err, token) => {
			if (err) {
				return next(err);
			}
			res.json({
				token: token
			})
		})
	}
};

exports.isRevokedCallback = function (req, payload, done) {
	const issuer = payload.email;
	const tokenId = payload.jti;

	SessionService.isTokenRevoked(issuer, tokenId, (err, revoked) => {
		if (err) {
			return done(err);
		}
		return done(null, revoked);
	});
};

exports.logout = function (req, res, next) {

	let token;
	if (req.headers && req.headers.authorization) {
		const parts = req.headers.authorization.split(' ');
		if (parts.length === 2) {
			const scheme = parts[0];
			const credentials = parts[1];

			if (/^Bearer$/i.test(scheme)) {
				token = credentials;
			}
		}
	}
	if (typeof token === 'undefined') {
		const err = new Error('Missing JWT in header!');
		err.status = 401;
		next(err);
	}
	const decodedToken = jwt.verify(token, conf.jwt.secret);
	const email = decodedToken.email;
	const tokenId = decodedToken.jti;
	SessionService.logout(email, tokenId, (err) => {
		if (err) {
			return next(err);
		}
		res.status(200).end();
	})
};

exports.getSession = function (req, res, next) {
	res.json(token);
};
