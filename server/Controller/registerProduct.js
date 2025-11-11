const connectionPool = require('../Config/connectToSQL')

exports.registerProduct = async (req,res,next)=>{
    const { user_id, productName, credentialId, password, price, walletAddress } = req.body;

    try {
    const [existing] = await connectionPool.execute(
      "SELECT * FROM products WHERE productName = ? AND credentialId = ?",
      [productName, credentialId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Product already present" });
    }

    const sql = `
      INSERT INTO products (user_id, productName, credentialId, password, price, walletAddress)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connectionPool.execute(sql, [
      user_id,
      productName,
      credentialId,
      password,
      price,
      walletAddress,
    ]);

    res.status(200).json({ message: "Product registered!", id: result.insertId });

  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Database error", error: error.message });
  }
}