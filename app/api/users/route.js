import sql from "../config/postgresConfig"
import bcrypt from 'bcrypt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email'); 
    if (email) {
      const user = await sql`SELECT username, id, class, tagline, tier, division, lp FROM users WHERE email = ${email}`;
      return new Response(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const users = await sql`SELECT username, id, class, tagline, tier, division, lp FROM users`;
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

    const saltRounds = 10;  
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const apiKey =  process.env.RIOT_KEY; 
    const riotApiUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tagline}`;

    const apiResponse = await fetch(riotApiUrl, {
      method: 'GET',
      headers: {
        'X-Riot-Token': apiKey, 
      },
    });

    if (!apiResponse.ok) {
      throw new Error('Invalid username or tagline');
    }

    const { puuid } = await apiResponse.json();

    const summonerApiUrl = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}`;
    const summonerResults = await fetch(summonerApiUrl, {
      method: 'GET',
      headers: {
        'X-Riot-Token': apiKey,
      },
    });

    if (!summonerResults.ok) {
      throw new Error('Could not retrieve rank information');
    }
    const summonerData = await summonerResults.json();
    const summonerID = summonerData?.id


    const tftApiUrl = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerID}`;
    const tftResults = await fetch(tftApiUrl, {
      method: 'GET',
      headers: {
        'X-Riot-Token': apiKey,
      },
    });

    if (!tftResults.ok) {
      throw new Error('Could not retrieve rank information');
    }

    const tftData = await tftResults.json();

    let tier = '';
    let division = '';
    let lp = '';
    for(let i = 0; i < tftData.length; i++) {
      if(tftData[i].queueType === 'RANKED_TFT') {
        tier = tftData[i].tier
        division = tftData[i].rank
        lp = tftData[i].leaguePoints
      }
    }
    const result = await sql`
      INSERT INTO users (username, password, email, class, tagline, tier, division, lp)
      VALUES (${username}, ${hashedPassword}, ${email}, ${classYear}, ${tagline}, ${tier}, ${division}, ${lp})
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