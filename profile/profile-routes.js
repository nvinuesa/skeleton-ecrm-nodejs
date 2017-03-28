const express = require('express');
const router = express.Router();

const profile_controller = require('./profile-controller');

// Get profiles
router.get('/profiles/:id', profile_controller.profile_get);

module.exports = router;