import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/app/constants/colors';
import { Transaction } from '@/app/types';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

export default function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handlePress = () => {
    if (onPress) {
      onPress(transaction);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.type}>
            {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
          </Text>
          <Text 
            style={[
              styles.amount, 
              { color: transaction.type === 'deposit' ? Colors.chart.deposit : Colors.chart.withdrawal }
            ]}
          >
            {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(transaction.created_at)}</Text>
          {transaction.notes && (
            <Text style={styles.notes} numberOfLines={1}>
              {transaction.notes}
            </Text>
          )}
        </View>
      </View>
      <ChevronRight size={20} color={Colors.text.secondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.light,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginRight: 8,
  },
  notes: {
    fontSize: 12,
    color: Colors.text.secondary,
    flex: 1,
  },
});