const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateInviteCode(length = 8): string {
  let out = '';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  for (let i = 0; i < length; i += 1) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

export function clampExpiryHours(input?: number): number {
  if (!input || Number.isNaN(input)) return 48;
  return Math.min(168, Math.max(1, Math.floor(input)));
}
