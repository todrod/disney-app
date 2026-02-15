import { supabase } from './supabase'

// =============================================
// TypeScript Interfaces for Specialized Tables
// =============================================

export interface Event {
  id?: string
  title: string
  park: string
  location?: string
  event_date?: string
  description?: string
  source?: string
  confidence?: number
  cache_key?: string
  ttl?: number
  last_updated?: string
  created_at?: string
}

export interface Merch {
  id?: string
  name: string
  park: string
  location?: string
  release_date?: string
  description?: string
  source?: string
  cache_key?: string
  ttl?: number
  last_updated?: string
  created_at?: string
}

export interface WaitTime {
  id?: string
  ride: string
  park: string
  minutes?: number
  cache_key?: string
  ttl?: number
  last_updated?: string
  created_at?: string
}

export interface SocialPost {
  id?: string
  post_title: string
  caption?: string
  hashtags?: string[]
  media_required?: string
  cache_key?: string
  last_updated?: string
  created_at?: string
}

export interface TransportRoute {
  id?: string
  start_location: string
  end_location: string
  route_steps?: Record<string, any>
  est_minutes?: number
  cache_key?: string
  ttl?: number
  last_updated?: string
  created_at?: string
}

export interface AgentLog {
  id?: string
  agent_name: string
  action: string
  model_used?: string
  cache_status?: 'cache_hit' | 'cache_miss' | 'bypass'
  tokens_estimated?: number
  created_at?: string
}

// =============================================
// Events Table Functions (Basil)
// =============================================

