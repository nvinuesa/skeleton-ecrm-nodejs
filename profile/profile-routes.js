const express = require('express');
const router = express.Router();

const profile_controller = require('./profile-controller');

// Create profile
router.post('/profiles', profile_controller.profile_create);
// Get profiles
router.get('/profiles/:id', profile_controller.profile_get);
// Update profile
router.put('/profiles/:id', profile_controller.profile_update);
// Delete profile
router.delete('/profiles/:id', profile_controller.profile_delete);

module.exports = router;