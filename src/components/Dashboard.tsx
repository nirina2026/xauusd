import PriceWidget from './PriceWidget';
import Chart from './Chart';
import { TrendingUp, AlertCircle, Target, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Dashboard de Trading
        </h1>
        <p className="text-gray-600">
          Suivez le cours de l'or en temps réel et gérez vos positions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceWidget />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Signal Actuel</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tendance</span>
                <span className="font-semibold text-green-600">Haussière</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Force</span>
                <span className="font-semibold text-green-600">Forte</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Volatilité</span>
                <span className="font-semibold text-red-600">Élevée</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Niveaux Clés</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">Résistance</p>
                <p className="font-bold text-red-600">$4,313.00</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Support</p>
                <p className="font-bold text-green-600">$4,200.00</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Alerte Active
                </p>
                <p className="text-xs text-amber-700">
                  Le prix approche d'un niveau de résistance majeur
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Chart />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Positions Ouvertes</p>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <p className="text-xs text-green-600 mt-1">+1 cette semaine</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">P&L Journalier</p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">+$847</p>
          <p className="text-xs text-gray-500 mt-1">+2.3% du capital</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Taux de Réussite</p>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">68%</p>
          <p className="text-xs text-gray-500 mt-1">Sur 30 jours</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Risque Actuel</p>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">Moyen</p>
          <p className="text-xs text-gray-500 mt-1">1.8% exposition</p>
        </div>
      </div>
    </div>
  );
}
