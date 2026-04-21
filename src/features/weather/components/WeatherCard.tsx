import { motion } from 'framer-motion';
import { Wind, Navigation, RefreshCw, Clock, Droplets } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import { Skeleton } from '@/shared/components/Skeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { Button } from '@/shared/components/Button';

// WMO Weather Code descriptions
const WMO_CODES: Record<number, { label: string; emoji: string }> = {
  0: { label: 'Clear sky', emoji: '☀️' },
  1: { label: 'Mainly clear', emoji: '🌤' },
  2: { label: 'Partly cloudy', emoji: '⛅' },
  3: { label: 'Overcast', emoji: '☁️' },
  45: { label: 'Foggy', emoji: '🌫' },
  48: { label: 'Icy fog', emoji: '🌫' },
  51: { label: 'Light drizzle', emoji: '🌦' },
  53: { label: 'Drizzle', emoji: '🌦' },
  55: { label: 'Heavy drizzle', emoji: '🌦' },
  61: { label: 'Light rain', emoji: '🌧' },
  63: { label: 'Moderate rain', emoji: '🌧' },
  65: { label: 'Heavy rain', emoji: '🌧' },
  71: { label: 'Light snow', emoji: '❄️' },
  73: { label: 'Moderate snow', emoji: '❄️' },
  75: { label: 'Heavy snow', emoji: '❄️' },
  80: { label: 'Rain showers', emoji: '🌦' },
  81: { label: 'Rain showers', emoji: '🌦' },
  82: { label: 'Heavy showers', emoji: '🌧' },
  95: { label: 'Thunderstorm', emoji: '⛈' },
  96: { label: 'Thunderstorm', emoji: '⛈' },
  99: { label: 'Heavy thunderstorm', emoji: '⛈' },
};

function getWeatherInfo(code: number) {
  return WMO_CODES[code] ?? { label: 'Unknown', emoji: '🌡' };
}

interface StatBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass: string;
}
function StatBadge({ icon, label, value, colorClass }: StatBadgeProps) {
  return (
    <div className={`flex items-center gap-3 ${colorClass} rounded-2xl p-4`}>
      <div className="h-9 w-9 bg-white/25 rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium opacity-75">{label}</p>
        <p className="text-lg font-bold leading-tight">{value}</p>
      </div>
    </div>
  );
}

interface WeatherCardProps {
  cityName?: string;
  latitude?: number;
  longitude?: number;
}

export function WeatherCard({ cityName = 'New Delhi, India', latitude, longitude }: WeatherCardProps) {
  const { data, isLoading, isError, refetch, isFetching, dataUpdatedAt } = useWeather({
    latitude,
    longitude,
  });

  if (isLoading) {
    return (
      <div className="card p-6 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const w = data.current;
  const info = getWeatherInfo(w.weather_code);
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">{cityName}</p>
          <h3 className="text-xl font-bold text-gray-900 mt-0.5">
            {info.emoji} {info.label}
          </h3>
          <p className="text-3xl font-light text-gray-900 mt-1">
            {Math.round(w.temperature_2m)}°C
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />}
          onClick={() => refetch()}
          aria-label="Refresh weather"
        >
          Refresh
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatBadge
          icon={<Droplets className="h-4.5 w-4.5 text-white" />}
          label="Humidity"
          value={`${w.relative_humidity_2m}%`}
          colorClass="bg-gradient-to-br from-sky-400 to-blue-500 text-white"
        />
        <StatBadge
          icon={<Wind className="h-4.5 w-4.5 text-white" />}
          label="Wind"
          value={`${Math.round(w.wind_speed_10m)} km/h`}
          colorClass="bg-gradient-to-br from-primary-500 to-primary-600 text-white"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
        <div className="flex items-center gap-1">
          <Navigation
            className="h-3 w-3 text-primary-400"
            style={{ transform: `rotate(${w.wind_direction_10m}deg)` }}
          />
          {w.wind_direction_10m}°
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-primary-400" />
          {lastUpdated}
        </div>
      </div>
    </motion.div>
  );
}

