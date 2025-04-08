import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '@/app/types';
import { fetchTransactions, addTransaction } from '@/app/lib/supabase';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  balance: number;
  fetchUserTransactions: (userId: string) => Promise<void>;
  addUserTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>;
  calculateBalance: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      isLoading: false,
      error: null,
      balance: 0,

      fetchUserTransactions: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const data = await fetchTransactions(userId);
          set({ transactions: data, isLoading: false });
          
          // Calculate current balance
          get().calculateBalance();
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      addUserTransaction: async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
        try {
          set({ isLoading: true, error: null });
          const newTransaction = await addTransaction(transaction);
          set(state => ({ 
            transactions: [newTransaction, ...state.transactions],
            isLoading: false 
          }));
          
          // Recalculate balance
          get().calculateBalance();
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      calculateBalance: () => {
        const { transactions } = get();
        let balance = 0;

        transactions.forEach(transaction => {
          if (transaction.type === 'deposit') {
            balance += transaction.amount;
          } else {
            balance -= transaction.amount;
          }
        });

        set({ balance });
      },
    }),
    {
      name: 'transaction-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);