import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { ExamAnxietyResult } from '../types';

interface Props {
  results: ExamAnxietyResult[];
}

const ExamAnxietyBarChart: React.FC<Props> = ({ results }) => {
  const labels = results.map(r => r.categoryId);
  const scores = results.map(r => r.score);

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
        Kategori Bazında Sınav Kaygısı Skorları
      </Text>
      <BarChart
        data={{
          labels,
          datasets: [{ data: scores }],
        }}
        width={Dimensions.get('window').width - 32}
        height={220}
        yAxisLabel={''}
        chartConfig={{
          backgroundColor: '#e3f2fd',
          backgroundGradientFrom: '#e3f2fd',
          backgroundGradientTo: '#90caf9',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        style={{ borderRadius: 16 }}
        fromZero
        showValuesOnTopOfBars
      />
    </View>
  );
};

export default ExamAnxietyBarChart;
