import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (setIsLoggedIn) setIsLoggedIn(false);
    alert("You have been logged out.");
    navigate("/userAuth");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/userAuth");
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const userRes = await axios.get(`http://localhost:5000/user/${userId}`);
        setUser(userRes.data);

        const productRes = await axios.get(`http://localhost:5000/products/user/${userId}`);
        setUserProducts(productRes.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchData();
  }, [navigate]);

  if (!user) return <h2>Loading user profile...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Profile</h1>
      <h3>Username: {user.username}</h3>
      <p>Email: {user.email}</p>
      <p>Wallet Address: {user.walletAddress || "Not linked yet"}</p>
      <button onClick={handleLogout}>Logout</button>

      <hr />

      <h3>Your Products</h3>
      {userProducts.length > 0 ? (
        userProducts.map((p) => (
          <div key={p.id}>
            <h4>{p.productName}</h4>
            <p>Product ID: {p.id}</p>
            <p>Price: ₹{p.price}</p>
            <p>Wallet: {p.walletAddress || "N/A"}</p>
          </div>
        ))
      ) : (
        <p>No products listed yet.</p>
      )}
    </div>
  );
};

export default UserProfile;
