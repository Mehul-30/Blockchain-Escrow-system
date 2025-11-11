const express = require("express");
const { getProductsByUserId } = require("../Controller/getUserProducts");
const router = express.Router();

router.route("/user/:userId").get(getProductsByUserId);

module.exports = router;
