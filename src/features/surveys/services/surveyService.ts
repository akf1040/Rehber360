import { getFirestore, collection, addDoc, doc, updateDoc, query, where, getDocs, getDoc } from '@react-native-firebase/firestore';
import { AssignedSurvey, ExamAnxietySurveyResponse } from '../types';

export const assignSurveyToStudent = async (studentId: string, teacherId: string) => {
  const firestore = getFirestore();
  
  // Öğrenci bilgilerini al
  const studentDoc = await getDoc(doc(firestore, 'students', studentId));
  const teacherDoc = await getDoc(doc(firestore, 'teachers', teacherId));
  
  if (!studentDoc.exists() || !teacherDoc.exists()) {
    throw new Error('Öğrenci veya öğretmen bulunamadı');
  }
  
  const studentData = studentDoc.data();
  const teacherData = teacherDoc.data();
  
  const docRef = await addDoc(collection(firestore, 'assigned_surveys'), {
    studentId,
    teacherId,
    studentInfo: {
      fullName: studentData?.fullName,
      class: studentData?.class,
      schoolNumber: studentData?.schoolNumber,
    },
    teacherInfo: {
      name: teacherData?.name,
      surname: teacherData?.surname,
    },
    surveyType: 'exam_anxiety',
    title: 'Sınav Kaygısı Anketi',
    description: 'Öğrencilerin sınav kaygı düzeylerini ölçmek için hazırlanmış anket',
    completed: false,
    createdAt: new Date().toISOString(),
    assignedAt: new Date().toISOString(),
  });
  
  return docRef.id;
};

export const submitExamAnxietySurvey = async (
  assignedSurveyId: string,
  studentId: string,
  answers: any,
  results: any
) => {
  const firestore = getFirestore();
  
  console.log('submitExamAnxietySurvey çağrıldı:', {
    assignedSurveyId,
    studentId,
    answers: answers.length,
    results: results.length
  });
  
  // Önce assigned_survey bilgilerini al
  const assignedSurveyDoc = await getDoc(doc(firestore, 'assigned_surveys', assignedSurveyId));
  if (!assignedSurveyDoc.exists()) {
    throw new Error('Atanmış anket bulunamadı');
  }
  
  const assignedSurveyData = assignedSurveyDoc.data();
  const teacherId = assignedSurveyData?.teacherId;
  
  console.log('Assigned survey data:', assignedSurveyData);
  console.log('Teacher ID:', teacherId);
  
  if (!teacherId) {
    throw new Error('Öğretmen bilgisi bulunamadı');
  }
  
  // Anket sonuçlarını survey_results koleksiyonuna kaydet
  const resultData = {
    assignedSurveyId,
    studentId,
    teacherId, // Sadece bu öğretmen sonuçları görebilir
    surveyType: 'exam_anxiety',
    studentInfo: assignedSurveyData?.studentInfo,
    teacherInfo: assignedSurveyData?.teacherInfo,
    answers,
    results,
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  
  console.log('Survey result data:', resultData);
  
  const resultDocRef = await addDoc(collection(firestore, 'survey_results'), resultData);
  
  console.log('Result saved with ID:', resultDocRef.id);
  
  // Atanmış anketin durumunu güncelle
  await updateDoc(doc(firestore, 'assigned_surveys', assignedSurveyId), {
    completed: true,
    completedAt: new Date().toISOString(),
    resultId: resultDocRef.id,
  });
  
  console.log('Assigned survey updated as completed');
  
  return resultDocRef.id;
};

export const getAssignedSurveysForStudent = async (studentId: string) => {
  const firestore = getFirestore();
  
  const surveysQuery = query(
    collection(firestore, 'assigned_surveys'),
    where('studentId', '==', studentId),
    where('completed', '==', false)
  );
  
  const snapshot = await getDocs(surveysQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getSurveyResponsesForTeacher = async (teacherId: string) => {
  const firestore = getFirestore();
  
  const surveysQuery = query(
    collection(firestore, 'assigned_surveys'),
    where('teacherId', '==', teacherId),
    where('completed', '==', true)
  );
  
  const snapshot = await getDocs(surveysQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Öğretmenin anket sonuçlarını getir
export const getSurveyResultsForTeacher = async (teacherId: string) => {
  const firestore = getFirestore();
  
  console.log('getSurveyResultsForTeacher çağrıldı, teacherId:', teacherId);
  
  const resultsQuery = query(
    collection(firestore, 'survey_results'),
    where('teacherId', '==', teacherId)
  );
  
  const snapshot = await getDocs(resultsQuery);
  console.log('Firestore snapshot size:', snapshot.size);
  
  const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log('Dönen sonuçlar:', results);
  
  return results;
};

export const getExamAnxietySurveyResponse = async (assignedSurveyId: string) => {
  const firestore = getFirestore();
  
  const responseQuery = query(
    collection(firestore, 'exam_anxiety_responses'),
    where('assignedSurveyId', '==', assignedSurveyId)
  );
  
  const snapshot = await getDocs(responseQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
};
