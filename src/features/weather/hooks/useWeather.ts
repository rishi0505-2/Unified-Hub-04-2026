import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, APP_CONFIG } from '@/shared/constants';
import { weatherService } from '../services/weatherService';
import type { WeatherParams } from '../services/weatherService';

export function useWeather(params: WeatherParams = {}) {
  const lat = params.latitude ?? (Number(import.meta.env.VITE_DEFAULT_LATITUDE) || 52.52);
  const lon = params.longitude ?? (Number(import.meta.env.VITE_DEFAULT_LONGITUDE) || 13.41);

  return useQuery({
    queryKey: QUERY_KEYS.WEATHER(lat, lon),
    queryFn: () => weatherService.getWeather({ latitude: lat, longitude: lon }),
    refetchInterval: APP_CONFIG.WEATHER_REFRESH_INTERVAL,
    staleTime: APP_CONFIG.WEATHER_REFRESH_INTERVAL,
  });
}
