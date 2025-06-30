import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc, deleteDoc } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AuthStack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TeacherData {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  branch?: string;
}

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userInfo, setUserInfo] = useState<{
    name: string;
    surname: string;
    email: string;
    phone?: string;
    branch?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        console.log('Auth User ID:', user.uid);
        console.log('Auth User Email:', user.email);
        
        const firestore = getFirestore();
        const userDoc = await getDoc(doc(firestore, 'teachers', user.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data() as TeacherData;
          console.log('Firestore Data:', JSON.stringify(data, null, 2));
          
          setUserInfo({
            name: data.name,
            surname: data.surname,
            email: user.email || 'E-posta yok',
            phone: data.phone,
            branch: data.branch,
          });
        } else {
          console.log('Firestore document does not exist');
        }
      } else {
        console.log('No authenticated user found');
      }
      setLoading(false);
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenirken hata:', error);
      console.error('Error details:', error);
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      navigation.navigate('ChangePassword');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Hesap Silme',
      'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const auth = getAuth();
              const user = auth.currentUser;

              if (user) {
                const firestore = getFirestore();
                await deleteDoc(doc(firestore, 'teachers', user.uid));
                await user.delete();
                navigation.replace('RoleSelect');
              }
            } catch (error) {
              console.error('Hesap silinirken hata:', error);
              Alert.alert('Hata', 'Hesap silinirken bir hata oluştu.');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E5C9A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profil</Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userInfo?.name?.[0]}{userInfo?.surname?.[0]}
            </Text>
          </View>
          <Text style={styles.userName}>
            {userInfo?.name} {userInfo?.surname}
          </Text>
          <Text style={styles.userRole}>Öğretmen</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>E-posta</Text>
            <Text style={styles.infoValue} numberOfLines={2} ellipsizeMode="tail">
              {userInfo?.email || 'E-posta yok'}
            </Text>
          </View>

          {userInfo?.phone && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Telefon</Text>
              <Text style={styles.infoValue}>{userInfo.phone}</Text>
            </View>
          )}

          {userInfo?.branch && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Branş</Text>
              <Text style={styles.infoValue}>{userInfo.branch}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.editButtonText}>Profili Düzenle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.passwordButton} onPress={handlePasswordChange}>
          <Text style={styles.passwordButtonText}>Şifre Değiştir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>Hesabı Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#2E5C9A',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E5C9A',
    textAlign: 'center',
    marginRight: 40,
  },
  profileContainer: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2E5C9A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoItem: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    flexWrap: 'wrap',
  },
  editButton: {
    backgroundColor: '#2E5C9A',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  passwordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 