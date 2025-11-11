const express = require('express')
const { getProducts } = require('../Controller/getProducts')

const router = express.Router()

router.route('/').get(getProducts)

module.exports = router