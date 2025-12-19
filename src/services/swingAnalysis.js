// services/swingAnalysis.js
// SERVICE DÉDIÉ AU SWING TRADING (3-7 jours)

/**
 * SUPPLY & DEMAND ZONES POUR SWING TRADING
 * Timeframes : 4H et Daily
 * Objectif : Identifier zones institutionnelles pour positions multi-jours
 */

/**
 * Détecte les zones de DEMAND adaptées au swing trading
 * Critères : Zone large, mouvement fort, peu de retests
 */
export function detectSwingDemandZones(candleData) {
  const demandZones = [];

  // Pour le swing, on cherche des zones plus larges (10-15 chandeliers)
  for (let i = 15; i < candleData.length - 10; i++) {
    const zone = candleData.slice(i - 10, i); // 10 chandeliers pour la zone
    const moveAfter = candleData.slice(i, i + 10); // Mouvement après

    // 1. Zone de consolidation (swing = range plus large toléré)
    const zoneHigh = Math.max(...zone.map(c => c.high));
    const zoneLow = Math.min(...zone.map(c => c.low));
    const zoneRange = zoneHigh - zoneLow;
    const avgBodySize = zone.reduce((sum, c) => sum + Math.abs(c.close - c.open), 0) / zone.length;

    // Pour swing : tolérance plus large (range < 5x au lieu de 3x)
    const isSwingConsolidation = zoneRange < avgBodySize * 5;

    // 2. Fort mouvement haussier SOUTENU (pas juste un spike)
    const rallySize = moveAfter[moveAfter.length - 1].close - zoneLow;
    const isStrongSwingRally = rallySize > zoneRange * 3; // Au moins 3x la zone

    // 3. Mouvement progressif (pas de retour brutal)
    const progressiveMove = moveAfter.filter(c => c.close > zoneLow).length >= 7;

    if (isSwingConsolidation && isStrongSwingRally && progressiveMove) {
      // Vérifier non retesté récemment (important pour swing)
      const recentData = candleData.slice(i + 10);
      const wasRespected = !recentData.some(c => c.low < zoneLow * 0.995);

      demandZones.push({
        type: 'SWING_DEMAND',
        high: zoneHigh,
        low: zoneLow,
        midPoint: (zoneHigh + zoneLow) / 2,
        timeStart: zone[0].time,
        timeEnd: zone[zone.length - 1].time,
        strength: calculateSwingZoneStrength(rallySize, zoneRange),
        tested: countSwingRetests(recentData, zoneLow, zoneHigh),
        status: wasRespected ? 'INTACT' : 'BROKEN',
        quality: progressiveMove && isSwingConsolidation ? 'HAUTE' : 'MOYENNE',
        swingTarget: zoneLow + (rallySize * 0.618), // Projection Fibonacci
      });
    }
  }

  // Garder uniquement zones intactes et de qualité HAUTE
  return demandZones
    .filter(z => z.status === 'INTACT' && z.quality === 'HAUTE')
    .slice(-6);
}

/**
 * Détecte les zones de SUPPLY pour swing trading
 */
export function detectSwingSupplyZones(candleData) {
  const supplyZones = [];

  for (let i = 15; i < candleData.length - 10; i++) {
    const zone = candleData.slice(i - 10, i);
    const moveAfter = candleData.slice(i, i + 10);

    const zoneHigh = Math.max(...zone.map(c => c.high));
    const zoneLow = Math.min(...zone.map(c => c.low));
    const zoneRange = zoneHigh - zoneLow;
    const avgBodySize = zone.reduce((sum, c) => sum + Math.abs(c.close - c.open), 0) / zone.length;

    const isSwingConsolidation = zoneRange < avgBodySize * 5;

    // Fort mouvement baissier SOUTENU
    const dropSize = zoneHigh - moveAfter[moveAfter.length - 1].close;
    const isStrongSwingDrop = dropSize > zoneRange * 3;

    const progressiveMove = moveAfter.filter(c => c.close < zoneHigh).length >= 7;

    if (isSwingConsolidation && isStrongSwingDrop && progressiveMove) {
      const recentData = candleData.slice(i + 10);
      const wasRespected = !recentData.some(c => c.high > zoneHigh * 1.005);

      supplyZones.push({
        type: 'SWING_SUPPLY',
        high: zoneHigh,
        low: zoneLow,
        midPoint: (zoneHigh + zoneLow) / 2,
        timeStart: zone[0].time,
        timeEnd: zone[zone.length - 1].time,
        strength: calculateSwingZoneStrength(dropSize, zoneRange),
        tested: countSwingRetests(recentData, zoneLow, zoneHigh),
        status: wasRespected ? 'INTACT' : 'BROKEN',
        quality: progressiveMove && isSwingConsolidation ? 'HAUTE' : 'MOYENNE',
        swingTarget: zoneHigh - (dropSize * 0.618),
      });
    }
  }

  return supplyZones
    .filter(z => z.status === 'INTACT' && z.quality === 'HAUTE')
    .slice(-6);
}

