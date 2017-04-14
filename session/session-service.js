const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
        let session = {
            name: profile.name,
            email: profile.email
        };
        generateToken(session, next);
    })
};

exports.logout = function (username, next) {
};