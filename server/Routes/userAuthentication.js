const express = require('express');
const { userRegister, userLogin, getUserById } = require('../Controller/userAuthenticatin');

const router = express.Router();

router.route('/register').post(userRegister)

router.route('/login').post(userLogin)

router.route("/:id").get(getUserById);

module.exports = router
