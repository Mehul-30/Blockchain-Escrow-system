const db = require("../Config/connectToSQL");
const { getIO } = require("../Config/socket");

// Buyer creates request
exports.createRequest = async (req, res) => {
  const { product_id, buyer_id, seller_id } = req.body;

  try {
    const [result] = await db.execute(
      "INSERT INTO purchase_requests (product_id, buyer_id, seller_id) VALUES (?, ?, ?)",
      [product_id, buyer_id, seller_id]
    );

    const io = getIO();

    io.to(seller_id.toString()).emit("notification", {
      message: "New purchase request",
      requestId: result.insertId,
    });

    res.json({ requestId: result.insertId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Seller approves
exports.sellerApprove = async (req, res) => {
  const { requestId } = req.body;

  try {
    await db.execute(
      "UPDATE purchase_requests SET status='seller_approved' WHERE id=?",
      [requestId]
    );

    const [[request]] = await db.execute(
      "SELECT buyer_id FROM purchase_requests WHERE id=?",
      [requestId]
    );

    const io = getIO();

    io.to(request.buyer_id.toString()).emit("notification", {
      message: "Seller approved. Confirm purchase.",
      requestId,
    });

    res.json({ message: "Approved" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buyer confirms → trigger escrow
exports.buyerConfirm = async (req, res) => {
  const { requestId } = req.body;

  try {
    await db.execute(
      "UPDATE purchase_requests SET status='buyer_confirmed' WHERE id=?",
      [requestId]
    );

    const [[request]] = await db.execute(
      "SELECT * FROM purchase_requests WHERE id=?",
      [requestId]
    );

    const [[product]] = await db.execute(
      "SELECT * FROM products WHERE id=?",
      [request.product_id]
    );

    const io = getIO();

    // send event to buyer frontend
    io.to(request.buyer_id.toString()).emit("createEscrow", {
      seller: product.walletAddress,
      amount: product.price,
      requestId,
    });

    res.json({ message: "Escrow triggered" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSeller = async (req, res) => {
   const sellerId = req.params.id;

  const [rows] = await db.execute(
    "SELECT * FROM purchase_requests WHERE seller_id=? AND status='pending'",
    [sellerId]
  );

  res.json(rows);
};

