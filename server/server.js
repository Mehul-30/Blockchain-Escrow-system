const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use(require('./Routes/register'));
app.use(require('./Routes/products'));


app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
