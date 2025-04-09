// db/schema.js
import pool from './db.mjs';

async function createTables() {
  try {
    // Tạo bảng Users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(255) NOT NULL UNIQUE
      );
    `);
    
    // Tạo bảng Transaction
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        from_address VARCHAR(255) NOT NULL,
        to_address VARCHAR(255) NOT NULL,
        transaction_type VARCHAR(50),
        amount DECIMAL(24, 18),
        txHash VARCHAR(255),
        status BOOLEAN DEFAULT FALSE,
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expire_at TIMESTAMP
      );
    `);

    console.log('Đã tạo bảng thành công');
  } catch (error) {
    console.error('Lỗi khi tạo bảng:', error);
  }
}

// Thực thi tạo bảng
createTables();