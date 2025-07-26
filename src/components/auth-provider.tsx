// components/auth-provider.tsx
'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading } = useAuthStore();
  const { setUserId: setCartUserId } = useCartStore();
  const { setUserId: setWishlistUserId } = useWishlistStore();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;
      const userId = user?.id ?? null;

      console.log(
        'Auth state change:',
        event,
        userId ? `User: ${userId}` : 'No user'
      );

      // Update auth store first
      setUser(user);
      setLoading(false);

      // Handle authentication state changes with proper cleanup
      if (event === 'SIGNED_OUT') {
        console.log('User signed out - switching to guest storage');
        // Switch to guest storage - this will properly clear the current user's data from view
        await setCartUserId(null);
        await setWishlistUserId(null);
      } else if (event === 'SIGNED_IN' && userId) {
        console.log('User signed in - loading user-specific data');
        // Load user-specific data when signing in
        await setCartUserId(userId);
        await setWishlistUserId(userId);
      } else if (event === 'TOKEN_REFRESHED' && userId) {
        console.log('Token refreshed - ensuring stores are synced');
        // Ensure stores are synced on token refresh (only if user hasn't changed)
        await setCartUserId(userId);
        await setWishlistUserId(userId);
      }
    });

    // Get initial session and sync stores
    const initializeAuth = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setLoading(false);
          // Initialize with guest data
          await setCartUserId(null);
          await setWishlistUserId(null);
          return;
        }

        const user = session?.user ?? null;
        const userId = user?.id ?? null;

        console.log('Initial session:', userId ? `User: ${userId}` : 'No user');

        setUser(user);
        setLoading(false);

        // Initialize stores with correct user context
        await setCartUserId(userId);
        await setWishlistUserId(userId);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setLoading(false);
        // Fallback to guest mode
        await setCartUserId(null);
        await setWishlistUserId(null);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, setCartUserId, setWishlistUserId, supabase.auth]);

  return <>{children}</>;
}
