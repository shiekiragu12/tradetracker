import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/app/lib/supabase';
import { User } from '@/app/types';

interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: false,
      error: null,

      signUp: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;
          
          set({ 
            session: data.session,
            user: data.user ? {
              id: data.user.id,
              email: data.user.email || '',
              created_at: data.user.created_at || new Date().toISOString(),
            } : null,
            isLoading: false 
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          set({ 
            session: data.session,
            user: data.user ? {
              id: data.user.id,
              email: data.user.email || '',
              created_at: data.user.created_at || new Date().toISOString(),
            } : null,
            isLoading: false 
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signOut();
          
          if (error) throw error;
          
          set({ 
            user: null, 
            session: null, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          
          if (error) throw error;
          
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          
          const { user } = get();
          if (!user) throw new Error('User not authenticated');
          
          // In a real app, this would call an API to update the user profile
          set({ 
            user: { ...user, ...updates },
            isLoading: false 
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);