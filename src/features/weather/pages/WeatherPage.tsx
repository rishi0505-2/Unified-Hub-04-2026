import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Wind, Droplets, RefreshCw, MapPin,
  Navigation, Clock, X, Loader2,
} from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import { useGeocodingSearch } from '../hooks/useGeocodingSearch';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { CurrentWeatherData, GeocodingResult } from '@/shared/types';

// ─── Types ────────────────────────────────────────────────────────────────────
type WeatherCategory =
  | 'clear' | 'partly-cloudy' | 'cloudy' | 'fog'
  | 'drizzle' | 'rain' | 'snow' | 'thunderstorm'
  | 'extreme-cold' | 'windy';

interface WeatherMeta {
  category: WeatherCategory;
  label: string;
  icon: string;
  gradient: string;
  textLight: boolean;
}

// ─── WMO Code label map ───────────────────────────────────────────────────────
const CODE_LABELS: Record<number, string> = {
  0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy Fog',
  51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
  56: 'Freezing Drizzle', 57: 'Heavy Freezing Drizzle',
  61: 'Light Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
  66: 'Freezing Rain', 67: 'Heavy Freezing Rain',
  71: 'Light Snow', 73: 'Moderate Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
  80: 'Rain Showers', 81: 'Moderate Showers', 82: 'Heavy Showers',
  85: 'Snow Showers', 86: 'Heavy Snow Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm w/ Hail', 99: 'Heavy Thunderstorm',
};

const CATEGORY_ICONS: Record<WeatherCategory, string> = {
  'clear': '☀️', 'partly-cloudy': '⛅', 'cloudy': '☁️', 'fog': '🌫️',
  'drizzle': '🌦️', 'rain': '🌧️', 'snow': '❄️', 'thunderstorm': '⛈️',
  'extreme-cold': '🥶', 'windy': '💨',
};

const CATEGORY_GRADIENTS: Record<WeatherCategory, string> = {
  'clear':        'from-amber-300 via-orange-200 to-yellow-100',
  'partly-cloudy':'from-sky-500 via-blue-400 to-cyan-300',
  'cloudy':       'from-slate-600 via-gray-500 to-slate-400',
  'fog':          'from-gray-400 via-slate-300 to-gray-200',
  'drizzle':      'from-slate-600 via-blue-500 to-slate-500',
  'rain':         'from-slate-800 via-blue-900 to-slate-700',
  'snow':         'from-blue-200 via-slate-100 to-blue-50',
  'thunderstorm': 'from-gray-950 via-purple-950 to-slate-900',
  'extreme-cold': 'from-blue-900 via-cyan-800 to-blue-800',
  'windy':        'from-teal-500 via-cyan-400 to-sky-400',
};

const TEXT_LIGHT: Record<WeatherCategory, boolean> = {
  'clear': false, 'partly-cloudy': true, 'cloudy': true, 'fog': false,
  'drizzle': true, 'rain': true, 'snow': false, 'thunderstorm': true,
  'extreme-cold': true, 'windy': true,
};

function getWeatherMeta(code: number, temp: number, windspeed: number): WeatherMeta {
  let category: WeatherCategory;

  if (windspeed > 60) category = 'windy';
  else if (temp < -10) category = 'extreme-cold';
  else if (code <= 1) category = 'clear';
  else if (code === 2) category = 'partly-cloudy';
  else if (code === 3) category = 'cloudy';
  else if (code === 45 || code === 48) category = 'fog';
  else if (code >= 51 && code <= 57) category = 'drizzle';
  else if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) category = 'rain';
  else if ((code >= 71 && code <= 77) || code === 85 || code === 86) category = 'snow';
  else if (code >= 95) category = 'thunderstorm';
  else category = 'clear';

  return {
    category,
    label: CODE_LABELS[code] ?? 'Unknown',
    icon: CATEGORY_ICONS[category],
    gradient: CATEGORY_GRADIENTS[category],
    textLight: TEXT_LIGHT[category],
  };
}

function getWindDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

// ─── Animation: Rain ─────────────────────────────────────────────────────────
function RainEffect({ heavy = false }: { heavy?: boolean }) {
  const drops = useMemo(
    () =>
      Array.from({ length: heavy ? 100 : 60 }, (_, i) => ({
        id: i,
        left: `${(i / (heavy ? 100 : 60)) * 100 + (Math.sin(i) * 2)}%`,
        delay: `${-(Math.random() * 2).toFixed(2)}s`,
        duration: `${(0.5 + Math.random() * 0.5).toFixed(2)}s`,
        height: `${8 + Math.floor(Math.random() * 16)}px`,
        opacity: 0.4 + Math.random() * 0.4,
      })),
    [heavy]
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute w-px bg-blue-300 rounded-full animate-rain-fall"
          style={{
            left: d.left,
            top: -20,
            height: d.height,
            opacity: d.opacity,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        />
      ))}
    </div>
  );
}

