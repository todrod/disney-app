'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabaseBrowser } from '@/lib/goofy-beacon/supabase-browser';
import { GroupStateMember } from '@/types/goofy-beacon';

const BeaconMap = dynamic(() => import('@/components/goofy-beacon/BeaconMap'), {
  ssr: false,
  loading: () => <div className="rounded-xl border border-border bg-surface2 p-4 text-text-muted">Loading map…</div>,
});

interface MyGroupItem {
  groupId: string;
  displayName: string;
  optedIn: boolean;
  group: {
    id: string;
    name: string;
    invite_code: string;
    owner_user_id: string;
    expires_at: string;
  };
}

interface GroupState {
  group: {
    id: string;
    name: string;
    invite_code: string;
    owner_user_id: string;
    expires_at: string;
  };
  membership: {
    group_id: string;
    user_id: string;
    display_name: string;
    opted_in: boolean;
  };
  members: GroupStateMember[];
  telegramLinked: boolean;
}

interface GroupClientProps {
  initialGroupId?: string;
}

export default function GroupClient({ initialGroupId }: GroupClientProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const [groups, setGroups] = useState<MyGroupItem[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId ?? '');
  const [groupState, setGroupState] = useState<GroupState | null>(null);
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState('');

  const [createName, setCreateName] = useState('');
  const [createDisplayName, setCreateDisplayName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [joinDisplayName, setJoinDisplayName] = useState('');

  const token = session?.access_token;

  const selectedMyGroup = useMemo(
    () => groups.find((group) => group.groupId === selectedGroupId),
    [groups, selectedGroupId]
  );

  async function authedFetch(path: string, init?: RequestInit) {
    const headers = new Headers(init?.headers ?? {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    if (!headers.has('Content-Type') && init?.body) headers.set('Content-Type', 'application/json');
    return fetch(path, { ...init, headers });
  }

  const refreshGroups = async () => {
    if (!token) return;
    const response = await authedFetch('/api/groups/my');
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error ?? 'Failed to load groups');
      return;
    }
    setGroups(data.groups ?? []);

    if (!selectedGroupId && data.groups?.length) {
      setSelectedGroupId(initialGroupId && data.groups.some((item: MyGroupItem) => item.groupId === initialGroupId)
        ? initialGroupId
        : data.groups[0].groupId);
    }
  };

  const refreshGroupState = async (groupId = selectedGroupId) => {
    if (!token || !groupId) return;
    setLoadingState(true);
    setError('');
    try {
      const response = await authedFetch(`/api/groups/${groupId}/state`);
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setGroupState(null);
        setError(data.error ?? 'Failed to load group state');
        return;
      }
      setGroupState(data as GroupState);
    } finally {
      setLoadingState(false);
    }
  };

  const signIn = async () => {
    setAuthMessage('');
    if (!email.trim()) return;
    const response = await supabaseBrowser.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/group`,
      },
    });

    if (response.error) {
      setAuthMessage(response.error.message);
      return;
    }

    setAuthMessage('Magic link sent. Check your email.');
  };

  const signOut = async () => {
    await supabaseBrowser.auth.signOut();
    setSession(null);
    setUser(null);
    setGroups([]);
    setGroupState(null);
  };

  const createGroup = async () => {
    const response = await authedFetch('/api/groups/create', {
      method: 'POST',
      body: JSON.stringify({ name: createName, displayName: createDisplayName || 'Owner', expiresInHours: 48 }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error ?? 'Failed to create group');
      return;
    }
    setCreateName('');
    setInviteCode(data.inviteCode ?? '');
    await refreshGroups();
    setSelectedGroupId(data.group.id);
    await refreshGroupState(data.group.id);
  };

  const joinGroup = async () => {
    const response = await authedFetch('/api/groups/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode, displayName: joinDisplayName || 'Teammate' }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error ?? 'Failed to join group');
      return;
    }
    await refreshGroups();
    setSelectedGroupId(data.groupId);
    await refreshGroupState(data.groupId);
  };

  const setOptIn = async (optIn: boolean) => {
    if (!selectedGroupId) return;
    const response = await authedFetch('/api/groups/optin', {
      method: 'POST',
      body: JSON.stringify({ groupId: selectedGroupId, optIn }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error ?? 'Failed to update opt-in');
      return;
    }
    await refreshGroups();
    await refreshGroupState();
  };

  const pingNow = async () => {
    if (!selectedGroupId) return;

    if (!navigator.geolocation) {
      setError('Geolocation is not available in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const response = await authedFetch('/api/ping', {
          method: 'POST',
          body: JSON.stringify({
            groupId: selectedGroupId,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracyM: pos.coords.accuracy,
          }),
        });
        const data = await response.json();
        if (!response.ok || !data.ok) {
          setError(data.error ?? 'Ping failed');
          return;
        }
        setError('');
        await refreshGroupState();
      },
      () => setError('Could not read your location. Please allow location access and try again.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const stopSharing = async () => {
    if (!selectedGroupId) return;
    const response = await authedFetch('/api/stop-sharing', {
      method: 'POST',
      body: JSON.stringify({ groupId: selectedGroupId }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error ?? 'Stop sharing failed');
      return;
    }
    await refreshGroups();
    await refreshGroupState();
  };

  useEffect(() => {
    let mounted = true;
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!token) return;
    refreshGroups().catch(() => null);
  }, [token]);

  useEffect(() => {
    if (!token || !selectedGroupId) return;
    refreshGroupState(selectedGroupId).catch(() => null);
  }, [token, selectedGroupId]);

  if (!user) {
    return (
      <section className="card-landio max-w-xl">
        <h1 className="text-2xl font-bold font-display">📍 Find Your Group - Goofy Beacon</h1>
        <p className="text-text-muted mt-2">Sign in with email magic link to create or join groups.</p>
        <div className="mt-4 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl bg-surface2 border border-border p-3 min-h-[44px]"
          />
          <button onClick={signIn} className="btn-primary px-4 py-2 rounded-lg min-h-[44px]">Send Magic Link</button>
          {authMessage && <p className="text-sm text-text-muted">{authMessage}</p>}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="card-landio card-landio-featured">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display">📍 Find Your Group</h1>
            <p className="text-text-muted">Goofy Beacon uses manual pings only. No live tracking.</p>
          </div>
          <button onClick={signOut} className="btn-ghost px-3 py-2 rounded-lg">Sign out</button>
        </div>
        <p className="text-xs text-text-faint mt-3">
          Privacy: Sharing is opt-in. Stop Sharing removes your latest ping. Group map remains viewable to members even if they never opt in.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card-landio space-y-3">
          <p className="font-semibold">Create Group</p>
          <input
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder="Weekend Disney Crew"
            className="w-full rounded-xl bg-surface2 border border-border p-3 min-h-[44px]"
          />
          <input
            value={createDisplayName}
            onChange={(e) => setCreateDisplayName(e.target.value)}
            placeholder="Your display name"
            className="w-full rounded-xl bg-surface2 border border-border p-3 min-h-[44px]"
          />
          <button onClick={createGroup} className="btn-primary px-4 py-2 rounded-lg min-h-[44px]">Create</button>
        </div>

        <div className="card-landio space-y-3">
          <p className="font-semibold">Join Group</p>
          <input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="Invite code"
            className="w-full rounded-xl bg-surface2 border border-border p-3 min-h-[44px]"
          />
          <input
            value={joinDisplayName}
            onChange={(e) => setJoinDisplayName(e.target.value)}
            placeholder="Your display name"
            className="w-full rounded-xl bg-surface2 border border-border p-3 min-h-[44px]"
          />
          <button onClick={joinGroup} className="btn-primary px-4 py-2 rounded-lg min-h-[44px]">Join</button>
        </div>
      </section>

      {groups.length > 0 && (
        <section className="card-landio space-y-3">
          <p className="font-semibold">Your Groups</p>
          <select
            className="w-full rounded-xl bg-surface2 border border-border p-3 min-h-[44px]"
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
          >
            {groups.map((item) => (
              <option value={item.groupId} key={item.groupId}>
                {item.group.name} ({item.group.invite_code})
              </option>
            ))}
          </select>
        </section>
      )}

      {error && <div className="card-landio border-danger text-danger">{error}</div>}

      {loadingState && <div className="card-landio">Loading group state…</div>}

      {groupState && (
        <>
          <section className="card-landio">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xl font-semibold">{groupState.group.name}</p>
                <p className="text-sm text-text-muted">
                  Invite code: <span className="font-mono">{groupState.group.invite_code}</span> • Expires {new Date(groupState.group.expires_at).toLocaleString()}
                </p>
              </div>
              <Link href={`/group/${groupState.group.id}`} className="btn-ghost px-3 py-2 rounded-lg">Open Deep Link</Link>
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              {!groupState.membership.opted_in ? (
                <button onClick={() => setOptIn(true)} className="btn-primary px-4 py-2 rounded-lg min-h-[44px]">Opt In to Share</button>
              ) : (
                <button onClick={() => setOptIn(false)} className="btn-ghost px-4 py-2 rounded-lg min-h-[44px]">Turn Off Sharing</button>
              )}

              <button
                onClick={pingNow}
                disabled={!groupState.membership.opted_in}
                className="btn-primary px-4 py-2 rounded-lg min-h-[44px] disabled:opacity-50"
                title={!groupState.membership.opted_in ? 'Opt in first' : 'Send manual location ping'}
              >
                Goofy Beacon Ping
              </button>

              <button onClick={stopSharing} className="btn-ghost px-4 py-2 rounded-lg min-h-[44px]">Stop Sharing & Delete Last Ping</button>
            </div>

            <p className="text-xs text-text-faint mt-3">
              Mandatory opt-in applies before each manual share cycle. No background tracking is used.
            </p>
          </section>

          <section className="card-landio">
            <p className="font-semibold mb-3">Member Map</p>
            <BeaconMap members={groupState.members} />
          </section>

          <section className="card-landio">
            <p className="font-semibold mb-3">Members</p>
            <div className="space-y-2">
              {groupState.members.map((member) => (
                <div key={member.user_id} className="rounded-xl border border-border bg-surface2 p-3">
                  <p className="font-medium">{member.display_name}</p>
                  <p className="text-xs text-text-muted">
                    Sharing: {member.opted_in ? 'Opted in' : 'Not sharing'}
                  </p>
                  {member.ping ? (
                    <p className="text-sm text-text-muted">
                      {member.ping.zone_label} • {new Date(member.ping.pinged_at).toLocaleString()} • ±{member.ping.accuracy_m ?? 'n/a'}m
                    </p>
                  ) : (
                    <p className="text-sm text-text-faint">No ping yet</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="card-landio">
            <p className="font-semibold">Telegram Notifications</p>
            <p className="text-sm text-text-muted mt-1">
              {groupState.telegramLinked
                ? 'Telegram is linked for this group. Pings send notifications there.'
                : `Not linked yet. In your Telegram group, send: /link ${groupState.group.invite_code}`}
            </p>
          </section>
        </>
      )}

      {!groupState && groups.length === 0 && (
        <section className="card-landio">
          <p className="text-text-muted">Create a group or join with an invite code to get started.</p>
        </section>
      )}

      {selectedMyGroup && !groupState && (
        <section className="card-landio">
          <p className="text-text-muted">Select a group and refresh if needed.</p>
        </section>
      )}
    </div>
  );
}
