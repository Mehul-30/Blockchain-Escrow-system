const express = require('express');
const { getProducts, getProductsByUserId, registerProduct } = require('../Controller/controlProducts');

const router = express.Router()

router.route('/').get(getProducts)
router.route("/user/:userId").get(getProductsByUserId);
router.route('/sellproduct').post(registerProduct)


module.exports = router