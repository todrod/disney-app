import { NextRequest } from 'next/server';
import { User } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '@/lib/goofy-beacon/supabase-server';

export async function requireAuthenticatedUser(request: NextRequest): Promise<User> {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) {
    throw new Error('Unauthorized: missing bearer token');
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    throw new Error('Unauthorized: invalid session');
  }

  return data.user;
}
