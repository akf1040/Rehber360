import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { examAnxietyQuestions, examAnxietyCategories } from '../constants/examAnxietyData';
import { ExamAnxietyAnswer, ExamAnxietyResult, StudentInfo } from '../types';
import { evaluateExamAnxiety } from '../utils';
import { submitExamAnxietySurvey } from '../services/surveyService';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

const ExamAnxietySurveyScreen = ({ route, navigation }: any) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const assignedSurveyId = route?.params?.assignedSurveyId || null;
  const [studentInfo, setStudentInfo] = useState<StudentInfo & { schoolNumber?: string; password?: string }>({
    school: '',
    schoolNumber: '',
    fullName: '',
    class: '',
    gender: '',
    password: '',
    date: new Date().toLocaleDateString()
  });

  const [answers, setAnswers] = useState<ExamAnxietyAnswer[]>([]);
  const [results, setResults] = useState<ExamAnxietyResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  // Eğer assignedSurveyId varsa (öğrenci girişi) direkt student step'i ile başla
  const [step, setStep] = useState<'register' | 'send' | 'student' | 'sent'>(
    assignedSurveyId ? 'student' : 'register'
  );
  const [loading, setLoading] = useState(false);
  const [unansweredQuestions, setUnansweredQuestions] = useState<number[]>([]);

  const handleAnswer = (questionId: number, answer: boolean) => {
    const newAnswers = [...answers];
    const index = newAnswers.findIndex(a => a.questionId === questionId);
    
    if (index !== -1) {
      newAnswers[index] = { questionId, answer };
    } else {
      newAnswers.push({ questionId, answer });
    }
    
    setAnswers(newAnswers);
    
    // Cevaplanmış soruyu unansweredQuestions listesinden çıkar
    setUnansweredQuestions(prev => prev.filter(id => id !== questionId));
  };

  const checkUnansweredQuestions = () => {
    const answeredQuestionIds = answers.map(a => a.questionId);
    const allQuestionIds = examAnxietyQuestions.map(q => q.id);
    const unanswered = allQuestionIds.filter(id => !answeredQuestionIds.includes(id));
    
    if (unanswered.length > 0) {
      setUnansweredQuestions(unanswered);
      Alert.alert('Uyarı', 'Lütfen tüm soruları cevaplayın.');
      return false;
    }
    
    setUnansweredQuestions([]);
    return true;
  };

  const calculateResults = () => {
    if (!studentInfo.school || !studentInfo.fullName || !studentInfo.class || !studentInfo.gender) {
      Alert.alert('Uyarı', 'Lütfen tüm öğrenci bilgilerini doldurun.');
      return;
    }

    if (!checkUnansweredQuestions()) {
      return;
    }

    const categoryResults = evaluateExamAnxiety(answers);
    setResults(categoryResults);
    setShowResults(true);
  };

  const renderStudentInfo = () => (
    <View style={styles.infoContainer}>
      <Text style={styles.sectionTitle}>Öğrenci Bilgileri</Text>
      <TextInput
        style={styles.input}
        placeholder="Okul"
        value={studentInfo.school}
        onChangeText={text => setStudentInfo({...studentInfo, school: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Okul No"
        value={studentInfo.schoolNumber}
        keyboardType="numeric"
        onChangeText={text => setStudentInfo({...studentInfo, schoolNumber: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={studentInfo.password}
        secureTextEntry
        onChangeText={text => setStudentInfo({...studentInfo, password: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Ad Soyad"
        value={studentInfo.fullName}
        onChangeText={text => setStudentInfo({...studentInfo, fullName: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Sınıf"
        value={studentInfo.class}
        onChangeText={text => setStudentInfo({...studentInfo, class: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Cinsiyet"
        value={studentInfo.gender}
        onChangeText={text => setStudentInfo({...studentInfo, gender: text})}
      />
    </View>
  );

  const renderQuestion = (questionId: number, text: string) => {
    const answer = answers.find(a => a.questionId === questionId);
    const isUnanswered = unansweredQuestions.includes(questionId);
    
    return (
      <View key={questionId} style={[
        styles.questionContainer,
        isUnanswered && styles.unansweredQuestionContainer
      ]}>
        <Text style={[
          styles.questionText,
          isUnanswered && styles.unansweredQuestionText
        ]}>
          {questionId}. {text}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.answerButton,
              answer?.answer === true && styles.selectedButton,
              isUnanswered && styles.unansweredButton
            ]}
            onPress={() => handleAnswer(questionId, true)}
          >
            <Text style={[
              styles.buttonText,
              answer?.answer === true && styles.selectedButtonText,
              isUnanswered && styles.unansweredButtonText
            ]}>D</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.answerButton,
              answer?.answer === false && styles.selectedButton,
              isUnanswered && styles.unansweredButton
            ]}
            onPress={() => handleAnswer(questionId, false)}
          >
            <Text style={[
              styles.buttonText,
              answer?.answer === false && styles.selectedButtonText,
              isUnanswered && styles.unansweredButtonText
            ]}>Y</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderResults = () => (
    <View style={styles.resultsContainer}>
      <Text style={styles.sectionTitle}>Sonuçlar</Text>
      {results.map(result => {
        const category = examAnxietyCategories.find(c => c.id === result.categoryId);
        return (
          <View key={result.categoryId} style={styles.resultItem}>
            <Text style={styles.categoryTitle}>{category?.title}</Text>
            <Text style={styles.scoreText}>Puan: {result.score}</Text>
            <Text style={styles.interpretationText}>{result.interpretation}</Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sınav Kaygısı Ölçeği</Text>

      {/* Geri Butonu */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('Home');
          }
        }}
      >
        <Text style={styles.backButtonText}>{'< Geri'}</Text>
      </TouchableOpacity>

      {step === 'register' && (
        <>
          {renderStudentInfo()}
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={() => {
              if (!studentInfo.school || !studentInfo.fullName || !studentInfo.class || !studentInfo.gender) {
                Alert.alert('Uyarı', 'Lütfen tüm öğrenci bilgilerini doldurun.');
                return;
              }
              setStep('send');
            }}
          >
            <Text style={styles.calculateButtonText}>Kaydet ve Anketi Gönder</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'send' && (
        <View style={{alignItems: 'center', marginTop: 32}}>
          <Text style={{fontSize: 18, marginBottom: 16}}>Anket öğrenciye gönderilmeye hazır.</Text>
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={() => setStep('student')}
          >
            <Text style={styles.calculateButtonText}>Öğrenciye Gönder</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'student' && (
        <>
          <View style={styles.questionsContainer}>
            <Text style={styles.sectionTitle}>Sorular</Text>
            <Text style={styles.instructions}>
              Okuduğunuz cümle sizin için her zaman veya genellikle geçerliyse "D" (Doğru),
              her zaman veya genellikle geçerli değilse "Y" (Yanlış) seçeneğini işaretleyiniz.
            </Text>
            {examAnxietyQuestions.map(question =>
              renderQuestion(question.id, question.text)
            )}
          </View>
          {!showResults && (
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={assignedSurveyId ? async () => {
                // Öğrenci için direkt gönder
                if (!assignedSurveyId) {
                  Alert.alert('Hata', 'Anket ataması bulunamadı!');
                  return;
                }
                
                if (!checkUnansweredQuestions()) {
                  return;
                }
                
                setLoading(true);
                try {
                  // Önce sonuçları hesapla
                  const categoryResults = evaluateExamAnxiety(answers);
                  await submitExamAnxietySurvey(
                    assignedSurveyId,
                    user?.uid || 'anonymous', // Öğrenci ID'si
                    answers,
                    categoryResults
                  );
                  setStep('sent');
                } catch (e) {
                  console.error('Anket gönderme hatası:', e);
                  Alert.alert('Hata', 'Anket gönderilemedi! Lütfen tekrar deneyin.');
                } finally {
                  setLoading(false);
                }
              } : calculateResults}
            >
              <Text style={styles.calculateButtonText}>
                {loading ? 'Gönderiliyor...' : (assignedSurveyId ? 'Anketi Gönder' : 'Sonuçları Hesapla')}
              </Text>
            </TouchableOpacity>
          )}
          {showResults && !assignedSurveyId && (
            <>
              {renderResults()}
              <TouchableOpacity
                style={styles.calculateButton}
                disabled={loading}
                onPress={async () => {
                  if (!assignedSurveyId || !user?.uid) {
                    Alert.alert('Hata', 'Anket ataması veya kullanıcı bulunamadı!');
                    return;
                  }
                  setLoading(true);
                  try {
                    await submitExamAnxietySurvey(
                      assignedSurveyId,
                      user.uid,
                      answers,
                      results
                    );
                    setStep('sent');
                  } catch (e) {
                    Alert.alert('Hata', 'Anket gönderilemedi!');
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <Text style={styles.calculateButtonText}>
                  {loading ? 'Gönderiliyor...' : 'Anketi Gönder'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}

      {step === 'sent' && (
        <View style={styles.sentContainer}>
          <Text style={styles.sentText}>
            {assignedSurveyId ? 'Anket başarıyla tamamlandı!' : 'Anket öğrenciye gönderildi!'}
          </Text>
          <TouchableOpacity style={styles.calculateButton} onPress={() => {
            if (assignedSurveyId) {
              // Öğrenci için ana sayfaya dön
              navigation.navigate('StudentHome');
            } else {
              // Öğretmen için geri git
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('Home');
              }
            }
          }}>
            <Text style={styles.calculateButtonText}>
              {assignedSurveyId ? 'Ana Sayfaya Dön' : 'Geri'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* {step === 'result' && renderResults()} */}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  infoContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  questionsContainer: {
    marginBottom: 30,
  },
  instructions: {
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 24,
    color: '#555555',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 10,
  },
  questionContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  questionText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#2c2c2c',
    lineHeight: 22,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  answerButton: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedButton: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#666666',
  },
  selectedButtonText: {
    color: '#ffffff',
  },
  calculateButton: {
    backgroundColor: '#1a1a1a',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  calculateButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  sentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 30,
  },
  sentText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 32,
  },
  resultsContainer: {
    marginBottom: 30,
  },
  resultItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  scoreText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333333',
    fontWeight: '500',
  },
  interpretationText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555555',
  },
  unansweredQuestionContainer: {
    borderColor: '#e74c3c',
    borderWidth: 2,
    backgroundColor: '#fdf2f2',
  },
  unansweredQuestionText: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  unansweredButton: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  unansweredButtonText: {
    color: '#e74c3c',
    fontWeight: '700',
  },
});

export default ExamAnxietySurveyScreen;
