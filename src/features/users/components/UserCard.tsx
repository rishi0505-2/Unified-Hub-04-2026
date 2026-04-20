import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Globe, Building2, ChevronRight } from 'lucide-react';
import { Card } from '@/shared/components/Card';
import { getInitials } from '@/shared/utils/formatters';
import type { User } from '@/shared/types';

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-pink-500', 'bg-orange-500',
  'bg-emerald-500', 'bg-cyan-500', 'bg-blue-500',
  'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-indigo-500',
];

interface UserCardProps {
  user: User;
  index: number;
}

export function UserCard({ user, index }: UserCardProps) {
  const navigate = useNavigate();
  const color = AVATAR_COLORS[user.id % AVATAR_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card hover onClick={() => navigate(`/users/${user.id}`)}>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}
            aria-hidden="true"
          >
            <span className="text-white font-bold text-sm">{getInitials(user.name)}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            </div>

            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Phone className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{user.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Building2 className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{user.company.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-primary-500">
                <Globe className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{user.website}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
