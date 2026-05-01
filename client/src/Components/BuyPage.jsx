import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BACKEND_URL } from "../Config/config";

const BuyPage = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const res = await axios.get(`${BACKEND_URL}/products`);
      setGames(res.data);
    };
    fetchGames();
  }, []);

  const handleOrder = async (game) => {
    const token = localStorage.getItem("token");
    const buyer_id = jwtDecode(token).id;

    await axios.post(`${BACKEND_URL}/purchase/create`, {
      product_id: game.id,
      buyer_id,
      seller_id: game.user_id,
    });

    alert("Request sent!");
  };

  return (
    <div>
      <h2>Products</h2>
      {games.map((game) => (
        <div key={game.id}>
          <h3>{game.productName}</h3>
          <p>₹{game.price}</p>
          <button onClick={() => handleOrder(game)}>Buy</button>
        </div>
      ))}
    </div>
  );
};

export default BuyPage;