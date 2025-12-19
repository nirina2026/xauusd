# Systeme d'Authentification Firebase

## Vue d'ensemble

Votre application est maintenant securisee avec un systeme d'authentification complet utilisant Firebase Authentication. Toutes les pages du dashboard sont automatiquement protegees et necessitent une connexion.

## Fonctionnalites implementees

### 1. Authentification Firebase
- Utilisation de Firebase Authentication (Email/Password)
- Gestion securisee des sessions utilisateur
- Persistence automatique de la session
- Redirection automatique lors de l'expiration de session

### 2. Pages d'authentification

#### Page de connexion (/login)
- Formulaire de connexion avec email et mot de passe
- Validation automatique des champs
- Messages d'erreur clairs en francais
- Lien vers page "Mot de passe oublie"
- Redirection automatique vers le dashboard apres connexion
- Lien vers page d'inscription pour les nouveaux utilisateurs

#### Page d'inscription (/signup)
- Formulaire complet avec nom complet, email et mot de passe
- Validation de la correspondance des mots de passe
- Verification de la force du mot de passe (minimum 6 caracteres)
- Messages d'erreur detailles
- Creation automatique du profil utilisateur avec le nom complet
- Lien vers page de connexion pour les utilisateurs existants

#### Page de recuperation de mot de passe (/forgot-password)
- Formulaire pour entrer l'email
- Envoi automatique d'un email de reinitialisation
- Confirmation visuelle apres envoi
- Lien valable 1 heure
- Retour vers la connexion

### 3. Protection des routes
- Toutes les pages du dashboard sont automatiquement protegees
- Les utilisateurs non connectes sont rediriges vers /login
- Verification de l'authentification a chaque changement de route
- Ecran de chargement pendant la verification

### 4. Interface utilisateur integree

#### Header enrichi
- Affichage du nom de l'utilisateur connecte
- Avatar avec les initiales de l'utilisateur
- Menu deroulant avec les informations du compte
- Bouton de deconnexion accessible en un clic
- Design coherent avec votre theme bleu/indigo

#### Messages d'erreur clairs
- Codes d'erreur Firebase traduits en francais
- Suggestions d'actions appropriees
- Design intuitif et facile a comprendre

## Architecture technique

### Fichiers crees

```
src/
├── contexts/
│   └── AuthContext.tsx              # Contexte global d'authentification
│       - Fournit les hooks useAuth()
│       - Gere signup, login, logout
│       - Maintient l'etat de connexion
│
├── components/
│   └── ProtectedRoute.tsx          # Composant de protection des routes
│       - Verifie si l'utilisateur est authentifie
│       - Redirige vers /login sinon
│       - Affiche un loader pendant la verification
│
├── pages/
│   ├── LoginPage.tsx               # Page de connexion
│   ├── SignupPage.tsx              # Page d'inscription
│   └── ForgotPasswordPage.tsx       # Page de recuperation
│
└── lib/
    └── firebase.ts                 # Configuration Firebase (existant)
```

### Flux d'authentification

```
Utilisateur visite l'app
    ↓
App.tsx initialise Firebase & AuthProvider
    ↓
AuthContext verifie l'authentification
    ↓
Est authentifie?
    ├─ OUI → Affiche Layout + Pages protegees
    └─ NON → Affiche pages de login/signup

Sur deconnexion → Redirection vers /login
```

## Configuration requise

### Firebase Console

Assurez-vous que votre projet Firebase a :

1. **Authentication activee**
   - Allez dans Firebase Console → votre projet → Authentication
   - Cliquez sur "Email/Password" dans les methodes
   - Activez la methode

2. **Variables d'environnement configurees** dans `.env`
   ```env
   VITE_FIREBASE_API_KEY=votre_api_key
   VITE_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=votre-projet
   VITE_FIREBASE_APP_ID=votre_app_id
   ```

## Utilisation pour les utilisateurs

### Creer un compte
1. Accedez a /signup (lien sur la page de connexion)
2. Entrez votre nom complet
3. Entrez votre email et mot de passe
4. Cliquez sur "Creer mon compte"
5. Redirection automatique vers le dashboard

### Se connecter
1. Accedez a /login
2. Entrez votre email et mot de passe
3. Cliquez sur "Se connecter"
4. Redirection automatique vers le dashboard

### Mot de passe oublie
1. Allez sur /login
2. Cliquez sur "Mot de passe oublie ?"
3. Entrez votre email
4. Cliquez sur "Envoyer le lien"
5. Verifiez votre email (valide 1 heure)
6. Cliquez sur le lien et creez un nouveau mot de passe

