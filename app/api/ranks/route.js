import sql from "../config/postgresConfig";
import { getAccountByRiotId, getAccountByPuuid, getLeagueByPuuid } from '../lib/riotApiClient';

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

export async function PUT(request) {
  try {
    const result = await updateUserRanks();
    return new Response(JSON.stringify({
      message: 'Rank updates completed',
      ...result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating ranks:', error);
    return new Response(JSON.stringify({ error: 'Failed to update ranks' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}



async function updateUserRanks() {
  try {
    // Get all users from the database
    const users = await sql`SELECT * FROM users`;

    // Batch size (configurable via environment variable)
    const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '10', 10);

    // Process users in controlled batches
    const results = [];

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(users.length / BATCH_SIZE)} (${batch.length} users)`);

      const batchPromises = batch.map(user => updateSingleUser(user));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Optional: Add small delay between batches for extra safety
      if (i + BATCH_SIZE < users.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const successCount = results.filter(r => r !== null).length;
    const failCount = results.filter(r => r === null).length;

    console.log(`Rank updates completed. Success: ${successCount}, Failed: ${failCount}`);
    return { success: successCount, failed: failCount };
  } catch (error) {
    console.error('Error updating user ranks:', error);
    throw error;
  }
}

async function updateSingleUser(user) {
  try {
    let { username, tagline, puuid } = user;
    let currentUsername = username;
    let currentTagline = tagline;
    let currentPuuid = puuid;

    // Try username lookup first
    const accountResult = await getAccountByRiotId(username, tagline);

    if (!accountResult.success) {
      // Fallback to PUUID if available
      if (puuid) {
        console.log(`Username fetch failed for ${username}#${tagline}, trying PUUID fallback...`);
        const puuidResult = await getAccountByPuuid(puuid);

        if (!puuidResult.success) {
          console.error(`PUUID fallback failed for ${username}#${tagline}`);
          return null;
        }

        // Username changed - update from PUUID lookup
        currentUsername = puuidResult.data.gameName;
        currentTagline = puuidResult.data.tagLine;
        currentPuuid = puuidResult.data.puuid;
        console.log(`Username changed detected: ${username}#${tagline} -> ${currentUsername}#${currentTagline}`);
      } else {
        console.error(`Account lookup failed for ${username}#${tagline} (no stored PUUID)`);
        return null;
      }
    } else {
      // Username lookup succeeded
      currentPuuid = accountResult.data.puuid;
    }

    // Get rank data directly by PUUID (no summoner ID needed!)
    const leagueResult = await getLeagueByPuuid(currentPuuid);

    if (!leagueResult.success) {
      console.error(`Failed to fetch rank for ${currentUsername}#${currentTagline}`);
      return null;
    }

    // Extract RANKED_TFT data
    const tftData = leagueResult.data;
    let tier = 'UNRANKED';
    let division = '';
    let lp = 0;

    // Log all queue types to help debug set-specific data
    console.log(`Queue types for ${currentUsername}:`, tftData.map(entry => entry.queueType));

    const rankedEntry = tftData.find(entry => entry.queueType === 'RANKED_TFT');
    if (rankedEntry) {
      tier = rankedEntry.tier;
      division = rankedEntry.rank;
      lp = rankedEntry.leaguePoints;
      console.log(`${currentUsername} ranked data:`, { tier, division, lp, queueType: rankedEntry.queueType });
    } else {
      console.log(`No RANKED_TFT data found for ${currentUsername}. Available queues:`, tftData);
    }

    // Update database with new rank data and potentially updated username/tagline/puuid
    await sql`
      UPDATE users
      SET tier = ${tier},
          division = ${division},
          lp = ${lp},
          username = ${currentUsername},
          tagline = ${currentTagline},
          puuid = ${currentPuuid}
      WHERE id = ${user.id}
      RETURNING *;
    `;

    return { username: currentUsername, tier, division, lp };
  } catch (error) {
    console.error(`Error updating rank for user ${user.username}:`, error.message);
    return null;
  }
}
