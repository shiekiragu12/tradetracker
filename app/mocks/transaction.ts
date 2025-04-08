import { Transaction } from '@/app/types';

// Generate dates for the last 60 days
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

const dates = generateDates(60);

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    user_id: 'user123',
    amount: 1000.00,
    type: 'deposit',
    notes: 'Initial account funding',
    created_at: dates[60],
  },
  {
    id: '2',
    user_id: 'user123',
    amount: 500.00,
    type: 'deposit',
    notes: 'Additional capital for new strategy',
    created_at: dates[45],
  },
  {
    id: '3',
    user_id: 'user123',
    amount: 250.00,
    type: 'withdrawal',
    notes: 'Monthly profit taking',
    created_at: dates[30],
  },
  {
    id: '4',
    user_id: 'user123',
    amount: 750.00,
    type: 'deposit',
    notes: 'Increasing position size capacity',
    created_at: dates[20],
  },
  {
    id: '5',
    user_id: 'user123',
    amount: 400.00,
    type: 'withdrawal',
    notes: 'Partial profit taking for expenses',
    created_at: dates[10],
  },
  {
    id: '6',
    user_id: 'user123',
    amount: 300.00,
    type: 'deposit',
    notes: 'Adding funds after successful month',
    created_at: dates[5],
  },
];