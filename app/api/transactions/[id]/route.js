    // app/api/transactions/[id]/route.js
    import pool from '@/app/api/sql/db';
    import { NextResponse } from 'next/server';

    export async function PATCH(request, { params }) {
        try {
          const id = params.id;
          const { status, transaction_type } = await request.json();
      
          if (status === undefined) {
            return NextResponse.json({ success: false, message: 'Status is required' }, { status: 400 });
          }
      
          let query = 'UPDATE transactions SET status = $1';
          const values = [status];
      
          if (transaction_type) {
            query += `, transaction_type = $2`;
            values.push(transaction_type);
          }
      
          query += ` WHERE id = $${values.length + 1} RETURNING *`;
          values.push(id);
      
          const result = await pool.query(query, values);
          
          if (result.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
          }
          
          return NextResponse.json({ success: true, data: result.rows[0] });
        } catch (error) {
          console.error('API Error:', error);
          return NextResponse.json({ 
            success: false, 
            message: error.message || 'Internal server error' 
          }, { status: 500 });
        }
      }
      