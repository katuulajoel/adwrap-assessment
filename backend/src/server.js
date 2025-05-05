const express = require('express');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON bodies

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// TODO: Add API routes here

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
