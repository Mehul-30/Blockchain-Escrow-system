const pool = require("../Config/connectToSQL");
const { getIO } = require("../Config/socket");

exports.releaseEscrow = async (req, res) => {
  const { escrowId } = req.body;

  try {
    await pool.execute(
      "UPDATE escrows SET status='completed' WHERE id=?",
      [escrowId]
    );

  
    const [[escrow]] = await pool.execute(
      "SELECT * FROM escrows WHERE id=?",
      [escrowId]
    );

    if (!escrow) {
      return res.status(404).json({ message: "Escrow not found" });
    }


    const [rows] = await pool.execute(
      "SELECT * FROM products WHERE id=?",
      [escrow.product_id]
    );

    if (rows.length === 0) {
      throw new Error("Product not found");
    }

    const productDetails = rows[0];

    const credentials = {
      productName: productDetails.productName,
      username: productDetails.credentialId,
      password: productDetails.password,
      price: productDetails.price
    };

    const [[user]] = await pool.execute(
      
    );

    if (!user) {
      throw new Error("Buyer not found");
    }

    const userId = user.id;

    const io = getIO();

    io.to(userId.toString()).emit("credentials", {
      escrowId,
      credentials,
    });

    const [admins] = await pool.execute(
      "SELECT id FROM users WHERE role = 'admin'"
    );

    admins.forEach((admin) => {
      io.to(admin.id.toString()).emit("adminNotification", {
        message: `Escrow ${escrowId} released`,
        escrowId,
      });
    });

    res.json({
      message: "Payment released & notifications sent",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};