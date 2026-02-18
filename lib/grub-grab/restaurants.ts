import restaurantsData from '@/data/wdw-restaurants.json';
import { Restaurant, RestaurantLocation } from '@/types/grub-grab';

const restaurants = restaurantsData as Restaurant[];

export function getAllRestaurants(): Restaurant[] {
  return restaurants;
}

export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return restaurants.find((restaurant) => restaurant.slug === slug);
}

export function searchRestaurants(query: string): Restaurant[] {
  const q = query.trim().toLowerCase();
  if (!q) return restaurants;

  return restaurants.filter((restaurant) => {
    return (
      restaurant.name.toLowerCase().includes(q) ||
      restaurant.location.toLowerCase().includes(q) ||
      restaurant.cuisine.toLowerCase().includes(q)
    );
  });
}

export function getRestaurantsByLocation(location: RestaurantLocation): Restaurant[] {
  return restaurants.filter((restaurant) => restaurant.location === location);
}

export function getPopularRestaurants(limit = 8): Restaurant[] {
  return restaurants.filter((restaurant) => restaurant.popular).slice(0, limit);
}

export function getLocationCounts(): Array<{ location: RestaurantLocation; count: number; emoji: string }> {
  const locations: Array<{ location: RestaurantLocation; emoji: string }> = [
    { location: 'Magic Kingdom', emoji: '🏰' },
    { location: 'EPCOT', emoji: '🌐' },
    { location: 'Hollywood Studios', emoji: '🎬' },
    { location: 'Animal Kingdom', emoji: '🦁' },
    { location: 'Disney Springs', emoji: '🛍️' },
    { location: 'Resort Hotels', emoji: '🏨' },
  ];

  return locations.map(({ location, emoji }) => ({
    location,
    emoji,
    count: restaurants.filter((restaurant) => restaurant.location === location).length,
  }));
}
