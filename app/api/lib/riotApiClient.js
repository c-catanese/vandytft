import Bottleneck from 'bottleneck';

// Rate limiter for Account API (by-riot-id and by-puuid endpoints)
// 1000 requests per minute = 60ms between calls
const accountApiLimiter = new Bottleneck({
  minTime: 60,           // Minimum time between requests (ms)
  maxConcurrent: 10,     // Max concurrent requests
  reservoir: 1000,       // Token bucket capacity
  reservoirRefreshAmount: 1000,
  reservoirRefreshInterval: 60 * 1000  // 1 minute
});

// Rate limiter for League API (by-puuid endpoint)
// 1800 requests per second (safety margin under 2000/sec limit)
const leagueApiLimiter = new Bottleneck({
  minTime: 1,            // ~1800 req/sec
  maxConcurrent: 50,     // Max concurrent requests
  reservoir: 1800,       // Token bucket capacity
  reservoirRefreshAmount: 1800,
  reservoirRefreshInterval: 1000  // 1 second
});

// Add event listeners for debugging (optional)
accountApiLimiter.on('failed', async (error, jobInfo) => {
  console.error('Account API rate limiter job failed:', error.message);
});

leagueApiLimiter.on('failed', async (error, jobInfo) => {
  console.error('League API rate limiter job failed:', error.message);
});

/**
 * Make a rate-limited request with retry logic
 * @param {string} url - The API endpoint URL
 * @param {Bottleneck} limiter - The rate limiter to use
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<{success: boolean, data?: any, error?: string, statusCode?: number}>}
 */
async function makeRateLimitedRequest(url, limiter, maxRetries = 3) {
  const apiKey = process.env.RIOT_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'Riot API key not configured',
      statusCode: 500
    };
  }

  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Use the rate limiter to schedule the request
      const response = await limiter.schedule(async () => {
        return await fetch(url, {
          method: 'GET',
          headers: {
            'X-Riot-Token': apiKey,
          },
        });
      });

      // Handle successful responses
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data: data,
          statusCode: response.status
        };
      }

      // Handle 429 (rate limit) responses
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;

        console.warn(`Rate limit hit (429). Retrying after ${waitTime}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }

      // Handle 404 (not found) - don't retry
      if (response.status === 404) {
        return {
          success: false,
          error: 'Resource not found',
          statusCode: 404
        };
      }

      // Handle other error status codes
      const errorText = await response.text();
      lastError = {
        success: false,
        error: `API request failed: ${response.status} ${response.statusText}`,
        statusCode: response.status
      };

      // For server errors (5xx), retry with exponential backoff
      if (response.status >= 500 && attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.warn(`Server error ${response.status}. Retrying after ${waitTime}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      return lastError;
    } catch (error) {
      lastError = {
        success: false,
        error: `Network error: ${error.message}`,
        statusCode: 500
      };

      // Retry on network errors
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.warn(`Network error. Retrying after ${waitTime}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
    }
  }

  return lastError || {
    success: false,
    error: 'Request failed after all retry attempts',
    statusCode: 500
  };
}

/**
 * Get account information by Riot ID (username#tagline)
 * @param {string} gameName - The username (without the #)
 * @param {string} tagLine - The tagline (without the #)
 * @returns {Promise<{success: boolean, data?: {puuid: string, gameName: string, tagLine: string}, error?: string, statusCode?: number}>}
 */
export async function getAccountByRiotId(gameName, tagLine) {
  const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  return await makeRateLimitedRequest(url, accountApiLimiter);
}

/**
 * Get account information by PUUID
 * @param {string} puuid - The player's PUUID
 * @returns {Promise<{success: boolean, data?: {puuid: string, gameName: string, tagLine: string}, error?: string, statusCode?: number}>}
 */
export async function getAccountByPuuid(puuid) {
  const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${encodeURIComponent(puuid)}`;
  return await makeRateLimitedRequest(url, accountApiLimiter);
}

/**
 * Get league/rank information by PUUID (NEW - replaces summoner ID lookup)
 * @param {string} puuid - The player's PUUID
 * @returns {Promise<{success: boolean, data?: Array, error?: string, statusCode?: number}>}
 */
export async function getLeagueByPuuid(puuid) {
  const url = `https://na1.api.riotgames.com/tft/league/v1/by-puuid/${encodeURIComponent(puuid)}`;
  return await makeRateLimitedRequest(url, leagueApiLimiter);
}
