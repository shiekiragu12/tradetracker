import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  ArrowRight 
} from 'lucide-react-native';
import Colors from '../constants/colors';
import StatCard from '@/components/StatCard';
import Card from '@/components/Card';
import { useTradeStore } from '@/app/store/tradeStore';
import { useTransactionStore } from '@/app/store/transactionStore';
import { usePredictionStore } from '@/app/store/predictionStore';
import { mockTrades } from '@/app/mocks/trades';
import { mockTransactions } from '../mocks/transaction';


export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  // Get store data
  const { 
    trades, 
    dailyPerformance, 
    monthlyPerformance, 
    calculateDailyPerformance, 
    calculateMonthlyPerformance 
  } = useTradeStore();
  
  const { 
    balance, 
    calculateBalance 
  } = useTransactionStore();
  
  const { 
    predictions, 
    generatePrediction 
  } = usePredictionStore();

  // Initialize with mock data if empty
  useEffect(() => {
    if (trades.length === 0) {
      useTradeStore.setState({ trades: mockTrades });
      calculateDailyPerformance();
      calculateMonthlyPerformance();
    }
    
    if (useTransactionStore.getState().transactions.length === 0) {
      useTransactionStore.setState({ transactions: mockTransactions });
      calculateBalance();
    }
    
    if (predictions.length === 0 && dailyPerformance.length > 0) {
      generatePrediction(dailyPerformance);
    }
  }, [trades.length, dailyPerformance.length]);

  // Calculate summary stats
  const currentMonth = monthlyPerformance[0] || { profit: 0, loss: 0, net: 0, trades: 0 };
  const previousMonth = monthlyPerformance[1] || { profit: 0, loss: 0, net: 0, trades: 0 };
  const monthlyChange = previousMonth.net !== 0 
    ? ((currentMonth.net - previousMonth.net) / Math.abs(previousMonth.net)) * 100 
    : 0;
  
  const todayPerformance = dailyPerformance[0] || { profit: 0, loss: 0, net: 0, trades: 0 };
  const yesterdayPerformance = dailyPerformance[1] || { profit: 0, loss: 0, net: 0, trades: 0 };
  
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      calculateDailyPerformance();
      calculateMonthlyPerformance();
      calculateBalance();
      generatePrediction(dailyPerformance);
      setRefreshing(false);
    }, 1000);
  };

  const formatDate = (date: Date): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello 🤗 Trader</Text>
          <Text style={styles.date}>{formatDate(new Date())}</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Account Balance"
            value={`$${balance.toFixed(2)}`}
            icon={<DollarSign size={18} color={Colors.primary.light} />}
            variant="info"
          />
          
          <StatCard
            title="Monthly P/L"
            value={`$${currentMonth.net.toFixed(2)}`}
            trend={monthlyChange >= 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(monthlyChange).toFixed(1)}%`}
            icon={monthlyChange >= 0 
              ? <TrendingUp size={18} color={Colors.success} />
              : <TrendingDown size={18} color={Colors.error} />
            }
            variant={currentMonth.net >= 0 ? 'success' : 'error'}
          />
          
          <StatCard
            title="Today's P/L"
            value={`$${todayPerformance.net.toFixed(2)}`}
            subtitle={`${todayPerformance.trades} trades`}
            icon={<Calendar size={18} color={Colors.primary.light} />}
            variant={todayPerformance.net >= 0 ? 'success' : 'error'}
          />
          
          <StatCard
            title="Win Rate"
            value={`${trades.length > 0 
              ? ((trades.filter(t => t.type === 'profit').length / trades.length) * 100).toFixed(0) 
              : 0}%`}
            subtitle="Last 30 days"
            icon={<TrendingUp size={18} color={Colors.primary.light} />}
            variant="warning"
          />
        </View>

        {predictions.length > 0 && (
          <Card variant="elevated" style={styles.predictionCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Tomorrow's Prediction</Text>
              <TouchableOpacity 
                onPress={() => router.push('/predictions')}
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ArrowRight size={16} color={Colors.primary.light} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.predictionContent}>
              <View style={styles.predictionIconContainer}>
                {predictions[0].predicted_profit >= 0 ? (
                  <TrendingUp size={24} color={Colors.success} />
                ) : (
                  <TrendingDown size={24} color={Colors.error} />
                )}
              </View>
              
              <View style={styles.predictionDetails}>
                <Text style={styles.predictionLabel}>Predicted P/L</Text>
                <Text style={[
                  styles.predictionValue,
                  { color: predictions[0].predicted_profit >= 0 ? Colors.success : Colors.error }
                ]}>
                  {predictions[0].predicted_profit >= 0 ? '+' : ''}
                  ${predictions[0].predicted_profit.toFixed(2)}
                </Text>
                <Text style={styles.predictionConfidence}>
                  {Math.round(predictions[0].confidence * 100)}% confidence
                </Text>
              </View>
            </View>
            
            <Text style={styles.predictionFactors}>
              Based on: {predictions[0].factors.join(', ')}
            </Text>
          </Card>
        )}

        <Card variant="elevated" style={styles.recentActivityCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            <TouchableOpacity 
              onPress={() => router.push('/trades')}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ArrowRight size={16} color={Colors.primary.light} />
            </TouchableOpacity>
          </View>
          
          {trades.slice(0, 3).map((trade) => (
            <View key={trade.id} style={styles.activityItem}>
              <View style={[
                styles.activityIcon,
                { backgroundColor: trade.type === 'profit' 
                  ? `${Colors.success}20` 
                  : `${Colors.error}20` 
                }
              ]}>
                {trade.type === 'profit' ? (
                  <TrendingUp size={16} color={Colors.success} />
                ) : (
                  <TrendingDown size={16} color={Colors.error} />
                )}
              </View>
              
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>{trade.pair}</Text>
                <Text style={styles.activityDate}>
                  {new Date(trade.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </View>
              
              <Text style={[
                styles.activityAmount,
                { color: trade.type === 'profit' ? Colors.success : Colors.error }
              ]}>
                {trade.type === 'profit' ? '+' : '-'}${trade.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  predictionCard: {
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.light,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary.light,
    marginRight: 4,
  },
  predictionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  predictionDetails: {
    flex: 1,
  },
  predictionLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  predictionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  predictionConfidence: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  predictionFactors: {
    fontSize: 12,
    color: Colors.text.secondary,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  recentActivityCard: {
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.light,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
});