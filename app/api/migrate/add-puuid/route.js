import sql from "../../config/postgresConfig";

export async function POST(request) {
  try {
    // Add puuid column to users table if it doesn't exist
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS puuid TEXT
    `;

    return new Response(JSON.stringify({
      success: true,
      message: 'Successfully added puuid column to users table'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Migration error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
