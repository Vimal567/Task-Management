const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);

module.exports = router;