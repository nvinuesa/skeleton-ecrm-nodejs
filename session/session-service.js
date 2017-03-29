const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const env = module.exports.env = process.env.NODE_ENV || 'dev';
const conf = require('../config/' + env + '.js');

const ProfileService = require('../profile/profile-service');

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

function generateToken(session, next) {
    jwt.sign(session, conf.jwt.secret, {expiresInMinutes: conf.jwt.expiration}, (err, token) => {
        if (err) {
            return next(err);
        }
        return next(null, token);
    });
}

function checkPassword(profile, password, next) {

    if (profile.password) {
        bcrypt.compare(password, user.password, (err, res) => {
            if (err) {
                return next(err);
            }
            return next(null, res);
        });
    }
}

exports.login = function (email, password, next) {

    ProfileService.getByEmail(email, (err, profile) => {
        if (err) {
            return next(err);
        }
        generateToken(profile, next);
    })
};

exports.logout = function (username, next) {
};