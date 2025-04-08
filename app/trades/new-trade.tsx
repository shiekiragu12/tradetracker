import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Clock,
  DollarSign,
  ChevronDown
} from 'lucide-react-native';
import Colors from '../constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useTradeStore } from '@/app/store/tradeStore';
import { Trade } from '@/app/types';

// Module declaration for uuid
declare module 'uuid' {
  export function v4(): string;
}

import { v4 as uuidv4 } from 'uuid';

const currencyPairs = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 
  'AUD/USD', 'USD/CAD', 'NZD/USD', 'EUR/GBP',
  'EUR/JPY', 'GBP/JPY', 'AUD/JPY', 'CHF/JPY'
];

export default function NewTradeScreen() {
  const router = useRouter();
  const { addUserTrade } = useTradeStore();
  
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'profit' | 'loss'>('profit');
  const [pair, setPair] = useState('EUR/USD');
  const [notes, setNotes] = useState('');
  const [showPairSelector, setShowPairSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    amount: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { amount: '' };
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const newTrade: Trade = {
        user_id: 'user123', // In a real app, this would come from auth
        amount: parseFloat(amount),
        type: type,
        pair,
        notes,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      };
      
      // In a real app, this would call the API
      useTradeStore.getState().trades.unshift(newTrade);
      useTradeStore.getState().calculateDailyPerformance();
      useTradeStore.getState().calculateMonthlyPerformance();
      
      router.back();
    } catch (error) {
      console.error('Error adding trade:', error);
      // Show error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen 
        options={{
          title: 'Add New Trade',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text.light} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'profit' && styles.activeTypeButton
              ]}
              onPress={() => setType('profit')}
            >
              <TrendingUp 
                size={20} 
                color={type === 'profit' ? '#fff' : Colors.success} 
              />
              <Text style={[
                styles.typeText,
                type === 'profit' && styles.activeTypeText
              ]}>
                Profit
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'loss' && styles.activeTypeButtonLoss
              ]}
              onPress={() => setType('loss')}
            >
              <TrendingDown 
                size={20} 
                color={type === 'loss' ? '#fff' : Colors.error} 
              />
              <Text style={[
                styles.typeText,
                type === 'loss' && styles.activeTypeText
              ]}>
                Loss
              </Text>
            </TouchableOpacity>
          </View>

          <Input
            label="Amount"
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            leftIcon={<DollarSign size={20} color={Colors.text.secondary} />}
            error={errors.amount}
          />
          
          <TouchableOpacity
            onPress={() => setShowPairSelector(!showPairSelector)}
          >
            <Input
              label="Currency Pair"
              value={pair}
              editable={false}
              pointerEvents="none"
              rightIcon={
                <ChevronDown size={20} color={Colors.text.secondary} />
              }
            />
          </TouchableOpacity>
          
          {showPairSelector && (
            <View style={styles.pairSelector}>
              {currencyPairs.map((currencyPair) => (
                <TouchableOpacity
                  key={currencyPair}
                  style={[
                    styles.pairOption,
                    pair === currencyPair && styles.activePairOption
                  ]}
                  onPress={() => {
                    setPair(currencyPair);
                    setShowPairSelector(false);
                  }}
                >
                  <Text style={[
                    styles.pairOptionText,
                    pair === currencyPair && styles.activePairOptionText
                  ]}>
                    {currencyPair}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <Input
            label="Notes (Optional)"
            placeholder="Add notes about this trade"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.notesInput}
          />
          
          <View style={styles.dateTimeInfo}>
            <View style={styles.dateTimeItem}>
              <Calendar size={16} color={Colors.text.secondary} />
              <Text style={styles.dateTimeText}>
                {new Date().toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.dateTimeItem}>
              <Clock size={16} color={Colors.text.secondary} />
              <Text style={styles.dateTimeText}>
                {new Date().toLocaleTimeString()}
              </Text>
            </View>
          </View>
          
          <Button
            title="Save Trade"
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.success,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTypeButton: {
    backgroundColor: Colors.success,
  },
  activeTypeButtonLoss: {
    backgroundColor: Colors.error,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    color: Colors.text.light,
  },
  activeTypeText: {
    color: '#fff',
  },
  pairSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pairOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    margin: 4,
    backgroundColor: '#f3f4f6',
  },
  activePairOption: {
    backgroundColor: Colors.primary.light,
  },
  pairOptionText: {
    fontSize: 14,
    color: Colors.text.light,
  },
  activePairOptionText: {
    color: '#fff',
  },
  notesInput: {
    height: 100,
    paddingTop: 12,
  },
  dateTimeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  submitButton: {
    marginTop: 16,
  },
});