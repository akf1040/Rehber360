import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, updateDoc, getDoc } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AuthStack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TeacherData {
  name: string;
  surname: string;
  phone?: string;
  branch?: string;
}

const EditProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TeacherData>({
    name: '',
    surname: '',
    phone: '',
    branch: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const firestore = getFirestore();
        const userDoc = await getDoc(doc(firestore, 'teachers', user.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data() as TeacherData;
          setFormData({
            name: data.name,
            surname: data.surname,
            phone: data.phone || '',
            branch: data.branch || '',
          });
        }
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenirken hata:', error);
      Alert.alert('Hata', 'Kullanıcı bilgileri yüklenirken bir hata oluştu.');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const firestore = getFirestore();
        await updateDoc(doc(firestore, 'teachers', user.uid), {
          name: formData.name,
          surname: formData.surname,
          phone: formData.phone,
          branch: formData.branch,
        });

        Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.', [
          { text: 'Tamam', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profili Düzenle</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ad</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Adınız"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Soyad</Text>
          <TextInput
            style={styles.input}
            value={formData.surname}
            onChangeText={(text) => setFormData({ ...formData, surname: text })}
            placeholder="Soyadınız"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefon</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Telefon numaranız"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Branş</Text>
          <TextInput
            style={styles.input}
            value={formData.branch}
            onChangeText={(text) => setFormData({ ...formData, branch: text })}
            placeholder="Branşınız"
          />
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Kaydet</Text>
          )}
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
  formContainer: {
    padding: 20,
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: '#2E5C9A',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen; 