const express = require('express')
const { getProducts } = require('../Controller/allProducts')

const router = express.Router()

router.route('/products').get(getProducts)

module.exports = router