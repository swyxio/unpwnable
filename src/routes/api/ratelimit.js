// https://github.com/vercel/next.js/blob/canary/examples/api-routes-rate-limit/utils/rate-limit.ts
import LRU from 'lru-cache'


export default function rateLimit(options) {
  const tokenCache = new LRU({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (setHeaders, limit, token) =>
      /** @type {Promise<void>} */(new Promise((resolve, reject) => {
      const tokenCount = (tokenCache.get(token)) || [0]
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount)
      }
      tokenCount[0] += 1

      const currentUsage = tokenCount[0]
      const isRateLimited = currentUsage >= limit
      setHeaders({
        'X-RateLimit-Limit': limit,
        'X-RateLimit-Remaining': isRateLimited ? 0 : limit - currentUsage
      })

      return isRateLimited ? reject() : resolve()
    })),
  }
}