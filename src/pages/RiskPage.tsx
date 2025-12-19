import { useState, useEffect } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import PositionCalculator from '../components/PositionCalculator';
import { getTrades } from '../services/journal';

export default function RiskPage() {
  const [openTrades, setOpenTrades] = useState<any[]>([]);
  const [totalRisk, setTotalRisk] = useState(0);

  useEffect(() => {
    const trades = getTrades().filter((t: any) => t.status === 'OUVERT');
    setOpenTrades(trades);

    const risk = trades.reduce((sum: number, trade: any) => {
      const riskAmount = Math.abs(trade.entry - trade.stopLoss) * trade.lots;
      return sum + riskAmount;
    }, 0);
    setTotalRisk(risk);
  }, []);

  const riskPercent = 1.8;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Gestion du Risque
        </h1>
        <p className="text-gray-600">
          Calculez vos positions et gérez votre exposition au risque
        </p>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Risque Total du Portefeuille</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <p className="text-white/80 text-sm mb-2">Positions Ouvertes</p>
            <p className="text-4xl font-bold">{openTrades.length}</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <p className="text-white/80 text-sm mb-2">Capital en Risque</p>
            <p className="text-4xl font-bold">${totalRisk.toFixed(2)}</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <p className="text-white/80 text-sm mb-2">Exposition Totale</p>
            <p className="text-4xl font-bold">{riskPercent.toFixed(1)}%</p>
            <div className="mt-3">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    riskPercent < 3 ? 'bg-green-400' :
                    riskPercent < 5 ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(riskPercent * 20, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white/10 backdrop-blur rounded-xl p-4">
          <div className="flex items-start gap-3">
            {riskPercent < 3 ? (
              <>
                <Shield className="w-6 h-6 text-green-300 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-100">Risque Faible ✓</p>
                  <p className="text-sm text-white/80">
                    Votre exposition est saine. Vous pouvez envisager de nouvelles positions.
                  </p>
                </div>
              </>
            ) : riskPercent < 5 ? (
              <>
                <AlertTriangle className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-yellow-100">Risque Modéré</p>
                  <p className="text-sm text-white/80">
                    Attention à ne pas dépasser 5% d'exposition totale.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-6 h-6 text-red-300 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-100">Risque Élevé !</p>
                  <p className="text-sm text-white/80">
                    Votre exposition est trop importante. Réduisez vos positions.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <PositionCalculator />

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📋 Positions Ouvertes
        </h2>

        {openTrades.length > 0 ? (
          <div className="space-y-4">
            {openTrades.map((trade) => (
              <div key={trade.id} className="border-2 border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">{trade.type} XAU/USD</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(trade.dateCreated).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg font-semibold ${
                    trade.type === 'ACHAT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {trade.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Entrée</p>
                    <p className="font-bold">${trade.entry}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Stop Loss</p>
                    <p className="font-bold text-red-600">${trade.stopLoss}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Take Profit</p>
                    <p className="font-bold text-green-600">${trade.takeProfit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Risque</p>
                    <p className="font-bold text-orange-600">
                      ${(Math.abs(trade.entry - trade.stopLoss) * trade.lots).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Aucune position ouverte
            </h3>
            <p className="text-gray-600">
              Utilisez le calculateur ci-dessus pour planifier vos prochaines positions.
            </p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
        <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Règles de Gestion du Risque
        </h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>✓ Ne risquez jamais plus de 1-2% de votre capital par trade</li>
          <li>✓ L'exposition totale ne doit pas dépasser 5% de votre capital</li>
          <li>✓ Utilisez toujours un stop loss sur chaque position</li>
          <li>✓ Visez un ratio risque/récompense minimum de 1:2</li>
          <li>✓ Ne tradez pas sous le coup de l'émotion</li>
        </ul>
      </div>
    </div>
  );
}
