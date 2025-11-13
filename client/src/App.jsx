import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BuyPage from "./Components/BuyPage";
import UserProfile from "./Components/UserProfile";
import SellProductPage from "./Components/SellProductPage";
import UserAuthentication from "./Components/UserAuthentication";
import CreateEscrow from "./Components/CreateEscrow";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); 
  }, []);

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <div>
          <Link to="/sellProduct" style={{ marginRight: "20px" }}>Sell</Link>
          <Link to="/buyProducts" style={{ marginRight: "20px" }}>Buy</Link>

          {isLoggedIn ? (
            <Link to="/userProfile" style={{ marginRight: "20px" }}>Profile</Link>
          ) : (
            <>
              <Link to="/userAuth" style={{ marginRight: "20px" }}>Register/Login</Link>
            </>
          )}
          {/* <Link to="/createEscrow" style={{ marginRight: "20px" }}>createEscrow</Link> */}
        </div>

        <hr />

        <Routes>
          <Route path="/sellProduct" element={<SellProductPage />} />
          <Route path="/buyProducts" element={<BuyPage />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/userAuth" element={<UserAuthentication setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/createEscrow" element={<CreateEscrow />} />
        </Routes>
        
      </div>
    </Router>
  );
};

export default App;
