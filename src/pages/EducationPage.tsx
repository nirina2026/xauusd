import { useState } from 'react';
import { BookOpen, TrendingUp, Shield, BarChart, Target, ChevronDown, ChevronUp } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  icon: any;
  description: string;
  content: string;
  category: string;
}

export default function EducationPage() {
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const articles: Article[] = [
    {
      id: 'smc-intro',
      title: 'Introduction aux Smart Money Concepts (SMC)',
      icon: TrendingUp,
      description: 'Découvrez comment trader comme les institutions et le "smart money"',
      category: 'SMC',
      content: `Les Smart Money Concepts (SMC) représentent une approche moderne du trading basée sur la compréhension du comportement des institutions financières.

Qu'est-ce que le Smart Money ?
• Grandes banques et institutions financières
• Fonds d'investissement et hedge funds
• Acteurs qui déplacent réellement le marché
• Ils laissent des "empreintes" sur les graphiques

Différence avec l'analyse technique classique :
• Analyse Technique : Patterns, indicateurs, moyennes mobiles
• SMC : Structure du marché, zones de liquidité, order blocks
• SMC cherche à identifier OÙ le smart money entre

Concepts clés du SMC :
• Order Blocks : Zones où les institutions placent leurs ordres
• Fair Value Gaps (FVG) : Déséquilibres de prix à combler
• Break of Structure (BOS) : Confirmation de tendance
• Change of Character (ChoCh) : Signal de retournement
• Liquidity Zones : Zones où le smart money chasse les stops

Pourquoi le SMC fonctionne sur XAU/USD ?
• L'or est fortement influencé par les institutions
• Mouvements clairs et prévisibles
• Respecte très bien la structure de marché
• Liquidité élevée pour absorber les gros ordres

Le SMC vous permet de trader AVEC les institutions, pas contre elles.`
    },
    {
      id: 'order-blocks',
      title: 'Order Blocks : Les Zones d\'Entrée Institutionnelles',
      icon: Target,
      description: 'Identifiez les zones où les institutions placent leurs ordres massifs',
      category: 'SMC',
      content: `Les Order Blocks sont des zones de prix où les institutions ont placé des ordres importants, créant un déséquilibre offre/demande.

Qu'est-ce qu'un Order Block ?
• Dernière bougie haussière avant une chute brutale (Bearish OB)
• Dernière bougie baissière avant une hausse brutale (Bullish OB)
• Zone où les "gros joueurs" ont absorbé la liquidité
• Forte probabilité de réaction du prix à son retour

Comment identifier un Order Block ?
1. Cherchez un mouvement impulsif fort
2. Identifiez la dernière bougie AVANT le mouvement
3. Cette bougie = votre Order Block
4. Plus le mouvement est fort, plus l'OB est valide

Bullish Order Block (Zone d'achat) :
• Dernière bougie baissière avant hausse explosive
• Prix revient = institutions achètent encore
• Entrée : Au retest de la zone
• Stop Loss : Sous le bas de l'Order Block

Bearish Order Block (Zone de vente) :
• Dernière bougie haussière avant chute explosive
• Prix revient = institutions vendent encore
• Entrée : Au retest de la zone
• Stop Loss : Au-dessus du haut de l'Order Block

Règles importantes :
• Un OB non testé est plus fort
• Plus l'OB est récent, plus il est valide
• Un OB cassé perd sa validité
• Cherchez confluence avec structure de marché

Sur XAU/USD, les Order Blocks en timeframe 4H et Daily sont les plus fiables pour le swing trading.`
    },
    {
      id: 'fvg',
      title: 'Fair Value Gaps (FVG) : Les Déséquilibres de Prix',
      icon: BarChart,
      description: 'Exploitez les zones de déséquilibre que le marché revisite',
      category: 'SMC',
      content: `Un Fair Value Gap (FVG) est un déséquilibre de prix créé par un mouvement rapide et impulsif, laissant une "zone vide" sur le graphique.

Qu'est-ce qu'un FVG ?
• Zone où il y a eu peu ou pas d'échanges
• Créé par un mouvement violent et rapide
• Le marché a tendance à revenir "combler" ces zones
• Opportunités de trading à haute probabilité

Comment identifier un FVG ?

Bullish FVG (3 bougies) :
1. Bougie 1 : Bougie de base
2. Bougie 2 : Grande bougie haussière (impulsion)
3. Bougie 3 : Continuation haussière
• FVG = Espace entre le HIGH de bougie 1 et le LOW de bougie 3

Bearish FVG (3 bougies) :
1. Bougie 1 : Bougie de base
2. Bougie 2 : Grande bougie baissière (impulsion)
3. Bougie 3 : Continuation baissière
• FVG = Espace entre le LOW de bougie 1 et le HIGH de bougie 3

Comment trader les FVG ?

Setup Haussier :
• Attendre retour du prix dans le Bullish FVG
• Chercher confirmation (rejet, bougie d'inversion)
• Entrée : Au milieu ou bas du FVG
• Stop Loss : Sous le FVG
• Take Profit : Prochain OB ou niveau de structure

Setup Baissier :
• Attendre retour du prix dans le Bearish FVG
• Chercher confirmation (rejet, bougie d'inversion)
• Entrée : Au milieu ou haut du FVG
• Stop Loss : Au-dessus du FVG
• Take Profit : Prochain OB ou niveau de structure

Types de FVG :
• FVG Standard : Se comble partiellement (50%)
• FVG Inversion : Se comble totalement puis inverse
• FVG Rejet : Prix touche et rejette immédiatement

Règles d'or :
• Tous les FVG ne sont pas tradables
• Cherchez FVG + Order Block pour plus de force
• FVG en timeframe supérieur > FVG en timeframe inférieur
• Un FVG comblé perd sa validité

Pour XAU/USD, les FVG en Daily sont excellents pour les entrées swing.`
    },
    {
      id: 'market-structure',
      title: 'Structure de Marché : BOS et ChoCh',
      icon: TrendingUp,
      description: 'Comprenez les changements de tendance avant tout le monde',
      category: 'SMC',
      content: `La structure de marché est le fondement du SMC. Comprendre BOS et ChoCh vous permet d'anticiper les mouvements.

Structure de Marché - Les Bases :

Tendance Haussière :
• Série de Higher Highs (HH) et Higher Lows (HL)
• Chaque sommet > sommet précédent
• Chaque creux > creux précédent

Tendance Baissière :
• Série de Lower Lows (LL) et Lower Highs (LH)
• Chaque creux < creux précédent
• Chaque sommet < sommet précédent

Break of Structure (BOS) :

Définition :
• Cassure d'un niveau de structure dans la direction de la tendance
• CONFIRME que la tendance continue
• Signal pour chercher des opportunités d'achat/vente

BOS Haussier :
• Prix casse le dernier Higher High
• Confirmation de force haussière
• Cherchez retracement vers OB pour achat

BOS Baissier :
• Prix casse le dernier Lower Low
• Confirmation de force baissière
• Cherchez retracement vers OB pour vente

Change of Character (ChoCh) :

Définition :
• Cassure d'un niveau de structure CONTRE la tendance
• ALERTE qu'un retournement approche
• Pas encore confirmation, mais avertissement

ChoCh en Tendance Haussière :
• Prix casse le dernier Higher Low
• Signal d'affaiblissement haussier
• Attention : retournement possible
• Attendre confirmation avant de shorter

ChoCh en Tendance Baissière :
• Prix casse le dernier Lower High
• Signal d'affaiblissement baissier
• Attention : retournement possible
• Attendre confirmation avant d'acheter

Comment trader avec BOS et ChoCh ?

Setup après BOS :
1. BOS confirme la tendance
2. Attendre retracement vers zone de demande/offre
3. Chercher Order Block ou FVG
4. Entrée avec confirmation
5. Stop sous la zone, TP au prochain niveau

Setup après ChoCh :
1. ChoCh alerte d'un possible retournement
2. Attendre BOS dans la direction opposée (CONFIRMATION)
3. Retracement vers premier Order Block
4. Entrée avec gestion de risque stricte
5. Stop serré, TP conservateur au début

Erreurs à éviter :
• Ne pas trader un ChoCh seul (attendre BOS opposé)
• Ne pas ignorer la structure supérieure (Daily > 4H > 1H)
• Ne pas forcer un trade contre la structure claire
• Ne pas confondre correction et changement de tendance

Sur XAU/USD :
• Structure Daily = Direction principale
• Structure 4H = Timing d'entrée
• Structure 1H = Confirmation et précision
• Respectez TOUJOURS la structure du timeframe supérieur`
    },
    {
      id: 'liquidity',
      title: 'Zones de Liquidité : Où le Smart Money Chasse',
      icon: Target,
      description: 'Comprenez comment les institutions collectent la liquidité',
      category: 'SMC',
      content: `La liquidité est le carburant du marché. Les institutions ont BESOIN de liquidité pour remplir leurs gros ordres.

Qu'est-ce que la Liquidité ?

Définition :
• Ensemble d'ordres groupés à un niveau de prix
• Stop Loss des traders = Liquidité
• Les institutions "chassent" ces stops avant d'inverser

Où se trouve la Liquidité ?

1. Au-dessus des Highs récents :
• Buy Stops des vendeurs
• Stop Loss des shorts
• Equal Highs = Double liquidité

2. En-dessous des Lows récents :
• Sell Stops des acheteurs
• Stop Loss des longs
• Equal Lows = Double liquidité

3. Niveaux psychologiques :
• Nombres ronds (4200, 4300, 4400)
• Beaucoup de traders placent stops là
• Zones magnétiques pour le prix

Types de Raids de Liquidité :

Liquidity Grab (Fausse cassure) :
• Prix casse un High/Low
• Active tous les stops
• PUIS inverse violemment
• C'est là que les institutions entrent

Liquidity Sweep :
• Mouvement rapide pour prendre liquidité
• Souvent avec une grande mèche
• Retour immédiat dans la range
• Setup de trading à haute probabilité

Comment trader la Liquidité ?

Setup Buy (Sweep d'un Low) :
1. Identifier zone de liquidité (Equal Lows, Support)
2. Prix descend et casse brièvement
3. Forte réaction haussière (rejet)
4. Entrée au-dessus du Low initial
5. Stop sous le sweep
6. TP au prochain niveau de structure

Setup Sell (Sweep d'un High) :
1. Identifier zone de liquidité (Equal Highs, Résistance)
2. Prix monte et casse brièvement
3. Forte réaction baissière (rejet)
4. Entrée en-dessous du High initial
5. Stop au-dessus du sweep
6. TP au prochain niveau de structure

Confluence Parfaite (Setup Premium) :

Prix fait un sweep de liquidité...
+ Zone d'Order Block
+ Fair Value Gap
+ Niveau de structure important
= Trade à très haute probabilité

Règles importantes :
• Ne pas être du mauvais côté du sweep
• Attendez TOUJOURS la confirmation du rejet
• Plus le sweep est violent, plus le mouvement inverse sera fort
• Timeframe supérieur > timeframe inférieur

Protection personnelle :
• Ne placez PAS vos stops exactement sur les niveaux évidents
• Donnez de l'espace (quelques pips au-delà)
• Ou utilisez des stops mentaux (risqué, nécessite discipline)

Sur XAU/USD, les raids de liquidité sont TRÈS fréquents, surtout pendant :
• Ouverture de Londres (9h)
• Ouverture de New York (14h-15h)
• Publications économiques importantes
• Ces moments sont parfaits pour voir des setups de liquidité`
    },
    {
      id: 'smc-strategy',
      title: 'Stratégie Complète SMC pour XAU/USD',
      icon: Shield,
      description: 'Combinez tous les concepts SMC dans une stratégie cohérente',
      category: 'SMC',
      content: `Voici comment combiner tous les concepts SMC dans une stratégie complète et profitable.

Méthodologie Top-Down (Essentielle) :

1. Analyse Monthly/Weekly :
• Tendance générale du marché
• Niveaux de structure majeurs
• Zones de liquidité long terme

2. Analyse Daily :
• Structure actuelle
• Order Blocks principaux
• FVG importants
• Direction de trading de la semaine

3. Analyse 4H :
• Raffinement de la structure
• Points d'entrée potentiels
• Gestion de trade

4. Analyse 1H :
• Timing précis d'entrée
• Confirmation finale
• Stop Loss et Take Profit précis

Checklist pour un Trade SMC Parfait :

1. Direction (Daily) :
□ Tendance claire identifiée (HH/HL ou LL/LH)
□ Pas en zone de retournement majeur
□ Structure supérieure alignée

2. Zone d'Entrée (4H/Daily) :
□ Order Block valide et non testé
□ OU Fair Value Gap clair
□ Confluence avec niveau de structure
□ Possible liquidity sweep

3. Confirmation (1H/4H) :
□ Prix rejette la zone (chandelier)
□ Break of Structure dans notre direction
□ Volume/momentum en notre faveur

4. Gestion de Risque :
□ Risque max 1-2% du capital
□ Stop Loss logique (sous OB/FVG)
□ Ratio Risk/Reward minimum 1:2
□ Position sizing calculé

Setup d'Achat Complet (Exemple) :

1. Daily : Tendance haussière (HH, HL)
2. Daily : Prix fait retracement vers zone de demande
3. 4H : Order Block bullish identifié
4. 4H : Fair Value Gap dans la même zone
5. 1H : Prix fait liquidity sweep du Low
6. 1H : Forte bougie de rejet haussière
7. 1H : Break of Structure haussier
→ ENTRÉE À L'ACHAT

Entrée : Au-dessus du sweep
Stop Loss : Sous l'Order Block
Take Profit 1 (50%) : FVG opposé
Take Profit 2 (50%) : Prochain niveau de structure

Setup de Vente Complet (Exemple) :

1. Daily : Tendance baissière (LL, LH)
2. Daily : Prix fait retracement vers zone d'offre
3. 4H : Order Block bearish identifié
4. 4H : Fair Value Gap dans la même zone
5. 1H : Prix fait liquidity sweep du High
6. 1H : Forte bougie de rejet baissière
7. 1H : Break of Structure baissier
→ ENTRÉE À LA VENTE

Entrée : En-dessous du sweep
Stop Loss : Au-dessus de l'Order Block
Take Profit 1 (50%) : FVG opposé
Take Profit 2 (50%) : Prochain niveau de structure

Gestion de Trade SMC :

Déplacement du Stop Loss :
• Après TP1 atteint : Break-even
• Après BOS fort : Sous le dernier HL (achat) ou LH (vente)
• Jamais élargir le stop original

Sortie Anticipée :
• ChoCh contre notre position
• Cassure d'Order Block support
• Perte de structure

Erreurs Mortelles à Éviter :

1. Sur-Analyse (Paralysis by Analysis)
• Trop de lignes sur le graphique
• Confusion entre timeframes
• Solution : Restez simple et clair

2. FOMO (Fear Of Missing Out)
• Entrer sans tous les critères
• Chasser le prix
• Solution : Checklist stricte

3. Ignorer la Structure Supérieure
• Shorter en tendance haussière Daily
• Acheter en tendance baissière Daily
• Solution : Respectez TOUJOURS le Daily

4. Mauvaise Gestion du Risque
• Position trop grosse
• Stop Loss trop serré
• Solution : 1-2% max par trade

5. Ne pas Journaliser
• Répéter les mêmes erreurs
• Pas de progression
• Solution : Journal détaillé après chaque trade

Plan d'Entraînement SMC :

Semaine 1-2 : Identification
• Marquer Order Blocks sur graphiques passés
• Identifier FVG historiques
• Noter BOS et ChoCh

Semaine 3-4 : Analyse
• Analyser 20 setups passés
• Noter confluence et résultats
• Comprendre ce qui fonctionne

Semaine 5-6 : Paper Trading
• Trader en démo avec règles strictes
• Journal de tous les trades
• Analyser performances

Semaine 7+ : Small Position Live
• Commencer avec position minimale
• Respecter la stratégie à 100%
• Augmenter taille progressivement SEULEMENT si profitable

Le SMC est puissant mais demande PRATIQUE et DISCIPLINE. Prenez le temps de maîtriser chaque concept avant de trader réel.`
    },
    {
      id: 'swing-trading',
      title: 'Qu\'est-ce que le Swing Trading ?',
      icon: TrendingUp,
      description: 'Apprenez les bases du swing trading et pourquoi c\'est adapté pour XAU/USD',
      category: 'Débutant',
      content: `Le swing trading est une stratégie qui consiste à maintenir des positions pendant plusieurs jours ou semaines pour profiter des mouvements de prix à moyen terme.

Contrairement au day trading qui nécessite une surveillance constante, le swing trading permet de :
• Profiter des tendances significatives du marché
• Éviter le bruit des mouvements intrajournaliers
• Avoir une vie équilibrée sans passer la journée devant les écrans

Pour l'or (XAU/USD), le swing trading est particulièrement efficace car :
• L'or a des tendances claires et durables
• Moins de volatilité que les cryptomonnaies
• Réagit aux événements macroéconomiques importants

Horizon de temps recommandé : 3-10 jours par position`
    },
    {
      id: 'candlesticks',
      title: 'Comment Lire les Chandeliers Japonais ?',
      icon: BarChart,
      description: 'Maîtrisez l\'art de lire les graphiques en chandeliers',
      category: 'Débutant',
      content: `Les chandeliers japonais sont la représentation graphique la plus utilisée en trading.

Chaque chandelier représente :
• Open (Ouverture) : Prix au début de la période
• High (Plus Haut) : Prix maximum atteint
• Low (Plus Bas) : Prix minimum atteint
• Close (Clôture) : Prix à la fin de la période

Couleurs :
• Vert : Prix de clôture > Prix d'ouverture (hausse)
• Rouge : Prix de clôture < Prix d'ouverture (baisse)

Patterns importants à connaître :
• Doji : Indécision du marché
• Marteau : Possible retournement haussier
• Étoile Filante : Possible retournement baissier
• Engloutissante : Fort signal de retournement

Les chandeliers en timeframe Daily sont les plus fiables pour le swing trading.`
    },
    {
      id: 'risk-management',
      title: 'Gestion du Risque : La Règle des 1-2%',
      icon: Shield,
      description: 'La règle d\'or pour protéger votre capital',
      category: 'Essentiel',
      content: `La gestion du risque est LA compétence la plus importante en trading. Sans elle, même la meilleure stratégie échouera.

La règle des 1-2% :
• Ne risquez JAMAIS plus de 1-2% de votre capital par trade
• Avec $10,000 de capital : risque max = $100-200 par trade
• Cela vous permet de survivre à 50 trades perdants consécutifs

Comment appliquer cette règle :
1. Définir votre capital total
2. Calculer 1-2% de ce capital
3. Utiliser ce montant pour dimensionner votre position
4. Ajuster la taille en fonction de la distance du stop loss

Exemple pratique :
• Capital : $5,000
• Risque : 2% = $100
• Entrée : $4,286
• Stop Loss : $4,250
• Distance : $36
• Taille position : $100 / $36 = 0.09 lots

Autres règles importantes :
• Exposition totale max : 5% du capital
• Toujours utiliser un stop loss
• Ne jamais déplacer un stop loss pour augmenter la perte`
    },
    {
      id: 'support-resistance',
      title: 'Supports et Résistances Expliqués',
      icon: Target,
      description: 'Identifiez les niveaux clés où le prix réagit',
      category: 'Technique',
      content: `Les supports et résistances sont des niveaux de prix où la pression acheteuse ou vendeuse est forte.

Support :
• Zone où le prix a tendance à rebondir
• Les acheteurs sont plus forts que les vendeurs
• Opportunité d'achat potentielle

Résistance :
• Zone où le prix a tendance à être rejeté
• Les vendeurs sont plus forts que les acheteurs
• Opportunité de vente potentielle

Comment les identifier :
1. Cherchez les plus hauts et plus bas locaux
2. Tracez des lignes horizontales à ces niveaux
3. Plus un niveau a été testé, plus il est fort
4. Les anciens supports deviennent résistances (et vice-versa)

Stratégie de trading :
• Achat près d'un support avec stop loss en dessous
• Vente près d'une résistance avec stop loss au-dessus
• Breakout : Achat/Vente quand le prix casse un niveau

Sur XAU/USD, les niveaux psychologiques ($4,200, $4,300) sont particulièrement importants.`
    },
    {
      id: 'rsi-indicators',
      title: 'RSI et Indicateurs Techniques',
      icon: BarChart,
      description: 'Utilisez les indicateurs pour confirmer vos analyses',
      category: 'Technique',
      content: `Les indicateurs techniques aident à confirmer vos décisions de trading.

RSI (Relative Strength Index) :
• Oscillateur entre 0 et 100
• RSI < 30 : Zone de survente (potentiel achat)
• RSI > 70 : Zone de surachat (potentiel vente)
• Divergences : Signaux puissants de retournement

Comment utiliser le RSI :
1. Ne tradez PAS uniquement sur le RSI
2. Utilisez-le comme CONFIRMATION avec S/R
3. RSI < 30 + Support = Signal d'achat fort
4. RSI > 70 + Résistance = Signal de vente fort

Autres indicateurs utiles :
• Moyennes Mobiles : Identifient la tendance
• MACD : Confirme les retournements
• Volume : Confirme la force du mouvement

Règle d'or : Les indicateurs CONFIRMENT, ils ne prédisent pas !

Pour le swing trading sur XAU/USD, utilisez :
• RSI 14 périodes en Daily
• Moyennes mobiles 50 et 200
• Attendez la convergence de plusieurs signaux`
    },
    {
      id: 'psychology',
      title: 'Psychologie du Trading',
      icon: BookOpen,
      description: 'Maîtrisez vos émotions pour réussir',
      category: 'Mental',
      content: `95% des traders échouent non pas à cause de leur stratégie, mais à cause de leur psychologie.

Erreurs psychologiques communes :
• FOMO (Fear Of Missing Out) : Entrer sans signal
• Revenge Trading : Vouloir récupérer après une perte
• Over-Trading : Prendre trop de positions
• Moving Stop Loss : Refuser d'accepter la perte

Règles mentales à suivre :
1. Acceptez que des pertes sont normales
2. Un bon trader gagne 60-70% du temps (pas 100%)
3. Respectez TOUJOURS votre plan de trading
4. Ne tradez pas sous le coup de l'émotion
5. Prenez des pauses après 2-3 pertes consécutives

Comment développer la discipline :
• Tenez un journal de trading détaillé
• Analysez vos erreurs sans jugement
• Célébrez les bonnes décisions (pas seulement les gains)
• Fixez-vous des objectifs hebdomadaires réalistes

Le trading est un marathon, pas un sprint. La régularité bat la performance explosive.`
    }
  ];

  const toggleArticle = (id: string) => {
    setExpandedArticle(expandedArticle === id ? null : id);
  };

  const categories = ['Tous', 'SMC', 'Débutant', 'Essentiel', 'Technique', 'Mental'];
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const filteredArticles = selectedCategory === 'Tous'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Centre d'Éducation
        </h1>
        <p className="text-gray-600">
          Apprenez les bases et perfectionnez vos compétences en trading
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {filteredArticles.map((article) => {
          const Icon = article.icon;
          const isExpanded = expandedArticle === article.id;

          return (
            <div
              key={article.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-indigo-200 transition"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {article.title}
                      </h3>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                        {article.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {article.description}
                    </p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                      {article.content}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => toggleArticle(article.id)}
                  className="mt-4 w-full bg-indigo-50 text-indigo-700 px-4 py-3 rounded-lg hover:bg-indigo-100 font-semibold transition flex items-center justify-center gap-2"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-5 h-5" />
                      Réduire
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5" />
                      Lire Plus
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <BookOpen className="w-8 h-8" />
          Ressources Recommandées
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <h3 className="font-bold mb-2">📚 Livres Essentiels</h3>
            <ul className="text-sm space-y-1 text-white/90">
              <li>• Trading in the Zone - Mark Douglas</li>
              <li>• Japanese Candlestick Charting Techniques</li>
              <li>• The Disciplined Trader - Mark Douglas</li>
            </ul>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <h3 className="font-bold mb-2">🎓 Pratique</h3>
            <ul className="text-sm space-y-1 text-white/90">
              <li>• Commencez avec un compte démo</li>
              <li>• Tenez votre journal de trading</li>
              <li>• Analysez vos erreurs chaque semaine</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