function calculateSwingZoneStrength(moveSize, zoneRange) {
  const ratio = moveSize / zoneRange;
  if (ratio > 8) return 'EXCELLENTE'; // Swing nécessite mouvements plus forts
  if (ratio > 5) return 'TRÈS FORTE';
  if (ratio > 3) return 'FORTE';
  return 'MOYENNE';
}

function countSwingRetests(dataAfter, zoneLow, zoneHigh) {
  let retests = 0;
  for (const candle of dataAfter) {
    if (candle.low <= zoneHigh && candle.high >= zoneLow) {
      retests++;
    }
  }
  return retests;
}

/**
 * SUPPORT & RÉSISTANCE POUR SWING TRADING
 * Basés sur pivots MAJEURS (timeframes plus longs)
 */

/**
 * Détecte les supports majeurs pour swing
 */
export function detectSwingSupports(candleData) {
  const supports = [];
  const pricePoints = [];

  // Pour swing : chercher pivots sur fenêtre plus large (10 chandeliers)
  for (let i = 10; i < candleData.length - 10; i++) {
    const isSwingLow =
      candleData.slice(i - 10, i).every(c => c.low > candleData[i].low) &&
      candleData.slice(i + 1, i + 11).every(c => c.low > candleData[i].low);

    if (isSwingLow) {
      pricePoints.push({
        price: candleData[i].low,
        time: candleData[i].time,
        type: 'SWING_LOW',
      });
    }
  }

  // Clustering plus serré pour swing (0.2%)
  const clusters = clusterSwingPrices(pricePoints, 0.002);

  clusters.forEach(cluster => {
    if (cluster.touches >= 2) {
      const avgPrice = cluster.prices.reduce((sum, p) => sum + p, 0) / cluster.prices.length;

      const recentLow = Math.min(...candleData.slice(-30).map(c => c.low));
      const isValid = recentLow > avgPrice * 0.995;

      supports.push({
        price: avgPrice,
        touches: cluster.touches,
        strength: cluster.touches >= 3 ? 'SWING MAJEUR' : 'SWING FORT',
        lastTouch: cluster.times[cluster.times.length - 1],
        status: isValid ? 'ACTIF' : 'CASSÉ',
        type: 'SWING_SUPPORT',
      });
    }
  });

  const currentPrice = candleData[candleData.length - 1].close;
  return supports
    .filter(s => s.status === 'ACTIF' && s.price < currentPrice)
    .sort((a, b) => Math.abs(currentPrice - a.price) - Math.abs(currentPrice - b.price))
    .slice(0, 4); // Seulement top 4 pour swing
}

/**
 * Détecte les résistances majeures pour swing
 */
export function detectSwingResistances(candleData) {
  const resistances = [];
  const pricePoints = [];

  for (let i = 10; i < candleData.length - 10; i++) {
    const isSwingHigh =
      candleData.slice(i - 10, i).every(c => c.high < candleData[i].high) &&
      candleData.slice(i + 1, i + 11).every(c => c.high < candleData[i].high);

    if (isSwingHigh) {
      pricePoints.push({
        price: candleData[i].high,
        time: candleData[i].time,
        type: 'SWING_HIGH',
      });
    }
  }

  const clusters = clusterSwingPrices(pricePoints, 0.002);

  clusters.forEach(cluster => {
    if (cluster.touches >= 2) {
      const avgPrice = cluster.prices.reduce((sum, p) => sum + p, 0) / cluster.prices.length;

      const recentHigh = Math.max(...candleData.slice(-30).map(c => c.high));
      const isValid = recentHigh < avgPrice * 1.005;

      resistances.push({
        price: avgPrice,
        touches: cluster.touches,
        strength: cluster.touches >= 3 ? 'SWING MAJEUR' : 'SWING FORT',
        lastTouch: cluster.times[cluster.times.length - 1],
        status: isValid ? 'ACTIF' : 'CASSÉ',
        type: 'SWING_RESISTANCE',
      });
    }
  });

  const currentPrice = candleData[candleData.length - 1].close;
  return resistances
    .filter(r => r.status === 'ACTIF' && r.price > currentPrice)
    .sort((a, b) => Math.abs(currentPrice - a.price) - Math.abs(currentPrice - b.price))
    .slice(0, 4);
}

function clusterSwingPrices(pricePoints, tolerance) {
  const clusters = [];

  pricePoints.forEach(point => {
    let foundCluster = false;

    for (const cluster of clusters) {
      const avgPrice = cluster.prices.reduce((sum, p) => sum + p, 0) / cluster.prices.length;
      const diff = Math.abs(point.price - avgPrice) / avgPrice;

      if (diff < tolerance) {
        cluster.prices.push(point.price);
        cluster.times.push(point.time);
        cluster.touches++;
        foundCluster = true;
        break;
      }
    }

    if (!foundCluster) {
      clusters.push({
        prices: [point.price],
        times: [point.time],
        touches: 1,
      });
    }
  });

  return clusters;
}

/**
 * Génère des opportunités de SWING TRADING (3-7 jours)
 */
