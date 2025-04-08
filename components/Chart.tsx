import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Colors from '../app/constants/colors';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

interface ChartProps {
  title: string;
  data: ChartData;
  height?: number;
  width?: number;
  yAxisSuffix?: string;
  legend?: string[];
}

export default function Chart({
  title,
  data,
  height = 220,
  width = Dimensions.get('window').width - 32,
  yAxisSuffix = '',
  legend = []
}: ChartProps) {
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: Colors.secondary.light,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        yAxisSuffix={yAxisSuffix}
      />
      {legend.length > 0 && (
        <View style={styles.legendContainer}>
          {legend.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor, 
                  { backgroundColor: data.datasets[index]?.color?.(1) || Colors.chart.line }
                ]} 
              />
              <Text style={styles.legendText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.text.light,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});