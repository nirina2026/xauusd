# Configuration des Notifications Email

Ce document explique comment configurer les notifications par email pour les opportunités de trading.

## Architecture

Le système de notifications email comprend 3 composants principaux :

1. **Base de données** : Table `email_subscriptions` pour stocker les abonnements
2. **Interface utilisateur** : Composant `EmailNotifications` pour gérer les abonnements
3. **Edge Function** : Fonction `send-opportunity-notifications` pour envoyer les emails

## Configuration de Resend

Pour envoyer des emails, vous devez configurer un compte Resend et ajouter votre clé API à Supabase.

### Étape 1 : Créer un compte Resend

1. Visitez [resend.com](https://resend.com)
2. Créez un compte gratuit (100 emails/jour inclus)
3. Vérifiez votre email

### Étape 2 : Obtenir votre clé API

1. Connectez-vous à votre tableau de bord Resend
2. Naviguez vers **API Keys** dans le menu
3. Cliquez sur **Create API Key**
4. Nommez votre clé (ex: "Gold Trading Notifications")
5. Copiez la clé générée (vous ne pourrez plus la voir après)

### Étape 3 : Configurer le domaine d'envoi

Par défaut, Resend vous permet d'envoyer depuis `onboarding@resend.dev` pour les tests.

Pour utiliser votre propre domaine en production :

1. Dans Resend, allez dans **Domains**
2. Cliquez sur **Add Domain**
3. Suivez les instructions pour configurer les enregistrements DNS
4. Une fois vérifié, modifiez le champ `from` dans l'Edge Function :

```typescript
from: "Trading Alerts <notifications@votredomaine.com>",
```

### Étape 4 : Ajouter la clé API à Supabase

1. Ouvrez votre projet Supabase
2. Allez dans **Settings** > **Edge Functions** > **Environment Variables**
3. Ajoutez une nouvelle variable :
   - **Nom** : `RESEND_API_KEY`
   - **Valeur** : Votre clé API Resend (commence par `re_`)
4. Sauvegardez

## Utilisation

### S'abonner aux notifications

1. Visitez la page **Opportunités**
2. Dans la section **Notifications par Email**, entrez votre email
3. Choisissez la fréquence :
   - **Immédiat** : Dès qu'une opportunité est détectée
   - **Quotidien** : Un résumé par jour
   - **Hebdomadaire** : Un résumé par semaine
4. Cliquez sur **Activer les Notifications**

### Envoyer des notifications manuellement

1. Cliquez sur le bouton **Rechercher** pour détecter de nouvelles opportunités
2. Une fois les opportunités chargées, cliquez sur **Envoyer Emails**
3. Tous les utilisateurs abonnés recevront un email avec les opportunités actives

### Se désabonner

1. Dans la section **Notifications par Email**, cliquez sur **Se Désabonner**
2. Votre email sera désactivé de la liste

## Automatisation

Pour automatiser l'envoi de notifications, vous pouvez :

1. **Utiliser un cron job** pour appeler régulièrement l'Edge Function
2. **Intégrer avec un webhook** qui se déclenche lors de nouvelles opportunités
3. **Utiliser Supabase Scheduled Functions** (fonctionnalité à venir)

### Exemple avec cURL

```bash
curl -X POST https://your-project.supabase.co/functions/v1/send-opportunity-notifications \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "opportunities": [
      {
        "id": "opp1",
        "type": "LONG",
        "title": "Setup SMC",
        "reason": "Order Block + FVG",
        "confidence": 85,
        "entry": {"ideal": "4250.00"},
        "stopLoss": "4220.00",
        "takeProfits": ["4313.00", "4356.00"],
        "riskReward": "1:2.1"
      }
    ],
    "sendNow": true
  }'
```

## Format des emails

Les emails envoyés contiennent :

- Titre et description de chaque opportunité
- Type (LONG/SHORT) et niveau de confiance
- Point d'entrée idéal
- Stop Loss
- Take Profit (multiples niveaux)
- Ratio Risk/Reward
- Avertissement sur les risques

## Sécurité et Confidentialité

- Les emails sont stockés de manière sécurisée dans Supabase
- Row Level Security (RLS) est activé sur la table `email_subscriptions`
- Les utilisateurs peuvent se désabonner à tout moment
- Aucune donnée sensible n'est envoyée dans les emails
- Les clés API sont stockées en toute sécurité dans les variables d'environnement Supabase

## Limites

- **Resend gratuit** : 100 emails/jour, 3000 emails/mois
- **Resend payant** : À partir de $20/mois pour 50,000 emails/mois

## Dépannage

### "RESEND_API_KEY not configured"

- Vérifiez que vous avez ajouté la variable d'environnement `RESEND_API_KEY` dans Supabase
- Assurez-vous que la clé commence par `re_`
- Redéployez l'Edge Function si nécessaire

### Les emails ne sont pas reçus

- Vérifiez vos spams/courriers indésirables
- Assurez-vous que votre domaine est vérifié dans Resend
- Consultez les logs dans le tableau de bord Resend

### Erreur d'abonnement

- Vérifiez que l'email est valide
- Assurez-vous que la base de données est accessible
- Consultez les logs du navigateur pour plus de détails

## Support

Pour toute question ou problème :

1. Consultez la documentation Resend : [resend.com/docs](https://resend.com/docs)
2. Vérifiez les logs Supabase dans **Logs** > **Edge Functions**
3. Consultez les logs Resend dans votre tableau de bord
