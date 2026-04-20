import { PageTransition } from '@/shared/components/PageTransition';
import { WeatherCard } from '../components/WeatherCard';
import { Cloud } from 'lucide-react';

const CITIES = [
  { name: 'Berlin, DE', lat: 52.52, lon: 13.41 },
  { name: 'New York, US', lat: 40.71, lon: -74.01 },
  { name: 'Tokyo, JP', lat: 35.68, lon: 139.69 },
  { name: 'Mumbai, IN', lat: 19.08, lon: 72.88 },
];

export default function WeatherPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-cyan-100 dark:bg-cyan-950 rounded-xl flex items-center justify-center">
            <Cloud className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Weather</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Real-time weather via Open-Meteo · auto-refreshes every 30s
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          {CITIES.map((city) => (
            <WeatherCard
              key={city.name}
              cityName={city.name}
              latitude={city.lat}
              longitude={city.lon}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
