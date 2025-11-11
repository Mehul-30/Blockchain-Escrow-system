import React, { useState, useEffect, useRef } from "react";
import axios from 'axios'

const BuyPage = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

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

  const orderSummaryRef = useRef(null);

  const handleOrder = (game) => {
    setSelectedGame(game);

    setTimeout(() => {
      orderSummaryRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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

      {selectedGame && (
        <div ref={orderSummaryRef} className="order-summary">
          <h3>Order Summary</h3>
          <p><b>Game:</b> {selectedGame.name}</p>
          <p><b>Price:</b> ₹{selectedGame.price}</p>
          <button onClick={() => alert("Proceed to payment (TODO)")}>
            Proceed to Pay
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyPage;
