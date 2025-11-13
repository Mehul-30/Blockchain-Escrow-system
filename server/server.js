const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use("/user", require("./Routes/userAuthentication"));   
app.use("/products", require("./Routes/products")); 
app.use("/api/escrow", require('./Routes/blockchain'));


app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
