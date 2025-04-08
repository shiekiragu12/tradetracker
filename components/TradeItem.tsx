import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/app/constants/colors';
import { Trade } from '@/app/types';

interface TradeItemProps {
  trade: Trade;
  onPress?: (trade: Trade) => void;
}

export default function TradeItem({ trade, onPress }: TradeItemProps) {
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
      onPress(trade);
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
          <Text style={styles.pair}>{trade.pair}</Text>
          <Text 
            style={[
              styles.amount, 
              { color: trade.type === 'profit' ? Colors.success : Colors.error }
            ]}
          >
            {trade.type === 'profit' ? '+' : '-'}${trade.amount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(trade.created_at)}</Text>
          {trade.notes && (
            <Text style={styles.notes} numberOfLines={1}>
              {trade.notes}
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
  pair: {
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