export async function getEvents(filters?: { park?: string; event_date?: string }): Promise<Event[]> {
  let query = supabase.from('events').select('*')

  if (filters?.park) {
    query = query.eq('park', filters.park)
  }
  if (filters?.event_date) {
    query = query.gte('event_date', filters.event_date)
  }

  const { data, error } = await query.order('event_date', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getEventByCacheKey(cacheKey: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('cache_key', cacheKey)
    .single()

  if (error || !data) return null
  return data
}

export async function upsertEvent(event: Event): Promise<Event> {
  const expiresAt = new Date(Date.now() + (event.ttl || 43200) * 1000).toISOString() // 12 hours default (Walt's rule)

  const { data, error } = await supabase
    .from('events')
    .upsert({
      ...event,
      last_updated: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// =============================================
// Merch Table Functions (Basil)
// =============================================

export async function getMerch(filters?: { park?: string; name?: string }): Promise<Merch[]> {
  let query = supabase.from('merch').select('*')

  if (filters?.park) {
    query = query.eq('park', filters.park)
  }
  if (filters?.name) {
    query = query.ilike('name', `%${filters.name}%`)
  }

  const { data, error } = await query.order('release_date', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getMerchByCacheKey(cacheKey: string): Promise<Merch | null> {
  const { data, error } = await supabase
    .from('merch')
    .select('*')
    .eq('cache_key', cacheKey)
    .single()

  if (error || !data) return null
  return data
}

export async function upsertMerch(merch: Merch): Promise<Merch> {
  const { data, error } = await supabase
    .from('merch')
    .upsert({
      ...merch,
      ttl: merch.ttl || 86400, // 24 hours default (Walt's rule)
      last_updated: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// =============================================
// Wait Times Table Functions (Basil - Real-time)
// =============================================

export async function getWaitTimes(park?: string): Promise<WaitTime[]> {
  let query = supabase.from('wait_times').select('*')

  if (park) {
    query = query.eq('park', park)
  }

  const { data, error } = await query.order('last_updated', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getWaitTime(ride: string, park: string): Promise<WaitTime | null> {
  const cacheKey = `${park.toLowerCase()}:${ride.toLowerCase().replace(/\s+/g, '-')}`

  const { data, error } = await supabase
    .from('wait_times')
    .select('*')
    .eq('cache_key', cacheKey)
    .gt('last_updated', new Date(Date.now() - 600000).toISOString()) // Fresh if < 10 min
    .single()

  if (error || !data) return null
  return data
}

export async function updateWaitTime(ride: string, park: string, minutes: number): Promise<WaitTime> {
  const cacheKey = `${park.toLowerCase()}:${ride.toLowerCase().replace(/\s+/g, '-')}`

  const { data, error } = await supabase
    .from('wait_times')
    .upsert({
      ride,
      park,
      minutes,
      cache_key: cacheKey,
      ttl: 600, // 10 minutes
      last_updated: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function batchUpdateWaitTimes(updates: { ride: string; park: string; minutes: number }[]): Promise<void> {
  const records = updates.map(u => ({
    ride: u.ride,
    park: u.park,
    minutes: u.minutes,
    cache_key: `${u.park.toLowerCase()}:${u.ride.toLowerCase().replace(/\s+/g, '-')}`,
    ttl: 600,
    last_updated: new Date().toISOString()
  }))

  const { error } = await supabase.from('wait_times').upsert(records)

  if (error) throw error
}

// =============================================
// Social Posts Table Functions (Goofy)
// =============================================

export async function getSocialPosts(limit: number = 50): Promise<SocialPost[]> {
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getSocialPostByCacheKey(cacheKey: string): Promise<SocialPost | null> {
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .eq('cache_key', cacheKey)
    .single()

  if (error || !data) return null
  return data
}

export async function createSocialPost(post: SocialPost): Promise<SocialPost> {
  const { data, error } = await supabase
    .from('social_posts')
    .insert(post)
    .select()
    .single()

  if (error) throw error
  return data
}

// =============================================
// Transport Routes Table Functions
// =============================================

export async function getTransportRoute(from: string, to: string): Promise<TransportRoute | null> {
  const cacheKey = `transport:${from.toLowerCase()}:${to.toLowerCase()}`

  const { data, error } = await supabase
    .from('transport_routes')
    .select('*')
    .eq('cache_key', cacheKey)
    .single()

  if (error || !data) return null
  return data
}

export async function upsertTransportRoute(route: TransportRoute): Promise<TransportRoute> {
  const cacheKey = `transport:${route.start_location.toLowerCase()}:${route.end_location.toLowerCase()}`

  const { data, error } = await supabase
    .from('transport_routes')
    .upsert({
      ...route,
      cache_key: cacheKey,
      ttl: route.ttl || 2592000, // 30 days default (Walt's rule)
      last_updated: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Invalidate transport routes on construction alert
 * Reduces TTL to 24 hours when Basil detects route construction/maintenance
 */
export async function invalidateTransportRoutes(affectedRoutes: { start_location: string; end_location: string }[]): Promise<void> {
  const updates = affectedRoutes.map(route => ({
    start_location: route.start_location,
    end_location: route.end_location,
    cache_key: `transport:${route.start_location.toLowerCase()}:${route.end_location.toLowerCase()}`,
    ttl: 86400, // 24 hours (construction alert override - Walt's rule)
    last_updated: new Date().toISOString()
  }))

  const { error } = await supabase.from('transport_routes').upsert(updates)

  if (error) throw error
}

// =============================================
// Agent Logs Table Functions (Walt - Performance Tracking)
// =============================================

export async function logAgentAction(log: Omit<AgentLog, 'id' | 'created_at'>): Promise<AgentLog> {
  const { data, error } = await supabase
    .from('agent_logs')
    .insert(log)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAgentLogs(filters?: {
  agent_name?: string
  cache_status?: 'cache_hit' | 'cache_miss' | 'bypass'
  limit?: number
}): Promise<AgentLog[]> {
  let query = supabase.from('agent_logs').select('*')

  if (filters?.agent_name) {
    query = query.eq('agent_name', filters.agent_name)
  }
  if (filters?.cache_status) {
    query = query.eq('cache_status', filters.cache_status)
  }

  query = query.order('created_at', { ascending: false })

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getCacheStats(): Promise<{
  totalLogs: number
  cacheHits: number
  cacheMisses: number
  byAgent: Record<string, { hits: number; misses: number; hitRate: number }>
}> {
  const { data: logs } = await supabase
    .from('agent_logs')
    .select('agent_name, cache_status')
    .gt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days

  if (!logs) {
    return { totalLogs: 0, cacheHits: 0, cacheMisses: 0, byAgent: {} }
  }

  const stats: Record<string, { hits: number; misses: number }> = {}
  let cacheHits = 0
  let cacheMisses = 0

  for (const log of logs) {
    if (!stats[log.agent_name]) {
      stats[log.agent_name] = { hits: 0, misses: 0 }
    }

    if (log.cache_status === 'cache_hit') {
      stats[log.agent_name].hits++
      cacheHits++
    } else if (log.cache_status === 'cache_miss') {
      stats[log.agent_name].misses++
      cacheMisses++
    }
  }

  const byAgent: Record<string, { hits: number; misses: number; hitRate: number }> = {}

  for (const [agent, s] of Object.entries(stats)) {
    const total = s.hits + s.misses
    byAgent[agent] = {
      hits: s.hits,
      misses: s.misses,
      hitRate: total > 0 ? Math.round((s.hits / total) * 100) : 0
    }
  }

  return {
    totalLogs: logs.length,
    cacheHits,
    cacheMisses,
    byAgent
  }
}

// =============================================
// Utility Functions
// =============================================

export async function clearExpiredRecords(): Promise<{ table: string; deleted: number }[]> {
  const tables = ['events', 'merch', 'wait_times', 'social_posts', 'transport_routes']
  const results = []

  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .delete()
      .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // 30 days

    if (!error) {
      results.push({ table, deleted: 0 }) // Supabase doesn't return count
    }
  }

  return results
}
