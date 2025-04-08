import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, RefreshCw } from 'lucide-react-native';
import Colors from '../constants/colors';
import PredictionCard from '@/components/PredictionCard';
import Button from '@/components/Button';
import { usePredictionStore } from '@/app/store/predictionStore';
import { useTradeStore } from '@/app/store/tradeStore';

export default function PredictionsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    predictions, 
    generatePrediction, 
    isLoading 
  } = usePredictionStore();
  
  const { dailyPerformance } = useTradeStore();

  useEffect(() => {
    if (predictions.length === 0 && dailyPerformance.length > 0) {
      generatePrediction(dailyPerformance);
    }
  }, [dailyPerformance.length]);

  const handleRefresh = () => {
    setRefreshing(true);
    generatePrediction(dailyPerformance);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen 
        options={{
          title: 'Predictions',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text.light} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Trading Predictions</Text>
        <Text style={styles.subtitle}>
          AI-powered forecasts based on your trading history
        </Text>
      </View>
      
      <View style={styles.refreshContainer}>
        <Button
          title="Regenerate Predictions"
          onPress={handleRefresh}
          variant="outline"
          leftIcon={<RefreshCw size={16} color={Colors.primary.light} />}
          isLoading={isLoading}
        />
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            These predictions are based on your historical trading data and market patterns. 
            They are for informational purposes only and should not be considered as financial advice.
          </Text>
        </View>
        
        {predictions.map((prediction, index) => (
          <PredictionCard key={index} prediction={prediction} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  refreshContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  disclaimer: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
});