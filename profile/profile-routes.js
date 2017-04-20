const express = require('express');
const router = express.Router();

const ProfileController = require('./profile-controller');

// Create profile
router.post('/profiles', ProfileController.createProfile);
// Get profile
router.get('/profiles/:id', ProfileController.getProfile);
// Get all profiles
router.get('/profiles', ProfileController.getAllProfiles);
// Update profile
router.put('/profiles/:id', ProfileController.updateProfile);
// Delete profile
router.delete('/profiles/:id', ProfileController.deleteProfile);

module.exports = router;
