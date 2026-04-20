import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants';
import { usersService } from '../services/usersService';

export function useComments(postId: number, enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.POST_COMMENTS(postId),
    queryFn: () => usersService.getCommentsByPost(postId),
    enabled: enabled && postId > 0,
  });
}
