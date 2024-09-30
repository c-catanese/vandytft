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

    // Define your API key and the endpoint
    const apiKey = 'YOUR_RIOT_API_KEY'; // Replace with your actual API key
    const riotApiUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${classYear}`;

    // Check if the username is valid by making a GET request to the Riot API
    const apiResponse = await fetch(riotApiUrl, {
      method: 'GET',
      headers: {
        'X-Riot-Token': apiKey, // Set the Riot API key in the headers
      },
    });

    // Check if the API response is OK (status code 200)
    if (!apiResponse.ok) {
      throw new Error('Invalid username or class year');
    }

    // Proceed to insert the new user into the database
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