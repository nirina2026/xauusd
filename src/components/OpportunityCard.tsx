interface OpportunityCardProps {
  opportunity: {
    id: string;
    type: 'ACHAT' | 'VENTE' | 'LONG' | 'SHORT';
    title?: string;
    status?: string;
    confidence: number;
    entry: {
      zone?: string;
      ideal: string;
      range?: string;
    };
    stopLoss: string;
    takeProfits: string[];
    ratio?: string;
    riskReward?: string;
    reason: string;
    duration?: string;
    timeframe?: string;
    signals?: Array<{ type: string; description: string }>;
    smcConcepts?: any;
  };
  onAddToJournal: (opportunity: OpportunityCardProps['opportunity']) => void;
}

export default function OpportunityCard({ opportunity, onAddToJournal }: OpportunityCardProps) {
  const isLong = opportunity.type === 'ACHAT' || opportunity.type === 'LONG';
  const displayType = opportunity.type === 'LONG' ? 'ACHAT' : opportunity.type === 'SHORT' ? 'VENTE' : opportunity.type;

  return (
    <div className={`rounded-xl p-6 border-l-4 shadow-lg ${
      isLong
        ? 'border-green-500 bg-green-50'
        : 'border-red-500 bg-red-50'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {opportunity.title || `${displayType} - ${isLong ? 'Support Majeur' : 'Résistance'}`}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{opportunity.reason}</p>
        </div>
        <span className={`px-4 py-2 rounded-lg font-bold text-white ${
          isLong ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {displayType}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-gray-600 mb-1">Entrée Idéale</p>
          <p className="font-bold text-blue-600">${opportunity.entry.ideal}</p>
          <p className="text-xs text-gray-500">{opportunity.entry.range || opportunity.entry.zone || ''}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-red-200">
          <p className="text-xs text-gray-600 mb-1">Stop Loss</p>
          <p className="font-bold text-red-600">${opportunity.stopLoss}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-green-200">
          <p className="text-xs text-gray-600 mb-1">TP1 / TP2 / TP3</p>
          <p className="font-bold text-green-600 text-sm">
            ${opportunity.takeProfits[0]}
          </p>
          {opportunity.takeProfits.length > 1 && (
            <p className="text-xs text-gray-500">
              ${opportunity.takeProfits[1]} {opportunity.takeProfits[2] ? `/ $${opportunity.takeProfits[2]}` : ''}
            </p>
          )}
        </div>
      </div>

      {opportunity.signals && opportunity.signals.length > 0 && (
        <div className="mb-4 bg-white rounded-lg p-4 border border-purple-200">
          <h4 className="font-bold text-sm text-purple-700 mb-3">Signaux SMC Détectés</h4>
          <div className="space-y-2">
            {opportunity.signals.map((signal, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-purple-600 font-bold text-xs mt-0.5">▸</span>
                <div>
                  <span className="font-semibold text-xs text-purple-800">{signal.type}:</span>
                  <span className="text-xs text-gray-700 ml-1">{signal.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {opportunity.smcConcepts && (
        <div className="mb-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 border border-purple-300">
          <h4 className="font-bold text-sm text-purple-800 mb-3">Analyse Institutionnelle (Footprint)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-semibold text-purple-700">Order Block:</span>
              <span className="text-gray-800 ml-1">{opportunity.smcConcepts.orderBlock?.zone}</span>
              <span className="ml-2 text-purple-600">({opportunity.smcConcepts.orderBlock?.strength})</span>
            </div>
            <div>
              <span className="font-semibold text-purple-700">FVG:</span>
              <span className="text-gray-800 ml-1">{opportunity.smcConcepts.fvg?.lower} - {opportunity.smcConcepts.fvg?.upper}</span>
              <span className="ml-2 text-orange-600">({opportunity.smcConcepts.fvg?.status})</span>
            </div>
            <div>
              <span className="font-semibold text-purple-700">Structure:</span>
              <span className="text-gray-800 ml-1">{opportunity.smcConcepts.marketStructure}</span>
            </div>
            <div>
              <span className="font-semibold text-purple-700">Flow Institutionnel:</span>
              <span className="text-green-700 font-bold ml-1">{opportunity.smcConcepts.institutionalFlow}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <span>🎯 <strong>{opportunity.confidence}%</strong></span>
          <span>📊 <strong>{opportunity.riskReward || opportunity.ratio || 'N/A'}</strong></span>
          {opportunity.timeframe && <span>⏱️ <strong>{opportunity.timeframe}</strong></span>}
          {opportunity.duration && <span>⏱️ <strong>{opportunity.duration}</strong></span>}
          {opportunity.status && (
            <span className={`px-2 py-1 rounded ${
              opportunity.status === 'ACTIF'
                ? 'bg-green-200 text-green-800'
                : 'bg-orange-200 text-orange-800'
            }`}>
              {opportunity.status}
            </span>
          )}
        </div>
        <button
          onClick={() => onAddToJournal(opportunity)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 font-semibold transition whitespace-nowrap"
        >
          ➕ Ajouter au Journal
        </button>
      </div>
    </div>
  );
}
