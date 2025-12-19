import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { usePrice } from '../contexts/PriceContext';

export default function PriceWidget() {
  const { priceData, isRefreshing, error, refreshPrice } = usePrice();
  const { price, change, changePercent, lastUpdate, open, high, low, volume } = priceData;

  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm opacity-90 mb-1">XAU/USD</p>
            <h2 className="text-4xl font-bold mb-2">
              ${price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-2">
              {isPositive ? (
                <ArrowUp className="w-5 h-5 text-green-300" />
              ) : (
                <ArrowDown className="w-5 h-5 text-red-300" />
              )}
              <span
                className={`text-lg font-semibold ${
                  isPositive ? 'text-green-300' : 'text-red-300'
                }`}
              >
                {isPositive ? '+' : ''}
                {change.toFixed(2)} ({isPositive ? '+' : ''}
                {changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs opacity-75">Dernière mise à jour</p>
            <p className="text-sm font-mono">
              {lastUpdate.toLocaleTimeString('fr-FR')}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Plus Haut du Jour</p>
            <p className="text-lg font-bold text-gray-900">
              ${high > 0 ? high.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : 'N/A'}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Plus Bas du Jour</p>
            <p className="text-lg font-bold text-gray-900">
              ${low > 0 ? low.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : 'N/A'}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Ouverture</p>
            <p className="text-lg font-bold text-gray-900">
              ${open > 0 ? open.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : 'N/A'}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Volume</p>
            <p className="text-lg font-bold text-green-600">{volume}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Tendance Intrajournalière
          </h3>
          <div className="h-32 bg-gray-50 rounded-lg p-4 relative">
            <svg className="w-full h-full" viewBox="0 0 300 100">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={isPositive ? '#10B981' : '#EF4444'} />
                  <stop offset="100%" stopColor={isPositive ? '#059669' : '#DC2626'} />
                </linearGradient>
              </defs>

              <polyline
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                points="0,80 30,75 60,70 90,65 120,60 150,55 180,58 210,50 240,45 270,40 300,35"
              />

              <line
                x1="0"
                y1="95"
                x2="300"
                y2="95"
                stroke="#E5E7EB"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="95"
                stroke="#E5E7EB"
                strokeWidth="1"
              />

              <text x="10" y="10" fill="#6B7280" fontSize="8">
                $4,290
              </text>
              <text x="10" y="90" fill="#6B7280" fontSize="8">
                $4,220
              </text>
              <text x="250" y="90" fill="#6B7280" fontSize="8">
                Maintenant
              </text>
            </svg>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Graphique simulé - Données en temps réel à venir
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-semibold text-amber-900 mb-2">Configuration requise</p>
            <p className="text-sm text-amber-800 mb-3">{error}</p>
            <div className="text-xs text-amber-700 space-y-1">
              <p className="font-medium">Pour obtenir de vraies données en temps réel :</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Créez un compte gratuit sur <a href="https://twelvedata.com/pricing" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-900">Twelve Data</a></li>
                <li>Copiez votre clé API gratuite</li>
                <li>Ajoutez-la dans les secrets Supabase (TWELVE_DATA_API_KEY)</li>
              </ol>
            </div>
          </div>
        )}

        <button
          onClick={refreshPrice}
          disabled={isRefreshing}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3
            bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg
            transition-all duration-200 shadow-md hover:shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser les Données
        </button>
      </div>
    </div>
  );
}
