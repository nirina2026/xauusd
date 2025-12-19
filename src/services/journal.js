const STORAGE_KEY = 'xau_trading_journal';

export function saveTrade(trade) {
  const trades = getTrades();
  const newTrade = {
    ...trade,
    id: Date.now(),
    dateCreated: new Date().toISOString()
  };
  trades.push(newTrade);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  return newTrade;
}

export function getTrades() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function updateTrade(id, updates) {
  const trades = getTrades();
  const index = trades.findIndex(t => t.id === id);
  if (index !== -1) {
    trades[index] = { ...trades[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
    return trades[index];
  }
  return null;
}

export function deleteTrade(id) {
  const trades = getTrades().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
}

export function getTradeStats() {
  const trades = getTrades().filter(t => t.status === 'FERMÉ');
  const wins = trades.filter(t => t.result > 0);
  const losses = trades.filter(t => t.result <= 0);

  return {
    total: trades.length,
    wins: wins.length,
    losses: losses.length,
    winRate: trades.length > 0 ? (wins.length / trades.length * 100).toFixed(1) : 0,
    totalProfit: trades.reduce((sum, t) => sum + (t.result || 0), 0).toFixed(2),
    avgWin: wins.length > 0 ? (wins.reduce((sum, t) => sum + t.result, 0) / wins.length).toFixed(2) : 0,
    avgLoss: losses.length > 0 ? (losses.reduce((sum, t) => sum + t.result, 0) / losses.length).toFixed(2) : 0
  };
}
