const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// Salt constant for the encryption algorithm
const SALT_WORK_FACTOR = 10;

const ProfileSchema = Schema(
	{
		name: {type: String, required: true},
		email: {type: String, required: true},
		password: {type: String, select: false}
	}
);

// Virtual for profile's URL
ProfileSchema
	.virtual('url')
	.get(function () {
		return '/profiles/' + this._id;
	});

// Pre save for the profile schema (encrypt user password)
ProfileSchema
	.pre('save', function (next) {
		const user = this;
		if (!user.password) return next();

		bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
			if (err) {
				return next(err);
			}
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) {
					return next(err);
				}
				user.password = hash;
				next();
			});
		});
	});


//Export model
module.exports = mongoose.model('Profile', ProfileSchema);
