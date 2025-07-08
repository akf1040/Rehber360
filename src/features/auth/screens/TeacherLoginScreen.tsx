import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/AuthStack';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { setAuthenticated } from '../../../store/authSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'TeacherLogin'>;

const TeacherLoginScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    // Kayıtlı e-posta adresini yükle
    loadSavedEmail();
  }, []);

  const loadSavedEmail = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('savedEmail');
      if (savedEmail) {
        setEmail(savedEmail);
      }
    } catch (error) {
      console.error('E-posta yüklenirken hata:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      console.log('👤 Giriş başarılı, kullanıcı:', userCredential.user.email);
      
      // Kullanıcı bilgilerini ve rolü Redux store'a kaydet
      dispatch(setAuthenticated({
        isAuthenticated: true,
        user: {
          displayName: userCredential.user.displayName,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          role: 'teacher' // Öğretmen rolünü ayarla
        }
      }));

      console.log('✅ Redux store güncellendi');

      // Beni hatırla seçeneği işaretliyse e-postayı kaydet
      if (rememberMe) {
        await AsyncStorage.setItem('savedEmail', email);
      } else {
        await AsyncStorage.removeItem('savedEmail');
      }

      navigation.replace('Home');
    } catch (error: any) {
      console.error('❌ Giriş hatası:', error);
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Hata', 'Geçersiz e-posta adresi.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Hata', 'Yanlış şifre.');
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert('Hata', 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.');
      } else {
        Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu.');
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>👩‍🏫</Text>
        </View>
        <Text style={styles.title}>Öğretmen Girişi</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-posta</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="E-posta adresiniz"
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus={true}
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Şifre</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Şifreniz"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.rememberContainer}
          onPress={() => setRememberMe(!rememberMe)}>
          <View
            style={[
              styles.checkbox,
              rememberMe && styles.checkboxChecked,
            ]}>
            {rememberMe && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.rememberText}>Beni Hatırla</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => console.log('Forgot password')}>
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('TeacherRegister')}>
            <Text style={styles.registerLinkText}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3E0FF',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E5C9A',
    marginTop: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2E5C9A',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2E5C9A',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
  },
  rememberText: {
    fontSize: 16,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#2E5C9A',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    alignItems: 'center',
  },
  forgotPassword: {
    flex: 1,
  },
  forgotPasswordText: {
    color: '#2E5C9A',
    fontSize: 16,
  },
  registerLink: {
    flex: 1,
    alignItems: 'flex-end',
  },
  registerLinkText: {
    color: '#2E5C9A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#2E5C9A',
    fontSize: 18,
  },
});

export default TeacherLoginScreen; 