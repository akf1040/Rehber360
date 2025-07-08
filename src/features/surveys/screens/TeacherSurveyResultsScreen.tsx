import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { getAuth } from '@react-native-firebase/auth';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { RootState } from '../../../store/store';
import { getSurveyResultsForTeacher } from '../services/surveyService';
import { examAnxietyCategories } from '../constants/examAnxietyData';

const screenWidth = Dimensions.get('window').width;

const TeacherSurveyResultsScreen = ({ route, navigation }: any) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const surveyId = route?.params?.surveyId;

  useEffect(() => {
    loadResult();
  }, []);

  const loadResult = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;
    
    console.log('loadResult çağrıldı, currentUser?.uid:', userId, 'surveyId:', surveyId);
    console.log('route.params:', route?.params);
    if (!userId || !surveyId) {
      console.log('User UID veya surveyId bulunamadı');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Sonuç yükleniyor, surveyId:', surveyId);
      const surveyResults = await getSurveyResultsForTeacher(userId);
      // surveyId artık survey_results ID'si, doğrudan ID ile arayacağız
      const specificResult = surveyResults.find((r: any) => r.id === surveyId);
      console.log('Bulunan sonuç:', specificResult);
      setResult(specificResult);
    } catch (error) {
      console.error('Sonuç yükleme hatası:', error);
      Alert.alert('Hata', 'Anket sonuçları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getAnxietyLevelColor = (interpretation: string) => {
    if (interpretation.includes('Yüksek')) return '#e74c3c';
    if (interpretation.includes('Orta')) return '#f39c12';
    return '#27ae60';
  };

  const getAnxietyLevelIcon = (interpretation: string) => {
    if (interpretation.includes('Yüksek')) return '🔴';
    if (interpretation.includes('Orta')) return '🟡';
    return '🟢';
  };

  const renderBarChart = (result: any) => {
    const categoryLabels = {
      'othersView': 'Başka.',
      'selfView': 'Kendi',
      'futureWorries': 'Gelecek',
      'preparationWorries': 'Hazırlık',
      'physicalReactions': 'Bedensel',
      'mentalReactions': 'Zihinsel',
      'generalAnxiety': 'Genel'
    };

    const data = {
      labels: result.results?.map((r: any) => {
        return categoryLabels[r.categoryId as keyof typeof categoryLabels] || 'Kategori';
      }) || [],
      datasets: [{
        data: result.results?.map((r: any) => r.score) || []
      }]
    };

    const chartConfig = {
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      color: (opacity = 1) => `rgba(46, 92, 154, ${opacity})`,
      strokeWidth: 2,
      barPercentage: 0.5,
      useShadowColorFromDataset: false,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      propsForLabels: {
        fontSize: 10,
        fontWeight: 'bold'
      }
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>📊 Kategori Puanları</Text>
        <BarChart
          data={data}
          width={screenWidth - 40}
          height={250}
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          verticalLabelRotation={30}
        />
      </View>
    );
  };

  const renderPieChart = (result: any) => {
    const anxietyLevels = { high: 0, medium: 0, low: 0 };
    
    result.results?.forEach((r: any) => {
      if (r.interpretation.includes('Yüksek')) anxietyLevels.high++;
      else if (r.interpretation.includes('Orta')) anxietyLevels.medium++;
      else anxietyLevels.low++;
    });

    const pieData = [
      { name: 'Düşük Kaygı', population: anxietyLevels.low, color: '#27ae60', legendFontColor: '#333' },
      { name: 'Orta Kaygı', population: anxietyLevels.medium, color: '#f39c12', legendFontColor: '#333' },
      { name: 'Yüksek Kaygı', population: anxietyLevels.high, color: '#e74c3c', legendFontColor: '#333' },
    ].filter(item => item.population > 0);

    const chartConfig = {
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>🥧 Kaygı Düzeyi Dağılımı</Text>
        <PieChart
          data={pieData}
          width={screenWidth - 60}
          height={200}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </View>
    );
  };

  const renderResultCard = (result: any) => (
    <View key={result.id} style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <View style={styles.studentInfoContainer}>
          <Text style={styles.studentName}>👤 {result.studentInfo?.fullName}</Text>
          <Text style={styles.studentClass}>🎓 {result.studentInfo?.class}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.submissionDate}>
            📅 {new Date(result.submittedAt).toLocaleDateString('tr-TR')}
          </Text>
        </View>
      </View>
      
      {/* Grafikler */}
      {renderBarChart(result)}
      {renderPieChart(result)}
      
      {/* Detaylı Sonuçlar */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>📋 Detaylı Sonuçlar</Text>
        {result.results?.map((categoryResult: any) => {
          const category = examAnxietyCategories.find(c => c.id === categoryResult.categoryId);
          const color = getAnxietyLevelColor(categoryResult.interpretation);
          const icon = getAnxietyLevelIcon(categoryResult.interpretation);
          
          return (
            <View key={categoryResult.categoryId} style={[styles.categoryResult, { borderLeftColor: color }]}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category?.title}</Text>
                <View style={styles.scoreContainer}>
                  <Text style={styles.categoryIcon}>{icon}</Text>
                  <Text style={[styles.categoryScore, { color }]}>
                    {categoryResult.score} puan
                  </Text>
                </View>
              </View>
              <Text style={styles.categoryInterpretation}>
                {categoryResult.interpretation}
              </Text>
            </View>
          );
        })}
      </View>
      
      {/* Genel Değerlendirme */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>🎯 Genel Değerlendirme</Text>
        <Text style={styles.summaryText}>
          Bu öğrenci {result.results?.length || 0} kategori üzerinden değerlendirilmiştir. 
          Sonuçlar yukarıdaki grafikler ve detaylı analizde görülebilir.
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E5C9A" />
        <Text style={styles.loadingText}>Sonuçlar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{'< Geri'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Anket Sonuçları</Text>
      </View>

      <ScrollView style={styles.content}>
        {!result ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>Anket sonucu bulunamadı.</Text>
          </View>
        ) : (
          renderResultCard(result)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    elevation: 3,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2E5C9A',
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E5C9A',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  studentInfoContainer: {
    flex: 1,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E5C9A',
    marginBottom: 5,
  },
  studentClass: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  submissionDate: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  chartContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 8,
  },
  resultsContainer: {
    marginTop: 10,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  categoryResult: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E5C9A',
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryInterpretation: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  summaryContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2E5C9A',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E5C9A',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default TeacherSurveyResultsScreen;
