#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Missing required env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const nowIso = new Date().toISOString();

const { data, error } = await supabase
  .from('groups')
  .delete()
  .lt('expires_at', nowIso)
  .select('id');

if (error) {
  console.error(`Failed to delete expired groups: ${error.message}`);
  process.exit(1);
}

console.log(`Deleted ${data?.length ?? 0} expired groups.`);
