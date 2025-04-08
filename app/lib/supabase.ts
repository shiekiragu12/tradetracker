import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Trade, Transaction, User } from '@/app/types';

// Mock implementation of Supabase client for demo purposes
// In a real app, you would use the actual Supabase SDK

class MockSupabaseClient {
  private storage: typeof AsyncStorage | Storage;

  constructor() {
    // Use appropriate storage based on platform
    this.storage = Platform.OS !== 'web' ? AsyncStorage : localStorage;
  }

  // Helper method to get data from storage
  private async getData(key: string) {
    try {
      const data = await this.storage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  }

  // Helper method to set data in storage
  private async setData(key: string, value: any) {
    try {
      await this.storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
    }
  }

  // Mock Supabase auth methods
  auth = {
    signUp: async ({ email, password }: { email: string; password: string }) => {
      const users = await this.getData('users') || [];
      const existingUser = users.find((u: User) => u.email === email);
      
      if (existingUser) {
        return { data: null, error: { message: 'User already exists' } };
      }
      
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        created_at: new Date().toISOString(),
      };
      
      users.push(newUser);
      await this.setData('users', users);
      
      return { 
        data: { 
          user: newUser,
          session: { user: newUser }
        }, 
        error: null 
      };
    },
    
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const users = await this.getData('users') || [];
      const user = users.find((u: User) => u.email === email);
      
      if (!user) {
        return { data: null, error: { message: 'Invalid login credentials' } };
      }
      
      return { 
        data: { 
          user,
          session: { user }
        }, 
        error: null 
      };
    },
    
    signOut: async () => {
      return { error: null };
    },
    
    resetPasswordForEmail: async (email: string) => {
      return { error: null };
    }
  };

  // Mock Supabase database methods
  from = (table: string) => {
    return {
      select: (columns = '*') => {
        return {
          eq: async (column: string, value: any) => {
            const data = await this.getData(table) || [];
            const filteredData = data.filter((item: any) => item[column] === value);
            return { data: filteredData, error: null };
          },
          
          gte: (column: string, value: any) => {
            return this;
          },
          
          lte: (column: string, value: any) => {
            return this;
          },
          
          order: (column: string, { ascending = true } = {}) => {
            return this;
          },
          
          single: async () => {
            const data = await this.getData(table) || [];
            return { data: data[0] || null, error: null };
          }
        };
      },
      
      insert: (data: any) => {
        return {
          select: () => {
            return {
              single: async () => {
                const existingData = await this.getData(table) || [];
                const newItem = {
                  ...data,
                  id: `${table}_${Date.now()}`,
                  created_at: new Date().toISOString()
                };
                
                existingData.push(newItem);
                await this.setData(table, existingData);
                
                return { data: newItem, error: null };
              }
            };
          }
        };
      },
      
      update: (updates: any) => {
        return {
          eq: (column: string, value: any) => {
            return {
              select: () => {
                return {
                  single: async () => {
                    const existingData = await this.getData(table) || [];
                    const index = existingData.findIndex((item: any) => item[column] === value);
                    
                    if (index === -1) {
                      return { data: null, error: { message: 'Item not found' } };
                    }
                    
                    existingData[index] = { ...existingData[index], ...updates };
                    await this.setData(table, existingData);
                    
                    return { data: existingData[index], error: null };
                  }
                };
              }
            };
          }
        };
      }
    };
  };
}

// Create mock Supabase client
export const supabase = new MockSupabaseClient();

// Helper functions for database operations
export const fetchTrades = async (userId: string, startDate?: string, endDate?: string) => {
  const { data, error } = await supabase.from('trades').select('*').eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching trades:', error);
    return [];
  }
  
  return data;
};

export const fetchTransactions = async (userId: string, startDate?: string, endDate?: string) => {
  const { data, error } = await supabase.from('transactions').select('*').eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
  
  return data;
};

export const fetchLearningResources = async (category?: string) => {
  const { data, error } = await supabase.from('learning_resources').select('*');
  
  if (error) {
    console.error('Error fetching learning resources:', error);
    return [];
  }
  
  return data;
};

export const addTrade = async (trade: Omit<Trade, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('trades')
    .insert(trade)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding trade:', error);
    throw error;
  }
  
  return data;
};

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
  
  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
  
  return data;
};