import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, APP_CONFIG } from '@/shared/constants';
import { weatherService } from '../services/weatherService';
import type { WeatherParams } from '../services/weatherService';

// Delhi, India as default
const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.209;

export function useWeather(params: WeatherParams = {}) {
  const lat = params.latitude ?? DEFAULT_LAT;
  const lon = params.longitude ?? DEFAULT_LON;

  return useQuery({
    queryKey: QUERY_KEYS.WEATHER(lat, lon),
    queryFn: () => weatherService.getWeather({ latitude: lat, longitude: lon }),
    refetchInterval: APP_CONFIG.WEATHER_REFRESH_INTERVAL,
    staleTime: APP_CONFIG.WEATHER_REFRESH_INTERVAL,
  });
}
