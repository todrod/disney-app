import { supabase } from './supabase'

/**
 * Cache Record Interface
 */
export interface CacheRecord {
  id?: string
  agent: string // 'basil' | 'felix' | 'goofy' | 'ralph' | 'walt'
  key: string // Unique identifier for the cached data
  data: any // Structured JSON data
  expires_at: string // ISO timestamp
  created_at?: string
  updated_at?: string
}

/**
 * Memory Configuration for Each Agent
 */
export const AGENT_MEMORY_CONFIGS = {
  basil: {
    ttlSeconds: 4 * 60 * 60, // 4 hours - Disney changes infrequently
    tableName: 'basil_memory',
    description: 'Disney intelligence gathering'
  },
  felix: {
    ttlSeconds: 24 * 60 * 60, // 24 hours - architectural decisions stable
    tableName: 'felix_memory',
    description: 'App structure and build decisions'
  },
  goofy: {
    ttlSeconds: 12 * 60 * 60, // 12 hours - social media changes faster
    tableName: 'goofy_memory',
    description: 'Disney social media content'
  },
  ralph: {
    ttlSeconds: 24 * 60 * 60, // 24 hours - TBD role
    tableName: 'ralph_memory',
    description: 'TBD agent memory'
  },
  walt: {
    ttlSeconds: 7 * 24 * 60 * 60, // 7 days - strategic plans change slowly
    tableName: 'walt_memory',
    description: 'Strategic planning and decisions'
  }
}

/**
 * Get cached data from Supabase
 * @param agent - Agent name
 * @param key - Unique cache key
 * @returns Cached data if valid, null otherwise
 */
export async function getCachedData(agent: string, key: string): Promise<CacheRecord | null> {
  const config = AGENT_MEMORY_CONFIGS[agent as keyof typeof AGENT_MEMORY_CONFIGS]
  if (!config) {
    console.warn(`Unknown agent: ${agent}`)
    return null
  }

  const { data, error } = await supabase
    .from(config.tableName)
    .select('*')
    .eq('key', key)
    .gt('expires_at', new Date().toISOString())
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }

  return data as CacheRecord
}

/**
 * Store or update cached data in Supabase
 * @param agent - Agent name
 * @param key - Unique cache key
 * @param data - Data to cache
 * @param ttlSeconds - Optional custom TTL (uses agent default if not provided)
 * @returns Stored record
 */
export async function setCachedData(
  agent: string,
  key: string,
  data: any,
  ttlSeconds?: number
): Promise<CacheRecord> {
  const config = AGENT_MEMORY_CONFIGS[agent as keyof typeof AGENT_MEMORY_CONFIGS]
  if (!config) {
    throw new Error(`Unknown agent: ${agent}`)
  }

  const expiresAt = new Date(Date.now() + (ttlSeconds || config.ttlSeconds) * 1000).toISOString()

  // Check if record exists and update, or insert new
  const { data: existing } = await supabase
    .from(config.tableName)
    .select('id')
    .eq('key', key)
    .single()

  const record: Partial<CacheRecord> = {
    agent,
    key,
    data,
    expires_at: expiresAt
  }

  let result

  if (existing) {
    // Update existing record
    const { data: updated, error } = await supabase
      .from(config.tableName)
      .update(record)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    result = updated
  } else {
    // Insert new record
    const { data: inserted, error } = await supabase
      .from(config.tableName)
      .insert(record)
      .select()
      .single()

    if (error) throw error
    result = inserted
  }

  return result as CacheRecord
}

/**
 * Execute task with memory caching
 * This is the main function agents should use
 */
export async function withMemoryCache<T>(
  agent: string,
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds?: number
): Promise<{ data: T; source: 'cache' | 'fresh' }> {
  // Try to get cached data
  const cached = await getCachedData(agent, key)

  if (cached) {
    console.log(`[${agent.toUpperCase()}] CACHE_HIT: ${key}`)
    return { data: cached.data as T, source: 'cache' }
  }

  // Cache miss - fetch fresh data
  console.log(`[${agent.toUpperCase()}] CACHE_MISS: ${key}`)
  const freshData = await fetchFn()

  // Store in cache
  await setCachedData(agent, key, freshData, ttlSeconds)

  return { data: freshData, source: 'fresh' }
}

/**
 * Clear expired records for an agent
 * Useful for maintenance
 */
export async function clearExpiredCache(agent: string): Promise<number> {
  const config = AGENT_MEMORY_CONFIGS[agent as keyof typeof AGENT_MEMORY_CONFIGS]
  if (!config) {
    throw new Error(`Unknown agent: ${agent}`)
  }

  const { error } = await supabase
    .from(config.tableName)
    .delete()
    .lt('expires_at', new Date().toISOString())

  if (error) throw error

  return 0 // Supabase delete doesn't return count, but success means records were deleted
}

/**
 * Get cache statistics for an agent
 */
export async function getCacheStats(agent: string) {
  const config = AGENT_MEMORY_CONFIGS[agent as keyof typeof AGENT_MEMORY_CONFIGS]
  if (!config) {
    throw new Error(`Unknown agent: ${agent}`)
  }

  const { count: total } = await supabase
    .from(config.tableName)
    .select('*', { count: 'exact', head: true })

  const { count: expired } = await supabase
    .from(config.tableName)
    .select('*', { count: 'exact', head: true })
    .lt('expires_at', new Date().toISOString())

  return {
    total: total || 0,
    expired: expired || 0,
    valid: (total || 0) - (expired || 0)
  }
}
