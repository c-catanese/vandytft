// src/app/api/pgVersion/route.js
import postgres from 'postgres';

// Load environment variables
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

// Initialize postgres connection
const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false }, // Optional SSL handling
  connection: {
    application_name: ENDPOINT_ID,
  },
});

// Define the GET handler for the API route
export async function GET(request) {
  try {
    const result = await sql`SELECT version()`;
    
    // Return the PostgreSQL version as a JSON response
    return new Response(JSON.stringify({ version: result[0].version }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching PostgreSQL version:', error);
    
    // Return an error message if the query fails
    return new Response(JSON.stringify({ error: 'Database query failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
