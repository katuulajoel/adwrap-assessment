const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function waitForDatabase(maxAttempts = 5, delay = 5000) {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      console.log(`Attempt ${attempts + 1}/${maxAttempts}: Connecting to database...`);
      const client = await db.pool.connect();
      console.log('Database connection successful!');
      client.release();
      return true;
    } catch (err) {
      console.error('Database connection failed:', err.message);
      attempts++;
      if (attempts >= maxAttempts) {
        console.error('Maximum connection attempts reached. Exiting.');
        throw err;
      }
      console.log(`Waiting ${delay/1000} seconds before trying again...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function initDatabase() {
  try {
    // Wait for database to be ready
    await waitForDatabase();
    
    console.log('Initializing database...');
    
    // Read migration files from migrations folder
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir).sort();
    
    for (const file of migrationFiles) {
      if (file.endsWith('.sql')) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        console.log(`Running migration: ${file}`);
        await db.query(sql);
        console.log(`Migration ${file} completed successfully`);
      }
    }
    
    console.log('Database initialization complete');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = { initDatabase };