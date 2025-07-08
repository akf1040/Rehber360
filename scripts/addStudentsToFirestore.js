// Node.js script to add students to Firestore
// Çalıştırmak için: node scripts/addStudentsToFirestore.js


const admin = require('firebase-admin');
const serviceAccount = require('../rehber360-firebase-adminsdk-fbsvc-1137e1f8fa.json');
const students = require('../firestore-students-example.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const db = admin.firestore();

async function addStudents() {
  for (const student of students) {
    // Okul numarasını doküman id olarak kullanmak istersen:
    await db.collection('students').doc(student.schoolNumber).set(student);
    // Rastgele id istersen:
    // await db.collection('students').add(student);
    console.log('Eklendi:', student.fullName);
  }
  console.log('Tüm öğrenciler eklendi!');
}

addStudents().catch(console.error);
