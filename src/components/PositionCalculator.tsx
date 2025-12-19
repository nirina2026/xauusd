import { useState, useEffect } from 'react';

interface PrefilledData {
  entry?: number;
  stopLoss?: number;
}

interface PositionCalculatorProps {
  prefilledData?: PrefilledData | null;
}

export default function PositionCalculator({ prefilledData = null }: PositionCalculatorProps) {
  const [capital, setCapital] = useState(1000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [entryPrice, setEntryPrice] = useState(4286);
  const [stopLoss, setStopLoss] = useState(4250);

  useEffect(() => {
    if (prefilledData) {
      if (prefilledData.entry) setEntryPrice(prefilledData.entry);
      if (prefilledData.stopLoss) setStopLoss(prefilledData.stopLoss);
    }
  }, [prefilledData]);

  const riskAmount = capital * (riskPercent / 100);
  const stopDistance = Math.abs(entryPrice - stopLoss);
  const stopDistancePercent = (stopDistance / entryPrice * 100).toFixed(2);
  const positionSize = riskAmount / stopDistance;
  const lotSize = (positionSize / 100).toFixed(2);

  const tp1 = entryPrice + 40;
  const tp2 = entryPrice + 80;
  const profit1 = 40 * (positionSize / entryPrice);
  const profit2 = 80 * (positionSize / entryPrice);
  const ratio1 = (profit1 / riskAmount).toFixed(2);
  const ratio2 = (profit2 / riskAmount).toFixed(2);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        💰 Calculateur de Position
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Capital Total ($)
          </label>
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Risque par Trade (%)
          </label>
          <input
            type="number"
            value={riskPercent}
            onChange={(e) => setRiskPercent(Number(e.target.value))}
            min={0.5}
            max={5}
            step={0.5}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">✅ Recommandé : 1-2%</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Prix d'Entrée ($)
          </label>
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(Number(e.target.value))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Stop Loss ($)
          </label>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(Number(e.target.value))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Résultats du Calcul</h3>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Montant à Risquer</p>
            <p className="text-2xl font-bold text-red-600">${riskAmount.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Distance Stop Loss</p>
            <p className="text-2xl font-bold text-gray-800">${stopDistance.toFixed(2)}</p>
            <p className="text-xs text-gray-500">({stopDistancePercent}%)</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-indigo-300 border-2">
            <p className="text-sm text-gray-600 mb-1">Taille Position</p>
            <p className="text-2xl font-bold text-indigo-600">{lotSize} lots</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border-2 border-green-300">
          <h4 className="font-bold text-gray-800 mb-3">🎯 Profits Potentiels</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">TP1 (${tp1.toFixed(2)}) :</span>
              <div className="text-right">
                <span className="font-bold text-green-600">${profit1.toFixed(2)}</span>
                <span className="text-xs text-gray-500 ml-2">(R:R 1:{ratio1})</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">TP2 (${tp2.toFixed(2)}) :</span>
              <div className="text-right">
                <span className="font-bold text-green-600">${profit2.toFixed(2)}</span>
                <span className="text-xs text-gray-500 ml-2">(R:R 1:{ratio2})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {riskPercent > 2 && (
        <div className="mt-6 bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <p className="text-red-800 font-semibold">
            ⚠️ Attention : Vous risquez plus de 2% de votre capital. C'est très risqué !
          </p>
        </div>
      )}
    </div>
  );
}
