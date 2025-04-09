// app/api/transactions/route.js
import pool from '@/app/api/sql/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const transaction = await request.json();
    
    // Validate required fields
    const requiredFields = ['user_id', 'from_address', 'to_address', 'transaction_type', 'amount', 'txHash'];
    for (const field of requiredFields) {
      if (!transaction[field]) {
        return NextResponse.json({ success: false, message: `${field} is required` }, { status: 400 });
      }
    }
    
    const { user_id, from_address, to_address, transaction_type, amount, txHash, expire_at } = transaction;
    
    const result = await pool.query(
      `INSERT INTO transactions 
      (user_id, from_address, to_address, transaction_type, amount, txHash, expire_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [user_id, from_address, to_address, transaction_type, amount, txHash, expire_at]
    );
    
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const walletAddress = url.searchParams.get('walletAddress') || userId; // Allow userId param to be a wallet address
    const type = url.searchParams.get('type');
    
    // Handle the case for received transactions
    if (type === 'received' && walletAddress) {
      const result = await pool.query(
        `SELECT * FROM transactions 
         WHERE to_address = $1 AND status = FALSE
         ORDER BY create_at DESC`,
        [walletAddress]
      );
      return NextResponse.json({ success: true, data: result.rows });
    } 
    // If userId is a number, treat it as an ID from the database
    else if (userId && !isNaN(parseInt(userId))) {
      const result = await pool.query(
        'SELECT * FROM transactions WHERE user_id = $1 ORDER BY create_at DESC',
        [userId]
      );
      return NextResponse.json({ success: true, data: result.rows });
    }
    // If userId looks like a wallet address, search transactions by from_address
    else if (walletAddress) {
      const result = await pool.query(
        'SELECT * FROM transactions WHERE from_address = $1 ORDER BY create_at DESC',
        [walletAddress]
      );
      return NextResponse.json({ success: true, data: result.rows });
    } else {
      return NextResponse.json({ success: false, message: 'Missing required parameters' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}