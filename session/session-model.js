const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = Schema(
	{
		profileId: {type: String, required: true},
		token: {type: String, required: true}
	}
);

//Export model
module.exports = mongoose.model('Session', SessionSchema);
