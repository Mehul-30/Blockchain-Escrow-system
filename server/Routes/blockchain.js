const express = require("express");
const { createEscrow } = require("../Controller/createEscrow");
const { releaseEscrow } = require("../Controller/releaseAssests");
const { getPendingEscrows } = require("../Controller/purchaseNotifier");
const router = express.Router();

router.route("/store").post(createEscrow)
router.route("/release").post(releaseEscrow)
router.route("/pending").get(getPendingEscrows);


module.exports = router;

