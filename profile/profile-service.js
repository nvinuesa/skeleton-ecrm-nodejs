const Profile = require('./profile-model');
const validator = require('validator');
const async = require('async');

function validateProfile(profile) {
    const name = profile.name;
    const email = profile.email;
    // Name must not be empty and must have minimum two words, email must not be empty and be a valid mail address
    return !validator.isEmpty(name)
        && name.split(' ').length >= 2
        && !validator.isEmpty(email)
        && validator.isEmail(email);
}

function invalidId(id) {
    const err = new Error('Profile id ' + id + ' is not valid!');
    err.status = 404;
    return err;
}

function invalidEmail(email) {
    const err = new Error('Profile email ' + email + ' is not valid!');
    err.status = 409;
    return err;
}

function profileNotFound(id) {
    const err = new Error('Profile ' + id + ' not found!');
    err.status = 404;
    return err;
}

exports.create = function (profile, next) {

    if (!validateProfile(profile)) {
        const err = new Error('Invalid profile format.');
        err.status = 409;
        return next(err)
    }
    async.waterfall([
            function (callback) {
                Profile.count({email: profile.email}, callback);
            },
            function (count, callback) {
                if (count !== 0) {
                    const err = new Error('Profile with email ' + profile.email + ' already exists!');
                    err.status = 409;
                    return callback(err);
                }
                callback();
            },
            function (callback) {
                profile.save((err) => {
                    callback(err)
                })
            }
        ],
        function (err) {
            return next(err);
        }
    );
};

exports.get = function (id, next) {

    // Validate the request's profile id (must be a valid MongoDB's ObjectID)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Profile.findById(id)
            .exec((err, profile) => {
                if (err) {
                    return next(err);
                }
                if (!profile) {
                    return next(profileNotFound(id));
                }
                // Successful, retrieve profile (with null error)
                return next(null, profile);
            });
    } else {
        return next(invalidId(id));
    }
};

exports.getByEmail = function (email, next) {

    // Validate the request's profile email
    if (validator.isEmail(email)) {
        Profile.findOne({email: email})
            .exec((err, profile) => {
                if (err) {
                    return next(err);
                }
                if (!profile) {
                    return next(profileNotFound(email));
                }
                // Successful, retrieve profile (with null error)
                return next(null, profile);
            });
    } else {
        return next(invalidEmail(email));
    }
};

exports.getWithPasswordByEmail = function (email, next) {

    // Validate the request's profile email
    if (validator.isEmail(email)) {
        Profile.findOne({email: email})
            .select('+password')
            .exec((err, profile) => {
                if (err) {
                    return next(err);
                }
                if (!profile) {
                    return next(profileNotFound(email));
                }
                // Successful, retrieve profile (with null error)
                return next(null, profile);
            });
    } else {
        return next(invalidEmail(email));
    }
};

exports.getAll = function (next) {

    Profile.find()
        .exec((err, profiles) => {
            if (err) {
                return next(err);
            }
            // Successful, retrieve all profile (with null error)
            return next(null, profiles);
        });
};

exports.update = function (id, profile, next) {

    // Validate the request's profile id (must be a valid MongoDB's ObjectID)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        if (!validateProfile(profile)) {
            const err = new Error('Invalid profile format.');
            err.status = 409;
            return next(err)
        }
        // Update the profile
        Profile.findByIdAndUpdate(id, {name: profile.name, email: profile.email})
            .exec((err, profile) => {
                if (err) {
                    return next(err);
                }
                if (!profile) {
                    return next(profileNotFound(id));
                }
                return next();
            });
    } else {
        return next(invalidId(id));
    }
};

exports.delete = function (id, next) {

    // Validate the request's profile id (must be a valid MongoDB's ObjectID)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // Delete the profile
        Profile.findByIdAndRemove(id)
            .exec((err, profile) => {
                if (err) {
                    return next(err);
                }
                if (!profile) {
                    return next(profileNotFound(id));
                }
                return next();
            });
    } else {
        return next(invalidId(id));
    }
};