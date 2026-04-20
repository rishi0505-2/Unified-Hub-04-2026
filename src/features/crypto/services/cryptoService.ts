import { cryptoApiClient } from '@/services/api/axiosInstances';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import type { CryptoAsset, CryptoSortKey } from '@/shared/types';

export interface CryptoFetchParams {
  currency?: string;
  order?: string;
  perPage?: number;
  page?: number;
}

export const cryptoService = {
  getMarkets: async ({
    currency = 'usd',
    order = 'market_cap_desc',
    perPage = 20,
    page = 1,
  }: CryptoFetchParams = {}): Promise<CryptoAsset[]> => {
    const { data } = await cryptoApiClient.get<CryptoAsset[]>(API_ENDPOINTS.COINS_MARKETS, {
      params: {
        vs_currency: currency,
        order,
        per_page: perPage,
        page,
        sparkline: false,
      },
    });
    return data;
  },
};

export type { CryptoSortKey };
