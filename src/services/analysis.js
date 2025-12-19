export function detectLevels(priceData) {
  const supports = [];
  const resistances = [];

  for (let i = 2; i < priceData.length - 2; i++) {
    const current = priceData[i];
    const prev1 = priceData[i-1];
    const prev2 = priceData[i-2];
    const next1 = priceData[i+1];
    const next2 = priceData[i+2];

    if (current.low < prev1.low && current.low < prev2.low &&
        current.low < next1.low && current.low < next2.low) {
      supports.push({
        price: current.low,
        strength: 'Moyen',
        date: current.time
      });
    }

    if (current.high > prev1.high && current.high > prev2.high &&
        current.high > next1.high && current.high > next2.high) {
      resistances.push({
        price: current.high,
        strength: 'Moyen',
        date: current.time
      });
    }
  }

  const currentPrice = priceData[priceData.length - 1].close;

  return {
    supports: supports
      .sort((a, b) => Math.abs(a.price - currentPrice) - Math.abs(b.price - currentPrice))
      .slice(0, 3),
    resistances: resistances
      .sort((a, b) => Math.abs(a.price - currentPrice) - Math.abs(b.price - currentPrice))
      .slice(0, 3)
  };
}

export function calculateRSI(priceData, period = 14) {
  if (priceData.length < period + 1) {
    return 50;
  }

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = priceData[priceData.length - i].close - priceData[priceData.length - i - 1].close;
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return parseFloat(rsi.toFixed(2));
}

export function detectOpportunities(priceData, levels, rsi) {
  const opportunities = [];
  const currentPrice = priceData[priceData.length - 1].close;

  const nearSupport = levels.supports.find(s =>
    Math.abs(currentPrice - s.price) / currentPrice < 0.005
  );

  if (nearSupport && rsi < 45) {
    const stopLoss = nearSupport.price * 0.995;
    const tp1 = currentPrice * 1.015;
    const tp2 = currentPrice * 1.025;
    const tp3 = currentPrice * 1.035;

    opportunities.push({
      id: 'opp_buy_' + Date.now(),
      type: 'ACHAT',
      status: 'ACTIF',
      confidence: 75,
      entry: {
        zone: `${(nearSupport.price * 0.998).toFixed(2)} - ${(nearSupport.price * 1.002).toFixed(2)}`,
        ideal: nearSupport.price.toFixed(2)
      },
      stopLoss: stopLoss.toFixed(2),
      takeProfits: [tp1.toFixed(2), tp2.toFixed(2), tp3.toFixed(2)],
      ratio: '1:2.5',
      reason: `Support majeur à $${nearSupport.price.toFixed(2)} + RSI survendu (${rsi})`,
      duration: '3-7 jours'
    });
  }

  const nearResistance = levels.resistances.find(r =>
    Math.abs(currentPrice - r.price) / currentPrice < 0.005
  );

  if (nearResistance && rsi > 55) {
    const stopLoss = nearResistance.price * 1.005;
    const tp1 = currentPrice * 0.985;
    const tp2 = currentPrice * 0.975;

    opportunities.push({
      id: 'opp_sell_' + Date.now(),
      type: 'VENTE',
      status: 'EN ATTENTE',
      confidence: 65,
      entry: {
        zone: `${(nearResistance.price * 0.998).toFixed(2)} - ${(nearResistance.price * 1.002).toFixed(2)}`,
        ideal: nearResistance.price.toFixed(2)
      },
      stopLoss: stopLoss.toFixed(2),
      takeProfits: [tp1.toFixed(2), tp2.toFixed(2)],
      ratio: '1:2',
      reason: `Résistance à $${nearResistance.price.toFixed(2)} + RSI suracheté (${rsi})`,
      duration: '3-5 jours'
    });
  }

  return opportunities;
}
