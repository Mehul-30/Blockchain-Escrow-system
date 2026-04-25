import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BuyPage = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get("http://localhost:5123/products");

        const formattedGames = res.data.map((item) => ({
          id: item.id,
          name: item.productName,
          price: item.price,
          owner: item.walletAddress,
          seller_id: item.user_id, 
        }));

        setGames(formattedGames);
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    };

    fetchGames();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed.");
      return null;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      return accounts[0];

    } catch (err) {
      console.error("Wallet connection error:", err);
      return null;
    }
  };

  // 🔥 FIXED: send request instead of navigating
  const handleOrder = async (game) => {
    try {
      const account = await connectWallet();
      if (!account) return;

      const token = localStorage.getItem("token");
      if (!token) return alert("Login first");

      const decoded = jwtDecode(token);
      const buyer_id = decoded.id;

      await axios.post("http://localhost:5123/purchase/create", {
        product_id: game.id,
        buyer_id,
        seller_id: game.seller_id, 
      });

      alert("Purchase request sent to seller!");

    } catch (err) {
      console.error(err);
      alert("Error sending request");
    }
  };

  return (
    <div className="buy-container">
      <h2>Available Game Assets</h2>

      <div className="Product-list">
        {games.map((game) => (
          <div key={game.id} className="product-card">
            <h3>{game.name}</h3>
            <p>Game ID: {game.id}</p>
            <p>Owner: {game.owner}</p>
            <p>Price: ₹{game.price}</p>

            <button onClick={() => handleOrder(game)}>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyPage;