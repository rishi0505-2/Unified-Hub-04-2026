import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

export function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching + isMutating > 0;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ originX: 0 }}
          className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 z-50"
        />
      )}
    </AnimatePresence>
  );
}
