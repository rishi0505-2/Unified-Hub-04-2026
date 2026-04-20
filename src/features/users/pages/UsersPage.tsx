import { PageTransition } from '@/shared/components/PageTransition';
import { UserList } from '../components/UserList';
import { Users } from 'lucide-react';

export default function UsersPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-100 dark:bg-primary-950 rounded-xl flex items-center justify-center">
            <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Users</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Browse and explore all users
            </p>
          </div>
        </div>

        <UserList />
      </div>
    </PageTransition>
  );
}
