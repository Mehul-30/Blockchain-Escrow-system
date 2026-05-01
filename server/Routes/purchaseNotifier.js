const express = require("express");
const router = express.Router();

const {
  createRequest,
  sellerApprove,
  buyerConfirm,
  getBuyerRequests,
  getSellerRequests,
} = require("../Controller/purchaseNotifier");
const { getBuyerPurchasedProducts } = require("../Controller/releaseAssests");


router.get("/seller/:id", getSellerRequests);
router.get("/buyer/:id", getBuyerRequests);
router.post("/create", createRequest);
router.post("/approve", sellerApprove);
router.post("/confirm", buyerConfirm);
router.get("/credentials/:userId", getBuyerPurchasedProducts );


module.exports = router;