const express = require("express");
const { createEscrow } = require("../Controller/createEscrow");
const { releaseEscrow } = require("../Controller/releaseAssests");
const router = express.Router();

router.route("/store").post(createEscrow)
router.route("/release").post(releaseEscrow)


module.exports = router;

