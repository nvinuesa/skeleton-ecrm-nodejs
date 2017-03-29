const express = require('express');
const router = express.Router();

const session_controller = require('./session-controller');

// Get session
router.get('/sessions', session_controller.session_get);
// Create session
router.post('/sessions', session_controller.session_create);

module.exports = router;