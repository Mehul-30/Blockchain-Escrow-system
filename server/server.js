const express = require('express');
const app = express();
const http = require("http");
const cors = require("cors");
require('dotenv').config();

app.use(cors());
app.use(express.json());

const { initSocket } = require("./Config/socket");

const server = http.createServer(app);


initSocket(server);

app.use("/purchase", require("./Routes/purchaseNotifier"));
app.use("/user", require("./Routes/userAuthentication"));   
app.use("/products", require("./Routes/products")); 
app.use("/api/escrow", require('./Routes/blockchain'));

// test route
app.get("/test", async (req, res) => {
  const balance = await wallet.getBalance();
  res.send(balance.toString());
});

server.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});