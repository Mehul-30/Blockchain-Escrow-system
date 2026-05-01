import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../Config/config";
import { jwtDecode } from "jwt-decode";

const CredentialsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = jwtDecode(token).id;

        const res = await axios.get(
          `${BACKEND_URL}/purchase/credentials/${userId}`
        );

        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Purchases</h1>

      <div>
        {products.length === 0 && <p>No purchases yet</p>}

        {products.map((p) => (
          <div
            key={p.product_id}
            onClick={() => {
              setSelectedProduct(p);
              setShowCredentials(false); 
            }}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            <h3>{p.productName}</h3>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "2px solid black",
          }}
        >
          <h2>{selectedProduct.productName}</h2>

          {!showCredentials ? (
            <>
              <p>Credentials are hidden</p>

              <button
                onClick={() => setShowCredentials(true)}
                style={{
                  padding: "8px 12px",
                  background: "black",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Show Credentials
              </button>
            </>
          ) : (
            <>
              <h3>Credentials</h3>

              <p>
                <strong>Username:</strong>{" "}
                {selectedProduct.credentialId}
              </p>

              <p>
                <strong>Password:</strong>{" "}
                {selectedProduct.password}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CredentialsPage;