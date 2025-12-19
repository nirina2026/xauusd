import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { usePrice } from '../contexts/PriceContext';
import { detectLevels } from '../services/analysis';

type Timeframe = '1H' | '4H' | 'Daily' | 'Weekly';

interface ChartDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function Chart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('4H');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [baseChartData, setBaseChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [levels, setLevels] = useState<any>({ supports: [], resistances: [] });
  const { priceData } = usePrice();

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setIsLoading(true);
      try {
        const timestamp = Date.now();
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-gold-history?timeframe=${timeframe}&t=${timestamp}`;
        const headers = {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        };

        const response = await fetch(apiUrl, {
          headers,
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch historical data');
        }

        const result = await response.json();

        if (result.success && result.data) {
          setBaseChartData(result.data);
          setChartData(result.data);
          if (result.data.length > 5) {
            const detectedLevels = detectLevels(result.data);
            setLevels(detectedLevels);
          }
        }
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();

    const refreshInterval = setInterval(() => {
      fetchHistoricalData();
    }, 180000);

    return () => clearInterval(refreshInterval);
  }, [timeframe]);

  useEffect(() => {
    if (baseChartData.length > 0 && priceData.price > 0) {
      const updatedData = [...baseChartData];
      const lastCandle = updatedData[updatedData.length - 1];

      if (lastCandle) {
        const today = new Date().toISOString().split('T')[0];

        if (lastCandle.time === today) {
          lastCandle.close = priceData.price;
          lastCandle.high = Math.max(lastCandle.high, priceData.price);
          lastCandle.low = Math.min(lastCandle.low, priceData.price);
        } else {
          updatedData.push({
            time: today,
            open: priceData.open || priceData.price,
            high: priceData.high || priceData.price,
            low: priceData.low || priceData.price,
            close: priceData.price
          });
        }

        setChartData(updatedData);
      }
    }
  }, [priceData.price, priceData.open, priceData.high, priceData.low, baseChartData]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: mobile ? 350 : 500,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return;

    const container = chartContainerRef.current;
    const height = isMobile ? 350 : 500;

    try {
      const chart = createChart(container, {
        layout: {
          background: { type: ColorType.Solid, color: '#FFFFFF' },
          textColor: '#333333',
        },
        width: container.clientWidth,
        height: height,
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        crosshair: {
          mode: 1,
        },
        rightPriceScale: {
          borderColor: '#cccccc',
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
          autoScale: true,
        },
        timeScale: {
          borderColor: '#cccccc',
          timeVisible: true,
          secondsVisible: false,
          rightOffset: 12,
          barSpacing: 6,
          minBarSpacing: 3,
        },
      });

      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#10B981',
        downColor: '#EF4444',
        borderUpColor: '#10B981',
        borderDownColor: '#EF4444',
        wickUpColor: '#10B981',
        wickDownColor: '#EF4444',
        priceFormat: {
          type: 'price',
          precision: 2,
          minMove: 0.01,
        },
      });

      candlestickSeries.setData(chartData);

      if (priceData.price > 0) {
        candlestickSeries.createPriceLine({
          price: priceData.price,
          color: '#F59E0B',
          lineWidth: 2,
          lineStyle: 0,
          axisLabelVisible: true,
          title: 'Prix Actuel',
        });
      }

      levels.supports.forEach((support: any, index: number) => {
        candlestickSeries.createPriceLine({
          price: support.price,
          color: '#10B981',
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: `S${index + 1}`,
        });
      });

      levels.resistances.forEach((resistance: any, index: number) => {
        candlestickSeries.createPriceLine({
          price: resistance.price,
          color: '#EF4444',
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: `R${index + 1}`,
        });
      });

      chart.timeScale().fitContent();

      const tooltip = document.createElement('div');
      tooltip.style.position = 'absolute';
      tooltip.style.display = 'none';
      tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      tooltip.style.color = '#FFFFFF';
      tooltip.style.padding = '8px 12px';
      tooltip.style.borderRadius = '6px';
      tooltip.style.fontSize = '12px';
      tooltip.style.fontFamily = 'monospace';
      tooltip.style.zIndex = '1000';
      tooltip.style.pointerEvents = 'none';
      container.appendChild(tooltip);

      chart.subscribeCrosshairMove((param: any) => {
        if (!param.point || !param.time) {
          tooltip.style.display = 'none';
          return;
        }

        const data = param.seriesData.get(candlestickSeries);
        if (!data) {
          tooltip.style.display = 'none';
          return;
        }

        tooltip.innerHTML = `
          <div>O: $${data.open.toFixed(2)}</div>
          <div>H: $${data.high.toFixed(2)}</div>
          <div>L: $${data.low.toFixed(2)}</div>
          <div>C: $${data.close.toFixed(2)}</div>
        `;
        tooltip.style.display = 'block';
        tooltip.style.left = param.point.x + 10 + 'px';
        tooltip.style.top = param.point.y + 10 + 'px';
      });

      chartRef.current = chart;

      return () => {
        chart.remove();
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      };
    } catch (error) {
      console.error('Chart error:', error);
    }
  }, [isMobile, chartData, priceData.price, levels]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Graphique de Prix</h3>
          <div className="flex gap-2">
            {(['1H', '4H', 'Daily', 'Weekly'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`
                  px-3 py-1 rounded-lg font-medium text-sm transition-all duration-200
                  ${
                    timeframe === tf
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Timeframe actuel: {timeframe} {isLoading && '(Chargement...)'}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center bg-white" style={{ minHeight: isMobile ? '350px' : '500px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du graphique...</p>
          </div>
        </div>
      ) : (
        <div
          ref={chartContainerRef}
          className="w-full bg-white"
          style={{
            position: 'relative',
            minHeight: isMobile ? '350px' : '500px',
          }}
        />
      )}
    </div>
  );
}