// ─── Animation: Snow ─────────────────────────────────────────────────────────
function SnowEffect() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 55 }, (_, i) => ({
        id: i,
        left: `${(i / 55) * 100 + (Math.sin(i * 1.3) * 3)}%`,
        delay: `${-(Math.random() * 4).toFixed(2)}s`,
        duration: `${(3 + Math.random() * 3).toFixed(2)}s`,
        size: `${4 + Math.floor(Math.random() * 7)}px`,
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((f) => (
        <div
          key={f.id}
          className="absolute bg-white rounded-full animate-snow-fall"
          style={{
            left: f.left,
            top: -10,
            width: f.size,
            height: f.size,
            animationDelay: f.delay,
            animationDuration: f.duration,
          }}
        />
      ))}
    </div>
  );
}

// ─── Animation: Clouds ────────────────────────────────────────────────────────
function CloudShape({ top, size, delay, opacity }: { top: string; size: number; delay: string; opacity: number }) {
  return (
    <div
      className="absolute animate-cloud-drift pointer-events-none"
      style={{ top, left: -size - 50, animationDelay: delay, animationDuration: `${20 + size * 0.05}s`, opacity }}
    >
      <div
        className="relative bg-white rounded-full"
        style={{ width: size, height: size * 0.6 }}
      >
        <div className="absolute bg-white rounded-full" style={{ width: size * 0.6, height: size * 0.7, top: -size * 0.25, left: size * 0.15 }} />
        <div className="absolute bg-white rounded-full" style={{ width: size * 0.45, height: size * 0.6, top: -size * 0.2, left: size * 0.4 }} />
      </div>
    </div>
  );
}

function CloudEffect({ dark = false }: { dark?: boolean }) {
  const clouds = useMemo(() => [
    { top: '8%',  size: 180, delay: '0s',    opacity: dark ? 0.25 : 0.8 },
    { top: '20%', size: 240, delay: '-8s',   opacity: dark ? 0.2  : 0.7 },
    { top: '40%', size: 140, delay: '-14s',  opacity: dark ? 0.15 : 0.6 },
    { top: '55%', size: 200, delay: '-4s',   opacity: dark ? 0.2  : 0.65 },
    { top: '70%', size: 160, delay: '-18s',  opacity: dark ? 0.15 : 0.5 },
  ], [dark]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map((c, i) => <CloudShape key={i} {...c} />)}
    </div>
  );
}

// ─── Animation: Sun ───────────────────────────────────────────────────────────
function SunEffect() {
  return (
    <div className="absolute top-6 right-10 pointer-events-none" style={{ width: 120, height: 120 }}>
      {/* Outer glow */}
      <motion.div
        className="absolute rounded-full bg-yellow-400/20"
        style={{ inset: -40 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Rotating rays */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-t from-transparent via-yellow-300/50 to-transparent rounded-full"
            style={{
              width: 3,
              height: 80,
              transformOrigin: 'center 60px',
              transform: `rotate(${i * 45}deg)`,
            }}
          />
        ))}
      </motion.div>
      {/* Sun disc */}
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400"
        style={{ boxShadow: '0 0 40px 15px rgba(251,191,36,0.35)' }}
        animate={{ boxShadow: ['0 0 30px 12px rgba(251,191,36,0.3)', '0 0 60px 25px rgba(251,191,36,0.5)', '0 0 30px 12px rgba(251,191,36,0.3)'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// ─── Animation: Lightning ────────────────────────────────────────────────────
function LightningEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-white animate-lightning-flash rounded-3xl" />
      <div
        className="absolute inset-0 bg-white animate-lightning-flash"
        style={{ animationDelay: '2.5s' }}
      />
    </div>
  );
}

// ─── Animation: Fog ───────────────────────────────────────────────────────────
function FogEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        { top: '20%', width: '120%', height: 80, delay: '0s' },
        { top: '45%', width: '140%', height: 60, delay: '-3s' },
        { top: '65%', width: '110%', height: 70, delay: '-6s' },
      ].map((f, i) => (
        <div
          key={i}
          className="absolute -left-10 bg-white/40 rounded-full blur-3xl animate-fog-drift"
          style={{ top: f.top, width: f.width, height: f.height, animationDelay: f.delay }}
        />
      ))}
    </div>
  );
}

