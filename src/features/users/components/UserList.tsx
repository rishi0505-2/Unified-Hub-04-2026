import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { UserCard } from './UserCard';
import { SkeletonCard } from '@/shared/components/Skeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { EmptyState } from '@/shared/components/EmptyState';
import { useDebounce } from '@/shared/hooks/useDebounce';

export function UserList() {
  const { data: users, isLoading, isError, refetch } = useUsers();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = debouncedSearch.toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.company.name.toLowerCase().includes(q)
    );
  }, [users, debouncedSearch]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name, email, company..."
          className="input-base pl-10"
          aria-label="Search users"
        />
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <ErrorState
          title="Failed to load users"
          message="Could not fetch user data from the server."
          onRetry={() => refetch()}
        />
      )}

      {/* Empty */}
      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState
          title="No users found"
          message={
            debouncedSearch
              ? `No results for "${debouncedSearch}".`
              : 'No users available.'
          }
        />
      )}

      {/* User grid */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((user, index) => (
            <UserCard key={user.id} user={user} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
