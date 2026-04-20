import { jsonPlaceholderClient } from '@/services/api/axiosInstances';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import type { User, Post, Comment } from '@/shared/types';

export const usersService = {
  getUsers: async (): Promise<User[]> => {
    const { data } = await jsonPlaceholderClient.get<User[]>(API_ENDPOINTS.USERS);
    return data;
  },

  getUserById: async (id: number): Promise<User> => {
    const { data } = await jsonPlaceholderClient.get<User>(API_ENDPOINTS.USER_BY_ID(id));
    return data;
  },

  getPostsByUser: async (userId: number): Promise<Post[]> => {
    const { data } = await jsonPlaceholderClient.get<Post[]>(API_ENDPOINTS.POSTS_BY_USER(userId));
    return data;
  },

  getCommentsByPost: async (postId: number): Promise<Comment[]> => {
    const { data } = await jsonPlaceholderClient.get<Comment[]>(
      API_ENDPOINTS.COMMENTS_BY_POST(postId)
    );
    return data;
  },
};
