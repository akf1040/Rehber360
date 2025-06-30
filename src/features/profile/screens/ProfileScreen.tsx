import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Switch,
} from 'react-native';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AuthStack';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TeacherData {
  name: string;
  surname: string;
  phone?: string;
  branch?: string;
  photoURL?: string;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
  };
}

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userInfo, setUserInfo] = useState<{
    name: string;
    surname: string;
    email: string;
    phone?: string;
    branch?: string;
    photoURL?: string;
    notificationPreferences?: {
      email: boolean;
      push: boolean;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const firestore = getFirestore();
        const userDoc = await getDoc(doc(firestore, 'teachers', user.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data() as TeacherData;
          setUserInfo({
            name: data.name,
            surname: data.surname,
            email: user.email || '',
            phone: data.phone,
            branch: data.branch,
            photoURL: data.photoURL,
            notificationPreferences: data.notificationPreferences || { email: true, push: true },
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenirken hata:', error);
      setLoading(false);
    }
  };

  const handlePhotoUpload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets[0].uri) {
        setUploadingPhoto(true);
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const reference = storage().ref(`profile_photos/${user.uid}`);
          await reference.putFile(result.assets[0].uri);
          const url = await reference.getDownloadURL();

          const firestore = getFirestore();
          await updateDoc(doc(firestore, 'teachers', user.uid), {
            photoURL: url,
          });

          setUserInfo(prev => prev ? { ...prev, photoURL: url } : null);
          Alert.alert('Başarılı', 'Profil fotoğrafı güncellendi.');
        }
      }
    } catch (error) {
      console.error('Fotoğraf yüklenirken hata:', error);
      Alert.alert('Hata', 'Fotoğraf yüklenirken bir hata oluştu.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePasswordChange = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Şifre değiştirme işlemi için yeni bir sayfa açılacak
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

  const handleNotificationToggle = async (type: 'email' | 'push') => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user && userInfo?.notificationPreferences) {
        const newPreferences = {
          email: type === 'email' 
            ? !userInfo.notificationPreferences.email 
            : userInfo.notificationPreferences.email,
          push: type === 'push' 
            ? !userInfo.notificationPreferences.push 
            : userInfo.notificationPreferences.push,
        };

        const firestore = getFirestore();
        await updateDoc(doc(firestore, 'teachers', user.uid), {
          notificationPreferences: newPreferences,
        });

        setUserInfo(prev => prev ? {
          ...prev,
          notificationPreferences: newPreferences,
        } : null);
      }
    } catch (error) {
      console.error('Bildirim tercihleri güncellenirken hata:', error);
      Alert.alert('Hata', 'Bildirim tercihleri güncellenirken bir hata oluştu.');
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await auth.signOut();
      navigation.replace('RoleSelect');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
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
            <Text style={styles.infoValue}>{userInfo?.email}</Text>
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

        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Profili Düzenle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
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
    backgroundColor: '#fff',
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
    color: '#2E5C9A',
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
    padding: 20,
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
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
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
  logoutButton: {
    backgroundColor: '#FF4444',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 