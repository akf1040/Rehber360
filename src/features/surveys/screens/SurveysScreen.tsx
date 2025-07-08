import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AuthStack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SurveysScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const surveys = [
    {
      id: 1,
      title: 'Sınav Kaygısı Ölçeği',
      description: 'Sınav kaygısı yaşayan öğrencileri tespit etmek ve çözüm yolları bulmak için kullanılır.',
      studentCount: 0,
      status: 'active',
      screen: 'ExamAnxietySurvey',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'completed': return '#2196F3';
      case 'draft': return '#FF9800';
      default: return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'completed': return 'Tamamlandı';
      case 'draft': return 'Taslak';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Anketlerim</Text>
        </View>
        <TouchableOpacity 
          style={styles.addStudentButton}
          onPress={() => navigation.navigate('StudentRegister')}
        >
          <Icon name="user-plus" size={18} color="#fff" />
          <Text style={styles.addStudentButtonText}>Öğrenci Ekle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Toplam Anket</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Aktif Anket</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Tamamlanan</Text>
        </View>
      </View>

      <View style={styles.surveysList}>
        {surveys.map((survey) => (
          <View key={survey.id} style={styles.surveyCard}>
            <View style={styles.surveyHeader}>
              <Text style={styles.surveyTitle}>{survey.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(survey.status) }]}>
                <Text style={styles.statusText}>{getStatusText(survey.status)}</Text>
              </View>
            </View>
            
            <Text style={styles.surveyDescription}>{survey.description}</Text>
            
            <View style={styles.surveyFooter}>
              <View style={styles.studentInfo}>
                <Icon name="users" size={16} color="#666" />
                <Text style={styles.studentCount}>{survey.studentCount} öğrenci</Text>
              </View>
            </View>
              
            <View style={styles.surveyActions}>
              <TouchableOpacity 
                style={styles.surveyActionButton}
                onPress={() => navigation.navigate('AssignSurvey')}
              >
                <Icon name="send" size={18} color="#fff" />
                <Text style={styles.surveyActionText}>Anketi Gönder</Text>
                </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.surveyActionButton, styles.surveyActionButtonSecondary]}
                onPress={() => {
                  navigation.navigate('TeacherSurveyResults');
                }}
              >
                <Icon name="list" size={18} color="#2E5C9A" />
                <Text style={styles.surveyActionTextSecondary}>Anketi Cevaplayanlar</Text>
                </TouchableOpacity>
              </View>
            </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    elevation: 3,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E5C9A',
  },
  addStudentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E5C9A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 2,
  },
  addStudentButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  stats: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E5C9A',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  surveysList: {
    padding: 20,
    paddingTop: 0,
  },
  surveyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  surveyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  surveyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  surveyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  surveyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentCount: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  surveyActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  surveyActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#2E5C9A',
    marginHorizontal: 5,
    elevation: 2,
  },
  surveyActionButtonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2E5C9A',
  },
  surveyActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  surveyActionTextSecondary: {
    color: '#2E5C9A',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default SurveysScreen; 