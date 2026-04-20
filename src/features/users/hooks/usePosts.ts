import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants';
import { usersService } from '../services/usersService';

export function usePosts(userId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.USER_POSTS(userId),
    queryFn: () => usersService.getPostsByUser(userId),
    enabled: userId > 0,
  });
}
