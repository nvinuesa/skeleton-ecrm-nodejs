const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProfileSchema = Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true}
    }
);

// Virtual for book's URL
ProfileSchema
    .virtual('url')
    .get(function () {
        return '/profiles/' + this._id;
    });

//Export model
module.exports = mongoose.model('Profile', ProfileSchema);