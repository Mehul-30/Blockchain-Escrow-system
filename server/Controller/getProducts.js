const connectionPool = require('../Config/connectToSQL');

exports.getProducts = async (req, res, next) => {
  try {
    const [rows] = await connectionPool.execute("SELECT * FROM products");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};