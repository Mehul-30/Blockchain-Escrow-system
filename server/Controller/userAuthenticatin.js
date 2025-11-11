const db = require('../Config/connectToSQL');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (username, email, hashedPassword) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({
      user: {
        id: result.insertId,
        username,
        email,
      },
      status: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Error from server" });
  }
};


exports.userLogin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!password || (!username && !email)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let query, values;
    if (email) {
      query = "SELECT * FROM users WHERE email = ?";
      values = [email];
    } else {
      query = "SELECT * FROM users WHERE username = ?";
      values = [username];
    }

    const [userFetch] = await db.execute(query, values);

    if (userFetch.length === 0) {
      return res.status(400).json({ message: "User not found!" });
    }

    const user = userFetch[0];

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
      status: true,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error from server" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      "SELECT id, username, email FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

