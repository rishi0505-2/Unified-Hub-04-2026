import { weatherApiClient, geocodingApiClient } from '@/services/api/axiosInstances';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import type { WeatherResponse, GeocodingResult, GeocodingResponse } from '@/shared/types';

export interface WeatherParams {
  latitude?: number;
  longitude?: number;
}

// Delhi, India as default
const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.209;

export const weatherService = {
  getWeather: async ({
    latitude = DEFAULT_LAT,
    longitude = DEFAULT_LON,
  }: WeatherParams = {}): Promise<WeatherResponse> => {
    const { data } = await weatherApiClient.get<WeatherResponse>(API_ENDPOINTS.FORECAST, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m',
        forecast_days: 1,
        timezone: 'auto',
      },
    });
    return data;
  },
};

export const geocodingService = {
  search: async (query: string): Promise<GeocodingResult[]> => {
    if (!query.trim()) return [];
    const { data } = await geocodingApiClient.get<GeocodingResponse>(API_ENDPOINTS.GEOCODING_SEARCH, {
      params: { name: query.trim(), count: 6, language: 'en', format: 'json' },
    });
    return data.results ?? [];
  },
};
