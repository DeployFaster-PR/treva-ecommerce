// stores/wishlist-store.ts
import { create } from 'zustand';
import { WishlistItem } from '@/types/cart';
import { createClient } from '@/lib/supabase';

interface WishlistState {
  items: WishlistItem[];
  currentUserId: string | null;
  isLoading: boolean;
  lastSyncTime: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscription: any;
  addItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  removeItem: (productId: string, size?: string) => void;
  isInWishlist: (productId: string, size?: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
  setUserId: (userId: string | null) => void;
  syncWithServer: () => Promise<void>;
  loadFromServer: () => Promise<void>;
  setupRealtimeSync: (userId: string) => void;
  cleanupRealtimeSync: () => void;
}

const getStorageKey = (userId: string | null) => {
  return userId ? `treva-wishlist-${userId}` : 'treva-wishlist-guest';
};

const loadFromStorage = (userId: string | null): WishlistItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const storageKey = getStorageKey(userId);
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.items || parsed.state?.items || [];
    }
    return [];
  } catch (error) {
    console.error('Error loading wishlist from storage:', error);
    return [];
  }
};

const saveToStorage = (userId: string | null, items: WishlistItem[]) => {
  if (typeof window === 'undefined') return;

  try {
    const storageKey = getStorageKey(userId);
    localStorage.setItem(
      storageKey,
      JSON.stringify({ items, timestamp: Date.now() })
    );
  } catch (error) {
    console.error('Error saving wishlist to storage:', error);
  }
};

const clearFromStorage = (userId: string | null) => {
  if (typeof window === 'undefined') return;

  try {
    const storageKey = getStorageKey(userId);
    localStorage.removeItem(storageKey);
    console.log(
      `Cleared wishlist storage for ${userId ? `user ${userId}` : 'guest'}`
    );
  } catch (error) {
    console.error('Error clearing wishlist storage:', error);
  }
};

