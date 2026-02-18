export interface BeaconGroup {
  id: string;
  owner_user_id: string;
  name: string;
  invite_code: string;
  expires_at: string;
  created_at: string;
}

export interface GroupMember {
  group_id: string;
  user_id: string;
  display_name: string;
  opted_in: boolean;
  joined_at: string;
}

export interface MemberLastPing {
  group_id: string;
  user_id: string;
  lat: number;
  lng: number;
  accuracy_m: number | null;
  zone_label: string;
  pinged_at: string;
}

export interface GroupStateMember {
  user_id: string;
  display_name: string;
  opted_in: boolean;
  ping?: {
    lat: number;
    lng: number;
    accuracy_m: number | null;
    zone_label: string;
    pinged_at: string;
  };
}

export interface ZoneCircle {
  id: string;
  label: string;
  lat: number;
  lng: number;
  radius_m: number;
}
