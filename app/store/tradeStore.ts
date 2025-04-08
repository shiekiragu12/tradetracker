import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trade, DailyPerformance, MonthlyPerformance } from '@/app/types';
import { fetchTrades, addTrade } from '@/app/lib/supabase';

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to format date as YYYY-MM
const formatMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

interface TradeState {
  trades: Trade[];
  isLoading: boolean;
  error: string | null;
  dailyPerformance: DailyPerformance[];
  monthlyPerformance: MonthlyPerformance[];
  fetchUserTrades: (userId: string) => Promise<void>;
  addUserTrade: (trade: Omit<Trade, 'id' | 'created_at'>) => Promise<void>;
  calculateDailyPerformance: () => void;
  calculateMonthlyPerformance: () => void;
}

export const useTradeStore = create<TradeState>()(
  persist(
    (set, get) => ({
      trades: [],
      isLoading: false,
      error: null,
      dailyPerformance: [],
      monthlyPerformance: [],

      fetchUserTrades: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const data = await fetchTrades(userId);
          set({ trades: data, isLoading: false });
          
          // Calculate performance metrics
          get().calculateDailyPerformance();
          get().calculateMonthlyPerformance();
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      addUserTrade: async (trade: Omit<Trade, 'id' | 'created_at'>) => {
        try {
          set({ isLoading: true, error: null });
          const newTrade = await addTrade(trade);
          set(state => ({ 
            trades: [newTrade, ...state.trades],
            isLoading: false 
          }));
          
          // Recalculate performance metrics
          get().calculateDailyPerformance();
          get().calculateMonthlyPerformance();
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      calculateDailyPerformance: () => {
        const { trades } = get();
        const dailyMap = new Map<string, DailyPerformance>();

        trades.forEach(trade => {
          const date = formatDate(new Date(trade.created_at));
          const existing = dailyMap.get(date) || { 
            date, 
            profit: 0, 
            loss: 0, 
            net: 0, 
            trades: 0 
          };

          if (trade.type === 'profit') {
            existing.profit += trade.amount;
          } else {
            existing.loss += trade.amount;
          }

          existing.net = existing.profit - existing.loss;
          existing.trades += 1;
          dailyMap.set(date, existing);
        });

        // Convert map to array and sort by date (newest first)
        const dailyPerformance = Array.from(dailyMap.values())
          .sort((a, b) => (a.date > b.date ? -1 : 1));

        set({ dailyPerformance });
      },

      calculateMonthlyPerformance: () => {
        const { trades } = get();
        const monthlyMap = new Map<string, MonthlyPerformance>();

        trades.forEach(trade => {
          const date = new Date(trade.created_at);
          const month = formatMonth(date);
          
          const existing = monthlyMap.get(month) || { 
            month, 
            profit: 0, 
            loss: 0, 
            net: 0, 
            trades: 0,
            deposits: 0,
            withdrawals: 0
          };

          if (trade.type === 'profit') {
            existing.profit += trade.amount;
          } else {
            existing.loss += trade.amount;
          }

          existing.net = existing.profit - existing.loss;
          existing.trades += 1;
          monthlyMap.set(month, existing);
        });

        // Convert map to array and sort by month (newest first)
        const monthlyPerformance = Array.from(monthlyMap.values())
          .sort((a, b) => (a.month > b.month ? -1 : 1));

        set({ monthlyPerformance });
      },
    }),
    {
      name: 'trade-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);