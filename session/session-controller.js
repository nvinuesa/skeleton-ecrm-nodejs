// sign with default (HMAC SHA256)
const jwt = require('jsonwebtoken');

// sign with RSA SHA256
const token = jwt.sign({ foo: 'bar' }, 'sdf', { algorithm: 'HS512'});

function requestValidation(req) {

    // Validate the profile received in the body of the request
    req.checkBody('name', 'Profile\'s name can not be empty').notEmpty();
    req.checkBody('email', 'Profile\'s email can not be empty').notEmpty();
    req.checkBody('email', 'Profile\'s email is incorrect').isEmail();
    req.sanitize('name').escape();
    req.sanitize('email').escape();
    req.sanitize('name').trim();
    req.sanitize('email').trim();
}

exports.session_create = function (req, res, next) {
    res.json(token);
};

exports.session_get = function (req, res, next) {
    res.json(token);
};