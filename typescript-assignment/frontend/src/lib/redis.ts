import Redis from 'ioredis';
import { THREE_WEEKS_SECONDS } from '../utils';

let redisClient: Redis | null = null;

/**
 * Gets or creates a Redis client instance (singleton pattern)
 */
export function getRedisClient(): Redis {
  if (typeof window !== 'undefined') {
    throw new Error('Redis client can only be used on the server');
  }

  if (!redisClient) {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 3,
    });

    redisClient.on('error', (err) => {
      console.error('Redis client error:', err);
    });
  }

  return redisClient;
}

interface CachedDataWithTimestamp<T> {
  data: T;
  timestamp: number;
}

/**
 * Gets data from Redis cache
 */
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient();
    const data = await client.get(key);

    if (!data) return null;

    const parsed: CachedDataWithTimestamp<T> = JSON.parse(data);
    return parsed.data;
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
}

/**
 * Gets data from Redis cache with timestamp for age checking
 */
export async function getCachedWithTimestamp<T>(
  key: string
): Promise<{ data: T; timestamp: number } | null> {
  try {
    const client = getRedisClient();
    const data = await client.get(key);

    if (!data) return null;

    const parsed: CachedDataWithTimestamp<T> = JSON.parse(data);
    return { data: parsed.data, timestamp: parsed.timestamp };
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
}

/**
 * Sets data in Redis cache with TTL
 * @param key Cache key
 * @param data Data to cache
 * @param ttl Time to live in seconds (default: 3 weeks - hard deletion after this)
 */
export async function setCached<T>(
  key: string,
  data: T,
  ttl: number = THREE_WEEKS_SECONDS
): Promise<void> {
  try {
    const client = getRedisClient();
    const payload: CachedDataWithTimestamp<T> = {
      data,
      timestamp: Date.now(),
    };
    await client.setex(key, ttl, JSON.stringify(payload));
  } catch (error) {
    console.error('Redis SET error:', error);
  }
}

/**
 * Deletes a key from Redis cache
 */
export async function deleteCached(key: string): Promise<void> {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    console.error('Redis DEL error:', error);
  }
}
