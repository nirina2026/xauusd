interface TradeCardProps {
  trade: {
    id: number;
    type: 'ACHAT' | 'VENTE';
    status: 'OUVERT' | 'FERMÉ' | 'EN ATTENTE';
    dateCreated: string;
    entry: number;
    stopLoss: number;
    takeProfit: number;
    lots: number;
    result?: number;
    notes?: string;
  };
  onUpdate: (id: number, updates: any) => void;
  onDelete: (id: number) => void;
}

export default function TradeCard({ trade, onUpdate, onDelete }: TradeCardProps) {
  return (
    <div className={`rounded-xl p-6 border-2 ${
      trade.type === 'ACHAT' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
    } shadow-lg`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {trade.type} XAU/USD
          </h3>
          <p className="text-sm text-gray-600">{new Date(trade.dateCreated).toLocaleDateString('fr-FR')}</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-lg font-semibold ${
            trade.status === 'OUVERT' ? 'bg-blue-500 text-white' :
            trade.status === 'FERMÉ' ? 'bg-gray-500 text-white' :
            'bg-yellow-500 text-white'
          }`}>
            {trade.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded p-2 border">
          <p className="text-xs text-gray-600">Entrée</p>
          <p className="font-bold text-sm">${trade.entry}</p>
        </div>
        <div className="bg-white rounded p-2 border">
          <p className="text-xs text-gray-600">Stop Loss</p>
          <p className="font-bold text-sm text-red-600">${trade.stopLoss}</p>
        </div>
        <div className="bg-white rounded p-2 border">
          <p className="text-xs text-gray-600">Take Profit</p>
          <p className="font-bold text-sm text-green-600">${trade.takeProfit}</p>
        </div>
        <div className="bg-white rounded p-2 border">
          <p className="text-xs text-gray-600">Lots</p>
          <p className="font-bold text-sm">{trade.lots}</p>
        </div>
      </div>

      {trade.status === 'FERMÉ' && trade.result !== undefined && (
        <div className={`rounded-lg p-3 mb-3 ${
          trade.result > 0 ? 'bg-green-100 border-2 border-green-400' : 'bg-red-100 border-2 border-red-400'
        }`}>
          <p className="text-sm font-semibold">
            Résultat : <span className={trade.result > 0 ? 'text-green-700' : 'text-red-700'}>
              ${trade.result > 0 ? '+' : ''}{trade.result}
            </span>
          </p>
        </div>
      )}

      {trade.notes && (
        <div className="bg-white rounded-lg p-3 mb-3 border">
          <p className="text-sm text-gray-700">{trade.notes}</p>
        </div>
      )}

      <div className="flex gap-2">
        {trade.status === 'OUVERT' && (
          <button
            onClick={() => onUpdate(trade.id, { status: 'FERMÉ' })}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold"
          >
            ✓ Clôturer
          </button>
        )}
        <button
          onClick={() => onDelete(trade.id)}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold"
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  );
}