// ─── Animation: Wind Lines ────────────────────────────────────────────────────
function WindEffect() {
  const lines = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        top: `${8 + i * 7}%`,
        width: `${60 + Math.random() * 30}%`,
        delay: `${-(Math.random() * 2.5).toFixed(2)}s`,
        opacity: 0.3 + Math.random() * 0.3,
        thickness: i % 3 === 0 ? 2 : 1,
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {lines.map((l) => (
        <div
          key={l.id}
          className="absolute bg-white/60 rounded-full animate-wind-blow"
          style={{
            top: l.top,
            height: l.thickness,
            width: l.width,
            opacity: l.opacity,
            animationDelay: l.delay,
          }}
        />
      ))}
    </div>
  );
}

// ─── Background renderer ─────────────────────────────────────────────────────
function WeatherBackground({ meta }: { meta: WeatherMeta }) {
  const { category, gradient } = meta;
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-1000`}>
      {(category === 'rain' || category === 'drizzle') && <RainEffect heavy={category === 'rain'} />}
      {(category === 'thunderstorm') && (
        <>
          <RainEffect heavy />
          <LightningEffect />
        </>
      )}
      {category === 'snow' && <SnowEffect />}
      {category === 'extreme-cold' && <SnowEffect />}
      {(category === 'cloudy' || category === 'partly-cloudy') && <CloudEffect dark={category === 'cloudy'} />}
      {category === 'fog' && <FogEffect />}
      {category === 'clear' && <SunEffect />}
      {category === 'windy' && (
        <>
          <CloudEffect />
          <WindEffect />
        </>
      )}
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({
  icon, label, value, textLight,
}: { icon: React.ReactNode; label: string; value: string; textLight: boolean }) {
  const bg = textLight ? 'bg-white/15 border-white/20' : 'bg-black/10 border-black/10';
  const text = textLight ? 'text-white' : 'text-gray-800';
  const sub = textLight ? 'text-white/60' : 'text-gray-600';
  return (
    <div className={`${bg} border rounded-2xl p-3 text-center`}>
      <div className={`flex justify-center mb-1 ${text} opacity-80`}>{icon}</div>
      <div className={`text-base font-bold leading-tight ${text}`}>{value}</div>
      <div className={`text-[11px] mt-0.5 ${sub}`}>{label}</div>
    </div>
  );
}

// ─── Main weather display ─────────────────────────────────────────────────────
function WeatherDisplay({
  cityName,
  current,
  meta,
  isFetching,
  onRefresh,
  lastUpdated,
}: {
  cityName: string;
  current: CurrentWeatherData;
  meta: WeatherMeta;
  isFetching: boolean;
  onRefresh: () => void;
  lastUpdated: string;
}) {
  const { textLight } = meta;
  const glass = textLight
    ? 'bg-white/15 border-white/25'
    : 'bg-white/50 border-white/70';
  const text = textLight ? 'text-white' : 'text-gray-900';
  const sub = textLight ? 'text-white/70' : 'text-gray-600';
  const btnCls = textLight
    ? 'bg-white/15 hover:bg-white/25 text-white border-white/20'
    : 'bg-black/10 hover:bg-black/15 text-gray-800 border-black/10';

  return (
    <motion.div
      key={cityName}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`max-w-md mx-auto backdrop-blur-xl border ${glass} rounded-3xl p-8 shadow-2xl`}
    >
      {/* City & condition row */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className={`flex items-center gap-1.5 ${sub} text-sm mb-1`}>
            <MapPin className="h-3.5 w-3.5" />
            {cityName}
          </div>
          <h2 className={`text-2xl font-semibold ${text}`}>
            {meta.icon} {meta.label}
          </h2>
        </div>
        <button
          onClick={onRefresh}
          className={`flex items-center justify-center h-9 w-9 rounded-xl border ${btnCls} transition-colors`}
          aria-label="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Big temperature */}
      <div className={`flex items-start gap-1 my-6 ${text}`}>
        <span className="text-8xl font-thin leading-none tabular-nums">
          {Math.round(current.temperature_2m)}
        </span>
        <span className="text-3xl font-light mt-3">°C</span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatPill
          icon={<Droplets className="h-4 w-4" />}
          label="Humidity"
          value={`${current.relative_humidity_2m}%`}
          textLight={textLight}
        />
        <StatPill
          icon={<Wind className="h-4 w-4" />}
          label="Wind"
          value={`${Math.round(current.wind_speed_10m)} km/h`}
          textLight={textLight}
        />
        <StatPill
          icon={<Navigation className="h-4 w-4" style={{ transform: `rotate(${current.wind_direction_10m}deg)` }} />}
          label="Direction"
          value={getWindDirection(current.wind_direction_10m)}
          textLight={textLight}
        />
      </div>

      {/* Last updated */}
      <div className={`flex items-center justify-center gap-1.5 mt-5 text-xs ${sub}`}>
        <Clock className="h-3 w-3" />
        Updated {lastUpdated} · auto-refreshes every 30s
      </div>
    </motion.div>
  );
}

// ─── Search bar ───────────────────────────────────────────────────────────────
function WeatherSearch({
  query, setQuery, suggestions, isSearching, onSelect, textLight,
}: {
  query: string;
  setQuery: (q: string) => void;
  suggestions: GeocodingResult[];
  isSearching: boolean;
  onSelect: (r: GeocodingResult) => void;
  textLight: boolean;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const inputGlass = textLight
    ? 'bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/25'
    : 'bg-white/60 border-white/80 text-gray-900 placeholder:text-gray-500 focus:bg-white/80';

  return (
    <div ref={containerRef} className="relative max-w-md mx-auto">
      <div className={`flex items-center gap-3 backdrop-blur-xl border ${inputGlass} rounded-2xl px-4 py-3 transition-all`}>
        <Search className="h-4 w-4 flex-shrink-0 opacity-70" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search city…"
          className="flex-1 bg-transparent outline-none text-sm font-medium"
          aria-label="Search city"
        />
        {isSearching && <Loader2 className="h-4 w-4 animate-spin opacity-60 flex-shrink-0" />}
        {query && !isSearching && (
          <button onClick={() => { setQuery(''); setOpen(false); }} className="opacity-60 hover:opacity-100 flex-shrink-0">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {suggestions.map((r) => (
              <button
                key={r.id}
                onMouseDown={() => onSelect(r)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors text-left"
              >
                <MapPin className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-400">
                    {[r.admin1, r.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function WeatherSkeleton() {
  return (
    <div className="max-w-md mx-auto bg-white/20 backdrop-blur-xl border border-white/25 rounded-3xl p-8">
      <div className="space-y-5 animate-pulse">
        <div className="h-4 bg-white/30 rounded-full w-32" />
        <div className="h-6 bg-white/30 rounded-full w-48" />
        <div className="h-24 bg-white/30 rounded-2xl w-40" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/30 rounded-2xl" />)}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
interface CityState {
  name: string;
  lat: number;
  lon: number;
}

const DELHI: CityState = { name: 'New Delhi, India', lat: 28.6139, lon: 77.209 };

export default function WeatherPage() {
  const [city, setCity] = useState<CityState>(DELHI);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery);

  const { data, isLoading, isError, refetch, isFetching, dataUpdatedAt } =
    useWeather({ latitude: city.lat, longitude: city.lon });

  const { data: suggestions = [], isFetching: isSearching } =
    useGeocodingSearch(debouncedSearch);

  const current = data?.current;
  const meta = useMemo(
    () => (current ? getWeatherMeta(current.weather_code, current.temperature_2m, current.wind_speed_10m) : null),
    [current]
  );

  const handleSelect = useCallback((r: GeocodingResult) => {
    const cityName = [r.name, r.admin1, r.country].filter(Boolean).join(', ');
    setCity({ name: cityName, lat: r.latitude, lon: r.longitude });
    setSearchQuery('');
  }, []);

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—';
  const fallbackMeta = meta ?? {
    category: 'clear' as WeatherCategory,
    gradient: CATEGORY_GRADIENTS['clear'],
    textLight: false,
    label: '',
    icon: '',
  };

  return (
    <div className="relative -mx-4 -mt-4 lg:-mx-6 lg:-mt-6 min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Animated background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={fallbackMeta.gradient}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <WeatherBackground meta={fallbackMeta} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 px-4 pt-6 pb-10 lg:px-6 space-y-8">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center"
        >
          <h1 className={`text-3xl font-bold ${fallbackMeta.textLight ? 'text-white' : 'text-gray-900'}`}>
            Weather
          </h1>
          <p className={`text-sm mt-1 ${fallbackMeta.textLight ? 'text-white/60' : 'text-gray-600'}`}>
            Real-time conditions via Open-Meteo
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <WeatherSearch
            query={searchQuery}
            setQuery={setSearchQuery}
            suggestions={suggestions}
            isSearching={isSearching}
            onSelect={handleSelect}
            textLight={fallbackMeta.textLight}
          />
        </motion.div>

        {/* Weather content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <WeatherSkeleton />
          ) : isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md mx-auto bg-white/20 backdrop-blur-xl border border-white/25 rounded-3xl p-8 text-center"
            >
              <p className={`text-lg font-semibold ${fallbackMeta.textLight ? 'text-white' : 'text-gray-800'}`}>
                Failed to load weather
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 px-5 py-2 bg-white/25 hover:bg-white/35 border border-white/30 rounded-xl text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </motion.div>
          ) : (
            current &&
            meta && (
              <WeatherDisplay
                key={city.name}
                cityName={city.name}
                current={current}
                meta={meta}
                isFetching={isFetching}
                onRefresh={() => refetch()}
                lastUpdated={lastUpdated}
              />
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
