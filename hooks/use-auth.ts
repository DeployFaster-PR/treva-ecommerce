// hooks/use-auth.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuthStore();

  // Get store functions for clearing user data
  const cartSetUserId = useCartStore((state) => state.setUserId);
  const wishlistSetUserId = useWishlistStore((state) => state.setUserId);

  const clearAllStores = async () => {
    // Set user ID to null for both stores, which will:
    // 1. Save current user's data before switching
    // 2. Clear the current state
    // 3. Load guest data (empty for new guest session)
    await Promise.all([cartSetUserId(null), wishlistSetUserId(null)]);

    console.log('All user stores cleared on logout');
  };

  const redirectToDashboard = () => {
    router.push('/dashboard');
  };

  const checkAuthAndRedirect = () => {
    // If user is already signed in and on auth pages, redirect to dashboard
    if (user) {
      redirectToDashboard();
      return true;
    }
    return false;
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user && !data.session) {
        // Email confirmation required
        return {
          success: true,
          message: 'Check your email for confirmation link',
        };
      }

      // Redirect to dashboard on successful signup
      redirectToDashboard();
      return { success: true, message: 'Account created successfully' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect to dashboard on successful signin
      redirectToDashboard();
      return { success: true, message: 'Signed in successfully' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      // Clear all user-specific stores BEFORE signing out
      await clearAllStores();

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Redirect to homepage
      window.location.replace('/');
      return { success: true, message: 'Signed out successfully' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      return { success: true, message: 'Password reset email sent' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      // Redirect to dashboard after password update
      redirectToDashboard();
      return { success: true, message: 'Password updated successfully' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'github') => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return { success: true, message: `Redirecting to ${provider}...` };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    signInWithProvider,
    checkAuthAndRedirect,
  };
}
