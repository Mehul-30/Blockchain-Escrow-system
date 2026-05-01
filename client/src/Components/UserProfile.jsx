import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { BACKEND_URL, CONTRACT_ADDRESS } from "../Config/config";
import EscrowABI from "../../../smart_contract/artifacts/contracts/EscortContract.sol/EscrowUPI.json";

const UserProfile = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState(null);
  const [buyerRequests, setBuyerRequests] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [adminEscrows, setAdminEscrows] = useState([]);

  const navigate = useNavigate();

  const isAdmin = user?.roles === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (setIsLoggedIn) setIsLoggedIn(false);
    navigate("/userAuth");
  };


  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/userAuth");
        return;
      }

      const userId = jwtDecode(token).id;

      const [userRes, productRes, sellerReqRes, buyerReqRes] =
        await Promise.all([
          axios.get(`${BACKEND_URL}/user/${userId}`),
          axios.get(`${BACKEND_URL}/products/user/${userId}`),
          axios.get(`${BACKEND_URL}/purchase/seller/${userId}`),
          axios.get(`${BACKEND_URL}/purchase/buyer/${userId}`),
          
        ]);

      setUser(userRes.data);
      setUserProducts(productRes.data);
      setRequests(sellerReqRes.data);
      setBuyerRequests(buyerReqRes.data);

      if (userRes.data.roles === "admin") {
        const escRes = await axios.get(`${BACKEND_URL}/escrow/pending`);
        setAdminEscrows(escRes.data);
      }

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

    const handleRelease = async (escrowId) => {
    try {
      await axios.post(`${BACKEND_URL}/escrow/release`, {
        escrowId,
      });

      alert("Funds Released!");

      // refresh
      setAdminEscrows((prev) =>
        prev.map((e) =>
          e.escrow_id === escrowId
            ? { ...e, status: "released" }
            : e
        )
      );

    } catch (err) {
      console.error(err);
      alert("Release failed");
    }
  };


  const handleApprove = async (requestId) => {
    try {
      await axios.post(`${BACKEND_URL}/purchase/approve`, {
        requestId,
      });

      alert("Approved!");

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "approved" } : r
        )
      );

      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirm = async (request) => {
  try {
    if (!window.ethereum) {
      alert("Install MetaMask!");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const signer = await provider.getSigner();

    const network = await provider.getNetwork();
    if (network.chainId !== 31337n) {
      alert("Switch to localhost network");
      return;
    }

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      EscrowABI.abi,
      signer
    );

    const sellerAddress = request.walletAddress || request.seller_id;

    if (!sellerAddress) {
      alert("Seller wallet missing");
      return;
    }

    const tx = await contract.createEscrow(sellerAddress, {
      value: ethers.parseEther(request.amount.toString()),
    });

    alert("Transaction sent...");

    await tx.wait();

    const escrowId = await contract.escrowCount();

    await axios.post(`${BACKEND_URL}/purchase/confirm`, {
      requestId: request.id,
      escrowId: escrowId.toString(),
      txHash: tx.hash,
    });

    alert("Escrow created & payment confirmed!");

    setBuyerRequests((prev) =>
      prev.map((r) =>
        r.id === request.id
          ? { ...r, status: "confirmed", escrow_id: escrowId.toString() }
          : r
      )
    );

  } catch (err) {
    console.error(err);
    alert(err.message || "Escrow creation failed");
  }
};
  useEffect(() => {
    fetchAllData();
  }, []);

  if (!user) return <h2>Loading user profile...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Profile</h1>

      <h3>{user.username}</h3>
      <p>{user.email}</p>
      <p>Wallet: {user.walletAddress || "Not linked"}</p>

      <button onClick={handleLogout}>Logout</button>

      <hr />

    
      <h3>Your Products</h3>
      {userProducts.length > 0 ? (
        userProducts.map((p) => (
          <div key={p.id}>
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
          </div>
        ))
      ) : (
        <p>No products</p>
      )}

      <hr />

      <h3>Purchase Requests (Seller)</h3>
      {requests.length === 0 ? (
        <p>No requests</p>
      ) : (
        requests.map((req) => (
          <div
            key={req.id}
            style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
          >
            <p>ID: {req.id}</p>
            <p>Status: {req.status}</p>

            {req.status === "pending" && (
              <button onClick={() => handleApprove(req.id)}>
                Approve
              </button>
            )}
          </div>
        ))
      )}

      <hr />

      <h3>My Purchases</h3>

      {buyerRequests.length === 0 ? (
        <p>No purchases</p>
      ) : (
        buyerRequests.map((req) => (
          <div
            key={req.id}
            style={{
              border: "1px solid green",
              margin: "10px",
              padding: "10px",
            }}
          >
            <p>ID: {req.id}</p>
            <p>Status: {req.status}</p>
            <p>Price: {req.amount}</p>

            {req.status === "approved" && (
              <button onClick={() => handleConfirm(req)}>
                Confirm Payment
              </button>
            )}

            {req.status === "confirmed" && (
              <p style={{ color: "green" }}>Payment Confirmed </p>
            )}
          </div>
        ))
      )}

      <hr />

      {isAdmin && (
        <>
          <h3>Admin Panel (Escrow Release)</h3>

          {adminEscrows.length === 0 ? (
            <p>No pending escrows</p>
          ) : (
            adminEscrows.map((e) => (
              <div
                key={e.escrow_id}
                style={{
                  border: "2px solid red",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <p>Escrow ID: {e.escrow_id}</p>
                <p>Buyer: {e.buyer_id}</p>
                <p>Amount: ₹{e.amount}</p>
                <p>Status: {e.status}</p>

                {e.status === "locked" && (
                  <button onClick={() => handleRelease(e.escrow_id)}>
                    Release Funds
                  </button>
                )}

                {e.status === "released" && (
                  <p style={{ color: "green" }}>Released </p>
                )}
              </div>
            ))
          )}
        </>
      )}


    </div>
  );
};

export default UserProfile;