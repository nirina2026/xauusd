export function getCurrentSession() {
  const now = new Date();
  const utcHour = now.getUTCHours();

  if ((utcHour >= 23 || utcHour < 8)) {
    return 'Asia';
  } else if (utcHour >= 12 && utcHour < 16) {
    return 'Overlap';
  } else if (utcHour >= 7 && utcHour < 12) {
    return 'London';
  } else if (utcHour >= 12 && utcHour < 21) {
    return 'New York';
  }

  return 'Asia';
}

export function detectDayTradingZones(candleData) {
  if (!candleData || candleData.length < 20) return { supply: [], demand: [] };

  const recentData = candleData.slice(-50);
  const supply = [];
  const demand = [];

  for (let i = 2; i < recentData.length - 2; i++) {
    const current = recentData[i];
    const prev1 = recentData[i - 1];
    const prev2 = recentData[i - 2];
    const next1 = recentData[i + 1];
    const next2 = recentData[i + 2];

    const isHighVolume = (current.high - current.low) > 15;

    if (
      current.high > prev1.high &&
      current.high > prev2.high &&
      current.high > next1.high &&
      current.high > next2.high &&
      isHighVolume
    ) {
      const nearPsychological = Math.abs(Math.round(current.high / 50) * 50 - current.high) < 10;
      supply.push({
        price: current.high,
        zone: `${(current.high - 5).toFixed(2)} - ${current.high.toFixed(2)}`,
        strength: nearPsychological ? 'Fort' : 'Moyen',
        confluence: nearPsychological ? 4 : 3,
        psychological: nearPsychological
      });
    }

    if (
      current.low < prev1.low &&
      current.low < prev2.low &&
      current.low < next1.low &&
      current.low < next2.low &&
      isHighVolume
    ) {
      const nearPsychological = Math.abs(Math.round(current.low / 50) * 50 - current.low) < 10;
      demand.push({
        price: current.low,
        zone: `${current.low.toFixed(2)} - ${(current.low + 5).toFixed(2)}`,
        strength: nearPsychological ? 'Fort' : 'Moyen',
        confluence: nearPsychological ? 4 : 3,
        psychological: nearPsychological
      });
    }
  }

  return {
    supply: supply.slice(-3),
    demand: demand.slice(-3)
  };
}

export function generateDayTradingOpportunities(candleData, zones) {
  if (!candleData || candleData.length === 0) return [];

  const currentPrice = candleData[candleData.length - 1].close;
  const currentSession = getCurrentSession();
  const opportunities = [];

  zones.demand.forEach((zone, index) => {
    if (Math.abs(currentPrice - zone.price) < 30) {
      const entry = zone.price + 2;
      const stopLoss = (zone.price - 15).toFixed(2);
      const tp1 = (entry + 20).toFixed(2);
      const tp2 = (entry + 35).toFixed(2);
      const riskReward = ((entry + 20 - entry) / (entry - (zone.price - 15))).toFixed(2);

      opportunities.push({
        id: `day-buy-${index}`,
        type: 'ACHAT',
        strategy: 'Day Trading - Demand Zone',
        timeframe: '15min/30min',
        duration: '2-8 heures',
        session: currentSession,
        entry: entry.toFixed(2),
        entryZone: zone.zone,
        stopLoss: stopLoss,
        takeProfit1: tp1,
        takeProfit2: tp2,
        confidence: zone.confluence * 20,
        riskReward: `1:${riskReward}`,
        reason: zone.psychological
          ? `Zone Demand forte détectée avec confluence niveau psychologique ${Math.round(zone.price / 50) * 50}$`
          : `Zone Demand détectée sur ${currentSession} avec volume significatif`,
        elements: [
          `Zone formée sur 15min-1H avec volume important`,
          zone.psychological ? `Confluence avec niveau psychologique ${Math.round(zone.price / 50) * 50}$` : 'Rejet rapide attendu',
          `Session active: ${currentSession}`,
          `Risque serré: ${Math.abs(entry - parseFloat(stopLoss)).toFixed(2)}$ (10-20$)`
        ],
        dayAdvice: 'Clôturer avant fin de session (pas de positions overnight). Prendre 50% profit au TP1, 50% au TP2.'
      });
    }
  });

  zones.supply.forEach((zone, index) => {
    if (Math.abs(currentPrice - zone.price) < 30) {
      const entry = zone.price - 2;
      const stopLoss = (zone.price + 15).toFixed(2);
      const tp1 = (entry - 20).toFixed(2);
      const tp2 = (entry - 35).toFixed(2);
      const riskReward = ((entry - (entry - 20)) / (parseFloat(stopLoss) - entry)).toFixed(2);

      opportunities.push({
        id: `day-sell-${index}`,
        type: 'VENTE',
        strategy: 'Day Trading - Supply Zone',
        timeframe: '15min/30min',
        duration: '2-8 heures',
        session: currentSession,
        entry: entry.toFixed(2),
        entryZone: zone.zone,
        stopLoss: stopLoss,
        takeProfit1: tp1,
        takeProfit2: tp2,
        confidence: zone.confluence * 20,
        riskReward: `1:${riskReward}`,
        reason: zone.psychological
          ? `Zone Supply forte détectée avec confluence niveau psychologique ${Math.round(zone.price / 50) * 50}$`
          : `Zone Supply détectée sur ${currentSession} avec volume significatif`,
        elements: [
          `Zone formée sur 15min-1H avec volume important`,
          zone.psychological ? `Confluence avec niveau psychologique ${Math.round(zone.price / 50) * 50}$` : 'Rejet rapide attendu',
          `Session active: ${currentSession}`,
          `Risque serré: ${Math.abs(parseFloat(stopLoss) - entry).toFixed(2)}$ (10-20$)`
        ],
        dayAdvice: 'Clôturer avant fin de session (pas de positions overnight). Prendre 50% profit au TP1, 50% au TP2.'
      });
    }
  });

  return opportunities.slice(0, 5);
}
