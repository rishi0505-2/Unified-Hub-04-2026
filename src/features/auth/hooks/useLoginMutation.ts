import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuth } from '@/shared/hooks/useAuth';
import type { LoginCredentials } from '@/shared/types';

export function useLoginMutation() {
  const { login, setLoading, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  async function mutate(credentials: LoginCredentials) {
    setError(null);
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      const { token, ...user } = response;
      login(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
        },
        token
      );
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Invalid username or password';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return { mutate, isLoading, error };
}