export function generateSwingOpportunities(candleData) {
  const currentPrice = candleData[candleData.length - 1].close;
  const demandZones = detectSwingDemandZones(candleData);
  const supplyZones = detectSwingSupplyZones(candleData);
  const supports = detectSwingSupports(candleData);
  const resistances = detectSwingResistances(candleData);

  const opportunities = [];

  // SWING ACHAT : Zone demande + support majeur
  const nearDemand = demandZones.find(z =>
    currentPrice >= z.low * 0.995 && currentPrice <= z.high * 1.01
  );

  const nearSupport = supports.find(s =>
    Math.abs(currentPrice - s.price) / currentPrice < 0.005
  );

  if (nearDemand || (nearSupport && nearSupport.strength === 'SWING MAJEUR')) {
    const zone = nearDemand || { low: nearSupport.price, high: nearSupport.price + 15 };
    const stopLoss = zone.low - 20; // Stop plus large pour swing
    const tp1 = nearDemand ? nearDemand.swingTarget : currentPrice + 50;
    const tp2 = currentPrice + 100;
    const tp3 = currentPrice + 150;

    opportunities.push({
      type: 'SWING ACHAT',
      strategy: 'Swing Trading - Supply & Demand',
      timeframe: '4H / Daily',
      duration: '3-7 jours',
      entry: zone.low.toFixed(2),
      entryZone: `${zone.low.toFixed(2)} - ${zone.high.toFixed(2)}`,
      stopLoss: stopLoss.toFixed(2),
      takeProfit1: tp1.toFixed(2),
      takeProfit2: tp2.toFixed(2),
      takeProfit3: tp3.toFixed(2),
      confidence: nearDemand && nearSupport ? 95 : nearDemand ? 85 : 75,
      reason: nearDemand
        ? `Zone de demande SWING ${nearDemand.strength}. Qualité: ${nearDemand.quality}. Position multi-jours recommandée.`
        : `Support Swing ${nearSupport.strength} avec ${nearSupport.touches} touches majeures`,
      elements: [
        nearDemand ? `Zone Demand Swing ${nearDemand.strength}` : `Support ${nearSupport.strength}`,
        nearDemand && nearSupport ? 'CONFLUENCE MAJEURE : Demand + Support' : '',
        `Durée estimée: 3-7 jours`,
        `Ratio R:R 1:${((tp2 - currentPrice) / (currentPrice - stopLoss)).toFixed(1)}`,
        `Target Fibonacci: ${nearDemand ? nearDemand.swingTarget.toFixed(2) : 'N/A'}`,
      ].filter(Boolean),
      swingAdvice: 'Position à tenir plusieurs jours. Ne pas closer au moindre mouvement. Patience requise.',
    });
  }

  // SWING VENTE : Zone offre + résistance majeure
  const nearSupply = supplyZones.find(z =>
    currentPrice <= z.high * 1.005 && currentPrice >= z.low * 0.99
  );

  const nearResistance = resistances.find(r =>
    Math.abs(currentPrice - r.price) / currentPrice < 0.005
  );

  if (nearSupply || (nearResistance && nearResistance.strength === 'SWING MAJEUR')) {
    const zone = nearSupply || { high: nearResistance.price, low: nearResistance.price - 15 };
    const stopLoss = zone.high + 20;
    const tp1 = nearSupply ? nearSupply.swingTarget : currentPrice - 50;
    const tp2 = currentPrice - 100;
    const tp3 = currentPrice - 150;

    opportunities.push({
      type: 'SWING VENTE',
      strategy: 'Swing Trading - Supply & Demand',
      timeframe: '4H / Daily',
      duration: '3-7 jours',
      entry: zone.high.toFixed(2),
      entryZone: `${zone.low.toFixed(2)} - ${zone.high.toFixed(2)}`,
      stopLoss: stopLoss.toFixed(2),
      takeProfit1: tp1.toFixed(2),
      takeProfit2: tp2.toFixed(2),
      takeProfit3: tp3.toFixed(2),
      confidence: nearSupply && nearResistance ? 95 : nearSupply ? 85 : 75,
      reason: nearSupply
        ? `Zone d'offre SWING ${nearSupply.strength}. Qualité: ${nearSupply.quality}. Position multi-jours recommandée.`
        : `Résistance Swing ${nearResistance.strength} avec ${nearResistance.touches} touches majeures`,
      elements: [
        nearSupply ? `Zone Supply Swing ${nearSupply.strength}` : `Résistance ${nearResistance.strength}`,
        nearSupply && nearResistance ? 'CONFLUENCE MAJEURE : Supply + Résistance' : '',
        `Durée estimée: 3-7 jours`,
        `Ratio R:R 1:${((currentPrice - tp2) / (stopLoss - currentPrice)).toFixed(1)}`,
        `Target Fibonacci: ${nearSupply ? nearSupply.swingTarget.toFixed(2) : 'N/A'}`,
      ].filter(Boolean),
      swingAdvice: 'Position à tenir plusieurs jours. Ne pas closer au moindre mouvement. Patience requise.',
    });
  }

  return opportunities;
}
