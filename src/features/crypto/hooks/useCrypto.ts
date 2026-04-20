import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, APP_CONFIG } from '@/shared/constants';
import { cryptoService } from '../services/cryptoService';
import type { CryptoFetchParams } from '../services/cryptoService';

export function useCrypto(params: CryptoFetchParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.CRYPTO(params as Record<string, unknown>),
    queryFn: () => cryptoService.getMarkets(params),
    staleTime: APP_CONFIG.CRYPTO_STALE_TIME,
  });
}
