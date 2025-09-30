const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Function to run migrations
async function runMigrations() {
  console.log('Checking database tables...');
  
  try {
    // Check if tables already exist
    const tablesExist = await checkTablesExist();
    
    if (tablesExist) {
      console.log('Database tables already exist. Skipping migrations.');
      return;
    }
    
    console.log('Running database migrations...');
    
    // Read and execute migration files in order
    const migrationDir = path.join(__dirname, '..', 'migrations');
    const migrationFiles = fs.readdirSync(migrationDir).sort();
    
    for (const file of migrationFiles) {
      if (file.endsWith('.sql')) {
        const filePath = path.join(migrationDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        console.log(`Executing migration: ${file}`);
        await pool.query(sql);
        console.log(`Migration ${file} completed successfully.`);
      }
    }
    
    console.log('All migrations completed successfully.');
  } catch (err) {
    console.error('Error running migrations:', err);
    throw err;
  }
}

// Check if main tables exist
async function checkTablesExist() {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      ) AND EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'bikes'
      ) as tables_exist;
    `);
    
    return result.rows[0].tables_exist;
  } catch (err) {
    console.error('Error checking tables existence:', err);
    return false;
  }
}

module.exports = { pool, runMigrations };