// Server sync functions
const syncWishlistToServer = async (userId: string, items: WishlistItem[]) => {
  if (!userId) return;

  try {
    const supabase = createClient();
    const { error } = await supabase.from('user_wishlists').upsert({
      user_id: userId,
      wishlist_data: items,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    console.log('Wishlist synced to server for user:', userId);
  } catch (error) {
    console.error('Error syncing wishlist to server:', error);
    throw error;
  }
};

const loadWishlistFromServer = async (
  userId: string
): Promise<WishlistItem[]> => {
  if (!userId) return [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_wishlists')
      .select('wishlist_data, updated_at')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const serverItems = data?.wishlist_data || [];
    console.log(
      'Loaded wishlist from server for user:',
      userId,
      'items:',
      serverItems.length
    );
    return serverItems;
  } catch (error) {
    console.error('Error loading wishlist from server:', error);
    return [];
  }
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  currentUserId: null,
  isLoading: false,
  lastSyncTime: null,
  subscription: null,

  setupRealtimeSync: (userId: string) => {
    const supabase = createClient();

    // Clean up existing subscription
    get().cleanupRealtimeSync();

    // Set up new subscription
    const subscription = supabase
      .channel(`user_wishlist_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_wishlists',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Wishlist real-time update received:', payload);

          if (
            payload.eventType === 'UPDATE' ||
            payload.eventType === 'INSERT'
          ) {
            const newItems = payload.new?.wishlist_data || [];
            const currentItems = get().items;

            // Only update if the data is different (avoid infinite loops)
            if (JSON.stringify(newItems) !== JSON.stringify(currentItems)) {
              set({
                items: newItems,
                lastSyncTime: Date.now(),
              });
              saveToStorage(userId, newItems);
              console.log('Wishlist updated from real-time sync');
            }
          }
        }
      )
      .subscribe();

    set({ subscription });
    console.log('Real-time wishlist sync enabled for user:', userId);
  },

  cleanupRealtimeSync: () => {
    const { subscription } = get();
    if (subscription) {
      subscription.unsubscribe();
      set({ subscription: null });
      console.log('Real-time wishlist sync disabled');
    }
  },

  setUserId: async (userId) => {
    const prevUserId = get().currentUserId;

    if (prevUserId === userId) {
      console.log('Wishlist: User ID unchanged, skipping switch');
      return;
    }

    console.log(
      'Wishlist: Switching from',
      prevUserId || 'guest',
      'to',
      userId || 'guest'
    );

    // Clean up real-time subscription for previous user
    get().cleanupRealtimeSync();

    // Save current state before switching (if we have a previous user)
    if (prevUserId) {
      const currentItems = get().items;
      saveToStorage(prevUserId, currentItems);

      try {
        await syncWishlistToServer(prevUserId, currentItems);
        console.log('Wishlist: Saved current state for previous user');
      } catch (error) {
        console.error('Failed to sync wishlist before switching users:', error);
      }
    }

    // Update user ID and set loading
    set({ currentUserId: userId, isLoading: true, items: [] });

    try {
      let itemsToUse: WishlistItem[] = [];

      if (userId) {
        // For authenticated users, try server first, then localStorage
        try {
          const serverItems = await loadWishlistFromServer(userId);
          if (serverItems.length > 0) {
            itemsToUse = serverItems;
            saveToStorage(userId, serverItems);
            console.log('Wishlist: Using server data for user', userId);
          } else {
            const localItems = loadFromStorage(userId);
            itemsToUse = localItems;
            console.log('Wishlist: Using localStorage data for user', userId);
          }
        } catch (error) {
          console.error(
            'Server load failed, falling back to localStorage:',
            error
          );
          const localItems = loadFromStorage(userId);
          itemsToUse = localItems;
        }

        // Set up real-time sync for authenticated users
        get().setupRealtimeSync(userId);
      } else {
        // For guest users, use localStorage only
        itemsToUse = loadFromStorage(null);
        console.log('Wishlist: Using localStorage data for guest');
      }

      // Update store state
      set({
        items: itemsToUse,
        isLoading: false,
        lastSyncTime: userId ? Date.now() : null,
      });

      console.log(
        'Wishlist: Successfully loaded',
        itemsToUse.length,
        'items for',
        userId || 'guest'
      );
    } catch (error) {
      console.error('Error during user switch:', error);
      set({ items: [], isLoading: false });
    }
  },

  syncWithServer: async () => {
    const { currentUserId, items } = get();
    if (currentUserId) {
      try {
        await syncWishlistToServer(currentUserId, items);
        set({ lastSyncTime: Date.now() });
      } catch (error) {
        console.error('Failed to sync wishlist to server:', error);
      }
    }
  },

  loadFromServer: async () => {
    const { currentUserId } = get();
    if (currentUserId) {
      set({ isLoading: true });
      try {
        const serverItems = await loadWishlistFromServer(currentUserId);
        set({
          items: serverItems,
          isLoading: false,
          lastSyncTime: Date.now(),
        });
        saveToStorage(currentUserId, serverItems);
      } catch (error) {
        console.error('Failed to load wishlist from server:', error);
        set({ isLoading: false });
      }
    }
  },

  addItem: async (newItem) => {
    const { items, currentUserId } = get();
    const exists = items.some(
      (item) =>
        item.productId === newItem.productId && item.size === newItem.size
    );

    if (!exists) {
      const wishlistItem: WishlistItem = {
        ...newItem,
        id: `${newItem.productId}_${newItem.size || 'no-size'}_${Date.now()}`,
        addedAt: new Date().toISOString(),
      };

      const updatedItems = [...items, wishlistItem];
      set({ items: updatedItems });
      saveToStorage(currentUserId, updatedItems);

      if (currentUserId) {
        try {
          await syncWishlistToServer(currentUserId, updatedItems);
          set({ lastSyncTime: Date.now() });
        } catch (error) {
          console.error('Failed to sync wishlist to server:', error);
        }
      }
    }
  },

  removeItem: async (productId, size) => {
    const { items, currentUserId } = get();
    const updatedItems = items.filter(
      (item) => !(item.productId === productId && item.size === size)
    );

    set({ items: updatedItems });
    saveToStorage(currentUserId, updatedItems);

    if (currentUserId) {
      try {
        await syncWishlistToServer(currentUserId, updatedItems);
        set({ lastSyncTime: Date.now() });
      } catch (error) {
        console.error('Failed to sync wishlist to server:', error);
      }
    }
  },

  isInWishlist: (productId, size) => {
    return get().items.some(
      (item) => item.productId === productId && item.size === size
    );
  },

  clearWishlist: async () => {
    const { currentUserId } = get();

    set({ items: [] });
    clearFromStorage(currentUserId);

    if (currentUserId) {
      try {
        await syncWishlistToServer(currentUserId, []);
        set({ lastSyncTime: Date.now() });
      } catch (error) {
        console.error('Failed to sync wishlist to server:', error);
      }
    }
  },

  getItemCount: () => {
    return get().items.length;
  },
}));