### Se deconnecter
1. Cliquez sur votre nom en haut a droite
2. Cliquez sur "Se deconnecter"
3. Redirection automatique vers /login

## Utilisation pour les developpeurs

### Ajouter l'authentification a un composant

```tsx
import { useAuth } from '../contexts/AuthContext';

function MonComposant() {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <p>Bonjour {currentUser?.displayName}</p>
      <p>Email: {currentUser?.email}</p>
    </div>
  );
}
```

### Proteger une nouvelle route

Les routes sont automatiquement protegees. Il suffit de les ajouter dans App.tsx:

```tsx
<ProtectedRoute>
  <Layout>
    <Routes>
      <Route path="/ma-nouvelle-page" element={<MaNouvellePage />} />
    </Routes>
  </Layout>
</ProtectedRoute>
```

### Fonctions disponibles

```typescript
const {
  currentUser,  // Utilisateur Firebase (User | null)
  loading,      // Chargement initial (boolean)
  signup,       // (email, password, displayName) => Promise<void>
  login,        // (email, password) => Promise<void>
  logout        // () => Promise<void>
} = useAuth();
```

### Acces aux donnees utilisateur

```typescript
currentUser?.email           // Email de l'utilisateur
currentUser?.displayName     // Nom complet
currentUser?.uid             // ID unique Firebase
currentUser?.emailVerified   // Verification d'email
currentUser?.metadata        // Dates de creation/update
```

## Gestion des erreurs

Les codes d'erreur Firebase sont traduits en francais:

- `auth/invalid-credential` → "Email ou mot de passe incorrect"
- `auth/user-not-found` → "Aucun compte trouve avec cet email"
- `auth/email-already-in-use` → "Cet email est deja utilise"
- `auth/weak-password` → "Mot de passe trop faible"
- `auth/too-many-requests` → "Trop de tentatives. Reessayez plus tard"

## Securite

### Bonnes pratiques implementees

1. **Validation des donnees**
   - Validation des champs avant soumission
   - Verification de la force du mot de passe
   - Gestion d'erreurs robuste

2. **Gestion des sessions**
   - Persistence automatique avec Firebase
   - Expiration de session securisee
   - Redirection automatique si session expirée

3. **Protection des donnees**
   - Les mots de passe ne sont jamais logs
   - Les donnees sensibles ne sont pas stockees localement
   - Utilisation de HTTPS obligatoire en production

4. **Redirection de securite**
   - Impossible d'acceder aux pages protegees sans auth
   - Redirection automatique vers /login
   - Session maintenue meme apres fermeture du navigateur

## Depannage

### L'utilisateur est redirige vers /login en boucle
- Verifiez que Firebase est correctement initialise dans App.tsx
- Verifiez les variables d'environnement dans .env
- Consultez la console du navigateur (F12) pour les erreurs

### Erreur "Cannot find useAuth"
- Assurez-vous que le composant est a l'interieur d'un AuthProvider
- L'AuthProvider est configuré dans App.tsx

### Les informations utilisateur ne s'affichent pas
- Verifiez que updateProfile() a ete appelé lors de la creation du compte
- Le displayName doit etre fourni lors du signup

### Session perdue apres rechargement
- Firebase gere automatiquement la persistence
- Verifiez la configuration Firebase dans firebase.ts
- Consultez la console pour les erreurs d'initialisation

### Erreur "user-not-found" au login
- Verifiez que le compte a bien ete cree dans Firebase Console
- Verifiez l'orthographe de l'email

## Tests recommandes

Pour valider le systeme d'authentification:

1. Creer un compte via /signup
2. Verifier que vous etes redirige vers /dashboard
3. Cliquer sur votre nom → "Se deconnecter"
4. Verifier la redirection vers /login
5. Se reconnecter avec les memes identifiants
6. Rafraichir la page → verifier que la session est maintenue
7. Tenter d'acceder a /dashboard sans connexion → doit rediriger vers /login
8. Tester "Mot de passe oublie" → verifier la reception de l'email

## Ameliorations futures possibles

- Verification d'email
- Authentification a deux facteurs (2FA)
- Connexion avec Google/Facebook
- Recuperation de donnees utilisateur depuis Supabase
- Stockage du profil utilisateur (avatar, preferences)
- Historique des connexions
- Gestion des roles utilisateur (admin, trader, viewer)
- Page de profil utilisateur detaillee

## Support Firebase

Pour plus d'informations:
- [Documentation Firebase Auth](https://firebase.google.com/docs/auth)
- [Console Firebase](https://console.firebase.google.com)
- [Codes d'erreur Firebase](https://firebase.google.com/docs/auth/handle-errors)
