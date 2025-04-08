import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Plus, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  BarChart
} from 'lucide-react-native';
import Colors from '../constants/colors';
import Button from '@/components/Button';
import TradeItem from '@/components/TradeItem';
import TransactionItem from '../../components/TransactionItem';
import EmptyState from '@/components/EmptyState';
import { useTradeStore } from '@/app/store/tradeStore';
import { useTransactionStore } from '@/app/store/transactionStore';
import { mockTrades } from '@/app/mocks/trades';
import { mockTransactions } from '../mocks/transaction';
import { Trade, Transaction } from '@/app/types';

export default function TradesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('trades');
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    trades, 
    calculateDailyPerformance, 
    calculateMonthlyPerformance 
  } = useTradeStore();
  
  const { 
    transactions, 
    balance, 
    calculateBalance 
  } = useTransactionStore();

  // Initialize with mock data if empty
  useEffect(() => {
    if (trades.length === 0) {
      useTradeStore.setState({ trades: mockTrades });
      calculateDailyPerformance();
      calculateMonthlyPerformance();
    }
    
    if (transactions.length === 0) {
      useTransactionStore.setState({ transactions: mockTransactions });
      calculateBalance();
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      calculateDailyPerformance();
      calculateMonthlyPerformance();
      calculateBalance();
      setRefreshing(false);
    }, 1000);
  };

  const handleAddNew = () => {
    if (activeTab === 'trades') {
      router.push('/trades/new-trade');
    } else {
      router.push('/trades/new-transaction');
    }
  };

  const handleTradeTap = (trade: Trade) => {
    router.push({
      pathname: '/trades/trade-details',
      params: { id: trade.id }
    });
  };

  const handleTransactionTap = (transaction: Transaction) => {
    router.push({
      pathname: '/transaction-details',
      params: { id: transaction.id }
    });
  };

  // Calculate summary stats
  const totalProfit = trades
    .filter(trade => trade.type === 'profit')
    .reduce((sum, trade) => sum + trade.amount, 0);
    
  const totalLoss = trades
    .filter(trade => trade.type === 'loss')
    .reduce((sum, trade) => sum + trade.amount, 0);
    
  const netProfit = totalProfit - totalLoss;
  
  const totalDeposits = transactions
    .filter(tx => tx.type === 'deposit')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalWithdrawals = transactions
    .filter(tx => tx.type === 'withdrawal')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'trades' && styles.activeTab]}
            onPress={() => setActiveTab('trades')}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'trades' && styles.activeTabText
            ]}>
              Trades
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
            onPress={() => setActiveTab('transactions')}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'transactions' && styles.activeTabText
            ]}>
              Transactions
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={Colors.text.light} />
          </TouchableOpacity>
          <Button
            title="Add New"
            onPress={handleAddNew}
            variant="primary"
            size="small"
            leftIcon={<Plus size={16} color="#fff" />}
            style={styles.addButton}
          />
        </View>
      </View>

      <View style={styles.summaryCards}>
        {activeTab === 'trades' ? (
          <>
            <View style={[styles.summaryCard, styles.profitCard]}>
              <TrendingUp size={20} color={Colors.success} />
              <Text style={styles.summaryLabel}>Total Profit</Text>
              <Text style={[styles.summaryValue, styles.profitValue]}>
                ${totalProfit.toFixed(2)}
              </Text>
            </View>
            
            <View style={[styles.summaryCard, styles.lossCard]}>
              <TrendingDown size={20} color={Colors.error} />
              <Text style={styles.summaryLabel}>Total Loss</Text>
              <Text style={[styles.summaryValue, styles.lossValue]}>
                ${totalLoss.toFixed(2)}
              </Text>
            </View>
            
            <View style={[styles.summaryCard, styles.netCard]}>
              <DollarSign size={20} color={netProfit >= 0 ? Colors.success : Colors.error} />
              <Text style={styles.summaryLabel}>Net P/L</Text>
              <Text style={[
                styles.summaryValue, 
                netProfit >= 0 ? styles.profitValue : styles.lossValue
              ]}>
                ${netProfit.toFixed(2)}
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.summaryCard, styles.depositCard]}>
              <TrendingUp size={20} color={Colors.chart.deposit} />
              <Text style={styles.summaryLabel}>Deposits</Text>
              <Text style={[styles.summaryValue, { color: Colors.chart.deposit }]}>
                ${totalDeposits.toFixed(2)}
              </Text>
            </View>
            
            <View style={[styles.summaryCard, styles.withdrawalCard]}>
              <TrendingDown size={20} color={Colors.chart.withdrawal} />
              <Text style={styles.summaryLabel}>Withdrawals</Text>
              <Text style={[styles.summaryValue, { color: Colors.chart.withdrawal }]}>
                ${totalWithdrawals.toFixed(2)}
              </Text>
            </View>
            
            <View style={[styles.summaryCard, styles.balanceCard]}>
              <DollarSign size={20} color={Colors.primary.light} />
              <Text style={styles.summaryLabel}>Balance</Text>
              <Text style={[styles.summaryValue, { color: Colors.primary.light }]}>
                ${balance.toFixed(2)}
              </Text>
            </View>
          </>
        )}
      </View>

      {activeTab === 'trades' ? (
        trades.length > 0 ? (
          <FlatList
            data={trades}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TradeItem trade={item} onPress={handleTradeTap} />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <EmptyState
            title="No trades yet"
            description="Start tracking your trading performance by adding your first trade."
            icon={<BarChart size={32} color={Colors.primary.light} />}
            actionLabel="Add First Trade"
            onAction={() => router.push('/trades/new-trade')}
          />
        )
      ) : (
        transactions.length > 0 ? (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TransactionItem transaction={item} onPress={handleTransactionTap} />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <EmptyState
            title="No transactions yet"
            description="Track your deposits and withdrawals to monitor your account balance."
            icon={<DollarSign size={32} color={Colors.primary.light} />}
            actionLabel="Add First Transaction"
            onAction={() => router.push('/trades/new-transaction')}
          />
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.text.light,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  addButton: {
    height: 36,
  },
  summaryCards: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // elevation: 1,
  },
  profitCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  lossCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  netCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  depositCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  withdrawalCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  balanceCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginVertical: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profitValue: {
    color: Colors.success,
  },
  lossValue: {
    color: Colors.error,
  },
  listContent: {
    paddingBottom: 20,
  },
});