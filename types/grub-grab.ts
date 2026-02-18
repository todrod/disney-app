export type RestaurantLocation =
  | 'Magic Kingdom'
  | 'EPCOT'
  | 'Hollywood Studios'
  | 'Animal Kingdom'
  | 'Disney Springs'
  | 'Resort Hotels';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  location: RestaurantLocation;
  disneyUrl: string;
  mealTypes: MealType[];
  cuisine: string;
  priceRange: '$' | '$$' | '$$$';
  popular: boolean;
}

export type MealPreference = 'any' | MealType;
export type TimePreference = 'any' | 'morning' | 'afternoon' | 'evening';
export type AlertStatus = 'active' | 'paused' | 'expired';

export interface DiningAlert {
  id: string;
  userId: string;
  restaurant: Pick<Restaurant, 'id' | 'name' | 'slug' | 'disneyUrl' | 'location'>;
  dateRange: {
    start: string;
    end: string;
  };
  partySize: number;
  mealPreference: MealPreference;
  timePreference: TimePreference;
  telegramChatId: string;
  status: AlertStatus;
  createdAt: string;
  lastChecked?: string;
  triggeredDates: string[];
  totalChecks: number;
  successfulFinds: number;
}

export interface AvailableSlot {
  date: string;
  time: string;
  bookingUrl: string;
}
