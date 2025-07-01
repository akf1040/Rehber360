import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const SurveysScreen = () => {
  const surveys = [
    {
      id: 1,
      title: 'Öğrenci Davranış Değerlendirmesi',
      description: 'Sınıf içi davranış ve katılım değerlendirmesi',
      studentCount: 25,
      status: 'active',
    },
    {
      id: 2,
      title: 'Akademik Performans Anketi',
      description: 'Ders başarı durumu ve gelişim alanları',
      studentCount: 25,
      status: 'completed',
    },
    {
      id: 3,
      title: 'Sosyal Beceri Değerlendirmesi',
      description: 'Arkadaşlık ilişkileri ve sosyal uyum',
      studentCount: 25,
      status: 'draft',
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
        <Text style={styles.title}>Anketlerim</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Yeni Anket</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Toplam Anket</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Aktif Anket</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>25</Text>
          <Text style={styles.statLabel}>Öğrenci</Text>
        </View>
      </View>

      <View style={styles.surveysList}>
        {surveys.map((survey) => (
          <TouchableOpacity key={survey.id} style={styles.surveyCard}>
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
              
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="eye" size={16} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="edit" size={16} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="bar-chart" size={16} color="#FF9800" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
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
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
});

export default SurveysScreen; 