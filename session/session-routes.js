const express = require('express');
const router = express.Router();

const sessionController = require('./session-controller');

// // Get session
// router.get('/session', sessionController.getSession);
// Create session
router.post('/login', sessionController.login);
// // Logout
// router.post('/logout', sessionController.logout);

module.exports = router;