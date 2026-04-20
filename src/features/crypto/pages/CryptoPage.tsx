import { PageTransition } from '@/shared/components/PageTransition';
import { CryptoTable } from '../components/CryptoTable';
import { TrendingUp } from 'lucide-react';

export default function CryptoPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-amber-100 dark:bg-amber-950 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Crypto Markets</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Live market data via CoinGecko
            </p>
          </div>
        </div>

        <CryptoTable />
      </div>
    </PageTransition>
  );
}
