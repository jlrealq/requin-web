import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketData {
  uf: number;
  usd: number;
  eur: number;
  lastUpdate: string;
}

export function MarketTicker() {
  const [marketData, setMarketData] = useState<MarketData>({
    uf: 39854,
    usd: 894,
    eur: 1046,
    lastUpdate: ''
  });

  const [trends] = useState({
    uf: 'up',
    usd: 'down',
    eur: 'up'
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setMarketData(prev => ({ ...prev, lastUpdate: formatted }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('es-CL');
  };

  return (
    <div className="bg-[#1A1A1A] text-[10px] uppercase tracking-widest py-2 px-4 border-b border-[#C5A059]/20 overflow-hidden">
      <div className="flex gap-6 animate-[scroll_25s_linear_infinite] whitespace-nowrap">
        <span className="mx-10 text-yellow-500 italic flex items-center gap-1">
          UF: ${formatNumber(marketData.uf)} {trends.uf === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        </span>
        <span className="mx-10 text-yellow-500 italic flex items-center gap-1">
          USD/CLP: ${formatNumber(marketData.usd)} {trends.usd === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        </span>
        <span className="mx-10 text-yellow-500 italic flex items-center gap-1">
          EUR/CLP: ${formatNumber(marketData.eur)} {trends.eur === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        </span>
        <span className="mx-10 text-gray-400 text-[10px] italic">
          ACTUALIZADO: {marketData.lastUpdate}
        </span>
        <span className="mx-10 text-[#EFEDE8]/60 font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> MARKET LIVE
        </span>
      </div>
    </div>
  );
}
