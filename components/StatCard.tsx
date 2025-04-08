import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import Colors from '@/app/constants/colors';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = 'default'
}: StatCardProps) {
  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return Colors.success;
      case 'error':
        return Colors.error;
      case 'warning':
        return Colors.warning;
      case 'info':
        return Colors.info;
      default:
        return Colors.primary.light;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return Colors.success;
      case 'down':
        return Colors.error;
      default:
        return Colors.text.secondary;
    }
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
      <Text style={[styles.value, { color: getVariantColor() }]}>
        {value}
      </Text>
      <View style={styles.footer}>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {trend && trendValue && (
          <Text style={[styles.trend, { color: getTrendColor() }]}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendValue}
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    width:150,
  },
  title: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  trend: {
    fontSize: 12,
    fontWeight: '800',
  },
});
