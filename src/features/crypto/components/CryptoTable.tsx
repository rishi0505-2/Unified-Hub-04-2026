import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useCrypto } from '../hooks/useCrypto';
import { SkeletonTable } from '@/shared/components/Skeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { EmptyState } from '@/shared/components/EmptyState';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { formatCurrency, formatCompactNumber, formatPercent } from '@/shared/utils/formatters';
import { APP_CONFIG } from '@/shared/constants';
import type { CryptoAsset, CryptoSortKey } from '@/shared/types';

type SortDir = 'asc' | 'desc';

interface SortState {
  key: CryptoSortKey;
  dir: SortDir;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />;
  return dir === 'asc' ? (
    <ChevronUp className="h-3.5 w-3.5 text-primary-500" />
  ) : (
    <ChevronDown className="h-3.5 w-3.5 text-primary-500" />
  );
}

const COLUMNS: { label: string; key: CryptoSortKey }[] = [
  { label: 'Price', key: 'current_price' },
  { label: 'Market Cap', key: 'market_cap' },
  { label: '24h Change', key: 'price_change_percentage_24h' },
];

const PAGE_SIZE = APP_CONFIG.CRYPTO_PAGE_SIZE;

export function CryptoTable() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortState>({ key: 'market_cap_rank', dir: 'asc' });
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const { data: coins, isLoading, isError, refetch } = useCrypto({ perPage: 100 });

  const handleSort = useCallback(
    (key: CryptoSortKey) => {
      setSort((prev) =>
        prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }
      );
      setPage(1);
    },
    []
  );

  const filteredSorted = useMemo<CryptoAsset[]>(() => {
    if (!coins) return [];
    const q = debouncedSearch.toLowerCase();
    const filtered = q
      ? coins.filter(
          (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
        )
      : coins;

    return [...filtered].sort((a, b) => {
      const aVal = a[sort.key] ?? 0;
      const bVal = b[sort.key] ?? 0;
      return sort.dir === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });
  }, [coins, debouncedSearch, sort]);

  const totalPages = Math.ceil(filteredSorted.length / PAGE_SIZE);
  const paginated = filteredSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) return <SkeletonTable rows={10} cols={5} />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search crypto by name or symbol..."
          className="input-base pl-10"
          aria-label="Search crypto"
        />
      </div>

      {filteredSorted.length === 0 ? (
        <EmptyState title="No coins found" message={`No matches for "${debouncedSearch}".`} />
      ) : (
        <>
          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table" aria-label="Crypto markets">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 w-8">#</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Name
                    </th>
                    {COLUMNS.map(({ label, key }) => (
                      <th key={key} className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleSort(key)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ml-auto"
                        >
                          {label}
                          <SortIcon active={sort.key === key} dir={sort.dir} />
                        </button>
                      </th>
                    ))}
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Volume
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  <AnimatePresence initial={false}>
                    {paginated.map((coin, i) => {
                      const positive = coin.price_change_percentage_24h >= 0;
                      return (
                        <motion.tr
                          key={coin.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.02 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-400 dark:text-gray-600 text-xs font-mono">
                            {coin.market_cap_rank}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="h-7 w-7 rounded-full"
                                loading="lazy"
                              />
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                  {coin.name}
                                </p>
                                <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm text-gray-900 dark:text-white">
                            {formatCurrency(coin.current_price)}
                          </td>
                          <td className="px-4 py-3 text-right text-xs text-gray-600 dark:text-gray-400">
                            {formatCompactNumber(coin.market_cap)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-medium ${
                                positive
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-red-500 dark:text-red-400'
                              }`}
                            >
                              {positive ? (
                                <TrendingUp className="h-3.5 w-3.5" />
                              ) : (
                                <TrendingDown className="h-3.5 w-3.5" />
                              )}
                              {formatPercent(coin.price_change_percentage_24h)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-xs text-gray-500 dark:text-gray-400">
                            {formatCompactNumber(coin.total_volume)}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-500 dark:text-gray-400">
                Page {page} of {totalPages} &mdash; {filteredSorted.length} coins
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
