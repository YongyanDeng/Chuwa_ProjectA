require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

// const mongoose = require('./models/index');

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
})