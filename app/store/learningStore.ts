import { create } from 'zustand';
import { LearningResource } from '@/app/types';
import { fetchLearningResources } from '@/app/lib/supabase';

interface LearningState {
  resources: LearningResource[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  fetchResources: (category?: string) => Promise<void>;
}

export const useLearningStore = create<LearningState>((set) => ({
  resources: [],
  categories: ['Basics', 'Technical Analysis', 'Fundamental Analysis', 'Risk Management', 'Psychology'],
  isLoading: false,
  error: null,

  fetchResources: async (category?: string) => {
    try {
      set({ isLoading: true, error: null });
      const data = await fetchLearningResources(category);
      set({ resources: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));