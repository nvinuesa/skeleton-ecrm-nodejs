const express = require('express');
const router = express.Router();

const sessionController = require('./session-controller');

// Create JWT
router.post('/login', sessionController.login);

module.exports = router;