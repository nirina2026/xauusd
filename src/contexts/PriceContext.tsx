import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PriceData {
  price: number;
  change: number;
  changePercent: number;
  lastUpdate: Date;
  open: number;
  high: number;
  low: number;
  volume: string;
}

interface PriceContextType {
  priceData: PriceData;
  isRefreshing: boolean;
  error: string | null;
  refreshPrice: () => void;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export function PriceProvider({ children }: { children: ReactNode }) {
  const [priceData, setPriceData] = useState<PriceData>({
    price: 4280.39,
    change: 2.11,
    changePercent: 0.05,
    lastUpdate: new Date(),
    open: 4275.00,
    high: 4290.00,
    low: 4270.00,
    volume: 'N/A',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoldPrice = async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const timestamp = Date.now();
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-gold-price?t=${timestamp}`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        headers,
        cache: 'no-store'
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = data.message || data.error || 'Failed to fetch gold price';
        throw new Error(errorMessage);
      }

      setPriceData({
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
        lastUpdate: new Date(),
        open: data.open || 0,
        high: data.high || 0,
        low: data.low || 0,
        volume: data.volume || 'N/A',
      });
    } catch (err) {
      console.error('Error fetching gold price:', err);
      const errorMessage = err instanceof Error ? err.message : 'Impossible de charger le prix en temps réel';
      setError(errorMessage);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGoldPrice();

    const priceTimer = setInterval(() => {
      fetchGoldPrice();
    }, 60000);

    return () => clearInterval(priceTimer);
  }, []);

  return (
    <PriceContext.Provider
      value={{
        priceData,
        isRefreshing,
        error,
        refreshPrice: fetchGoldPrice,
      }}
    >
      {children}
    </PriceContext.Provider>
  );
}

export function usePrice() {
  const context = useContext(PriceContext);
  if (context === undefined) {
    throw new Error('usePrice must be used within a PriceProvider');
  }
  return context;
}
