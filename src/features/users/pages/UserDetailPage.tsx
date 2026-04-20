import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Building2,
  MapPin,
  FileText,
} from 'lucide-react';
import { useUser } from '../hooks/useUsers';
import { PostList } from '../components/PostList';
import { SkeletonCard } from '@/shared/components/Skeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { PageTransition } from '@/shared/components/PageTransition';
import { Button } from '@/shared/components/Button';
import { getInitials } from '@/shared/utils/formatters';

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-pink-500', 'bg-orange-500',
  'bg-emerald-500', 'bg-cyan-500', 'bg-blue-500',
  'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-indigo-500',
];

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();

  const { data: user, isLoading, isError, refetch } = useUser(userId);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </PageTransition>
    );
  }

  if (isError || !user) {
    return (
      <PageTransition>
        <ErrorState
          title="User not found"
          message="Could not load this user's information."
          onRetry={() => refetch()}
        />
      </PageTransition>
    );
  }

  const color = AVATAR_COLORS[user.id % AVATAR_COLORS.length];

  return (
    <PageTransition>
      <div className="space-y-6 max-w-3xl">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/users')}
        >
          Back to Users
        </Button>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-start gap-5">
            <div
              className={`h-16 w-16 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}
            >
              <span className="text-white font-bold text-lg">{getInitials(user.name)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {[
                  { icon: Mail, text: user.email },
                  { icon: Phone, text: user.phone },
                  { icon: Globe, text: user.website },
                  {
                    icon: MapPin,
                    text: `${user.address.city}, ${user.address.zipcode}`,
                  },
                  { icon: Building2, text: user.company.name },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <Icon className="h-4 w-4 text-primary-500 flex-shrink-0" />
                    <span className="truncate">{text}</span>
                  </div>
                ))}
              </div>

              {user.company.catchPhrase && (
                <blockquote className="mt-4 pl-3 border-l-2 border-primary-500 text-sm italic text-gray-500 dark:text-gray-400">
                  "{user.company.catchPhrase}"
                </blockquote>
              )}
            </div>
          </div>
        </motion.div>

        {/* Posts */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Posts</h2>
          </div>
          <PostList userId={userId} />
        </div>
      </div>
    </PageTransition>
  );
}
