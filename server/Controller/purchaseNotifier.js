const db = require("../Config/connectToSQL");

exports.createRequest = async (req, res) => {
  const { product_id, buyer_id, seller_id } = req.body;

  try {
    const [result] = await db.execute(
      "INSERT INTO purchase_requests (product_id, buyer_id, seller_id, status) VALUES (?, ?, ?, 'pending')",
      [product_id, buyer_id, seller_id]
    );

    res.json({
      message: "Request created successfully",
      requestId: result.insertId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.sellerApprove = async (req, res) => {
  const { requestId } = req.body;

  try {
    await db.execute(
      "UPDATE purchase_requests SET status='approved' WHERE id=?",
      [requestId]
    );

    res.json({
      message: "Request approved by seller",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.buyerConfirm = async (req, res) => {
  const { requestId, escrowId, txHash } = req.body;

  try {

    await db.query(
      `UPDATE purchase_requests 
       SET status='confirmed', escrow_id=?, tx_hash=? 
       WHERE id=?`,
      [escrowId, txHash, requestId]
    );

    const [rows] = await db.query(
      `SELECT * FROM purchase_requests WHERE id=?`,
      [requestId]
    );

    const request = rows[0];

    await db.query(
      `INSERT INTO escrows 
      (escrow_id, buyer_id, seller_id, product_id, status)
      VALUES (?, ?, ?, ?, ?)`,
      [
        escrowId,
        request.buyer_id,
        request.seller_id,
        request.product_id,
        "locked",
      ]
    );

    res.json({ message: "Escrow created and stored" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to confirm purchase" });
  }
  
};


exports.getSellerRequests = async (req, res) => {
  const sellerId = req.params.id;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM purchase_requests WHERE seller_id=? AND status='pending'",
      [sellerId]
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getBuyerRequests = async (req, res) => {
  const buyerId = req.params.id;

  try {
    const [rows] = await db.execute(
      "SELECT p.price as amount,walletAddress,pr.status,pr.id,pr.buyer_id,pr.product_id FROM purchase_requests pr JOIN products p ON pr.product_id = p.id WHERE pr.buyer_id = ?",
      [buyerId]
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPendingEscrows = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM escrows WHERE status='locked'"
  );
  res.json(rows);
};

