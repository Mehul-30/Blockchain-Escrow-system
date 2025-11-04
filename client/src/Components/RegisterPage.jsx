import React, { useState } from "react";
import axios from "axios";


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    productName: "",
    credentialId: "",
    password: "",
    price: "",
    walletAddress: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Registering Product!:", formData);

      try {
      const res = await axios.post("http://localhost:5000/register", formData);
      alert(res.data.message);
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        if (error.response.status === 409) {

          alert("Product already exists!");
        } else if (error.response.status === 500) {

          alert("Server error while saving product. Please try again later.");
        } else {

          alert(`Error: ${error.response.data.message || "Unexpected error"}`);
        }
      } else if (error.request) {

        alert("No response from server. Check your connection.");
      } else {

        alert("Sorry! Failed to send request.");
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

        <label>
          credentialId:
          <input
            type="string"
            name="credentialId"
            value={formData.credentialId}
            onChange={handleChange}
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

export default RegisterPage;
