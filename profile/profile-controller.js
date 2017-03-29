const Profile = require('./profile-model');

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

function invalidId(id) {
    const err = new Error('Profile id ' + id + ' is not valid!');
    err.status = 404;
    return err;
}

exports.profile_create = function (req, res, next) {

    requestValidation(req);
    const err = req.validationErrors();
    // Check if there are any validation errors in the received profile, else save it
    if (err) {
        return next(err);
    } else {
        const profile = new Profile({
            name: req.body.name,
            email: req.body.email
        });
        // Check if provided profile's email exists in the collection
        Profile.count({email: profile.email}, (err, count) => {
            if (count !== 0) {
                const err = new Error('Profile with email ' + profile.email + ' already exists!');
                err.status = 409;
                return next(err);
            } else {
                profile.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.json(profile);
                })
            }
        })
    }
};

exports.profile_get = function (req, res, next) {

    const id = req.params.id;
    // Validate the request's profile id (must be a valid MongoDB's ObjectID)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Profile.findById(id)
            .exec(function (err, profile) {
                if (err) {
                    return next(err);
                }
                //Successful, so render
                res.json(profile);
            });
    } else {
        return next(invalidId(id));
    }
};

exports.profile_update = function (req, res, next) {

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
        // Validate the request's profile id (must be a valid MongoDB's ObjectID)
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            // Check if provided profile's id exists in the collection
            Profile.count({email: profile.email}, (err, count) => {
                if (count === 0) {
                    const err = new Error('Profile with id ' + id + ' does not exists!');
                    err.status = 404;
                    return next(err);
                } else {
                    // Update the profile
                    Profile.findByIdAndUpdate(id, {name: profile.name, email: profile.email})
                        .exec(function (err) {
                            if (err) {
                                return next(err);
                            }
                            //Successful, so render
                            res.json(profile);
                        });
                }
            });
        } else {
            return next(invalidId(id));
        }
    }
};

exports.profile_delete = function (req, res, next) {

    const id = req.params.id;
    // Validate the request's profile id (must be a valid MongoDB's ObjectID)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Profile.findByIdAndRemove(id)
            .exec(function (err) {
                if (err) {
                    return next(err);
                }
                res.status(200).end();
            });
    } else {
        return next(invalidId(id));
    }
};