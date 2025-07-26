// stores/cart-store.ts
import { create } from 'zustand';
import { CartItem, CartSummary } from '@/types/cart';
import { createClient } from '@/lib/supabase';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  currentUserId: string | null;
  isLoading: boolean;
  lastSyncTime: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscription: any;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
  getCartSummary: () => CartSummary;
  getItemById: (itemId: string) => CartItem | undefined;
  setUserId: (userId: string | null) => void;
  syncWithServer: () => Promise<void>;
  loadFromServer: () => Promise<void>;
  setupRealtimeSync: (userId: string) => void;
  cleanupRealtimeSync: () => void;
}

const getStorageKey = (userId: string | null) => {
  return userId ? `treva-cart-${userId}` : 'treva-cart-guest';
};

const loadFromStorage = (userId: string | null): CartItem[] => {
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
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

const saveToStorage = (userId: string | null, items: CartItem[]) => {
  if (typeof window === 'undefined') return;

  try {
    const storageKey = getStorageKey(userId);
    localStorage.setItem(
      storageKey,
      JSON.stringify({ items, timestamp: Date.now() })
    );
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

const clearFromStorage = (userId: string | null) => {
  if (typeof window === 'undefined') return;

  try {
    const storageKey = getStorageKey(userId);
    localStorage.removeItem(storageKey);
    console.log(
      `Cleared cart storage for ${userId ? `user ${userId}` : 'guest'}`
    );
  } catch (error) {
    console.error('Error clearing cart storage:', error);
  }
};

// Server sync functions
const syncCartToServer = async (userId: string, items: CartItem[]) => {
  if (!userId) return;

  try {
    const supabase = createClient();
    const { error } = await supabase.from('user_carts').upsert({
      user_id: userId,
      cart_data: items,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    console.log('Cart synced to server for user:', userId);
  } catch (error) {
    console.error('Error syncing cart to server:', error);
    throw error;
  }
};

const loadCartFromServer = async (userId: string): Promise<CartItem[]> => {
  if (!userId) return [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_carts')
      .select('cart_data, updated_at')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const serverItems = data?.cart_data || [];
    console.log(
      'Loaded cart from server for user:',
      userId,
      'items:',
      serverItems.length
    );
    return serverItems;
  } catch (error) {
    console.error('Error loading cart from server:', error);
    return [];
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
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
      .channel(`user_cart_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_carts',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Cart real-time update received:', payload);

          if (
            payload.eventType === 'UPDATE' ||
            payload.eventType === 'INSERT'
          ) {
            const newItems = payload.new?.cart_data || [];
            const currentItems = get().items;

            // Only update if the data is different (avoid infinite loops)
            if (JSON.stringify(newItems) !== JSON.stringify(currentItems)) {
              set({
                items: newItems,
                lastSyncTime: Date.now(),
              });
              saveToStorage(userId, newItems);
              console.log('Cart updated from real-time sync');
            }
          }
        }
      )
      .subscribe();

    set({ subscription });
    console.log('Real-time cart sync enabled for user:', userId);
  },

  cleanupRealtimeSync: () => {
    const { subscription } = get();
    if (subscription) {
      subscription.unsubscribe();
      set({ subscription: null });
      console.log('Real-time cart sync disabled');
    }
  },

  setUserId: async (userId) => {
    const prevUserId = get().currentUserId;

    if (prevUserId === userId) {
      console.log('Cart: User ID unchanged, skipping switch');
      return;
    }

    console.log(
      'Cart: Switching from',
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
        await syncCartToServer(prevUserId, currentItems);
        console.log('Cart: Saved current state for previous user');
      } catch (error) {
        console.error('Failed to sync cart before switching users:', error);
      }
    }

    // Update user ID and set loading
    set({ currentUserId: userId, isLoading: true, items: [] });

    try {
      let itemsToUse: CartItem[] = [];

      if (userId) {
        // For authenticated users, try server first, then localStorage
        try {
          const serverItems = await loadCartFromServer(userId);
          if (serverItems.length > 0) {
            itemsToUse = serverItems;
            saveToStorage(userId, serverItems);
            console.log('Cart: Using server data for user', userId);
          } else {
            const localItems = loadFromStorage(userId);
            itemsToUse = localItems;
            console.log('Cart: Using localStorage data for user', userId);
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
        console.log('Cart: Using localStorage data for guest');
      }

      // Update store state
      set({
        items: itemsToUse,
        isLoading: false,
        lastSyncTime: userId ? Date.now() : null,
      });

      console.log(
        'Cart: Successfully loaded',
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
        await syncCartToServer(currentUserId, items);
        set({ lastSyncTime: Date.now() });
      } catch (error) {
        console.error('Failed to sync cart to server:', error);
      }
    }
  },

  loadFromServer: async () => {
    const { currentUserId } = get();
    if (currentUserId) {
      set({ isLoading: true });
      try {
        const serverItems = await loadCartFromServer(currentUserId);
        set({
          items: serverItems,
          isLoading: false,
          lastSyncTime: Date.now(),
        });
        saveToStorage(currentUserId, serverItems);
      } catch (error) {
        console.error('Failed to load cart from server:', error);
        set({ isLoading: false });
      }
    }
  },

  addItem: async (newItem) => {
    const { items, currentUserId } = get();
    const existingItemIndex = items.findIndex(
      (item) =>
        item.productId === newItem.productId && item.size === newItem.size
    );

    let updatedItems: CartItem[];

    if (existingItemIndex > -1) {
      updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += 1;
    } else {
      const cartItem: CartItem = {
        ...newItem,
        id: `${newItem.productId}_${newItem.size || 'no-size'}_${Date.now()}`,
        quantity: 1,
      };
      updatedItems = [...items, cartItem];
    }

    set({ items: updatedItems });
    saveToStorage(currentUserId, updatedItems);

    if (currentUserId) {
      try {
        await syncCartToServer(currentUserId, updatedItems);
        set({ lastSyncTime: Date.now() });
      } catch (error) {
        console.error('Failed to sync cart to server:', error);
      }
    }
  },

  removeItem: async (itemId) => {
    const { items, currentUserId } = get();
    const updatedItems = items.filter((item) => item.id !== itemId);

    set({ items: updatedItems });
    saveToStorage(currentUserId, updatedItems);

    if (currentUserId) {
      try {
        await syncCartToServer(currentUserId, updatedItems);
        set({ lastSyncTime: Date.now() });
      } catch (error) {
        console.error('Failed to sync cart to server:', error);
      }
    }
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity <= 0) {
      await get().removeItem(itemId);
      return;
    }

    const { items, currentUserId } = get();
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );

    set({ items: updatedItems });
    saveToStorage(currentUserId, updatedItems);

    if (currentUserId) {
      try {
        await syncCartToServer(currentUserId, updatedItems);
        set({ lastSyncTime: Date.now() });
      } catch (error) {
        console.error('Failed to sync cart to server:', error);
      }
    }
  },

  clearCart: async () => {
    const { currentUserId } = get();

    set({ items: [] });
    clearFromStorage(currentUserId);

    if (currentUserId) {
      try {
        await syncCartToServer(currentUserId, []);
        set({ lastSyncTime: Date.now() });
      } catch (error) {
        console.error('Failed to sync cart to server:', error);
      }
    }
  },

  openCart: () => {
    set({ isOpen: true });
  },

  closeCart: () => {
    set({ isOpen: false });
  },

  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getItemById: (itemId) => {
    return get().items.find((item) => item.id === itemId);
  },

  getCartSummary: () => {
    const items = get().items;
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const shipping = subtotal >= 150 ? 0 : 10;
    const total = subtotal + shipping;
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    const currency = items.length > 0 ? items[0].currency : 'GBP';

    return {
      subtotal,
      shipping,
      total,
      currency,
      itemCount,
    };
  },
}));
