import { useState, useEffect } from 'react';
import { TrendingUp, Radio, Clock, Target, AlertTriangle, CheckCircle, BarChart3, Newspaper, Zap, ArrowUpRight, TrendingDown, AlertCircle } from 'lucide-react';
import { usePrice } from '../contexts/PriceContext';
import { detectLevels } from '../services/analysis';

interface NewsItem {
  id: string;
  time: string;
  type: 'TRÈS POSITIF' | 'POSITIF' | 'ATTENTION';
  title: string;
  impact: string;
  description: string;
}

interface Level {
  price: number;
  strength: number;
  touches: number;
}

interface TechnicalLevel {
  price: number;
  type: 'resistance' | 'support';
  description: string;
  strength: 'Très Fort' | 'Fort' | 'Moyen';
}

interface TakeProfit {
  level: number;
  price: number;
  ratio: string;
  action: string;
}

interface Setup {
  id: string;
  name: string;
  description: string;
  situation: string;
  recommendation: string;
  entry: {
    price: number;
    condition: string;
  };
  stopLoss: {
    price: number;
    reason: string;
  };
  takeProfits: TakeProfit[];
  technicalAnalysis: string[];
  fundamentalAnalysis: string[];
  catalysts: string[];
}

export default function AnalysisPage() {
  const { priceData } = usePrice();
  const [levels, setLevels] = useState<{ supports: Level[]; resistances: Level[] }>({
    supports: [],
    resistances: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSetup, setSelectedSetup] = useState<string>('active');
  const [dynamicData, setDynamicData] = useState<any>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [setups, setSetups] = useState<Record<string, Setup>>({});

  const defaultSetups: Record<string, Setup> = {
    active: {
      id: 'active',
      name: 'SETUP ACTIVÉ',
      description: 'Position haussière active',
      situation: 'L\'or a franchi la résistance des 4200$ avec un fort volume. Le RSI est à 72.5, en zone de surachat léger. Les moyennes mobiles sont alignées positivement (EMA20 > EMA50 > EMA100). La tendance de fond reste très haussière.',
      recommendation: 'ACHETER sur repli vers 4250-4270$ ou breakout confirmé au-dessus de 4313$',
      entry: {
        price: 4280,
        condition: 'Entrée au-dessus de 4280$ avec confirmation volume'
      },
      stopLoss: {
        price: 4240,
        reason: 'En dessous du support clé et de l\'EMA50'
      },
      takeProfits: [
        {
          level: 1,
          price: 4320,
          ratio: '1:1.0',
          action: 'Sécuriser 30% de la position'
        },
        {
          level: 2,
          price: 4360,
          ratio: '1:2.0',
          action: 'Sécuriser 40% supplémentaires'
        },
        {
          level: 3,
          price: 4400,
          ratio: '1:3.0',
          action: 'Laisser courir les 30% restants avec trailing stop'
        }
      ],
      technicalAnalysis: [
        'Cassure nette de la résistance 4200$ avec fort volume',
        'RSI à 72.5 - Zone de surachat mais momentum fort',
        'MACD croisement haussier confirmé',
        'Support immédiat à 4260$, majeur à 4200$',
        'Objectif technique à 4400$ (extension Fibonacci 161.8%)'
      ],
      fundamentalAnalysis: [
        'Dollar faible suite aux commentaires dovish de la Fed',
        'Inflation persistante favorise les valeurs refuges',
        'Demande physique soutenue en Asie (Inde +15% YoY)',
        'Banques centrales continuent leurs achats nets',
        'Tensions géopolitiques au Moyen-Orient'
      ],
      catalysts: [
        'Publication NFP vendredi - Volatilité attendue',
        'Discours Powell mardi sur politique monétaire',
        'Données inflation CPI jeudi (consensus 3.1%)',
        'Réunion FOMC dans 2 semaines',
        'Clôture mensuelle fin de semaine - Importante'
      ]
    },
    wait: {
      id: 'wait',
      name: 'ATTENDRE - Repli',
      description: 'En attente d\'opportunité d\'achat',
      situation: 'Après la forte hausse vers 4280$, l\'or montre des signes d\'essoufflement à court terme. Le RSI à 72.5 est en zone de surachat. Une consolidation ou un repli technique vers les supports serait sain avant de reprendre la hausse.',
      recommendation: 'PATIENTER - Attendre un repli vers la zone 4200-4250$ pour entrer dans de meilleures conditions',
      entry: {
        price: 4225,
        condition: 'Attendre repli vers 4200-4225$ avec rebond confirmé'
      },
      stopLoss: {
        price: 4180,
        reason: 'Sous le support majeur et l\'EMA100'
      },
      takeProfits: [
        {
          level: 1,
          price: 4280,
          ratio: '1:1.2',
          action: 'Prendre 40% des profits'
        },
        {
          level: 2,
          price: 4330,
          ratio: '1:2.3',
          action: 'Prendre 40% supplémentaires'
        },
        {
          level: 3,
          price: 4370,
          ratio: '1:3.2',
          action: 'Laisser courir avec trailing stop serré'
        }
      ],
      technicalAnalysis: [
        'RSI à 72.5 - Zone de surachat atteinte',
        'Prix éloigné de l\'EMA20 - Correction probable',
        'Divergence baissière mineure sur indicateurs',
        'Support solide à 4200$ et zone de repli idéale',
        'Volume en baisse sur les dernières hausses'
      ],
      fundamentalAnalysis: [
        'Même contexte fondamental haussier',
        'Attendre meilleur point d\'entrée pour optimiser R:R',
        'Pas d\'urgence, patience récompensée',
        'Contexte général reste favorable à l\'or',
        'Moyen/long terme haussier intact'
      ],
      catalysts: [
        'Guetter les publications économiques pour timing',
        'Surveiller réaction au support 4200$',
        'Opportunité probable dans les 2-5 jours',
        'Ne pas courir après le prix actuel',
        'Meilleur ratio risque/récompense à venir'
      ]
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const timestamp = Date.now();
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const [historyResponse, analysisResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-gold-history?timeframe=Daily&t=${timestamp}`, {
          headers,
          cache: 'no-store'
        }),
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-market?t=${timestamp}`, {
          headers,
          cache: 'no-store'
        })
      ]);

      if (historyResponse.ok) {
        const result = await historyResponse.json();
        if (result.success && result.data && result.data.length > 5) {
          const detectedLevels = detectLevels(result.data);
          setLevels(detectedLevels);
        }
      }

      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json();
        setDynamicData(analysisData);

        if (analysisData.news) {
          setNewsItems(analysisData.news);
        }

        if (analysisData.setups) {
          setSetups(analysisData.setups);
        } else {
          setSetups(defaultSetups);
        }
      } else {
        setSetups(defaultSetups);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSetups(defaultSetups);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    const interval = setInterval(() => {
      fetchAllData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const calculateDistance = (levelPrice: number): string => {
    const distance = ((levelPrice - priceData.price) / priceData.price) * 100;
    return distance.toFixed(2);
  };

  const getStatusText = (levelPrice: number, isResistance: boolean): string => {
    const distance = Math.abs(levelPrice - priceData.price);
    const percentDistance = (distance / priceData.price) * 100;

    if (percentDistance < 0.3) {
      return 'EN TEST';
    }

    if (isResistance) {
      return levelPrice < priceData.price ? 'CASSÉE' : 'Fort';
    } else {
      return levelPrice > priceData.price ? 'CASSÉE' : 'Fort';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TRÈS POSITIF':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'POSITIF':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'ATTENTION':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const currentSetup = setups[selectedSetup] || defaultSetups[selectedSetup];

  const yesterdayPrice = dynamicData?.summary?.yesterdayPrice || priceData.price * 0.99;
  const todayPrice = priceData.price;
  const variation24h = dynamicData?.summary?.variation24h || (todayPrice - yesterdayPrice);
  const variation24hPercent = dynamicData?.summary?.variation24hPercent || ((variation24h / yesterdayPrice) * 100);
  const yesterdaySetupEntry = yesterdayPrice * 1.001;
  const profitFromYesterday = todayPrice - yesterdaySetupEntry;

  const positivePoints = dynamicData?.summary?.positivePoints || [
    'Données de marché en cours de chargement...'
  ];

  const alertPoints = dynamicData?.summary?.alertPoints || [
    'Analyse en cours...'
  ];

  const marketData = {
    open: dynamicData?.marketData?.open || priceData.open || priceData.price * 0.999,
    high: dynamicData?.marketData?.high || priceData.high || priceData.price,
    low: dynamicData?.marketData?.low || priceData.low || priceData.price * 0.998,
    rsi: dynamicData?.marketData?.rsi || 50,
    signal: dynamicData?.marketData?.signal || 'Neutral'
  };

  const technicalLevels: TechnicalLevel[] = [
    { price: 4381, type: 'resistance', description: 'Record Historique - All-Time High (20 Oct 2024)', strength: 'Très Fort' },
    { price: 4356, type: 'resistance', description: 'Plus haut de 2024 - Zone de prise de profit institutionnelle', strength: 'Très Fort' },
    { price: 4313, type: 'resistance', description: 'Extension Fibonacci 127.2% - Objectif court terme', strength: 'Fort' },
    { price: 4200, type: 'support', description: 'Niveau psychologique majeur - Zone de forte demande institutionnelle', strength: 'Très Fort' },
    { price: 4171.41, type: 'support', description: 'Confluence technique : Fibonacci 61.8% + MA200', strength: 'Fort' },
    { price: 4167.30, type: 'support', description: 'Plus haut du jour précédent - Support devenu résistance recassé', strength: 'Fort' },
    { price: 4040.60, type: 'support', description: 'MA50 quotidienne - Support moyen terme', strength: 'Moyen' },
  ];

  const calculateLevelDistance = (levelPrice: number, currentPrice: number) => {
    const distance = levelPrice - currentPrice;
    return {
      distance: distance,
      distancePoints: Math.abs(distance).toFixed(2),
      isAbove: distance > 0
    };
  };

  const getLevelStatus = (level: TechnicalLevel, currentPrice: number) => {
    const { distance, isAbove } = calculateLevelDistance(level.price, currentPrice);
    const threshold = 2;

    if (level.type === 'resistance') {
      if (!isAbove) return { status: 'CASSÉE', color: 'bg-green-100 text-green-800 border-green-300' };
      if (Math.abs(distance) <= threshold) return { status: 'EN TEST', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
      return { status: level.strength, color: 'bg-red-50 text-red-700 border-red-200' };
    } else {
      if (isAbove) return { status: level.strength, color: 'bg-green-50 text-green-700 border-green-200' };
      if (Math.abs(distance) <= threshold) return { status: 'EN TEST', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
      return { status: 'CASSÉ', color: 'bg-red-100 text-red-800 border-red-300' };
    }
  };

  const getSignalColor = (signal: string) => {
    if (signal === 'Strong Buy' || signal === 'Buy') return 'bg-green-500 text-white';
    if (signal === 'Sell' || signal === 'Strong Sell') return 'bg-red-500 text-white';
    return 'bg-gray-500 text-white';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2 animate-pulse">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Marché en Hausse</h2>
              <p className="text-sm text-emerald-50">Analyse en temps réel - Mise à jour toutes les 30s</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {priceData.change >= 0 ? '+' : ''}{priceData.change.toFixed(2)}$
            </div>
            <div className="text-lg">
              {priceData.changePercent >= 0 ? '+' : ''}{priceData.changePercent.toFixed(2)}%
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${getSignalColor(marketData.signal)} shadow-lg`}>
                <TrendingUp className="w-4 h-4" />
                {marketData.signal}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-xs text-emerald-100 mb-1">Ouverture</div>
            <div className="text-lg font-bold">${marketData.open.toFixed(2)}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-xs text-emerald-100 mb-1">Plus Haut</div>
            <div className="text-lg font-bold text-green-200">${marketData.high.toFixed(2)}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-xs text-emerald-100 mb-1">Plus Bas</div>
            <div className="text-lg font-bold text-red-200">${marketData.low.toFixed(2)}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-xs text-emerald-100 mb-1">RSI</div>
            <div className="text-lg font-bold">{marketData.rsi}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-xs text-emerald-100 mb-1">Signal</div>
            <div className="text-sm font-bold text-green-200">{marketData.signal}</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-emerald-100">Tendance sur 24h</h3>
            <BarChart3 className="w-4 h-4 text-emerald-100" />
          </div>
          <div className="h-24 flex items-center justify-center text-emerald-100/60 text-sm">
            Graphique de tendance - Intégration prochaine
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-emerald-50">
          <Clock className="w-4 h-4" />
          <span>Mise à jour: {priceData.lastUpdate.toLocaleTimeString('fr-FR')}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-violet-500 to-blue-600 rounded-full p-2">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Niveaux Techniques</h2>
            <p className="text-sm text-gray-600">Supports et résistances clés</p>
          </div>
        </div>

        <div className="space-y-3">
          {technicalLevels.map((level, index) => {
            const { distance, distancePoints, isAbove } = calculateLevelDistance(level.price, priceData.price);
            const { status, color } = getLevelStatus(level, priceData.price);

            return (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${color}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {level.type === 'resistance' ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                      <span className="font-bold text-lg">${level.price.toFixed(2)}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/50">
                      {status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${isAbove ? 'text-blue-600' : 'text-purple-600'}`}>
                      {isAbove ? '+' : '-'}{distancePoints} pts
                    </div>
                    <div className="text-xs text-gray-600">
                      {isAbove ? 'Au-dessus' : 'En-dessous'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{level.description}</p>
                  </div>
                  <div className="ml-4 px-2 py-1 bg-white/50 rounded text-xs font-semibold whitespace-nowrap">
                    Force: {level.strength}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
              <span className="text-gray-700">Résistance cassée / Support actif</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
              <span className="text-gray-700">En test</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border-2 border-red-200 rounded"></div>
              <span className="text-gray-700">Résistance active</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sélection du Setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(setups).map((setup) => {
            const isActive = selectedSetup === setup.id;
            return (
              <button
                key={setup.id}
                onClick={() => setSelectedSetup(setup.id)}
                className={`text-left transition-all duration-300 transform ${
                  isActive
                    ? 'scale-105 shadow-2xl'
                    : 'scale-100 shadow-lg hover:shadow-xl hover:scale-102'
                }`}
              >
                <div
                  className={`rounded-xl p-6 border-4 ${
                    isActive
                      ? 'bg-gradient-to-br from-emerald-500 to-green-600 border-white'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3
                        className={`text-2xl font-bold mb-2 ${
                          isActive ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {setup.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          isActive ? 'text-emerald-50' : 'text-gray-600'
                        }`}
                      >
                        {setup.description}
                      </p>
                    </div>
                    {isActive && (
                      <CheckCircle className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      isActive
                        ? 'text-white bg-white/20'
                        : 'text-indigo-600 bg-indigo-50'
                    } px-4 py-2 rounded-lg`}
                  >
                    {isActive ? 'Setup Actif' : 'Cliquer pour activer'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Évolution depuis hier</h2>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border-2 border-green-200 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <div className="text-sm text-gray-600 mb-2 font-semibold">Prix Hier</div>
              <div className="text-3xl font-bold text-gray-700">
                ${yesterdayPrice.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 mt-2">Clôture 11/12/2025</div>
            </div>

            <div className="bg-white rounded-xl p-6 border-4 border-green-500 shadow-lg transform scale-105">
              <div className="text-sm text-green-700 mb-2 font-semibold flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                Prix Aujourd'hui
              </div>
              <div className="text-4xl font-bold text-green-600">
                ${todayPrice.toFixed(2)}
              </div>
              <div className="text-xs text-green-700 mt-2">En temps réel</div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <div className="text-sm text-gray-600 mb-2 font-semibold">Variation 24H</div>
              <div className={`text-3xl font-bold ${variation24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {variation24h >= 0 ? '+' : ''}{variation24h.toFixed(2)}$
              </div>
              <div className={`text-lg font-semibold mt-1 ${variation24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {variation24h >= 0 ? '+' : ''}{variation24hPercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl shadow-lg p-6 text-white text-center">
          <div className="flex items-center justify-center gap-3">
            <TrendingUp className="w-6 h-6" />
            <p className="text-xl font-bold">
              Le Setup d'hier (achat à ${yesterdaySetupEntry.toFixed(2)}) aurait donné{' '}
              <span className="text-2xl text-emerald-100">
                +{profitFromYesterday.toFixed(0)} points
              </span>
              {' '}de profit
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Résumé de la Journée</h2>
        <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 rounded-full p-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Points Positifs</h3>
              </div>
              <ul className="space-y-3">
                {positivePoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    </div>
                    <span className="text-gray-700 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 rounded-full p-2">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">À Surveiller</h3>
              </div>
              <ul className="space-y-3">
                {alertPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-amber-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    </div>
                    <span className="text-gray-700 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Situation Actuelle</h2>
        <p className="text-blue-50 leading-relaxed text-lg">
          {currentSetup.situation}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-4 border-indigo-500">
        <div className="flex items-start gap-3 mb-2">
          <Target className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Action Recommandée
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentSetup.recommendation}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
            <h3 className="text-lg font-bold">ENTRÉE</h3>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ${currentSetup.entry.price}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {currentSetup.entry.condition}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-red-200">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 text-white">
            <h3 className="text-lg font-bold">STOP LOSS</h3>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-red-600 mb-2">
              ${currentSetup.stopLoss.price}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {currentSetup.stopLoss.reason}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-green-200">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
            <h3 className="text-lg font-bold">OBJECTIFS</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {currentSetup.takeProfits.map((tp) => (
                <div key={tp.level} className="border-l-4 border-green-500 pl-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-700">
                      TP{tp.level}
                    </span>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                      {tp.ratio}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-green-600 mb-1">
                    ${tp.price}
                  </div>
                  <p className="text-xs text-gray-600">{tp.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyse Complète</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4 text-white">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                <h3 className="text-lg font-bold">Analyse Technique</h3>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {currentSetup.technicalAnalysis.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 text-white">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                <h3 className="text-lg font-bold">Analyse Fondamentale</h3>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {currentSetup.fundamentalAnalysis.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <h3 className="text-lg font-bold">Catalyseurs</h3>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {currentSetup.catalysts.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Actualités du Jour</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-indigo-200 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm text-gray-500 font-medium">{news.time}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getTypeColor(news.type)}`}>
                  {news.type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{news.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-600">{news.impact}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{news.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Niveaux Clés</h2>
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des niveaux...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-red-50 border-b-2 border-red-200 p-4">
                <h3 className="text-lg font-bold text-red-900">🚫 Résistances</h3>
                <p className="text-sm text-red-700 mt-1">Niveaux de vente potentiels</p>
              </div>
              <div className="p-6">
                {levels.resistances.length > 0 ? (
                  <div className="space-y-4">
                    {levels.resistances.map((resistance, index) => {
                      const status = getStatusText(resistance.price, true);
                      const distance = calculateDistance(resistance.price);

                      return (
                        <div
                          key={index}
                          className="border-l-4 border-red-500 pl-4 py-3 bg-red-50/50 rounded-r-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-gray-900">R{index + 1}</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                              status === 'CASSÉE'
                                ? 'bg-gray-200 text-gray-700'
                                : status === 'EN TEST'
                                ? 'bg-orange-200 text-orange-800'
                                : 'bg-red-200 text-red-800'
                            }`}>
                              {status}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-red-600">
                              ${resistance.price.toFixed(2)}
                            </span>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                Distance: {distance}%
                              </div>
                              <div className="text-xs text-gray-500">
                                Force: {resistance.strength}/10
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Aucune résistance détectée</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-green-50 border-b-2 border-green-200 p-4">
                <h3 className="text-lg font-bold text-green-900">🎯 Supports</h3>
                <p className="text-sm text-green-700 mt-1">Niveaux d'achat potentiels</p>
              </div>
              <div className="p-6">
                {levels.supports.length > 0 ? (
                  <div className="space-y-4">
                    {levels.supports.map((support, index) => {
                      const status = getStatusText(support.price, false);
                      const distance = calculateDistance(support.price);

                      return (
                        <div
                          key={index}
                          className="border-l-4 border-green-500 pl-4 py-3 bg-green-50/50 rounded-r-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-gray-900">S{index + 1}</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                              status === 'CASSÉE'
                                ? 'bg-gray-200 text-gray-700'
                                : status === 'EN TEST'
                                ? 'bg-orange-200 text-orange-800'
                                : 'bg-green-200 text-green-800'
                            }`}>
                              {status}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-green-600">
                              ${support.price.toFixed(2)}
                            </span>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                Distance: {distance}%
                              </div>
                              <div className="text-xs text-gray-500">
                                Force: {support.strength}/10
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Aucun support détecté</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
