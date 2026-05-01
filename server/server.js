const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();

app.use(cors());
app.use(express.json());


app.use("/purchase", require("./Routes/purchaseNotifier"));
app.use("/user", require("./Routes/userAuthentication"));   
app.use("/products", require("./Routes/products")); 
app.use("/escrow", require('./Routes/blockchain'));


app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${process.env.PORT}`);
});