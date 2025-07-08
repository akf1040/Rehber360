// Test için öğrenci verilerini Firebase'e eklemek için script
const admin = require('firebase-admin');

// Firebase Admin SDK'yı başlat
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://rehber360-default-rtdb.europe-west1.firebasedatabase.app'
});

const db = admin.firestore();

async function createTestStudent() {
  try {
    // Test öğrencisi oluştur
    const testStudent = {
      schoolNumber: '2024001',
      fullName: 'Test Öğrenci',
      class: '10A',
      gender: 'Erkek',
      email: '2024001@student.school.com',
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    // Firestore'a ekle
    const docRef = await db.collection('students').add(testStudent);
    console.log('✅ Test öğrencisi oluşturuldu:', docRef.id);
    console.log('📋 Öğrenci Bilgileri:', testStudent);
    console.log('🔑 Öğrenci ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

async function getTeacherId() {
  try {
    const teachersSnapshot = await db.collection('teachers').limit(1).get();
    if (!teachersSnapshot.empty) {
      const teacherId = teachersSnapshot.docs[0].id;
      console.log('👨‍🏫 Öğretmen ID:', teacherId);
      return teacherId;
    }
    return null;
  } catch (error) {
    console.error('❌ Öğretmen ID alınamadı:', error);
    return null;
  }
}

async function main() {
  console.log('🚀 Test verisi oluşturuluyor...');
  
  const studentId = await createTestStudent();
  const teacherId = await getTeacherId();
  
  if (studentId && teacherId) {
    console.log('\n📝 Anket Gönderme Testi için:');
    console.log('Öğrenci ID:', studentId);
    console.log('Öğretmen ID:', teacherId);
    console.log('\n✅ Bu ID\'leri AssignSurveyScreen\'de kullanabilirsiniz!');
  }
  
  process.exit(0);
}

main(); 