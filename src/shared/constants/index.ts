export const QUERY_KEYS = {
  USERS: ['users'] as const,
  USER: (id: number) => ['users', id] as const,
  USER_POSTS: (userId: number) => ['posts', 'user', userId] as const,
  POST_COMMENTS: (postId: number) => ['comments', 'post', postId] as const,
  CRYPTO: (params: Record<string, unknown>) => ['crypto', params] as const,
  WEATHER: (lat: number, lon: number) => ['weather', lat, lon] as const,
  GEOCODING: (query: string) => ['geocoding', query] as const,
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  USERS: '/users',
  USER_DETAIL: (id: number) => `/users/${id}`,
  CRYPTO: '/crypto',
  WEATHER: '/weather',
} as const;

export const APP_CONFIG = {
  WEATHER_REFRESH_INTERVAL: 30_000,
  CRYPTO_STALE_TIME: 60_000,
  DEBOUNCE_DELAY: 400,
  CRYPTO_PAGE_SIZE: 20,
} as const;
