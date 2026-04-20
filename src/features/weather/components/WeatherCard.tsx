import { motion } from 'framer-motion';
import { Wind, Thermometer, Navigation, RefreshCw, Clock } from 'lucide-react';
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
  61: { label: 'Light rain', emoji: '🌧' },
  63: { label: 'Moderate rain', emoji: '🌧' },
  71: { label: 'Light snow', emoji: '❄️' },
  80: { label: 'Rain showers', emoji: '🌦' },
  95: { label: 'Thunderstorm', emoji: '⛈' },
};

function getWeatherInfo(code: number) {
  return WMO_CODES[code] ?? { label: 'Unknown', emoji: '🌡' };
}

interface StatBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}
function StatBadge({ icon, label, value, color }: StatBadgeProps) {
  return (
    <div className={`flex items-center gap-3 ${color} rounded-2xl p-4`}>
      <div className="h-10 w-10 bg-white/30 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium opacity-80">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

interface WeatherCardProps {
  cityName?: string;
  latitude?: number;
  longitude?: number;
}

export function WeatherCard({ cityName = 'Berlin, DE', latitude, longitude }: WeatherCardProps) {
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

  const { current_weather: w } = data;
  const info = getWeatherInfo(w.weathercode);
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{cityName}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
            {info.emoji} {info.label}
          </h3>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatBadge
          icon={<Thermometer className="h-5 w-5 text-white" />}
          label="Temperature"
          value={`${w.temperature}°C`}
          color="bg-gradient-to-br from-orange-400 to-orange-500 text-white"
        />
        <StatBadge
          icon={<Wind className="h-5 w-5 text-white" />}
          label="Wind Speed"
          value={`${w.windspeed} km/h`}
          color="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white"
        />
      </div>

      {/* Wind direction + coordinates */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <Navigation
            className="h-3.5 w-3.5 text-primary-500"
            style={{ transform: `rotate(${w.winddirection}deg)` }}
          />
          Wind direction: {w.winddirection}°
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-primary-500" />
          Updated: {lastUpdated}
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-600">
        Auto-refreshes every 30 seconds · Coordinates: {data.latitude}°N, {data.longitude}°E
      </p>
    </motion.div>
  );
}
