import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Prediction } from '@/app/types';

interface PredictionState {
  predictions: Prediction[];
  isLoading: boolean;
  error: string | null;
  generatePrediction: (
    dailyPerformance: { date: string; profit: number; loss: number; net: number }[],
    days?: number
  ) => void;
}

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
};

export const usePredictionStore = create<PredictionState>()(
  persist(
    (set, get) => ({
      predictions: [],
      isLoading: false,
      error: null,

      generatePrediction: (dailyPerformance, days = 7) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simple prediction algorithm based on recent performance
          // In a real app, this would be more sophisticated or use an API
          const recentDays = dailyPerformance.slice(0, 14); // Use last 14 days
          
          if (recentDays.length === 0) {
            throw new Error('Not enough data for prediction');
          }
          
          // Calculate average daily profit/loss
          const totalNet = recentDays.reduce((sum, day) => sum + day.net, 0);
          const avgNet = totalNet / recentDays.length;
          
          // Calculate volatility (standard deviation)
          const variance = recentDays.reduce((sum, day) => {
            return sum + Math.pow(day.net - avgNet, 2);
          }, 0) / recentDays.length;
          const volatility = Math.sqrt(variance);
          
          // Generate predictions for next X days
          const today = new Date();
          const newPredictions: Prediction[] = [];
          
          for (let i = 1; i <= days; i++) {
            const predictionDate = addDays(today, i);
            const dateStr = formatDate(predictionDate);
            
            // Add some randomness to prediction based on volatility
            const randomFactor = (Math.random() * 2 - 1) * volatility * 0.5;
            const predictedProfit = avgNet + randomFactor;
            
            // Calculate confidence (higher when volatility is lower)
            const confidence = Math.max(0.3, Math.min(0.9, 1 - (volatility / Math.abs(avgNet || 1))));
            
            // Determine factors affecting prediction
            const factors = [];
            if (recentDays[0].net > 0) factors.push('Recent positive trend');
            if (recentDays[0].net < 0) factors.push('Recent negative trend');
            if (volatility > Math.abs(avgNet)) factors.push('High market volatility');
            if (Math.abs(randomFactor) > Math.abs(avgNet) * 0.5) factors.push('Unpredictable market conditions');
            if (factors.length === 0) factors.push('Stable market conditions');
            
            newPredictions.push({
              date: dateStr,
              predicted_profit: Number(predictedProfit.toFixed(2)),
              confidence: Number(confidence.toFixed(2)),
              factors,
            });
          }
          
          set({ predictions: newPredictions, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
    }),
    {
      name: 'prediction-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);