const db = require('../Config/connectToSQL');

// To get all the products

exports.getProducts = async (req, res, next) => {
  try {
    const [rows] = await db.execute("SELECT * FROM products WHERE status = 'available'");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// To register products

exports.registerProduct = async (req,res,next)=>{
    const { user_id, productName, credentialId, password, price, walletAddress } = req.body;

    try {
    const [existing] = await db.execute(
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

    const [result] = await db.execute(sql, [
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

// To get products for users

exports.getProductsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.execute(
      "SELECT id, productName, price, walletAddress FROM products WHERE user_id = ?",
      [userId]
    );

    res.status(200).json(rows);
    
  } catch (error) {
    console.error("Error fetching products by user ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};