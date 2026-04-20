import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface AnalyticsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: number;
  color?: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' | 'cyan';
  index?: number;
}

const colorMap = {
  blue:    { bg: 'bg-blue-50 dark:bg-blue-950/40',    icon: 'bg-blue-500',    text: 'text-blue-600 dark:text-blue-400' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', icon: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  amber:   { bg: 'bg-amber-50 dark:bg-amber-950/40',  icon: 'bg-amber-500',   text: 'text-amber-600 dark:text-amber-400' },
  violet:  { bg: 'bg-violet-50 dark:bg-violet-950/40', icon: 'bg-violet-500',  text: 'text-violet-600 dark:text-violet-400' },
  rose:    { bg: 'bg-rose-50 dark:bg-rose-950/40',    icon: 'bg-rose-500',    text: 'text-rose-600 dark:text-rose-400' },
  cyan:    { bg: 'bg-cyan-50 dark:bg-cyan-950/40',    icon: 'bg-cyan-500',    text: 'text-cyan-600 dark:text-cyan-400' },
};

export function AnalyticsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
  index = 0,
}: AnalyticsCardProps) {
  const c = colorMap[color];
  const hasTrend = trend !== undefined;
  const positive = (trend ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="card p-5"
    >
      <div className="flex items-start justify-between">
        <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', c.bg)}>
          <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', c.icon)}>
            <span className="text-white [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
          </div>
        </div>

        {hasTrend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${
              positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
            }`}
          >
            {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {Math.abs(trend!).toFixed(1)}%
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-0.5">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
