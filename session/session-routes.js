const express = require('express');
const router = express.Router();

const SessionController = require('./session-controller');

// Create JWT
router.post('/login', SessionController.login);
// Logout
router.get('/logout', SessionController.logout);

module.exports = router;
