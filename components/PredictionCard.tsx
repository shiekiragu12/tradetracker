import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react-native';
import Card from './Card';
import Colors from '@/app/constants/colors';
import { Prediction } from '@/app/types';

interface PredictionCardProps {
  prediction: Prediction;
}

export default function PredictionCard({ prediction }: PredictionCardProps) {
  const isPositive = prediction.predicted_profit > 0;
  
  const getConfidenceColor = () => {
    if (prediction.confidence >= 0.7) return Colors.success;
    if (prediction.confidence >= 0.4) return Colors.warning;
    return Colors.error;
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{prediction.date}</Text>
        <View style={[
          styles.confidenceTag,
          { backgroundColor: `${getConfidenceColor()}20` }
        ]}>
          <Text style={[styles.confidenceText, { color: getConfidenceColor() }]}>
            {Math.round(prediction.confidence * 100)}% confidence
          </Text>
        </View>
      </View>
      
      <View style={styles.predictionContainer}>
        {isPositive ? (
          <TrendingUp size={24} color={Colors.success} />
        ) : (
          <TrendingDown size={24} color={Colors.error} />
        )}
        <Text style={[
          styles.predictionValue,
          { color: isPositive ? Colors.success : Colors.error }
        ]}>
          {isPositive ? '+' : ''}{prediction.predicted_profit.toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.factorsContainer}>
        <Text style={styles.factorsTitle}>Based on:</Text>
        {prediction.factors.map((factor, index) => (
          <View key={index} style={styles.factorItem}>
            <AlertCircle size={14} color={Colors.text.secondary} style={styles.factorIcon} />
            <Text style={styles.factorText}>{factor}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.light,
  },
  confidenceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  predictionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  predictionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  factorsContainer: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  factorsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.light,
    marginBottom: 8,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  factorIcon: {
    marginRight: 6,
  },
  factorText: {
    fontSize: 12,
    color: Colors.text.secondary,
    flex: 1,
  },
});