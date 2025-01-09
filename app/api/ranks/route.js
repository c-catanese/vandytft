import sql from "../config/postgresConfig";

export async function GET(request) {
  try {
    // Get all users from the database
    const users = await sql`SELECT * FROM users`;

    // Ensure users is an array
    if (!Array.isArray(users)) {
      console.error('Expected an array of users, but received:', users);
      return new Response(JSON.stringify({ error: 'Users data format is invalid' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Now you can safely use .filter or loop through the users array
    for (const user of users) {
      const { username, tagline } = user;

      const apiKey = process.env.RIOT_KEY;

      try {
        const riotApiUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tagline}`;
        const apiResponse = await fetch(riotApiUrl, {
          method: 'GET',
          headers: { 'X-Riot-Token': apiKey },
        });

        if (!apiResponse.ok) {
          console.error(`Failed to fetch data for ${username}: Invalid username or tagline.`);
          continue; // Skip to next user
        }

        const { puuid } = await apiResponse.json();
        const summonerApiUrl = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}`;
        const summonerResults = await fetch(summonerApiUrl, {
          method: 'GET',
          headers: { 'X-Riot-Token': apiKey },
        });

        if (!summonerResults.ok) {
          console.error(`Failed to fetch summoner data for ${username}.`);
          continue;
        }

        const summonerData = await summonerResults.json();
        const summonerID = summonerData?.id;

        const tftApiUrl = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerID}`;
        const tftResults = await fetch(tftApiUrl, {
          method: 'GET',
          headers: { 'X-Riot-Token': apiKey },
        });

        if (!tftResults.ok) {
          console.error(`Failed to fetch TFT rank data for ${username}.`);
          continue;
        }

        const tftData = await tftResults.json();
        let tier = 'UNRANKED';
        let division = '';
        let lp = 0;

        for (let i = 0; i < tftData.length; i++) {
          if (tftData[i].queueType === 'RANKED_TFT') {
            tier = tftData[i].tier;
            division = tftData[i].rank;
            lp = tftData[i].leaguePoints;
          }
        }

        // Update user rank in the database
        await sql`
          UPDATE users
          SET tier = ${tier}, division = ${division}, lp = ${lp}
          WHERE username = ${username}
          RETURNING *;
        `;

        console.log(`Updated rank for user ${username}: Tier ${tier}, Division ${division}, LP ${lp}`);


      } catch (userError) {
        console.error(`Error updating rank for ${username}:`, userError);
        continue;
      }
    }

    console.log('Rank updates completed successfully.');
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error updating user ranks:', error);
    return new Response(JSON.stringify({ error: 'Failed to update user ranks' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
