import { authApiClient } from '@/services/api/axiosInstances';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import type { LoginCredentials, LoginResponse } from '@/shared/types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await authApiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH_LOGIN,
      credentials
    );
    return data;
  },
};
