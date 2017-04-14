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

    let encryptedPassword = ProfileService.getPasswordByEmail(profile.email, next);
    if (encryptedPassword) {
        bcrypt.compare(password, encryptedPassword, (err, res) => {
            if (err) {
                return next(err);
            }
            return next(null, res);
        });
    }
}

exports.login = function (email, password, next) {

    async.waterfall([
            function (callback) {
                ProfileService.getByEmail(email, callback);
            },
            function (profile, callback) {
                callback = {
                    profile, callback
                };
                checkPassword(profile, password, callback);
            },
            function (profile, checkPassword, callback) {
                console.log(checkPassword)
                let session = {
                    name: profile.name,
                    email: profile.email
                };
                generateToken(session, callback);
            }
        ],
        function (err) {
            return next(err);
        }
    );
};

exports.logout = function (username, next) {
};