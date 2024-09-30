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

// Handler for GET and POST requests
export async function GET(request) {
  try {
    // Fetch all users from the database
    const users = await sql`SELECT * FROM users`;
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    // Parse the request body to get user data
    const body = await request.json();
    const { username, password, email, class: classYear, value } = body;

    // Insert a new user into the database
    const result = await sql`
      INSERT INTO users (username, password, email, class, value)
      VALUES (${username}, ${password}, ${email}, ${classYear}, ${value})
      RETURNING *
    `;

    // Return the inserted user data as a response
    return new Response(JSON.stringify(result[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ error: 'Failed to create user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
