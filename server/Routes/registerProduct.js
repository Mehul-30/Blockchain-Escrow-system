const express = require('express')
const { registerProduct } = require('../Controller/registerProduct')

const router = express.Router()

router.route('/sellproduct').post(registerProduct)


module.exports = router