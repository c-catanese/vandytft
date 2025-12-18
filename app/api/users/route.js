import sql from "../config/postgresConfig"
import bcrypt from 'bcrypt';
import { getAccountByRiotId, getLeagueByPuuid } from '../lib/riotApiClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (email) {
      const user = await sql`SELECT username, id, class, tagline, tier, division, lp, puuid FROM users WHERE email = ${email}`;
      return new Response(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const users = await sql`SELECT username, id, class, tagline, tier, division, lp, puuid FROM users`;
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
    const body = await request.json();
    const { username, password, email, classYear, tagline } = body;

    // Validate required fields
    if (!username || !password || !email || !classYear || !tagline) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate email format and domain
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!email.endsWith('@vanderbilt.edu')) {
      return new Response(JSON.stringify({ error: 'Email must be a Vanderbilt email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate password length
    if (password.length < 8) {
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate username
    if (username.trim().length < 3 || username.length > 50) {
      return new Response(JSON.stringify({ error: 'Username must be between 3 and 50 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate tagline
    if (tagline.trim().length === 0 || tagline.length > 10) {
      return new Response(JSON.stringify({ error: 'Invalid tagline' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate class year
    const currentYear = new Date().getFullYear();
    const classYearNum = parseInt(classYear, 10);
    if (isNaN(classYearNum) || classYearNum < 1900 || classYearNum > currentYear + 10) {
      return new Response(JSON.stringify({ error: 'Invalid class year' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Step 1: Get PUUID from username#tagline
    const accountResult = await getAccountByRiotId(username, tagline);
    if (!accountResult.success) {
      return new Response(JSON.stringify({
        error: accountResult.statusCode === 404
          ? 'Invalid username or tagline'
          : 'Failed to verify Riot account'
      }), {
        status: accountResult.statusCode || 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { puuid } = accountResult.data;

    // Step 2: Get rank data directly from PUUID (no summoner ID needed!)
    const leagueResult = await getLeagueByPuuid(puuid);
    if (!leagueResult.success) {
      return new Response(JSON.stringify({
        error: 'Could not retrieve rank information'
      }), {
        status: leagueResult.statusCode || 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract RANKED_TFT data from the array
    const tftData = leagueResult.data;
    let tier = '';
    let division = '';
    let lp = '';

    const rankedEntry = tftData.find(entry => entry.queueType === 'RANKED_TFT');
    if (rankedEntry) {
      tier = rankedEntry.tier;
      division = rankedEntry.rank;
      lp = rankedEntry.leaguePoints;
    }
    const result = await sql`
      INSERT INTO users (username, password, email, class, tagline, tier, division, lp, puuid)
      VALUES (${username}, ${hashedPassword}, ${email}, ${classYear}, ${tagline}, ${tier}, ${division}, ${lp}, ${puuid})
      RETURNING *
    `;

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