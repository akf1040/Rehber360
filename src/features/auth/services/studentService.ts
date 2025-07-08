import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';

export const loginStudent = async (schoolNumber: string, password: string) => {
  try {
    const auth = getAuth();
    const firestore = getFirestore();
    
    // Firebase Auth ile giriş yap (email format: schoolNumber@student.school.com)
    const email = `${schoolNumber}@student.school.com`;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Firestore'dan öğrenci bilgilerini al
    const studentDoc = await getDoc(doc(firestore, 'students', userCredential.user.uid));
    
    if (studentDoc.exists()) {
      return { id: studentDoc.id, ...studentDoc.data() };
    } else {
      throw new Error('Öğrenci bilgileri bulunamadı');
    }
  } catch (error) {
    console.error('Öğrenci giriş hatası:', error);
    return null;
  }
};
