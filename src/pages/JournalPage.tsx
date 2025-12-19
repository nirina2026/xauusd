import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';
import TradeCard from '../components/TradeCard';
import { saveTrade, getTrades, updateTrade, deleteTrade, getTradeStats } from '../services/journal';

export default function JournalPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'OUVERT' | 'FERMÉ'>('ALL');
  const [stats, setStats] = useState<any>({});

  const [formData, setFormData] = useState({
    type: 'ACHAT' as 'ACHAT' | 'VENTE',
    entry: 4286,
    stopLoss: 4250,
    takeProfit: 4350,
    lots: 0.1,
    notes: ''
  });

  const loadTrades = () => {
    const allTrades = getTrades();
    setTrades(allTrades);
    setStats(getTradeStats());
  };

  useEffect(() => {
    loadTrades();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTrade = {
      ...formData,
      status: 'OUVERT' as const
    };

    saveTrade(newTrade);
    loadTrades();

    setFormData({
      type: 'ACHAT',
      entry: 4286,
      stopLoss: 4250,
      takeProfit: 4350,
      lots: 0.1,
      notes: ''
    });

    alert('Trade ajouté avec succès !');
  };

  const handleUpdate = (id: number, updates: any) => {
    if (updates.status === 'FERMÉ') {
      const trade = trades.find(t => t.id === id);
      if (trade) {
        const resultInput = prompt('Entrez le résultat du trade (ex: 150 ou -50):');
        if (resultInput !== null) {
          const result = parseFloat(resultInput);
          updateTrade(id, { ...updates, result });
          loadTrades();
        }
      }
    } else {
      updateTrade(id, updates);
      loadTrades();
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce trade ?')) {
      deleteTrade(id);
      loadTrades();
    }
  };

  const filteredTrades = trades.filter(trade => {
    if (filter === 'ALL') return true;
    return trade.status === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Journal de Trading
        </h1>
        <p className="text-gray-600">
          Enregistrez et suivez toutes vos positions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Total Trades</p>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Fermés</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Taux de Réussite</p>
            <Award className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-indigo-600">{stats.winRate || 0}%</p>
          <p className="text-xs text-gray-500 mt-1">{stats.wins || 0} wins / {stats.losses || 0} losses</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Profit Total</p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className={`text-3xl font-bold ${
            parseFloat(stats.totalProfit || '0') >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${stats.totalProfit || '0.00'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Cumulé</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Win Moyen</p>
            <TrendingDown className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-green-600">${stats.avgWin || '0.00'}</p>
          <p className="text-xs text-gray-500 mt-1">Loss: ${stats.avgLoss || '0.00'}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          ➕ Enregistrer un Nouveau Trade
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type de Trade
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'ACHAT' | 'VENTE' })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              >
                <option value="ACHAT">ACHAT</option>
                <option value="VENTE">VENTE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prix d'Entrée ($)
              </label>
              <input
                type="number"
                value={formData.entry}
                onChange={(e) => setFormData({ ...formData, entry: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stop Loss ($)
              </label>
              <input
                type="number"
                value={formData.stopLoss}
                onChange={(e) => setFormData({ ...formData, stopLoss: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Take Profit ($)
              </label>
              <input
                type="number"
                value={formData.takeProfit}
                onChange={(e) => setFormData({ ...formData, takeProfit: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lots
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.lots}
                onChange={(e) => setFormData({ ...formData, lots: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                rows={3}
                placeholder="Notes sur le trade..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-6 py-4 rounded-lg hover:bg-indigo-700 font-bold text-lg transition"
          >
            ✓ Enregistrer le Trade
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Mes Trades ({filteredTrades.length})
          </h2>

          <div className="flex gap-2">
            {(['ALL', 'OUVERT', 'FERMÉ'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'ALL' ? 'Tous' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {filteredTrades.length > 0 ? (
          <div className="space-y-6">
            {filteredTrades.sort((a, b) => b.id - a.id).map((trade) => (
              <TradeCard
                key={trade.id}
                trade={trade}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Aucun trade enregistré
            </h3>
            <p className="text-gray-600">
              Commencez par enregistrer votre premier trade ci-dessus.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
