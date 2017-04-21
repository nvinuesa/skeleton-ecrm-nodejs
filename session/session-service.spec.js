const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const proxyquire = require('proxyquire');
const confStub = {
	redis: {}
};

describe('IsTokenRevoked', function () {
	it('should return false if the token is not revoked', function (done) {
		const SessionService = require('./session-service');
		const email = "foo@bar.com";
		const tokenId = "validToken";
		SessionService.isTokenRevoked(email, tokenId, function (err, bool) {
			expect(err).to.be.null;
			expect(bool).to.be.false;
			done();
		});
	});

	it('should return false if the token is revoked in Redis', function (done) {
		const SessionService = proxyquire('./session-service', {'../config/dev.js': confStub});

		const email = "foo@bar.com";
		const tokenId = "validToken";
		SessionService.isTokenRevoked(email, tokenId, function (err, bool) {
			expect(err).to.be.null;
			expect(bool).to.be.false;
			done();
		});
	});
});
