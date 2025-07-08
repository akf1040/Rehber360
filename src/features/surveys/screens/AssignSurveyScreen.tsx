import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { assignSurveyToStudent } from '../services/surveyService';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Feather';

const AssignSurveyScreen = ({ navigation, route }: any) => {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    // Arama fonksiyonu
    if (searchText.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => 
        student.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        student.schoolNumber.toString().includes(searchText)
      );
      setFilteredStudents(filtered);
    }
  }, [searchText, students]);

  const loadStudents = async () => {
    try {
      const firestore = getFirestore();
      const studentsSnapshot = await getDocs(collection(firestore, 'students'));
      const studentsData = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentsData);
      setFilteredStudents(studentsData);
      setLoadingStudents(false);
    } catch (error) {
      console.error('Öğrenciler yüklenirken hata:', error);
      setLoadingStudents(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedStudent) {
      Alert.alert('Uyarı', 'Lütfen bir öğrenci seçin.');
      return;
    }

    const auth = getAuth();
    const teacherId = auth.currentUser?.uid;

    if (!teacherId) {
      Alert.alert('Hata', 'Öğretmen bilgisi bulunamadı.');
      return;
    }

    setLoading(true);
    try {
      await assignSurveyToStudent(selectedStudent.id, teacherId);
      
      // Sadece öğrenci numarasını göster ve anketler sayfasına dön
      Alert.alert('Başarılı', `${selectedStudent.schoolNumber} numaralı öğrenciye anket gönderildi`, [
        { 
          text: 'Tamam', 
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Surveys' }],
            });
          }
        }
      ]);
    } catch (e) {
      console.error('Anket gönderme hatası:', e);
      Alert.alert('Hata', 'Anket gönderme başarısız.');
      setLoading(false);
    }
  };

  if (loadingStudents) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E5C9A" />
        <Text style={styles.loadingText}>Öğrenciler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backHeaderButton}
          onPress={() => navigation.navigate('Surveys')}>
          <Icon name="arrow-left" size={24} color="#2E5C9A" />
        </TouchableOpacity>
        <Text style={styles.title}>Anket Gönder</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
      <TextInput
            style={styles.searchInput}
            placeholder="Öğrenci adı veya numarası ara..."
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Icon name="x" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Öğrenci Seç</Text>
          <Text style={styles.sectionDescription}>
            Sınav kaygısı anketini göndermek istediğiniz öğrenciyi seçin:
          </Text>
          
          {filteredStudents.length === 0 ? (
            <View style={styles.noStudentsContainer}>
              <Text style={styles.noStudentsText}>
                {searchText ? 'Arama sonucu bulunamadı.' : 'Henüz kayıtlı öğrenci bulunmamaktadır.'}
              </Text>
            </View>
          ) : (
            <View style={styles.studentsContainer}>
              {filteredStudents.map((student) => (
                <TouchableOpacity
                  key={student.id}
                  style={[
                    styles.studentCard,
                    selectedStudent?.id === student.id && styles.studentCardSelected
                  ]}
                  onPress={() => setSelectedStudent(student)}>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.fullName}</Text>
                    <Text style={styles.studentDetails}>
                      {student.class} - {student.schoolNumber}
                    </Text>
                    <Text style={styles.studentGender}>{student.gender}</Text>
                  </View>
                  {selectedStudent?.id === student.id && (
                    <View style={styles.checkIcon}>
                      <Text style={styles.checkIconText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {selectedStudent && (
          <View style={styles.selectedStudentContainer}>
            <Text style={styles.selectedStudentTitle}>Seçilen Öğrenci:</Text>
            <Text style={styles.selectedStudentName}>{selectedStudent.fullName}</Text>
            <Text style={styles.selectedStudentClass}>{selectedStudent.class}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.sendButton, !selectedStudent && styles.sendButtonDisabled]} 
          onPress={handleAssign} 
          disabled={loading || !selectedStudent}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Anketi Gönder</Text>
          )}
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
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
  backHeaderButton: {
    padding: 10,
    marginRight: 10,
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#2E5C9A',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5C9A',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  noStudentsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  noStudentsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  studentsContainer: {
    gap: 10,
  },
  studentCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  studentCardSelected: {
    backgroundColor: '#E8F4FD',
    borderWidth: 2,
    borderColor: '#2E5C9A',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  studentDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  studentGender: {
    fontSize: 12,
    color: '#999',
  },
  checkIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2E5C9A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedStudentContainer: {
    backgroundColor: '#E8F4FD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  selectedStudentTitle: {
    fontSize: 14,
    color: '#2E5C9A',
    marginBottom: 5,
  },
  selectedStudentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5C9A',
    marginBottom: 3,
  },
  selectedStudentClass: {
    fontSize: 14,
    color: '#666',
  },
  sendButton: { 
    backgroundColor: '#2E5C9A', 
    padding: 16, 
    borderRadius: 10, 
    alignItems: 'center',
    marginTop: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});

export default AssignSurveyScreen;
