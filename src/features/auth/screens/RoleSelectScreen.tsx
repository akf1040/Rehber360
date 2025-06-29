import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/AuthStack';

type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelect'>;

const RoleSelectScreen: React.FC<Props> = () => {
  const roles = [
    {
      id: 1,
      title: 'Öğretmen',
      description: '',
      color: '#2E5C9A',
    },
    {
      id: 2,
      title: 'Öğrenci',
      description: '',
      color: '#3D7CC9',
    },
    {
      id: 3,
      title: 'Veli',
      description: '',
      color: '#5B9BD5',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>📚</Text>
        </View>
        <Text style={styles.title}>Rehber360</Text>
        <Text style={styles.subtitle}>
          Eğitim Yönetim Sistemine Hoş Geldiniz
        </Text>
      </View>
      
      <Text style={styles.selectText}>Lütfen rolünüzü seçin:</Text>
      
      <View style={styles.buttonsContainer}>
        {roles.map(role => (
          <TouchableOpacity
            key={role.id}
            style={[styles.roleButton, {backgroundColor: role.color}]}
            onPress={() => console.log(`Selected role: ${role.title}`)}>
            <Text style={styles.roleButtonTitle}>{role.title}</Text>
            <Text style={styles.roleButtonDescription}>{role.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.footerText}>
        Kaliteli eğitim için teknoloji
      </Text>
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  selectText: {
    fontSize: 18,
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: 15,
    marginBottom: 40,
  },
  roleButton: {
    padding: 20,
    borderRadius: 12,
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
  roleButtonTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roleButtonDescription: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
});

export default RoleSelectScreen; 