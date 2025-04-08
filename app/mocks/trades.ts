import { Trade } from '@/app/types';

// Generate dates for the last 30 days
const generateDates = (count: number) => {
  const dates = [];
  const today = new Date();
  
  for (let i = count; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString());
  }
  
  return dates;
};

const dates = generateDates(30);

export const mockTrades: Trade[] = [
  {
    id: '1',
    user_id: 'user123',
    amount: 120.50,
    type: 'profit',
    pair: 'EUR/USD',
    notes: 'Strong trend following strategy worked well',
    created_at: dates[30],
  },
  {
    id: '2',
    user_id: 'user123',
    amount: 45.75,
    type: 'loss',
    pair: 'GBP/JPY',
    notes: 'Stop loss triggered due to unexpected news',
    created_at: dates[29],
  },
  {
    id: '3',
    user_id: 'user123',
    amount: 210.25,
    type: 'profit',
    pair: 'USD/CAD',
    notes: 'Breakout strategy on 4H timeframe',
    created_at: dates[28],
  },
  {
    id: '4',
    user_id: 'user123',
    amount: 75.30,
    type: 'profit',
    pair: 'AUD/USD',
    notes: 'Caught reversal at support level',
    created_at: dates[27],
  },
  {
    id: '5',
    user_id: 'user123',
    amount: 95.20,
    type: 'loss',
    pair: 'USD/JPY',
    notes: 'Failed to consider upcoming FOMC minutes',
    created_at: dates[26],
  },
  {
    id: '6',
    user_id: 'user123',
    amount: 150.00,
    type: 'profit',
    pair: 'EUR/GBP',
    notes: 'Scalping during London session',
    created_at: dates[25],
  },
  {
    id: '7',
    user_id: 'user123',
    amount: 65.40,
    type: 'loss',
    pair: 'NZD/USD',
    notes: 'Poor risk management, position too large',
    created_at: dates[24],
  },
  {
    id: '8',
    user_id: 'user123',
    amount: 180.60,
    type: 'profit',
    pair: 'USD/CHF',
    notes: 'Swing trade based on weekly chart pattern',
    created_at: dates[23],
  },
  {
    id: '9',
    user_id: 'user123',
    amount: 110.25,
    type: 'profit',
    pair: 'EUR/JPY',
    notes: 'Momentum strategy during Asian session',
    created_at: dates[22],
  },
  {
    id: '10',
    user_id: 'user123',
    amount: 85.75,
    type: 'loss',
    pair: 'GBP/USD',
    notes: 'Brexit news caused unexpected volatility',
    created_at: dates[21],
  },
  {
    id: '11',
    user_id: 'user123',
    amount: 135.50,
    type: 'profit',
    pair: 'AUD/JPY',
    notes: 'Risk-on sentiment helped carry trade',
    created_at: dates[20],
  },
  {
    id: '12',
    user_id: 'user123',
    amount: 55.25,
    type: 'loss',
    pair: 'USD/CAD',
    notes: 'Oil price spike affected correlation',
    created_at: dates[19],
  },
  {
    id: '13',
    user_id: 'user123',
    amount: 195.80,
    type: 'profit',
    pair: 'EUR/USD',
    notes: 'Successful pullback trade on 1H chart',
    created_at: dates[18],
  },
  {
    id: '14',
    user_id: 'user123',
    amount: 70.40,
    type: 'profit',
    pair: 'CHF/JPY',
    notes: 'Range trading during consolidation',
    created_at: dates[17],
  },
  {
    id: '15',
    user_id: 'user123',
    amount: 125.60,
    type: 'loss',
    pair: 'GBP/AUD',
    notes: 'Failed to consider correlation with stock market',
    created_at: dates[16],
  },
];