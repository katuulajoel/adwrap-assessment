const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { initDatabase } = require('./db/init');

// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API documentation with Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('ADWrap Media Management API is running! Visit <a href="/api-docs">API Documentation</a>');
});

// Import routes
const workspaceRoutes = require('./routes/workspaceRoutes');
const mediaItemRoutes = require('./routes/mediaItemRoutes');

// Use routes
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/media-items', mediaItemRoutes);

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize and connect to the database
    await initDatabase();
    
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`API Documentation available at http://localhost:${port}/api-docs`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
