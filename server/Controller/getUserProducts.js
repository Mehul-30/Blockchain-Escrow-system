const db = require('../Config/connectToSQL')


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
