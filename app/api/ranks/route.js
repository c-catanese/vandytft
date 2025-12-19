import sql from "../config/postgresConfig";
import { getAccountByRiotId, getAccountByPuuid, getLeagueByPuuid, getMatchIdsByPuuid, getMatch } from '../lib/riotApiClient';

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
    const successfulUpdates = results.filter(r => r !== null);

    console.log(`Rank updates completed. Success: ${successCount}, Failed: ${failCount}`);
    console.log('Successful updates:', successfulUpdates.map(r =>
      `${r.username} -> ${r.tier} ${r.division} (${r.lp} LP)`
    ));

    return {
      success: successCount,
      failed: failCount,
      details: successfulUpdates
    };
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

    // Log the FULL API response to debug set-specific data
    console.log(`[FULL-API-RESPONSE] ${currentUsername}:`, JSON.stringify(leagueResult.data, null, 2));

    // Extract RANKED_TFT data
    const tftData = leagueResult.data;
    let tier = 'UNRANKED';
    let division = '';
    let lp = 0;

    // Validate tftData is an array
    if (!Array.isArray(tftData)) {
      console.error(`[API-ERROR] tftData is not an array for ${currentUsername}:`, typeof tftData, tftData);
      tier = 'UNRANKED';
      division = '';
      lp = 0;
    } else {
      // Log all queue types to help debug set-specific data
      console.log(`Queue types for ${currentUsername}:`, tftData.map(entry => entry.queueType));

      // Check for multiple RANKED_TFT entries
      const rankedEntries = tftData.filter(entry => entry.queueType === 'RANKED_TFT');
      console.log(`[RANKED-ENTRIES-COUNT] ${currentUsername}: Found ${rankedEntries.length} RANKED_TFT entries`);

      if (rankedEntries.length > 1) {
        console.warn(`[MULTIPLE-ENTRIES] ${currentUsername} has multiple RANKED_TFT entries:`, JSON.stringify(rankedEntries, null, 2));
      }

      const rankedEntry = rankedEntries[0]; // Use first entry
      if (rankedEntry) {
        // Log the complete ranked entry to see all fields including potential set info
        console.log(`[RANKED-ENTRY-FULL] ${currentUsername}:`, JSON.stringify(rankedEntry, null, 2));

        // Use null coalescing to ensure valid values
        tier = rankedEntry.tier || 'UNRANKED';
        division = rankedEntry.rank || '';
        lp = rankedEntry.leaguePoints || 0;
        console.log(`${currentUsername} ranked data:`, { tier, division, lp, queueType: rankedEntry.queueType });
      } else {
        console.log(`No RANKED_TFT data found for ${currentUsername}. Available queues:`, tftData);
      }
    }

    // Verify rank is from Set 16 using Match API
    if (tier !== 'UNRANKED') {
      console.log(`[SET-VERIFICATION] ${currentUsername}: Checking if rank is from Set 16...`);

      const matchIdsResult = await getMatchIdsByPuuid(currentPuuid, 0, 1);
      if (matchIdsResult.success && matchIdsResult.data && matchIdsResult.data.length > 0) {
        const matchResult = await getMatch(matchIdsResult.data[0]);

        if (matchResult.success && matchResult.data) {
          const setNumber = matchResult.data.info.tft_set_number;
          console.log(`[MATCH-SET-CHECK] ${currentUsername}: Most recent match is Set ${setNumber}`);

          if (setNumber !== 16) {
            console.warn(`[STALE-DATA] ${currentUsername}: League API shows ${tier} ${division} ${lp} LP, but most recent match is Set ${setNumber}, not Set 16. Marking as UNRANKED for Set 16.`);
            tier = 'UNRANKED';
            division = '';
            lp = 0;
          } else {
            console.log(`[SET-VERIFIED] ${currentUsername}: Rank is from Set 16, using League API data`);
          }
        } else {
          console.warn(`[MATCH-API-FAILED] ${currentUsername}: Could not fetch match data to verify set. Using League API data as-is.`);
        }
      } else {
        console.warn(`[NO-MATCHES] ${currentUsername}: No recent matches found. Using League API data as-is.`);
      }
    }

    // Pre-update validation and logging
    console.log(`[PRE-UPDATE] User ${user.id}: tier=${tier} (${typeof tier}), division=${division} (${typeof division}), lp=${lp} (${typeof lp})`);

    // Validate data types
    if (typeof tier !== 'string' || !tier) {
      console.error(`[VALIDATION] Invalid tier for user ${user.id}: ${tier}`);
      return null;
    }
    if (typeof division !== 'string') {
      console.error(`[VALIDATION] Invalid division for user ${user.id}: ${division} (type: ${typeof division})`);
      return null;
    }
    if (typeof lp !== 'number' && typeof lp !== 'string') {
      console.error(`[VALIDATION] Invalid LP for user ${user.id}: ${lp} (type: ${typeof lp})`);
      return null;
    }
    if (!user.id) {
      console.error(`[VALIDATION] Missing user.id for ${currentUsername}`);
      return null;
    }

    // Update database with new rank data and potentially updated username/tagline/puuid
    const updateResult = await sql`
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

    console.log(`[UPDATE-RESULT] User ${user.id} (${currentUsername}): Rows affected: ${updateResult.count}`);

    if (updateResult.count === 0) {
      console.error(`[UPDATE-FAILED] No rows updated for user ID ${user.id}. User might not exist or WHERE clause failed.`);
      return null;
    }

    if (updateResult.length === 0) {
      console.error(`[UPDATE-FAILED] Update executed but returned no data for user ID ${user.id}`);
      return null;
    }

    return {
      username: currentUsername,
      tier: updateResult[0].tier,
      division: updateResult[0].division,
      lp: updateResult[0].lp,
      userId: user.id
    };
  } catch (error) {
    console.error(`Error updating rank for user ${user.username}:`, error.message);
    return null;
  }
}
