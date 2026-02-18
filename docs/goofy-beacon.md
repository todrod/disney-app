# Goofy Beacon (Find Your Group)

Goofy Beacon is a manual location ping feature for small groups.

## Privacy model

- No live tracking.
- Members share location only by pressing `Goofy Beacon Ping`.
- Sharing is mandatory opt-in (`Opt In to Share`).
- `Stop Sharing & Delete Last Ping` disables sharing and deletes the member's latest ping.
- Members can view the map even if they never opt in.
- Group data is deleted when expired (users remain in Supabase Auth).

## Routes

- `/group`
- `/group/[groupId]`

## API routes

- `POST /api/groups/create`
- `POST /api/groups/join`
- `POST /api/groups/optin`
- `POST /api/ping`
- `POST /api/stop-sharing`
- `POST /api/groups/extend`
- `POST /api/telegram/link`

Additional helper routes:

- `GET /api/groups/my`
- `GET /api/groups/[groupId]/state`

## Supabase SQL migration + RLS

Run this file in Supabase SQL editor:

- `db/migrations/2026-02-18_goofy_beacon.sql`

It creates:

- `groups`
- `group_invites`
- `group_members`
- `member_last_ping`
- `telegram_group_links`

RLS behavior implemented:

- Members can read their groups/members/pings.
- Owners manage group expiry/invites/telegram links.
- Users can only create/update/delete their own ping rows.

## Required env vars (names only)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `NEXT_PUBLIC_APP_URL` (optional but recommended, used in Telegram link text)

## Supabase Auth setup

This feature uses Supabase Auth magic link login from the `/group` UI.

In Supabase dashboard:

1. Enable Email provider for Auth.
2. Configure redirect URLs to include:
   - `http://localhost:3000/group`
   - your production URL `/group`

## Telegram bot setup

1. Create bot with `@BotFather` and get a bot token.
2. Set `TELEGRAM_BOT_TOKEN` in your runtime environment.
3. Set webhook to your app endpoint:

```bash
curl -X POST "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-domain.com/api/telegram/link"}'
```

4. In Telegram group chat, run:

```text
/link INVITECODE
```

If successful, that chat receives ping notifications for the linked group.

## Geofence zones

Zone circles are defined in:

- `data/goofy-beacon/zones.json`

Current zones include 4 parks, Disney Springs, and major resorts.

## Cleanup expired groups

Script:

- `scripts/cleanup-expired-groups.mjs`

Manual run:

```bash
NEXT_PUBLIC_SUPABASE_URL=... \
SUPABASE_SERVICE_ROLE_KEY=... \
node scripts/cleanup-expired-groups.mjs
```

### VPS cron example (do not auto-install)

Run every hour:

```cron
0 * * * * cd /var/www/disney-app && /usr/bin/env NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... /usr/bin/node scripts/cleanup-expired-groups.mjs >> /var/log/goofy-beacon-cleanup.log 2>&1
```

Use a secure env loading strategy on VPS (systemd env file or shell profile) instead of writing secrets in plain cron where possible.
