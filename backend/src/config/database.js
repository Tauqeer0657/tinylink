import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

let pool = null;

export const getPool = () => {
  if (!pool) {
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL 
    });
    
    pool.on('error', (err) => {
      console.error('Unexpected database error:', err);
    });
  }
  
  return pool;
};

export const initDatabase = async () => {
  const pool = getPool();
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS links (
      code VARCHAR(8) PRIMARY KEY,
      target_url TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      last_clicked_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await pool.query(createTableQuery);
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};
