# Configuration de Resend pour l'envoi d'emails

## Pourquoi configurer Resend ?

Actuellement, l'interface de notifications est **déjà fonctionnelle** :
- ✅ Vous pouvez vous abonner aux notifications
- ✅ Vous pouvez gérer votre abonnement
- ✅ L'interface est visible sur la page Opportunités

**Cependant**, pour que les emails soient réellement envoyés, vous devez configurer Resend.

## Option 1 : Tester sans Resend (Recommandé pour débuter)

Vous pouvez utiliser l'application dès maintenant sans configurer Resend :
- Abonnez-vous avec votre email
- Testez l'interface
- Quand vous cliquez sur "Envoyer Emails", vous verrez un message d'erreur expliquant que Resend n'est pas configuré

**C'est normal et l'application continue de fonctionner !**

## Option 2 : Configurer Resend (Pour envoyer réellement des emails)

### Étape 1 : Créer un compte Resend (Gratuit)

1. Allez sur [resend.com](https://resend.com)
2. Cliquez sur "Sign Up" (Inscription)
3. Créez votre compte
4. Vérifiez votre email

### Étape 2 : Obtenir votre clé API

1. Connectez-vous à [resend.com/api-keys](https://resend.com/api-keys)
2. Cliquez sur **"Create API Key"**
3. Donnez-lui un nom (ex: "Gold Trading")
4. Copiez la clé qui commence par `re_...`
5. **IMPORTANT** : Gardez cette clé en sécurité, vous ne pourrez plus la voir

### Étape 3 : Ajouter la clé dans Supabase

**Via le Dashboard Supabase (en ligne) :**

1. Allez sur [supabase.com](https://supabase.com) et connectez-vous
2. Ouvrez votre projet (celui que vous utilisez)
3. Dans le menu de gauche, cliquez sur **"Project Settings"** (⚙️ en bas)
4. Cliquez sur **"Edge Functions"** dans le sous-menu
5. Faites défiler jusqu'à la section **"Environment Variables"**
6. Cliquez sur **"Add new secret"**
7. Entrez :
   - **Name** : `RESEND_API_KEY`
   - **Value** : Votre clé API Resend (commence par `re_...`)
8. Cliquez sur **"Save"**

**Alternativement, via CLI Supabase (si vous l'avez installé) :**

```bash
supabase secrets set RESEND_API_KEY=re_votre_cle_ici
```

### Étape 4 : Vérifier la configuration

1. Sur votre page Opportunités, cliquez sur **"Envoyer Emails"**
2. Si configuré correctement, vous verrez : "✅ X email(s) envoyé(s) avec succès!"
3. Si non configuré, vous verrez : "❌ RESEND_API_KEY not configured"

## Utilisation du domaine d'envoi

### Pour les tests (par défaut)

Resend vous permet d'envoyer depuis `onboarding@resend.dev` gratuitement pour tester.
Les emails arrivent souvent dans les spams, c'est normal.

### Pour la production (optionnel)

Si vous voulez utiliser votre propre domaine (ex: `notifications@votredomaine.com`) :

1. Dans Resend, allez dans **"Domains"**
2. Ajoutez votre domaine
3. Configurez les enregistrements DNS selon les instructions
4. Une fois vérifié, modifiez le fichier Edge Function :

```typescript
// Dans supabase/functions/send-opportunity-notifications/index.ts
from: "Trading Alerts <notifications@votredomaine.com>",
```

## Limites et Tarifs

**Plan Gratuit Resend :**
- 100 emails par jour
- 3 000 emails par mois
- Parfait pour commencer

**Plan Payant (si besoin) :**
- À partir de $20/mois
- 50 000 emails/mois
- Support prioritaire

## Dépannage

### "Je ne vois pas mon projet Supabase"

Assurez-vous d'être connecté au bon compte Supabase où votre projet est hébergé.

### "Je ne trouve pas Edge Functions dans les settings"

1. Vérifiez que vous êtes bien dans **Project Settings** (⚙️)
2. Cherchez **"Edge Functions"** dans le menu latéral des settings
3. Si vous ne le voyez pas, votre projet Supabase est peut-être trop ancien, contactez le support

### "Les emails n'arrivent pas"

1. Vérifiez vos spams/courriers indésirables
2. Si vous utilisez `onboarding@resend.dev`, c'est normal qu'ils arrivent en spam
3. Configurez votre propre domaine vérifié pour éviter les spams
4. Vérifiez les logs dans le dashboard Resend

### "Erreur 500 lors de l'envoi"

1. Vérifiez que `RESEND_API_KEY` est bien configuré dans Supabase
2. Assurez-vous que la clé commence par `re_`
3. Vérifiez que vous avez encore du quota disponible sur Resend
4. Consultez les logs de l'Edge Function dans Supabase

## Résumé

**Sans Resend configuré :**
- ✅ Interface fonctionnelle
- ✅ Gestion des abonnements
- ❌ Envoi d'emails désactivé

**Avec Resend configuré :**
- ✅ Interface fonctionnelle
- ✅ Gestion des abonnements
- ✅ Envoi d'emails actif

Vous pouvez utiliser l'application dès maintenant et configurer Resend plus tard quand vous serez prêt à envoyer des emails !
