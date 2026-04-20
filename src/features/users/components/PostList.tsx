import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, MessageCircle, Mail } from 'lucide-react';
import { Skeleton } from '@/shared/components/Skeleton';
import { useComments } from '../hooks/useComments';
import { usePosts } from '../hooks/usePosts';
import type { Post } from '@/shared/types';

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const { data: comments, isLoading } = useComments(post.id, commentsOpen);

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
      {/* Post header */}
      <div className="p-4">
        <h4 className="font-medium text-gray-900 dark:text-white capitalize text-sm mb-1 leading-snug">
          {post.title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{post.body}</p>
      </div>

      {/* Toggle comments */}
      <button
        onClick={() => setCommentsOpen((v) => !v)}
        className="flex items-center gap-1.5 px-4 py-2.5 w-full text-left text-xs font-medium text-primary-600 dark:text-primary-400
                   border-t border-gray-100 dark:border-gray-800
                   hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
        aria-expanded={commentsOpen}
      >
        <MessageCircle className="h-3.5 w-3.5" />
        {commentsOpen ? 'Hide' : 'Show'} comments
        {commentsOpen ? (
          <ChevronUp className="h-3.5 w-3.5 ml-auto" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 ml-auto" />
        )}
      </button>

      {/* Comments section */}
      <AnimatePresence initial={false}>
        {commentsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 space-y-3">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))
                : comments?.map((comment) => (
                    <div key={comment.id} className="text-xs">
                      <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300 font-medium mb-0.5">
                        <Mail className="h-3 w-3 text-primary-500 flex-shrink-0" />
                        {comment.email}
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                        {comment.body}
                      </p>
                    </div>
                  ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface PostListProps {
  userId: number;
}

export function PostList({ userId }: PostListProps) {
  const { data: posts, isLoading, isError, refetch } = usePosts(userId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500 py-4 text-center">
        Failed to load posts.{' '}
        <button onClick={() => refetch()} className="underline">
          Retry
        </button>
      </p>
    );
  }

  if (!posts?.length) {
    return <p className="text-sm text-gray-500 py-4 text-center">No posts found.</p>;
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
