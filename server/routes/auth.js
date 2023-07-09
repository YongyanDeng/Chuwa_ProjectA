const express = require('express');
const router = express.Router();
const { signup, signin, findUser, resetPassword } = require('../handlers/auth');
const { reset } = require('nodemon');

// /api/auth
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/passwordupdate', resetPassword);

module.exports = router;
