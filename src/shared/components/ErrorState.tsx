import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  icon?: ReactNode;
}

export function ErrorState({
  title = 'Failed to load',
  message = 'Something went wrong while fetching the data.',
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      role="alert"
    >
      <div className="h-14 w-14 bg-red-100 dark:bg-red-950 rounded-2xl flex items-center justify-center mb-4">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" icon={<RefreshCw className="h-4 w-4" />} onClick={onRetry}>
          Retry
        </Button>
      )}
    </motion.div>
  );
}
