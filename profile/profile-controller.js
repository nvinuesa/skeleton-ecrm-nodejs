const Profile = require('./profile-model');
const ProfileService = require('./profile-service');

function requestValidation(req) {

    // Validate the profile received in the body of the request
    req.checkBody('name', 'Profile\'s name can not be empty').notEmpty();
    req.checkBody('email', 'Profile\'s email can not be empty').notEmpty();
    req.sanitize('name').escape();
    req.sanitize('email').escape();
    req.sanitize('name').trim();
    req.sanitize('email').trim();
}

exports.createProfile = function (req, res, next) {

    requestValidation(req);
    const err = req.validationErrors();
    // Check if there are any validation errors in the received profile, else save it
    if (err) {
        return next(err);
    } else {
        const profile = new Profile({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        ProfileService.create(profile, (err) => {
            if (err) {
                return next(err);
            }
            res.json(profile);
        });
    }
};

exports.getProfile = function (req, res, next) {

    const id = req.params.id;
    // Validate the request's profile id (must be a valid MongoDB's ObjectID)
    ProfileService.get(id, (err, profile) => {
        if (err) {
            return next(err);
        }
        res.json(profile);
    })
};

exports.getAllProfiles = function (req, res, next) {

    const id = req.params.id;
    // Validate the request's profile id (must be a valid MongoDB's ObjectID)
    ProfileService.getAll((err, profiles) => {
        if (err) {
            return next(err);
        }
        res.json(profiles);
    })
};

exports.updateProfile = function (req, res, next) {

    requestValidation(req);
    const err = req.validationErrors();
    // Check if there are any validation errors in the received profile, else save it
    if (err) {
        return next(err);
    } else {
        const id = req.params.id;
        const profile = new Profile({
            name: req.body.name,
            email: req.body.email
        });
        ProfileService.update(id, profile, (err) => {
            if (err) {
                return next(err);
            }
            res.json(profile);
        });
    }
};

exports.deleteProfile = function (req, res, next) {

    const id = req.params.id;
    ProfileService.delete(id, (err) => {
        if (err) {
            return next(err);
        }
        res.status(200).end();
    });
};