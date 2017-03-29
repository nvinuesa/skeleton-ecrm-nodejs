const express = require('express');
const router = express.Router();

const profileController = require('./profile-controller');

// Create profile
router.post('/profiles', profileController.createProfile);
// Get profile
router.get('/profiles/:id', profileController.getProfile);
// Get all profiles
router.get('/profiles', profileController.getAllProfiles);
// Update profile
router.put('/profiles/:id', profileController.updateProfile);
// Delete profile
router.delete('/profiles/:id', profileController.deleteProfile);

module.exports = router;