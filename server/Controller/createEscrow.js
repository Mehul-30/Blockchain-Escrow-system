const { contract, ethers } = require("../Config/blockchain");
const  pool  = require("../Config/connectToSQL");

exports.createEscrow = async (req, res, next) => {
  const { buyer, seller, amountEth, escrowId, userId } = req.body;

  try {
    await pool.execute(
      "INSERT INTO escrows (escrow_id_onchain, buyer_address, seller_address, amount_eth, status, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [escrowId, buyer, seller, amountEth, "Pending", userId]
    );
    res.send({ success: true, message: "Escrow stored off-chain" });
  } catch (err) {
    console.error("MYSQL INSERT ERROR:", err); 
    res.status(500).send({ error: err.message });
  }
};