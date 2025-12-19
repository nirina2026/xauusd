import { useState, useEffect } from 'react';
import { Search, Send } from 'lucide-react';
import OpportunityCard from '../components/OpportunityCard';
import EmailNotifications from '../components/EmailNotifications';
import { detectLevels, calculateRSI, detectOpportunities } from '../services/analysis';
import { saveTrade } from '../services/journal';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [smcOpportunity, setSmcOpportunity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSMC, setIsLoadingSMC] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [rsi, setRsi] = useState<number>(50);
  const [levels, setLevels] = useState<any>({ supports: [], resistances: [] });

  const fetchSMCOpportunity = async () => {
    setIsLoadingSMC(true);
    try {
      const timestamp = Date.now();
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-smc?t=${timestamp}`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        headers,
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch SMC analysis');
      }

      const result = await response.json();

      if (result.success && result.setup) {
        setSmcOpportunity(result.setup);
      } else {
        setSmcOpportunity(null);
      }
    } catch (error) {
      console.error('Error fetching SMC opportunity:', error);
      setSmcOpportunity(null);
    } finally {
      setIsLoadingSMC(false);
    }
  };

  const fetchOpportunities = async () => {
    setIsLoading(true);
    try {
      const timestamp = Date.now();
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-gold-history?timeframe=Daily&t=${timestamp}`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        headers,
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        const detectedLevels = detectLevels(result.data);
        const calculatedRSI = calculateRSI(result.data);
        const detectedOpportunities = detectOpportunities(result.data, detectedLevels, calculatedRSI);

        setLevels(detectedLevels);
        setRsi(calculatedRSI);
        setOpportunities(detectedOpportunities);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAll = async () => {
    await Promise.all([fetchOpportunities(), fetchSMCOpportunity()]);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddToJournal = (opportunity: any) => {
    const newTrade = {
      type: opportunity.type,
      status: 'EN ATTENTE',
      entry: parseFloat(opportunity.entry.ideal),
      stopLoss: parseFloat(opportunity.stopLoss),
      takeProfit: parseFloat(opportunity.takeProfits[0]),
      lots: 0.1,
      notes: opportunity.reason
    };

    saveTrade(newTrade);
    alert('Opportunité ajoutée au journal avec succès !');
  };

  const handleSendNotifications = async () => {
    setIsSendingEmails(true);
    setEmailMessage('');

    try {
      const allOpportunities = smcOpportunity
        ? [smcOpportunity, ...opportunities]
        : opportunities;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-opportunity-notifications`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          opportunities: allOpportunities,
          sendNow: true
        })
      });

      const result = await response.json();

      if (result.success) {
        if (result.sent > 0) {
          setEmailMessage(`✅ ${result.sent} email(s) envoyé(s) avec succès!`);
        } else {
          setEmailMessage(`ℹ️ ${result.message || 'Aucun abonné actif trouvé'}`);
        }
      } else {
        if (result.message && result.message.includes('RESEND_API_KEY')) {
          setEmailMessage(`⚠️ Configuration requise: Vous devez configurer votre clé API Resend dans Supabase pour envoyer des emails. Consultez le fichier CONFIGURATION_RESEND.md pour les instructions.`);
        } else {
          setEmailMessage(`❌ Erreur: ${result.message || 'Échec de l\'envoi'}`);
        }
      }
    } catch (error: any) {
      setEmailMessage(`❌ Erreur: ${error.message}`);
    } finally {
      setIsSendingEmails(false);
      setTimeout(() => setEmailMessage(''), 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Opportunités de Trading
          </h1>
          <p className="text-gray-600">
            Détection automatique des opportunités basée sur l'analyse technique
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchAll}
            disabled={isLoading || isLoadingSMC}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5" />
            {(isLoading || isLoadingSMC) ? 'Recherche...' : '🔄 Rechercher'}
          </button>
          <button
            onClick={handleSendNotifications}
            disabled={isSendingEmails || (opportunities.length === 0 && !smcOpportunity)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            {isSendingEmails ? 'Envoi...' : 'Envoyer Emails'}
          </button>
        </div>
      </div>

      {emailMessage && (
        <div className={`p-4 rounded-lg ${
          emailMessage.includes('✅')
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          <p className="font-medium">{emailMessage}</p>
        </div>
      )}

      <EmailNotifications />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Analyse Technique</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">RSI (14)</span>
              <span className={`font-bold ${
                rsi < 30 ? 'text-green-600' :
                rsi > 70 ? 'text-red-600' :
                'text-gray-800'
              }`}>
                {rsi.toFixed(2)}
                {rsi < 30 && ' (Survendu)'}
                {rsi > 70 && ' (Suracheté)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Supports Détectés</span>
              <span className="font-bold text-green-600">{levels.supports.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Résistances Détectées</span>
              <span className="font-bold text-red-600">{levels.resistances.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Supports Clés</h3>
          <div className="space-y-2">
            {levels.supports.length > 0 ? (
              levels.supports.map((support: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Support {index + 1}</span>
                  <span className="font-bold text-green-600">${support.price.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucun support détecté</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🚫 Résistances Clés</h3>
          <div className="space-y-2">
            {levels.resistances.length > 0 ? (
              levels.resistances.map((resistance: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Résistance {index + 1}</span>
                  <span className="font-bold text-red-600">${resistance.price.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucune résistance détectée</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800">
          Opportunités Actives ({opportunities.length + (smcOpportunity ? 1 : 0)})
        </h2>

        {(isLoading || isLoadingSMC) ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyse en cours...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {smcOpportunity && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 rounded-xl p-2">
                <div className="bg-purple-600 text-white px-3 py-1 rounded-t-lg text-xs font-bold inline-block mb-2">
                  SMC FOOTPRINT ANALYSIS - TEMPS RÉEL
                </div>
                <OpportunityCard
                  key={smcOpportunity.id}
                  opportunity={smcOpportunity}
                  onAddToJournal={handleAddToJournal}
                />
              </div>
            )}

            {!smcOpportunity && opportunities.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-gray-600">Aucune opportunité détectée pour le moment.</p>
                <p className="text-gray-500 text-sm mt-2">Cliquez sur "Rechercher" pour analyser le marché.</p>
              </div>
            )}

            {opportunities.length > 0 && (
              <>
                <div className="border-t-2 border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Opportunités Détectées Automatiquement
                  </h3>
                </div>
                {opportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    onAddToJournal={handleAddToJournal}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
