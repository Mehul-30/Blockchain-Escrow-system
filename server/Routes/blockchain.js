const express = require("express");
const { createEscrow } = require("../Controller/createEscrow");
const router = express.Router();

router.route("/store").post(createEscrow)

module.exports = router;

