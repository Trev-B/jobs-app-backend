const express = require('express');
const router = express.Router();

const {
  login,
  register,
  requestPasswordReset,
  resetPassword,
} = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/requestPasswordReset', requestPasswordReset);
router.post('/resetPassword', resetPassword);

module.exports = router;
