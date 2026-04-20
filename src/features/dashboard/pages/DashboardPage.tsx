import { Users, TrendingUp, Cloud, Bitcoin } from 'lucide-react';
import { PageTransition } from '@/shared/components/PageTransition';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { WeatherCard } from '@/features/weather/components/WeatherCard';
import { useUsers } from '@/features/users/hooks/useUsers';
import { useCrypto } from '@/features/crypto/hooks/useCrypto';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { motion } from 'framer-motion';
import { formatCurrency, formatCompactNumber, formatPercent } from '@/shared/utils/formatters';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: users } = useUsers();
  const { data: crypto } = useCrypto({ perPage: 10 });

  const bitcoin = crypto?.find((c) => c.id === 'bitcoin');
  const totalMarketCap = crypto?.reduce((sum, c) => sum + c.market_cap, 0) ?? 0;

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Good {getTimeOfDay()},{' '}
            <span className="text-primary-600 dark:text-primary-400">
              {user?.firstName ?? 'there'}
            </span>{' '}
            👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening across your modules today.
          </p>
        </div>

        {/* Analytics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard
            index={0}
            title="Total Users"
            value={users ? String(users.length) : '–'}
            subtitle="From JSONPlaceholder"
            icon={<Users />}
            color="blue"
          />
          <AnalyticsCard
            index={1}
            title="Bitcoin Price"
            value={bitcoin ? formatCurrency(bitcoin.current_price) : '–'}
            subtitle="24h change"
            icon={<Bitcoin />}
            trend={bitcoin?.price_change_percentage_24h}
            color="amber"
          />
          <AnalyticsCard
            index={2}
            title="Crypto Market Cap"
            value={totalMarketCap > 0 ? formatCompactNumber(totalMarketCap) : '–'}
            subtitle="Top 10 coins"
            icon={<TrendingUp />}
            color="emerald"
          />
          <AnalyticsCard
            index={3}
            title="Weather Tracked"
            value="4 Cities"
            subtitle="Auto-refreshing"
            icon={<Cloud />}
            color="cyan"
          />
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Top cryptos */}
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Top Cryptocurrencies</h2>
              <button
                onClick={() => navigate('/crypto')}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                View all →
              </button>
            </div>
            {crypto ? (
              <div className="space-y-2">
                {crypto.slice(0, 5).map((coin, i) => (
                  <motion.div
                    key={coin.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0"
                  >
                    <img src={coin.image} alt={coin.name} className="h-8 w-8 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{coin.name}</p>
                      <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                        {formatCurrency(coin.current_price)}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          coin.price_change_percentage_24h >= 0
                            ? 'text-emerald-500'
                            : 'text-red-500'
                        }`}
                      >
                        {formatPercent(coin.price_change_percentage_24h)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-4 text-center">Loading market data...</p>
            )}
          </div>

          {/* Weather widget */}
          <div>
            <WeatherCard cityName="Berlin, DE" latitude={52.52} longitude={13.41} />
          </div>
        </div>

        {/* Recent users */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Users Overview</h2>
            <button
              onClick={() => navigate('/users')}
              className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              View all →
            </button>
          </div>
          {users ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {users.slice(0, 5).map((u, i) => (
                <motion.button
                  key={u.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/users/${u.id}`)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
                >
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                      {u.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white leading-tight">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.company.name.split(' ')[0]}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-4 text-center">Loading users...</p>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
