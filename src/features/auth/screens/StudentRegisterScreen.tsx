import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AuthStack';
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc } from '@react-native-firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'StudentRegister'>;

const StudentRegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    schoolNumber: '',
    fullName: '',
    class: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!formData.schoolNumber || !formData.fullName || !formData.class || 
        !formData.gender || !formData.password || !formData.confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (formData.schoolNumber.length < 4) {
      Alert.alert('Hata', 'Okul numarası en az 4 haneli olmalıdır.');
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      const firestore = getFirestore();

      // Firebase Auth ile kullanıcı oluştur (email format: schoolNumber@student.school.com)
      const email = `${formData.schoolNumber}@student.school.com`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, formData.password);
      
      // Firestore'da öğrenci bilgilerini kaydet
      await setDoc(doc(firestore, 'students', userCredential.user.uid), {
        schoolNumber: formData.schoolNumber,
        fullName: formData.fullName,
        class: formData.class,
        gender: formData.gender,
        email: email,
        createdAt: new Date().toISOString(),
        role: 'student',
      });

      Alert.alert('Başarılı', 'Kayıt işlemi tamamlandı!', [
        { text: 'Tamam', onPress: () => navigation.navigate('StudentLogin') }
      ]);

    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Hata', 'Bu okul numarası zaten kullanılıyor.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Hata', 'Şifre çok zayıf.');
      } else {
        Alert.alert('Hata', 'Kayıt sırasında bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🎓</Text>
        </View>
        <Text style={styles.title}>Öğrenci Kayıt</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Okul Numarası</Text>
          <TextInput
            style={styles.input}
            value={formData.schoolNumber}
            onChangeText={(text) => setFormData({...formData, schoolNumber: text})}
            placeholder="Okul numaranız"
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(text) => setFormData({...formData, fullName: text})}
            placeholder="Adınız ve soyadınız"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sınıf</Text>
          <TextInput
            style={styles.input}
            value={formData.class}
            onChangeText={(text) => setFormData({...formData, class: text})}
            placeholder="Örn: 10A"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cinsiyet</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, formData.gender === 'Erkek' && styles.genderButtonActive]}
              onPress={() => setFormData({...formData, gender: 'Erkek'})}>
              <Text style={[styles.genderText, formData.gender === 'Erkek' && styles.genderTextActive]}>Erkek</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, formData.gender === 'Kız' && styles.genderButtonActive]}
              onPress={() => setFormData({...formData, gender: 'Kız'})}>
              <Text style={[styles.genderText, formData.gender === 'Kız' && styles.genderTextActive]}>Kız</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Şifre</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(text) => setFormData({...formData, password: text})}
            placeholder="Şifreniz"
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Şifre Tekrar</Text>
          <TextInput
            style={styles.input}
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
            placeholder="Şifrenizi tekrar girin"
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={handleRegister}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Kayıt Ol</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('StudentLogin')}>
          <Text style={styles.loginLinkText}>Zaten hesabın var mı? Giriş Yap</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Geri Dön</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3E0FF',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    color: '#3D7CC9',
    marginTop: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  genderButtonActive: {
    backgroundColor: '#3D7CC9',
  },
  genderText: {
    fontSize: 16,
    color: '#333',
  },
  genderTextActive: {
    color: '#fff',
  },
  registerButton: {
    backgroundColor: '#3D7CC9',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#3D7CC9',
    fontSize: 16,
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
    color: '#3D7CC9',
    fontSize: 18,
  },
});

export default StudentRegisterScreen; 