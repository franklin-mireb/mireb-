import admin from 'firebase-admin';

let firebaseInitialized = false;

const initializeFirebase = () => {
  if (firebaseInitialized) return;

  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString())
      : null;

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'mireb-commercial.appspot.com'
      });
      console.log('✅ Firebase initialisé avec succès');
    } else {
      console.log('⚠️ Firebase non configuré - utilisation du mode local');
    }

    firebaseInitialized = true;
  } catch (error) {
    console.error('❌ Erreur initialisation Firebase:', error);
  }
};

// Initialiser Firebase
initializeFirebase();

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
export const auth = admin.auth();

export default admin;
