import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants';
import { usersService } from '../services/usersService';

export function useUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: usersService.getUsers,
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.USER(id),
    queryFn: () => usersService.getUserById(id),
    enabled: id > 0,
  });
}
