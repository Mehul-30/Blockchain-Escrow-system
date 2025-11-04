import React, { useState, useEffect } from "react";
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

  const handleOrder = (game) => {
    setSelectedGame(game);
    console.log("Ordering:", game);
    // TODO: Send to backend or start UPI / crypto flow
  };

  if(games.length===0){
    return (
      <div>
        <h1>Loading</h1>
      </div>
    )
  }

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
        <div className="order-summary">
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
