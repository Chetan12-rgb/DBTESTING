import { NextResponse } from 'next/server';
import { getDbConnection } from '../../../lib/db';

// POST: Insert new submission into TiDB
export async function POST(request) {
  try {
    const { username, email, requirement } = await request.json();

    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username and Email are required.' },
        { status: 400 }
      );
    }

    const db = getDbConnection();
    const query = `
      INSERT INTO user_submissions (username, email, requirement)
      VALUES (?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [username, email, requirement || '']);

    return NextResponse.json({
      success: true,
      insertedId: result.insertId,
      message: 'Submission successfully recorded in TiDB!',
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Database execution failed: ' + error.message },
      { status: 500 }
    );
  }
}

// GET: Read all submissions from TiDB
export async function GET() {
  try {
    const db = getDbConnection();
    const [rows] = await db.execute('SELECT * FROM user_submissions ORDER BY created_at DESC');

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Database read failed: ' + error.message },
      { status: 500 }
    );
  }
}