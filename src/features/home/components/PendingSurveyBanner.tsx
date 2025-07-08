import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getAssignedSurveysForStudent } from '../../surveys/services/surveyService';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

const PendingSurveyBanner = () => {
  const [pendingSurvey, setPendingSurvey] = useState<any>(null);
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user && user.email) {
      getAssignedSurveysForStudent(user.email).then(surveys => {
        if (surveys.length > 0) setPendingSurvey(surveys[0]);
      });
    }
  }, [user]);

  if (!pendingSurvey) return null;

  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={() => navigation.navigate('ExamAnxietySurvey' as never)}
    >
      <Text style={styles.text}>Bekleyen bir anketiniz var! Tıklayarak doldurun.</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  text: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PendingSurveyBanner;
