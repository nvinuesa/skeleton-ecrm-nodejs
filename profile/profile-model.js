var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProfileSchema = Schema(
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