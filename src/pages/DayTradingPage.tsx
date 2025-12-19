import { useState, useEffect } from 'react';
import { Search, Zap, Clock } from 'lucide-react';
import SessionIndicator from '../components/SessionIndicator';
import { detectDayTradingZones, generateDayTradingOpportunities, getCurrentSession } from '../services/dayTradingAnalysis';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface DayTradingOpportunity {
  id: string;
  type: string;
  strategy: string;
  timeframe: string;
  duration: string;
  session: string;
  entry: string;
  entryZone: string;
  stopLoss: string;
  takeProfit1: string;
  takeProfit2: string;
  confidence: number;
  riskReward: string;
  reason: string;
  elements: string[];
  dayAdvice: string;
}

export default function DayTradingPage() {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [opportunities, setOpportunities] = useState<DayTradingOpportunity[]>([]);
  const [zones, setZones] = useState<any>({ supply: [], demand: [] });
  const [currentSession, setCurrentSession] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const fetchDayTradingData = async () => {
    setIsSearching(true);
    try {
      const timestamp = Date.now();
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-gold-history?timeframe=1H&t=${timestamp}`;
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

        const detectedZones = detectDayTradingZones(result.data);
        setZones(detectedZones);

        const dayOps = generateDayTradingOpportunities(result.data, detectedZones);
        setOpportunities(dayOps);

        const session = getCurrentSession();
        setCurrentSession(session);
      }
    } catch (error) {
      console.error('Error fetching day trading data:', error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchDayTradingData();

    const interval = setInterval(() => {
      const session = getCurrentSession();
      setCurrentSession(session);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement de l'analyse Day Trading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 text-white rounded-xl p-6 shadow-xl flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8" />
            <h1 className="text-3xl font-bold">
              Day Trading - Supply & Demand
            </h1>
          </div>
          <p className="text-green-100">
            Analyse 15min/1H - Positions intraday (2-8 heures) - Pas de overnight
          </p>
        </div>
        <button
          onClick={fetchDayTradingData}
          disabled={isSearching}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Search className="w-5 h-5" />
          {isSearching ? 'Analyse...' : 'Analyser'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            Session Active
          </h3>
          {currentSession && <SessionIndicator session={currentSession as any} />}
        </div>
        <p className="text-sm text-gray-600">
          Les opportunités Day Trading sont optimisées selon la session de trading active. Pensez à clôturer vos positions avant la fin de session.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-green-600">📈</span>
            Zones Demand Détectées
          </h3>
          <div className="space-y-2">
            {zones.demand.length > 0 ? (
              zones.demand.map((zone: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                  <div>
                    <span className="text-gray-600">Zone {index + 1}</span>
                    {zone.psychological && (
                      <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">Psych</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${zone.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{zone.strength}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucune zone demand détectée</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-red-600">📉</span>
            Zones Supply Détectées
          </h3>
          <div className="space-y-2">
            {zones.supply.length > 0 ? (
              zones.supply.map((zone: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  <div>
                    <span className="text-gray-600">Zone {index + 1}</span>
                    {zone.psychological && (
                      <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">Psych</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">${zone.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{zone.strength}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucune zone supply détectée</p>
            )}
          </div>
        </div>
      </div>

      {opportunities.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-green-600" />
            Opportunités Day Trading Détectées ({opportunities.length})
          </h2>
          <div className="space-y-4">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className={`p-6 rounded-xl border-2 shadow-lg ${
                  opp.type === 'ACHAT'
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
                        opp.type === 'ACHAT' ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {opp.type}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-green-100 text-green-800 font-semibold text-sm border-2 border-green-300">
                        DAY
                      </span>
                    </div>

                    <div className="flex gap-4 text-sm mb-3 flex-wrap">
                      <span className="bg-white px-3 py-1 rounded-lg border border-gray-300 font-semibold">
                        {opp.timeframe}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg font-semibold">
                        {opp.duration}
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg font-semibold">
                        Confiance: {opp.confidence}%
                      </span>
                      <SessionIndicator session={opp.session as any} />
                    </div>

                    <p className="text-sm text-gray-700 mb-3 font-medium">{opp.reason}</p>

                    <div className="space-y-1 mb-3">
                      {opp.elements.map((elem, i) => (
                        <p key={i} className="text-sm font-semibold text-gray-700">
                          {elem}
                        </p>
                      ))}
                    </div>

                    <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded mt-3">
                      <p className="text-sm font-semibold text-orange-800 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {opp.dayAdvice}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 border-2 border-blue-300">
                    <p className="text-xs text-gray-600 mb-1">Zone d'Entrée</p>
                    <p className="font-bold text-blue-700 text-sm">{opp.entryZone}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-2 border-red-300">
                    <p className="text-xs text-gray-600 mb-1">Stop Loss</p>
                    <p className="font-bold text-red-700">${opp.stopLoss}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-2 border-green-300">
                    <p className="text-xs text-gray-600 mb-1">TP1 (50%)</p>
                    <p className="font-bold text-green-700">${opp.takeProfit1}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-2 border-green-400">
                    <p className="text-xs text-gray-600 mb-1">TP2 (50%)</p>
                    <p className="font-bold text-green-800">${opp.takeProfit2}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm">
                    <span className="font-semibold text-gray-700">
                      Clôturer dans {opp.duration}
                    </span>
                    <span className="font-semibold text-green-700">
                      R:R {opp.riskReward}
                    </span>
                  </div>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-bold transition shadow-lg">
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
            Aucune opportunité day trading claire détectée pour le moment.
          </p>
          <p className="text-yellow-700 text-sm text-center mt-2">
            Attendez un retour vers une zone Supply/Demand avec confluence niveau psychologique.
          </p>
        </div>
      )}

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">
          Principes du Day Trading
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-bold text-green-700 mb-2">Timeframes</h4>
            <p className="text-gray-700">
              Utiliser 15min, 30min et 1H pour identifier les zones.
              Confirmer avec contexte 4H avant entrée.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-bold text-orange-700 mb-2">Durée de position</h4>
            <p className="text-gray-700">
              Tenir 2-8 heures maximum. Pas de positions overnight.
              Clôturer avant la fin de session active.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-bold text-purple-700 mb-2">Gestion du risque</h4>
            <p className="text-gray-700">
              Stop loss serré (10-20$). Ratio R:R minimum 1:2.
              Prendre 50% profit au TP1, laisser courir 50% jusqu'au TP2.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-bold text-blue-700 mb-2">Confluence</h4>
            <p className="text-gray-700">
              Zone S&D + niveau psychologique (00, 50) + session active.
              Plus de confluence = probabilité plus élevée.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
