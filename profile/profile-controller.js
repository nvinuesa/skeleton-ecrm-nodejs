const Profile = require('./profile-model');

const async = require('async');

exports.profile_get = function (req, res, next) {

    console.log("get profile")
    Profile.findById(req.params.id)
        .exec(function (err, profile) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.json(profile);
        });
};