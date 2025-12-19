import { useState, useEffect } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import SwingAnalysisPanel from '../components/SwingAnalysisPanel';
import { generateSwingOpportunities } from '../services/swingAnalysis';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface SwingOpportunity {
  type: string;
  strategy: string;
  timeframe: string;
  duration: string;
  entry: string;
  entryZone: string;
  stopLoss: string;
  takeProfit1: string;
  takeProfit2: string;
  takeProfit3: string;
  confidence: number;
  reason: string;
  elements: string[];
  swingAdvice: string;
}

export default function SwingTradingPage() {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [opportunities, setOpportunities] = useState<SwingOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const fetchSwingData = async () => {
    setIsSearching(true);
    try {
      const timestamp = Date.now();
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-gold-history?timeframe=4H&t=${timestamp}`;
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
        setCandleData(result.data);

        const swingOps = generateSwingOpportunities(result.data);
        setOpportunities(swingOps);
      }
    } catch (error) {
      console.error('Error fetching swing data:', error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchSwingData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement de l'analyse Swing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl p-6 shadow-xl flex-1">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <h1 className="text-3xl font-bold">
              Swing Trading - Supply & Demand
            </h1>
          </div>
          <p className="text-blue-100">
            Analyse 4H/Daily - Positions multi-jours (3-7 jours) - Zones institutionnelles
          </p>
        </div>
        <button
          onClick={fetchSwingData}
          disabled={isSearching}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Search className="w-5 h-5" />
          {isSearching ? 'Analyse...' : 'Analyser'}
        </button>
      </div>

      <SwingAnalysisPanel candleData={candleData} />

      {opportunities.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Opportunités Swing Détectées ({opportunities.length})
          </h2>
          <div className="space-y-4">
            {opportunities.map((opp, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl border-2 shadow-lg ${
                  opp.type === 'SWING ACHAT'
                    ? 'bg-green-50 border-green-400'
                    : 'bg-red-50 border-red-400'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {opp.strategy}
                      </h3>
                      <span className={`px-5 py-2 rounded-lg font-bold text-white text-lg ${
                        opp.type === 'SWING ACHAT' ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {opp.type}
                      </span>
                    </div>

                    <div className="flex gap-4 text-sm mb-3">
                      <span className="bg-white px-3 py-1 rounded-lg border border-gray-300 font-semibold">
                        {opp.timeframe}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg font-semibold">
                        {opp.duration}
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg font-semibold">
                        Confiance: {opp.confidence}%
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 font-medium">{opp.reason}</p>

                    <div className="space-y-1 mb-3">
                      {opp.elements.map((elem, i) => (
                        <p key={i} className="text-sm font-semibold text-gray-700">
                          {elem}
                        </p>
                      ))}
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded mt-3">
                      <p className="text-sm font-semibold text-yellow-800">
                        {opp.swingAdvice}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 border-2 border-blue-300">
                    <p className="text-xs text-gray-600 mb-1">Zone d'Entrée</p>
                    <p className="font-bold text-blue-700 text-sm">{opp.entryZone}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-2 border-red-300">
                    <p className="text-xs text-gray-600 mb-1">Stop Loss</p>
                    <p className="font-bold text-red-700">${opp.stopLoss}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-2 border-green-300">
                    <p className="text-xs text-gray-600 mb-1">TP1</p>
                    <p className="font-bold text-green-700">${opp.takeProfit1}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-2 border-green-400">
                    <p className="text-xs text-gray-600 mb-1">TP2</p>
                    <p className="font-bold text-green-800">${opp.takeProfit2}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-2 border-green-500">
                    <p className="text-xs text-gray-600 mb-1">TP3</p>
                    <p className="font-bold text-green-900">${opp.takeProfit3}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm">
                    <span className="font-semibold text-gray-700">
                      Position à tenir {opp.duration}
                    </span>
                  </div>
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-bold transition shadow-lg">
                    Ajouter au Journal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {opportunities.length === 0 && !isSearching && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
          <p className="text-yellow-800 font-semibold text-center">
            Aucune opportunité swing claire détectée pour le moment.
          </p>
          <p className="text-yellow-700 text-sm text-center mt-2">
            Attendez un retracement vers une zone de supply/demand majeure ou un support/résistance swing.
          </p>
        </div>
      )}

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">
          Principes du Swing Trading
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-bold text-blue-700 mb-2">Timeframes</h4>
            <p className="text-gray-700">
              Utiliser 4H et Daily pour identifier les zones majeures.
              Confirmer sur timeframe inférieur (1H) avant entrée.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-bold text-green-700 mb-2">Durée de position</h4>
            <p className="text-gray-700">
              Tenir 3-7 jours minimum. Ne pas closer au premier mouvement contraire.
              Attendre que le prix atteigne les targets ou le stop.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-bold text-purple-700 mb-2">Gestion du risque</h4>
            <p className="text-gray-700">
              Stop loss plus large (20-30$). Ratio R:R minimum 1:2.
              Position sizing réduite pour compenser le stop large.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-bold text-orange-700 mb-2">Confluence</h4>
            <p className="text-gray-700">
              Chercher confluence zone S&D + support/résistance swing.
              Plus de confluence = plus haute probabilité de réussite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
