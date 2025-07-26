/* eslint-disable @typescript-eslint/no-explicit-any */
// components/storage-cleanup-provider.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';

interface StorageCleanupProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that handles localStorage cleanup and provides debugging utilities
 */
export function StorageCleanupProvider({
  children,
}: StorageCleanupProviderProps) {
  const { user } = useAuthStore();
  const prevUserIdRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const currentUserId = user?.id ?? null;
    const prevUserId = prevUserIdRef.current;

    // Skip on initial mount
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      prevUserIdRef.current = currentUserId;
      return;
    }

    // Only run cleanup logic when user state actually changes
    if (prevUserId !== currentUserId && typeof window !== 'undefined') {
      console.log(
        'StorageCleanup: User changed from',
        prevUserId,
        'to',
        currentUserId
      );

      // User just logged in
      if (!prevUserId && currentUserId) {
        console.log('User logged in, optionally cleaning guest storage');

        // Optional: Clean up guest storage when user logs in
        // Set this to true if you want to clear guest data on login
        const CLEANUP_GUEST_ON_LOGIN = false;

        if (CLEANUP_GUEST_ON_LOGIN) {
          const cleanupGuestStorage = () => {
            try {
              localStorage.removeItem('treva-cart-guest');
              localStorage.removeItem('treva-wishlist-guest');
              console.log('Guest storage cleaned up after login');
            } catch (error) {
              console.error('Error cleaning up guest storage:', error);
            }
          };

          // Small delay to ensure stores have loaded user data first
          setTimeout(cleanupGuestStorage, 2000);
        }
      }

      // User just logged out
      if (prevUserId && !currentUserId) {
        console.log('User logged out, guest storage will be used');

        // Optional: Clean up specific user's data after logout
        // Set this to true if you want to aggressively clean up user data
        const CLEANUP_USER_ON_LOGOUT = false;

        if (CLEANUP_USER_ON_LOGOUT) {
          const cleanupUserStorage = () => {
            try {
              localStorage.removeItem(`treva-cart-${prevUserId}`);
              localStorage.removeItem(`treva-wishlist-${prevUserId}`);
              console.log(`User ${prevUserId} storage cleaned up after logout`);
            } catch (error) {
              console.error('Error cleaning up user storage:', error);
            }
          };

          // Delay cleanup to avoid removing data of users who just logged out temporarily
          setTimeout(cleanupUserStorage, 30000); // 30 seconds
        }
      }

      // Update the ref
      prevUserIdRef.current = currentUserId;
    }
  }, [user?.id]);

  // Enhanced debugging utilities
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Utility function to manually clean all storage (for debugging)
      (window as any).cleanAllTrevaStorage = () => {
        try {
          const keys = Object.keys(localStorage);
          const trevaKeys = keys.filter(
            (key) =>
              key.startsWith('treva-cart-') || key.startsWith('treva-wishlist-')
          );

          trevaKeys.forEach((key) => localStorage.removeItem(key));
          console.log('Cleaned all Treva storage:', trevaKeys);
          return { cleaned: trevaKeys, count: trevaKeys.length };
        } catch (error) {
          console.error('Error cleaning all storage:', error);
          return { error };
        }
      };

      // Utility function to show current storage state
      (window as any).showTrevaStorage = () => {
        try {
          const keys = Object.keys(localStorage);
          const trevaKeys = keys.filter(
            (key) =>
              key.startsWith('treva-cart-') || key.startsWith('treva-wishlist-')
          );

          const storage: { [key: string]: any } = {};
          trevaKeys.forEach((key) => {
            try {
              const value = localStorage.getItem(key);
              storage[key] = value ? JSON.parse(value) : null;
            } catch {
              storage[key] = localStorage.getItem(key);
            }
          });

          console.log('Current Treva storage:', storage);
          return storage;
        } catch (error) {
          console.error('Error showing storage:', error);
          return { error };
        }
      };

      // Utility function to clean specific user's storage
      (window as any).cleanUserStorage = (userId: string) => {
        try {
          const cartKey = `treva-cart-${userId}`;
          const wishlistKey = `treva-wishlist-${userId}`;

          localStorage.removeItem(cartKey);
          localStorage.removeItem(wishlistKey);

          console.log(`Cleaned storage for user: ${userId}`);
          return { cleaned: [cartKey, wishlistKey] };
        } catch (error) {
          console.error('Error cleaning user storage:', error);
          return { error };
        }
      };

      // Utility function to clean guest storage
      (window as any).cleanGuestStorage = () => {
        try {
          localStorage.removeItem('treva-cart-guest');
          localStorage.removeItem('treva-wishlist-guest');

          console.log('Cleaned guest storage');
          return { cleaned: ['treva-cart-guest', 'treva-wishlist-guest'] };
        } catch (error) {
          console.error('Error cleaning guest storage:', error);
          return { error };
        }
      };

      // Utility function to force reset stores (for debugging)
      (window as any).resetTrevaStores = () => {
        try {
          // Clear all storage
          (window as any).cleanAllTrevaStorage();

          // Reload the page to reinitialize stores
          window.location.reload();
        } catch (error) {
          console.error('Error resetting stores:', error);
          return { error };
        }
      };

      console.log('Storage cleanup utilities loaded:');
      console.log('- window.showTrevaStorage() - Show current storage state');
      console.log('- window.cleanAllTrevaStorage() - Clean all Treva storage');
      console.log(
        '- window.cleanUserStorage(userId) - Clean specific user storage'
      );
      console.log('- window.cleanGuestStorage() - Clean guest storage');
      console.log('- window.resetTrevaStores() - Force reset all stores');
    }
  }, []);

  return <>{children}</>;
}
