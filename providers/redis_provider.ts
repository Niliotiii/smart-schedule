import { ApplicationService } from '@adonisjs/core/types'
import { Redis } from 'ioredis'
import env from '#start/env'

let redis: Redis | null = null

export default class RedisProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const host = env.get('REDIS_HOST')
    const port = Number(env.get('REDIS_PORT'))
    const password = env.get('REDIS_PASSWORD') || undefined
    const db = Number(env.get('REDIS_DB'))

    redis = new Redis({ host, port, password, db, lazyConnect: true })

    redis.on('error', (err) => {
      console.warn('[Redis] connection error:', err.message)
    })
  }

  async shutdown() {
    if (redis) {
      await redis.quit()
      redis = null
    }
  }
}

export function getRedis(): Redis {
  if (!redis) {
    throw new Error('Redis has not been initialized. Ensure the RedisProvider booted.')
  }
  return redis
}
