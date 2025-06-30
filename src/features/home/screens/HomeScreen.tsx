import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AuthStack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userInfo, setUserInfo] = useState<{name: string; surname: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const loadUserInfo = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const firestore = getFirestore();
        const userDoc = await getDoc(doc(firestore, 'teachers', user.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data) {
            setUserInfo({
              name: data.name || '',
              surname: data.surname || '',
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

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await auth.signOut();
      navigation.replace('RoleSelect');
    } catch (error) {
      Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu.');
    }
  };

  // İlk yükleme için
  useEffect(() => {
    loadUserInfo();
  }, []);

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
            <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
            <Text style={styles.nameText}>{userInfo?.name} {userInfo?.surname}</Text>
          </View>
        </View>
      </View>

      {/* Yan Menü */}
      {menuVisible && (
        <View style={styles.menuContainer}>
          <View style={styles.menu}>
            <View style={styles.menuHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {userInfo?.name?.[0]}{userInfo?.surname?.[0]}
                  </Text>
                </View>
                <View style={styles.userTextContainer}>
                  <Text style={styles.userName}>
                    {userInfo?.name} {userInfo?.surname}
                  </Text>
                  <Text style={styles.userRole}>Öğretmen</Text>
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
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate('Profile');
                }}>
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
    backgroundColor: '#B3E0FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B3E0FF',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
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
  menuTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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

export default HomeScreen; 