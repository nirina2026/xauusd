import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

console.log('='.repeat(60));
console.log('🔍 FIREBASE DEBUG - Configuration Check');
console.log('='.repeat(60));

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

console.log('📍 API Key exists:', !!firebaseConfig.apiKey ? '✅ YES' : '❌ NO');
console.log('📍 Project ID:', firebaseConfig.projectId || '❌ UNDEFINED');
console.log('📍 Auth Domain:', firebaseConfig.authDomain || '❌ UNDEFINED');
console.log('📍 App ID:', firebaseConfig.appId || '❌ UNDEFINED');

const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
const missingFields: string[] = [];

requiredFields.forEach((field) => {
  if (!firebaseConfig[field]) {
    missingFields.push(field);
    console.error(`❌ Missing: ${field}`);
  }
});

console.log('='.repeat(60));

let app: any = null;
let analytics: any = null;
let initError: string | null = null;

try {
  if (missingFields.length === 0) {
    console.log('✅ Initializing Firebase...');
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully!');

    try {
      analytics = getAnalytics(app);
      console.log('✅ Firebase Analytics initialized!');
    } catch (analyticsError) {
      console.warn('⚠️ Analytics initialization warning (not critical):', analyticsError);
    }
  } else {
    initError = `Missing Firebase configuration: ${missingFields.join(', ')}`;
    console.error('❌ Cannot initialize Firebase - missing fields:', missingFields);
  }
} catch (error) {
  initError = error instanceof Error ? error.message : 'Unknown error';
  console.error('❌ Error initializing Firebase:', error);
}

export { app, analytics, firebaseConfig, initError };
