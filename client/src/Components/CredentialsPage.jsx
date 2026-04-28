import React from "react";
import { useLocation } from "react-router-dom";

const CredentialsPage = () => {
  const location = useLocation();
  const { credentials, escrowId } = location.state || {};

  if (!credentials) {
    return <h3>No credentials found</h3>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2> Asset Received</h2>

      <div style={{ border: "1px solid #ccc", padding: "15px" }}>
        <h3>{credentials.productName}</h3>
        <p><strong>Escrow ID:</strong> {escrowId}</p>
        <p><strong>Username:</strong> {credentials.username}</p>
        <p><strong>Password:</strong> {credentials.password}</p>
        <p><strong>Price:</strong> ₹{credentials.price}</p>
      </div>
    </div>
  );
};

export default CredentialsPage;