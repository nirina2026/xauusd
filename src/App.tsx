import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import OpportunitiesPage from './pages/OpportunitiesPage';
import JournalPage from './pages/JournalPage';
import RiskPage from './pages/RiskPage';
import EducationPage from './pages/EducationPage';
import AnalysisPage from './pages/AnalysisPage';
import SwingTradingPage from './pages/SwingTradingPage';
import DayTradingPage from './pages/DayTradingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';
import { PriceProvider } from './contexts/PriceContext';
import { AuthProvider } from './contexts/AuthContext';
import { app, initError, firebaseConfig } from './lib/firebase';

function App() {
  const [appStatus, setAppStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    console.log('🔄 App component mounted');

    if (initError) {
      console.error('❌ Initialization error detected:', initError);
      setAppStatus('error');
      setErrorMessage(initError);
      return;
    }

    const missingFields: string[] = [];
    if (!firebaseConfig.apiKey) missingFields.push('VITE_FIREBASE_API_KEY');
    if (!firebaseConfig.projectId) missingFields.push('VITE_FIREBASE_PROJECT_ID');
    if (!firebaseConfig.authDomain) missingFields.push('VITE_FIREBASE_AUTH_DOMAIN');
    if (!firebaseConfig.appId) missingFields.push('VITE_FIREBASE_APP_ID');

    if (missingFields.length > 0) {
      console.error('❌ Missing Firebase configuration:', missingFields.join(', '));
      setAppStatus('error');
      setErrorMessage(`Missing Firebase configuration: ${missingFields.join(', ')}`);
      return;
    }

    if (!app) {
      console.error('❌ Firebase app is null');
      setAppStatus('error');
      setErrorMessage('Firebase initialization failed');
      return;
    }

    console.log('✅ All checks passed - app ready');
    setAppStatus('ready');
  }, []);

  if (appStatus === 'loading') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px',
          animation: 'spin 2s linear infinite'
        }}>
          🔄
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Chargement de l'application...
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Initialisation en cours
        </p>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  if (appStatus === 'error') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#fef2f2',
        fontFamily: 'monospace',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '800px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '2px solid #ef4444'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '16px' }}>
            Erreur de Configuration Firebase
          </h1>
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{ color: '#991b1b', fontSize: '14px', marginBottom: '8px' }}>
              <strong>Erreur:</strong> {errorMessage}
            </p>
          </div>

          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
              Configuration actuelle:
            </h2>
            <div style={{ fontSize: '12px', color: '#4b5563' }}>
              <p>VITE_FIREBASE_API_KEY: {firebaseConfig.apiKey ? '✅ Défini' : '❌ Non défini'}</p>
              <p>VITE_FIREBASE_PROJECT_ID: {firebaseConfig.projectId || '❌ Non défini'}</p>
              <p>VITE_FIREBASE_AUTH_DOMAIN: {firebaseConfig.authDomain || '❌ Non défini'}</p>
              <p>VITE_FIREBASE_APP_ID: {firebaseConfig.appId || '❌ Non défini'}</p>
            </div>
          </div>

          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fcd34d',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#92400e', marginBottom: '12px' }}>
              Pour résoudre ce problème:
            </h2>
            <ol style={{ fontSize: '14px', color: '#78350f', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li>Créez un fichier <code>.env</code> à la racine du projet</li>
              <li>Ajoutez ces lignes (avec vos vraies valeurs):
                <pre style={{
                  backgroundColor: '#fef3c7',
                  padding: '12px',
                  borderRadius: '4px',
                  marginTop: '8px',
                  fontSize: '12px',
                  overflow: 'auto'
                }}>
{`VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre-projet
VITE_FIREBASE_STORAGE_BUCKET=votre-projet.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
VITE_FIREBASE_MEASUREMENT_ID=votre_measurement_id`}
                </pre>
              </li>
              <li>Redémarrez le serveur de développement (npm run dev)</li>
              <li>Rechargez la page</li>
            </ol>
          </div>

          <div style={{ marginTop: '24px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
            Consultez la console du navigateur (F12) pour plus de détails
          </div>
        </div>
      </div>
    );
  }

  console.log('✅ Rendering main application');

  return (
    <BrowserRouter>
      <AuthProvider>
        <PriceProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/analysis" element={<AnalysisPage />} />
                      <Route path="/opportunities" element={<OpportunitiesPage />} />
                      <Route path="/swing-trading" element={<SwingTradingPage />} />
                      <Route path="/day-trading" element={<DayTradingPage />} />
                      <Route path="/journal" element={<JournalPage />} />
                      <Route path="/risk" element={<RiskPage />} />
                      <Route path="/education" element={<EducationPage />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </PriceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
