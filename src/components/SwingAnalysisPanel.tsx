import { useState, useEffect } from 'react';
import {
  detectSwingDemandZones,
  detectSwingSupplyZones,
  detectSwingSupports,
  detectSwingResistances,
} from '../services/swingAnalysis';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Zone {
  type: string;
  high: number;
  low: number;
  midPoint: number;
  timeStart: string;
  timeEnd: string;
  strength: string;
  tested: number;
  status: string;
  quality: string;
  swingTarget: number;
}

interface Level {
  price: number;
  touches: number;
  strength: string;
  lastTouch: string;
  status: string;
  type: string;
}

interface Analysis {
  demandZones: Zone[];
  supplyZones: Zone[];
  supports: Level[];
  resistances: Level[];
  currentPrice: number;
}

interface Props {
  candleData: CandleData[];
}

export default function SwingAnalysisPanel({ candleData }: Props) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    if (!candleData || candleData.length < 30) return;

    const demandZones = detectSwingDemandZones(candleData);
    const supplyZones = detectSwingSupplyZones(candleData);
    const supports = detectSwingSupports(candleData);
    const resistances = detectSwingResistances(candleData);
    const currentPrice = candleData[candleData.length - 1].close;

    setAnalysis({
      demandZones,
      supplyZones,
      supports,
      resistances,
      currentPrice,
    });
  }, [candleData]);

  if (!analysis) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Chargement de l'analyse Swing...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-xl p-6 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          Supply & Demand Swing Trading (4H/Daily)
        </h2>

        <div className="bg-white rounded-lg p-5 mb-4 shadow-md">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
            Zones de DEMANDE Swing (Achat institutionnel) - {analysis.demandZones.length}
          </h3>
          {analysis.demandZones.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune zone de demande swing active détectée</p>
          ) : (
            <div className="space-y-3">
              {analysis.demandZones.map((zone, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-green-50 border-2 border-green-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-green-800 text-lg">
                        ${zone.low.toFixed(2)} - ${zone.high.toFixed(2)}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        Force: {zone.strength} | Qualité: {zone.quality} | Tests: {zone.tested}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      zone.quality === 'HAUTE'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-200 text-green-800'
                    }`}>
                      {zone.quality}
                    </span>
                  </div>

                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">Distance: </span>
                    <span className={`font-semibold ${
                      Math.abs(analysis.currentPrice - zone.low) < 30
                        ? 'text-orange-600'
                        : 'text-gray-800'
                    }`}>
                      ${Math.abs(analysis.currentPrice - zone.low).toFixed(2)}
                      {Math.abs(analysis.currentPrice - zone.low) < 30 && ' PROCHE'}
                    </span>
                  </div>

                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">Target Fibonacci: </span>
                    <span className="font-semibold text-green-700">
                      ${zone.swingTarget.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-5 shadow-md">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
            Zones d'OFFRE Swing (Vente institutionnelle) - {analysis.supplyZones.length}
          </h3>
          {analysis.supplyZones.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune zone d'offre swing active détectée</p>
          ) : (
            <div className="space-y-3">
              {analysis.supplyZones.map((zone, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-red-50 border-2 border-red-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-red-800 text-lg">
                        ${zone.low.toFixed(2)} - ${zone.high.toFixed(2)}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        Force: {zone.strength} | Qualité: {zone.quality} | Tests: {zone.tested}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      zone.quality === 'HAUTE'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {zone.quality}
                    </span>
                  </div>

                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">Distance: </span>
                    <span className={`font-semibold ${
                      Math.abs(analysis.currentPrice - zone.high) < 30
                        ? 'text-orange-600'
                        : 'text-gray-800'
                    }`}>
                      ${Math.abs(analysis.currentPrice - zone.high).toFixed(2)}
                      {Math.abs(analysis.currentPrice - zone.high) < 30 && ' PROCHE'}
                    </span>
                  </div>

                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">Target Fibonacci: </span>
                    <span className="font-semibold text-red-700">
                      ${zone.swingTarget.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-xl p-6 border-2 border-purple-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          Support & Résistance Swing
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-5 shadow-md">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              Supports Swing ({analysis.supports.length})
            </h3>
            {analysis.supports.length === 0 ? (
              <p className="text-sm text-gray-500">Aucun support swing actif</p>
            ) : (
              <div className="space-y-2">
                {analysis.supports.map((support, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded bg-blue-50 border-l-4 border-blue-500"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-800">
                        ${support.price.toFixed(2)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        support.strength === 'SWING MAJEUR'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-400 text-white'
                      }`}>
                        {support.strength}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {support.touches} touches majeures
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-5 shadow-md">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              Résistances Swing ({analysis.resistances.length})
            </h3>
            {analysis.resistances.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune résistance swing active</p>
            ) : (
              <div className="space-y-2">
                {analysis.resistances.map((resistance, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded bg-red-50 border-l-4 border-red-500"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-red-800">
                        ${resistance.price.toFixed(2)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        resistance.strength === 'SWING MAJEUR'
                          ? 'bg-red-600 text-white'
                          : 'bg-red-400 text-white'
                      }`}>
                        {resistance.strength}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {resistance.touches} touches majeures
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
        <h3 className="font-bold text-gray-800 mb-3 text-lg">
          Guide Swing Trading
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-bold text-green-700 mb-2">Zone de DEMANDE Swing</h4>
            <p className="text-gray-700">
              Zone d'accumulation institutionnelle sur timeframes élevés (4H/Daily).
              Position multi-jours avec target Fibonacci et stop large.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-bold text-red-700 mb-2">Zone d'OFFRE Swing</h4>
            <p className="text-gray-700">
              Zone de distribution institutionnelle. Les institutions vendent progressivement.
              Attendre confirmation avant d'entrer en vente.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-bold text-blue-700 mb-2">SUPPORT Swing</h4>
            <p className="text-gray-700">
              Niveau majeur testé plusieurs fois sur timeframes élevés.
              Confluence avec zone demand = setup haute probabilité.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-bold text-orange-700 mb-2">RÉSISTANCE Swing</h4>
            <p className="text-gray-700">
              Niveau majeur de rejet. Confluence avec zone supply = setup haute probabilité.
              Positions à tenir 3-7 jours minimum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
