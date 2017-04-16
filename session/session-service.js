const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const async = require('async');

const env = module.exports.env = process.env.NODE_ENV || 'dev';
const conf = require('../config/' + env + '.js');

const ProfileService = require('../profile/profile-service');

function generateToken(session, next) {
    jwt.sign(session, conf.jwt.secret, {expiresIn: conf.jwt.expiration}, (err, token) => {
        if (err) {
            return next(err);
        }
        return next(null, token);
    });
}

function checkPassword(profile, password, next) {

    let encryptedPassword = profile.password;
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
                    const err = new Error('Incorrect password for profile with email ' + profile.email);
                    err.status = 400;
                    return callback(err);
                }
                let session = {
                    name: profile.name,
                    email: profile.email
                };
                generateToken(session, callback);
            }
        ],
        function (err, token) {
            return next(err, token);
        }
    );
};

exports.logout = function (username, next) {
};