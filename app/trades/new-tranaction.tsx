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
  ArrowDown, 
  ArrowUp, 
  Calendar,
  Clock,
  DollarSign
} from 'lucide-react-native';
import Colors from '../constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useTransactionStore } from '@/app/store/transactionStore';
import { Transaction } from '@/app/types';

// Module declaration for uuid
declare module 'uuid' {
  export function v4(): string;
}

import { v4 as uuidv4 } from 'uuid';

export default function NewTransactionScreen() {
  const router = useRouter();
  const { addUserTransaction } = useTransactionStore();
  
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [notes, setNotes] = useState('');
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
      const newTransaction: Transaction = {
        user_id: 'user123', // In a real app, this would come from auth
        amount: parseFloat(amount),
        type: type,
        notes,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      };
      
      // In a real app, this would call the API
      useTransactionStore.getState().transactions.unshift(newTransaction);
      useTransactionStore.getState().calculateBalance();
      
      router.back();
    } catch (error) {
      console.error('Error adding transaction:', error);
      // Show error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen 
        options={{
          title: 'Add New Transaction',
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
                type === 'deposit' && styles.activeTypeButton
              ]}
              onPress={() => setType('deposit')}
            >
              <ArrowDown 
                size={20} 
                color={type === 'deposit' ? '#fff' : Colors.chart.deposit} 
              />
              <Text style={[
                styles.typeText,
                type === 'deposit' && styles.activeTypeText
              ]}>
                Deposit
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'withdrawal' && styles.activeTypeButtonWithdrawal
              ]}
              onPress={() => setType('withdrawal')}
            >
              <ArrowUp 
                size={20} 
                color={type === 'withdrawal' ? '#fff' : Colors.chart.withdrawal} 
              />
              <Text style={[
                styles.typeText,
                type === 'withdrawal' && styles.activeTypeText
              ]}>
                Withdrawal
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
          
          <Input
            label="Notes (Optional)"
            placeholder="Add notes about this transaction"
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
            title="Save Transaction"
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
    borderColor: Colors.chart.deposit,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTypeButton: {
    backgroundColor: Colors.chart.deposit,
  },
  activeTypeButtonWithdrawal: {
    backgroundColor: Colors.chart.withdrawal,
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