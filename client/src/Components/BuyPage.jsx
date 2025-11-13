import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import axios from 'axios'

const BuyPage = () => {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        const formattedGames = res.data.map((item) => ({
          id: item.id,
          name: item.productName,
          price: item.price,
          owner: item.walletAddress,
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
      alert("MetaMask is not installed. Please install it.");
      return null;
    }

    try {
      // Check existing accounts
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        // Already connected
        console.log("Already connected:", accounts[0]);
        return accounts[0];
      }

      // Not connected → request connection
      const newAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected:", newAccounts[0]);
      return newAccounts[0];

    } catch (err) {
      console.error("MetaMask connection error:", err);
      return null;
    }
  };

  const handleOrder = async (game) => {
    
    const account = await connectWallet();

    if (!account) return;

    navigate("/createEscrow", { state: { game, account } });
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
            <button onClick={() => handleOrder(game)}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyPage;
