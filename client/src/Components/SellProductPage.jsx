import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BACKEND_URL } from "../Config/config";

const SellProductPage = () => {
  const [formData, setFormData] = useState({
    productName: "",
    credentialId: "",
    password: "",
    price: "",
    walletAddress: "",
    accountType: "OAuth",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to list a product!");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const productData = { ...formData, user_id: userId };

      const res = await axios.post(
        `${BACKEND_URL}/products/sellproduct`,
        productData
      );

      alert(res.data.message || "Product registered successfully!");
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        if (error.response.status === 409) {
          alert("Product already exists!");
        } else if (error.response.status === 500) {
          alert("Server error while saving product.");
        } else {
          alert(error.response.data.message || "Unexpected error");
        }
      } else {
        alert("Failed to send request.");
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Register Product</h2>

      <form onSubmit={handleSubmit} className="register-form">
        
        <label>
          Product Name:
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </label>

        <label>Account Type:</label>

        <label>
          <input
            type="radio"
            name="accountType"
            value="OAuth"
            checked={formData.accountType === "OAuth"}
            onChange={handleChange}
          />
          Email Account
        </label>

        <label>
          <input
            type="radio"
            name="accountType"
            value="otp"
            checked={formData.accountType === "otp"}
            onChange={handleChange}
          />
          OTP Based Account
        </label>

        <label>
          {formData.accountType === "OAuth" ? "Email ID:" : "Phone Number:"}
          <input
            type="text"
            name="credentialId"
            value={formData.credentialId}
            onChange={handleChange}
            placeholder={
              formData.accountType === "OAuth"
                ? "Enter email"
                : "Enter phone number"
            }
            required
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Wallet Address:
          <input
            type="text"
            name="walletAddress"
            value={formData.walletAddress}
            onChange={handleChange}
            placeholder="0x..."
          />
        </label>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default SellProductPage;