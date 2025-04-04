import sql from "../config/postgresConfig";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email'); 
    await updateUserRanks()
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



async function updateUserRanks() {
  try {
    // Get all users from the database
    const users = await sql`SELECT * FROM users`;
    const apiKey = process.env.RIOT_KEY;

    for (const user of users) {
      const { username, tagline } = user;


      const riotApiUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tagline}`;

      const apiResponse = await fetch(riotApiUrl, {
        method: 'GET',
        headers: {
          'X-Riot-Token': apiKey, 
        },
      });
      if (!apiResponse.ok) {
        // console.log(username)
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
    
      let tier = 'UNRANKED';
      let division = '';
      let lp = 0;
      for(let i = 0; i < tftData.length; i++) {
        if(tftData[i].queueType === 'RANKED_TFT') {
          tier = tftData[i].tier
          division = tftData[i].rank
          lp = tftData[i].leaguePoints
        }
      }

        const result = await sql`
          UPDATE users
          SET tier = ${tier}, division = ${division}, lp = ${lp}
          WHERE username = ${username}
          RETURNING *;
        `;

        // console.log(`Updated rank for user ${username}: Tier ${tier}, Division ${division}, LP ${lp}`);
    }

    console.log('Rank updates completed successfully.');
  } catch (error) {
    console.error('Error updating user ranks:', error);
  }
}
