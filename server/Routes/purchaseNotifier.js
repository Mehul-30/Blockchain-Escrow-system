const express = require("express");
const router = express.Router();

const {
  createRequest,
  sellerApprove,
  buyerConfirm,
  getSeller,
} = require("../Controller/purchaseNotifier")


router.get("/seller/:id", getSeller);
router.post("/create", createRequest);
router.post("/approve", sellerApprove);
router.post("/confirm", buyerConfirm);

module.exports = router;