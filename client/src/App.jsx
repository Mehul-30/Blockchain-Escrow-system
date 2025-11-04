import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./Components/RegisterPage";
import BuyPage from "./Components/BuyPage";

const App = () => {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <div>
          <Link to="/register" style={{ marginRight: "20px" }}>Register</Link>
          <Link to="/buyProducts">Buy</Link>
        </div>

        <hr />
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/buyProducts" element={<BuyPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


