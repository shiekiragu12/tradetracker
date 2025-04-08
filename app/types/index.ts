export interface User {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
    created_at: string;
  }
  
  export interface Trade {
    id: string;
    user_id: string;
    amount: number;
    type: 'profit' | 'loss';
    pair: string;
    notes?: string;
    created_at: string;
  }
  
  export interface Transaction {
    id: string;
    user_id: string;
    amount: number;
    type: 'deposit' | 'withdrawal';
    notes?: string;
    created_at: string;
  }
  
  export interface DailyPerformance {
    date: string;
    profit: number;
    loss: number;
    net: number;
    trades: number;
  }
  
  export interface MonthlyPerformance {
    month: string;
    profit: number;
    loss: number;
    net: number;
    trades: number;
    deposits: number;
    withdrawals: number;
  }
  
  export interface LearningResource {
    id: string;
    title: string;
    description: string;
    url: string;
    image_url?: string;
    category: string;
    created_at: string;
  }
  
  export interface Prediction {
    date: string;
    predicted_profit: number;
    confidence: number;
    factors: string[];
  }
  
  export interface Reminder {
    id: string;
    title: string;
    message: string;
    time: string;
    days: string[];
    enabled: boolean;
  }