const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const router = require('./Router/route');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for requests from localhost:8081
app.use(cors({
  origin: 'http://localhost:8081', // Allow requests only from this origin
}));

app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Welcome to the server');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    console.log('Connected to MongoDB')
  })
  .catch((error) => console.error('Error connecting to MongoDB:', error));
