import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

// ─── DummyJSON (auth) ────────────────────────────────────────────────────────
export const authApiClient = axios.create({
  baseURL: import.meta.env.VITE_DUMMY_JSON_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── JSONPlaceholder (users, posts, comments) ─────────────────────────────────
export const jsonPlaceholderClient = axios.create({
  baseURL: import.meta.env.VITE_JSON_PLACEHOLDER_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── CoinGecko (crypto) ───────────────────────────────────────────────────────
export const cryptoApiClient = axios.create({
  baseURL: import.meta.env.VITE_COINGECKO_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Open-Meteo (weather) ─────────────────────────────────────────────────────
export const weatherApiClient = axios.create({
  baseURL: import.meta.env.VITE_OPEN_METEO_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Open-Meteo Geocoding ────────────────────────────────────────────────────
export const geocodingApiClient = axios.create({
  baseURL: 'https://geocoding-api.open-meteo.com/v1',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: attach Bearer token ────────────────────────────────
function attachToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

authApiClient.interceptors.request.use(attachToken, (error) => Promise.reject(error));

// ─── Response interceptor: global error handling ─────────────────────────────
function handleResponseError(error: AxiosError) {
  if (axios.isCancel(error)) return Promise.reject(error);

  const status = error.response?.status;
  const message =
    (error.response?.data as Record<string, string>)?.message ||
    error.message ||
    'An unexpected error occurred';

  if (status === 401) {
    useAuthStore.getState().logout();
    window.location.replace('/login');
    toast.error('Session expired. Please log in again.');
  } else if (status === 403) {
    toast.error('You do not have permission to perform this action.');
  } else if (status && status >= 500) {
    toast.error('Server error. Please try again later.');
  } else if (status && status >= 400) {
    toast.error(message);
  }

  return Promise.reject(error);
}

[authApiClient, jsonPlaceholderClient, cryptoApiClient, weatherApiClient, geocodingApiClient].forEach((client) => {
  client.interceptors.response.use((response) => response, handleResponseError);
});
