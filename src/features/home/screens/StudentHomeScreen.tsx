import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AuthStack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StudentHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userInfo, setUserInfo] = useState<{
    fullName: string;
    class: string;
    schoolNumber: string;
  } | null>(null);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const loadUserInfo = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const firestore = getFirestore();
        const userDoc = await getDoc(doc(firestore, 'students', user.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data) {
            setUserInfo({
              fullName: data.fullName || '',
              class: data.class || '',
              schoolNumber: data.schoolNumber || '',
            });
          }
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenirken hata:', error);
      setLoading(false);
    }
  };

  const loadAssignedSurveys = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user && userInfo) {
        const firestore = getFirestore();
        
        // Öğrenciye atanmış anketleri getir
        const surveysQuery = query(
          collection(firestore, 'assigned_surveys'),
          where('studentId', '==', user.uid),
          where('completed', '==', false)
        );
        
        const surveysSnapshot = await getDocs(surveysQuery);
        const surveysData = surveysSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setSurveys(surveysData);
      }
    } catch (error) {
      console.error('Anketler yüklenirken hata:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await auth.signOut();
      navigation.replace('RoleSelect');
    } catch (error) {
      Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu.');
    }
  };

  const handleSurveyPress = (survey: any) => {
    // Anket türüne göre ilgili ekrana yönlendir
    if (survey.surveyType === 'exam_anxiety') {
      navigation.navigate('ExamAnxietySurvey', { assignedSurveyId: survey.id });
    }
  };

  // İlk yükleme için
  useEffect(() => {
    loadUserInfo();
  }, []);

  // Kullanıcı bilgileri yüklendikten sonra anketleri yükle
  useEffect(() => {
    if (userInfo) {
      loadAssignedSurveys();
    }
  }, [userInfo]);

  // Profil sayfasından dönüşte yenileme için
  useFocusEffect(
    React.useCallback(() => {
      loadUserInfo();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E5C9A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Ana içerik */}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setMenuVisible(!menuVisible)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeText}>Hoş Geldin</Text>
            <Text style={styles.nameText}>{userInfo?.fullName}</Text>
            <Text style={styles.classText}>{userInfo?.class} - {userInfo?.schoolNumber}</Text>
          </View>
        </View>

        {/* Anketler Bölümü */}
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bekleyen Anketler</Text>
            {surveys.length === 0 ? (
              <View style={styles.noSurveyContainer}>
                <Text style={styles.noSurveyText}>Şu anda bekleyen anketiniz bulunmamaktadır.</Text>
              </View>
            ) : (
              surveys.map((survey) => (
                <TouchableOpacity
                  key={survey.id}
                  style={styles.surveyCard}
                  onPress={() => handleSurveyPress(survey)}>
                  <Text style={styles.surveyTitle}>{survey.title}</Text>
                  <Text style={styles.surveyDescription}>{survey.description}</Text>
                  <Text style={styles.surveyDate}>
                    Gönderilme: {new Date(survey.createdAt).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {/* Yan Menü */}
      {menuVisible && (
        <View style={styles.menuContainer}>
          <View style={styles.menu}>
            <View style={styles.menuHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {userInfo?.fullName?.[0]}
                  </Text>
                </View>
                <View style={styles.userTextContainer}>
                  <Text style={styles.userName}>
                    {userInfo?.fullName}
                  </Text>
                  <Text style={styles.userRole}>Öğrenci - {userInfo?.class}</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => setMenuVisible(false)}
                style={styles.closeButton}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Ana Sayfa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Tamamlanan Anketler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Profil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Ayarlar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}>
              <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.overlay} 
            onPress={() => setMenuVisible(false)} 
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#E8F4FD',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F4FD',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    elevation: 3,
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    fontSize: 24,
    color: '#2E5C9A',
  },
  headerTextContainer: {
    marginLeft: 15,
  },
  welcomeText: {
    fontSize: 20,
    color: '#2E5C9A',
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  classText: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5C9A',
    marginBottom: 15,
  },
  noSurveyContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  noSurveyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  surveyCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  surveyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E5C9A',
    marginBottom: 5,
  },
  surveyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  surveyDate: {
    fontSize: 12,
    color: '#999',
  },
  menuContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  menu: {
    width: '80%',
    backgroundColor: '#fff',
    elevation: 5,
  },
  menuHeader: {
    backgroundColor: '#2E5C9A',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    padding: 5,
  },
  closeIcon: {
    color: '#fff',
    fontSize: 20,
  },
  menuItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E5C9A',
  },
  userTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userRole: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  menuItems: {
    flex: 1,
  },
  logoutButton: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f8f8f8',
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StudentHomeScreen; 