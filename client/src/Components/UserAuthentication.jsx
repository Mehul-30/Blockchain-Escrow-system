import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserAuthentication = ({ setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState(""); 
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      if (!identifier || !password) {
        alert("Please enter your email/username and password");
        return;
      }

      const payload = identifier.includes("@")
        ? { email: identifier, password }
        : { username: identifier, password };

      const res = await axios.post("http://localhost:5000/user/login", payload);

      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      alert("Login successful!");
      navigate("/userProfile");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

 
  const handleRegister = async () => {
    try {
      if (!username || !identifier || !password) {
        alert("All fields are required");
        return;
      }

      const res = await axios.post("http://localhost:5000/user/register", {
        username,
        email: identifier,
        password,
      });

      alert("Registration successful! Please login now.");
      setIsLogin(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      {!isLogin && (
        <>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
        </>
      )}

      <input
        type="text"
        placeholder={isLogin ? "Email or Username" : "Email"}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      {isLogin ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <button onClick={handleRegister}>Register</button>
      )}

      <hr />

      {isLogin ? (
        <p>
          Haven’t registered yet?{" "}
          <button onClick={() => setIsLogin(false)}>Register here</button>
        </p>
      ) : (
        <p>
          Already have an account?{" "}
          <button onClick={() => setIsLogin(true)}>Login here</button>
        </p>
      )}
    </div>
  );
};

export default UserAuthentication;
