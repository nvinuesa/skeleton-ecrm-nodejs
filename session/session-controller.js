const SessionService = require('./session-service');

function requestValidation(req) {

    // Validate the profile received in the body of the request
    req.checkBody('password', 'Password can not be empty').notEmpty();
    req.checkBody('email', 'Profile\'s email can not be empty').notEmpty();
    req.sanitize('password').escape();
    req.sanitize('email').escape();
    req.sanitize('password').trim();
    req.sanitize('email').trim();
}


exports.login = function (req, res, next) {
    requestValidation(req);
    const err = req.validationErrors();
    // Check if there are any validation errors in the received profile, else save it
    if (err) {
        return next(err);
    } else {
        const email = req.body.email;
        const password = req.body.password;
        SessionService.login(email, password, (err, token) => {
            if (err) {
                return next(err);
            }
            res.json({
                token: token
            })
        })
    }
};

exports.getSession = function (req, res, next) {
    res.json(token);
};