// app/api/user/route.js
import pool from '@/app/api/sql/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { walletAddress } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json({ success: false, message: 'Wallet address is required' }, { status: 400 });
    }
    
    // First check if user already exists
    const checkUser = await pool.query(
      'SELECT * FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    
    if (checkUser.rows.length > 0) {
      return NextResponse.json({ success: true, data: checkUser.rows[0] });
    }
    
    // If not, create new user
    const result = await pool.query(
      'INSERT INTO users (wallet_address) VALUES ($1) RETURNING *',
      [walletAddress]
    );
    
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('API Error creating user:', error);
    return NextResponse.json({ success: false, message: 'Error creating user' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('walletAddress');
    
    if (!walletAddress) {
      return NextResponse.json({ success: false, message: 'Wallet address is required' }, { status: 400 });
    }
    
    const result = await pool.query(
      'SELECT * FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('API Error getting user:', error);
    return NextResponse.json({ success: false, message: 'Error getting user' }, { status: 500 });
  }
}