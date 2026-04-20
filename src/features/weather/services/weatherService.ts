import { weatherApiClient } from '@/services/api/axiosInstances';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import type { WeatherResponse } from '@/shared/types';

export interface WeatherParams {
  latitude?: number;
  longitude?: number;
}

export const weatherService = {
  getWeather: async ({
    latitude = Number(import.meta.env.VITE_DEFAULT_LATITUDE) || 52.52,
    longitude = Number(import.meta.env.VITE_DEFAULT_LONGITUDE) || 13.41,
  }: WeatherParams = {}): Promise<WeatherResponse> => {
    const { data } = await weatherApiClient.get<WeatherResponse>(API_ENDPOINTS.FORECAST, {
      params: {
        latitude,
        longitude,
        current_weather: true,
        hourly: 'temperature_2m,relativehumidity_2m,windspeed_10m',
        forecast_days: 1,
      },
    });
    return data;
  },
};
