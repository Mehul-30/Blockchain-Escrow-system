import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [requests, setRequests] = useState([]); 

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (setIsLoggedIn) setIsLoggedIn(false);
    alert("You have been logged out.");
    navigate("/userAuth");
  };

  // APPROVE REQUEST
  const handleApprove = async (requestId) => {
    try {
      await axios.post("http://localhost:5123/purchase/approve", {
        requestId,
      });

      alert("Approved!");

      // remove approved request from UI
      setRequests((prev) => prev.filter((r) => r.id !== requestId));

    } catch (err) {
      console.error(err);
    }
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

        // user info
        const userRes = await axios.get(`http://localhost:5123/user/${userId}`);
        setUser(userRes.data);

        // products
        const productRes = await axios.get(
          `http://localhost:5123/products/user/${userId}`
        );
        setUserProducts(productRes.data);

        // FETCH PURCHASE REQUESTS (IMPORTANT)
        const requestRes = await axios.get(
          `http://localhost:5123/purchase/seller/${userId}`
        );
        setRequests(requestRes.data);

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

      {/* PRODUCTS */}
      <h3>Your Products</h3>
      {userProducts.length > 0 ? (
        <div className="Product-list">
          {userProducts.map((Product) => (
            <div key={Product.id}>
              <h3>{Product.name}</h3>
              <p>Product ID: {Product.id}</p>
              <p>Price: ₹{Product.price}</p>
              <p>Wallet: {Product.walletAddress || "N/A"}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products listed yet.</p>
      )}

      <hr />

      {/* NEW SECTION: PURCHASE REQUESTS */}
      <h3>Purchase Requests</h3>

      {requests.length > 0 ? (
        <div>
          {requests.map((req) => (
            <div
              key={req.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <p>Request ID: {req.id}</p>
              <p>Product ID: {req.product_id}</p>

              <button onClick={() => handleApprove(req.id)}>
                Approve
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No pending requests</p>
      )}
    </div>
  );
};

export default UserProfile;