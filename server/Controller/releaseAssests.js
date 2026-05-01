const db = require("../Config/connectToSQL");
const { ethers } = require("ethers");
const EscrowABI = require("../../smart_contract/artifacts/contracts/EscortContract.sol/EscrowUPI.json");
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  EscrowABI.abi,
  signer
);

exports.releaseEscrow = async (req, res) => {
  const { escrowId } = req.body;

  try {
    if (!escrowId) {
      return res.status(400).json({ error: "Escrow ID required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM escrows WHERE escrow_id=?",
      [escrowId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Escrow not found" });
    }

    const escrow = rows[0];
    if (escrow.status === "released") {
      return res.status(400).json({ error: "Already released" });
    }

    const tx = await contract.releasePayment(escrowId);

    await tx.wait();

    await db.query(
      "UPDATE escrows SET status='released' WHERE escrow_id=?",
      [escrowId]
    );


    res.json({
      message: "Funds released successfully",
      txHash: tx.hash,
    });

  } catch (err) {
    console.error("RELEASE ERROR:", err);

    res.status(500).json({
      error: err.message || "Release failed",
    });
  }
};

exports.getBuyerPurchasedProducts = async (req, res) => {
  const userId = req.params.userId;

  const [rows] = await db.query(`
    SELECT DISTINCT 
      p.id AS product_id,
      p.productName,
      p.credentialId,
      p.password
    FROM purchase_requests pr
    JOIN escrows e ON pr.escrow_id = e.escrow_id
    JOIN products p ON pr.product_id = p.id
    WHERE pr.buyer_id = ?
    AND e.status = 'released';
  `, [userId]);

  res.json(rows);
};