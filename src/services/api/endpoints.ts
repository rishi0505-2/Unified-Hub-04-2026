export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',

  // Users (JSONPlaceholder)
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
  POSTS_BY_USER: (userId: number) => `/posts?userId=${userId}`,
  COMMENTS_BY_POST: (postId: number) => `/comments?postId=${postId}`,

  // Crypto (CoinGecko)
  COINS_MARKETS: '/coins/markets',

  // Weather (Open Meteo)
  FORECAST: '/forecast',

  // Geocoding (Open-Meteo)
  GEOCODING_SEARCH: '/search',
} as const;
