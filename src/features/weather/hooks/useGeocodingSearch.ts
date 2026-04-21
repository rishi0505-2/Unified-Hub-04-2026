import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants';
import { geocodingService } from '../services/weatherService';

export function useGeocodingSearch(query: string) {
  return useQuery({
    queryKey: QUERY_KEYS.GEOCODING(query),
    queryFn: () => geocodingService.search(query),
    enabled: query.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
