import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" aria-label="Loading page">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="h-8 w-8 text-primary-600" />
      </motion.div>
    </div>
  );
}

export function InlineLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div
      className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500 dark:text-gray-400"
      aria-label={label}
      role="status"
    >
      <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
      <span>{label}</span>
    </div>
  );
}
