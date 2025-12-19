import { useState } from 'react';
import { Bell, Mail, Check, X } from 'lucide-react';

export default function EmailNotifications() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [frequency, setFrequency] = useState<'immediate' | 'daily' | 'weekly'>('immediate');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Veuillez entrer une adresse email valide');
      }

      localStorage.setItem('notification_email', email);
      localStorage.setItem('notification_frequency', frequency);

      setMessage({
        type: 'success',
        text: 'Abonnement enregistré localement! La synchronisation Firebase sera bientôt disponible.'
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Erreur lors de l\'abonnement'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border-2 border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Notifications par Email
          </h3>
          <p className="text-sm text-gray-600">
            Abonnez-vous pour recevoir des alertes d'opportunités
          </p>
        </div>
      </div>

      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800 font-medium mb-1">ℹ️ Migration Firebase en cours</p>
        <p className="text-xs text-blue-700">
          La fonctionnalité de notifications est en cours d'intégration avec Firebase. Vos données seront bientôt synchronisées automatiquement.
        </p>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {message.type === 'success' ? (
            <Check className="w-5 h-5 flex-shrink-0" />
          ) : (
            <X className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubscribe} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fréquence des notifications
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="frequency"
                value="immediate"
                checked={frequency === 'immediate'}
                onChange={(e) => setFrequency(e.target.value as 'immediate')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Immédiat - Dès qu'une opportunité est détectée</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="frequency"
                value="daily"
                checked={frequency === 'daily'}
                onChange={(e) => setFrequency(e.target.value as 'daily')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Quotidien - Un résumé par jour</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="frequency"
                value="weekly"
                checked={frequency === 'weekly'}
                onChange={(e) => setFrequency(e.target.value as 'weekly')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Hebdomadaire - Un résumé par semaine</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Bell className="w-5 h-5" />
          {isLoading ? 'Activation...' : 'Enregistrer l\'Email'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-2">
          Vos données seront sauvegardées localement et synchronisées avec Firebase.
        </p>
      </form>
    </div>
  );
}
