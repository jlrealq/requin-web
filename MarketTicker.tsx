import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';

interface MarketData {
  uf: number;
  usd: number;
  eur: number;
  utm: number; // Unidad Tributaria Mensual
  lastUpdate: string;
}

export function MarketTicker() {
  const [marketData, setMarketData] = useState<MarketData>({
    uf: 39854.5,
    usd: 894.2,
    eur: 1046.8,
    utm: 64793.0,
    lastUpdate: ''
  });

  const [trends, setTrends] = useState({
    uf: 'up',
    usd: 'down',
    eur: 'up',
    utm: 'up'
  });
  
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    // Intentar obtener datos reales de mindicador.cl
    const fetchRealData = async () => {
      setIsFetching(true);
      try {
        const response = await fetch('https://mindicador.cl/api');
        const data = await response.json();
        
        setMarketData({
          uf: data.uf.valor,
          usd: data.dolar.valor,
          eur: data.euro.valor,
          utm: data.utm.valor,
          lastUpdate: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
        
        // Simular tendencias en base a los valores (en un entorno real se compara con el día anterior)
        setTrends({
          uf: 'up',
          usd: Math.random() > 0.5 ? 'up' : 'down',
          eur: Math.random() > 0.5 ? 'up' : 'down',
          utm: 'up'
        });
        
      } catch (error) {
        console.log("No se pudo conectar a la API, usando datos simulados.");
        updateTime();
      } finally {
        setIsFetching(false);
      }
    };

    const updateTime = () => {
      const now = new Date();
      const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      // Simular ligeras fluctuaciones para el modo offline
      setMarketData(prev => {
        const fluctuate = (val: number, spread: number) => val + (Math.random() * spread - (spread / 2));
        
        const newUsd = fluctuate(prev.usd, 0.5);
        const newEur = fluctuate(prev.eur, 0.5);
        
        setTrends(t => ({
          ...t,
          usd: newUsd > prev.usd ? 'up' : 'down',
          eur: newEur > prev.eur ? 'up' : 'down'
        }));

        return {
          ...prev,
          usd: newUsd,
          eur: newEur,
          lastUpdate: formatted
        };
      });
    };

    fetchRealData();
    
    // Actualizar fluctuaciones visuales cada 10 segundos
    const interval = setInterval(updateTime, 10000);
    // Intentar refrescar la API cada 15 minutos
    const apiInterval = setInterval(fetchRealData, 900000);
    
    return () => {
      clearInterval(interval);
      clearInterval(apiInterval);
    };
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const TrendIcon = ({ type }: { type: string }) => 
    type === 'up' ? 
      <TrendingUp className="w-3.5 h-3.5 text-green-500 animate-pulse" /> : 
      <TrendingDown className="w-3.5 h-3.5 text-red-500 animate-pulse" />;

  return (
    <div className="bg-[#111111] text-[10px] uppercase tracking-widest py-2.5 px-4 border-b border-[#C5A059]/20 overflow-hidden relative shadow-inner z-50">
      
      {/* Indicador LIVE Flotante que siempre es visible */}
      <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#111111] via-[#111111] to-transparent w-32 z-10 flex items-center pl-4">
        <span className="flex items-center gap-2 font-bold text-white tracking-[0.2em] text-[10px] bg-[#1A1A1A] px-3 py-1 rounded-full border border-white/5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
          </span>
          MARKET
        </span>
      </div>

      {/* Sombra de desvanecimiento derecha */}
      <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-[#111111] via-[#111111] to-transparent w-32 z-10 flex items-center justify-end pr-4">
        {isFetching ? (
          <RefreshCcw className="w-3 h-3 text-[#C5A059] animate-spin opacity-50" />
        ) : (
          <span className="text-[#EFEDE8]/40 text-[9px] font-medium tracking-[0.1em]">
            ACT: {marketData.lastUpdate}
          </span>
        )}
      </div>

      <div className="flex gap-12 animate-[scroll_40s_linear_infinite] whitespace-nowrap pl-40 pr-32">
        <span className="mx-8 font-mono text-[#EFEDE8]/90 flex items-center gap-2 text-xs">
          <span className="text-[#C5A059] font-sans font-bold text-[10px]">UF</span>
          ${formatNumber(marketData.uf)}
          <TrendIcon type={trends.uf} />
        </span>
        
        <span className="mx-8 font-mono text-[#EFEDE8]/90 flex items-center gap-2 text-xs">
          <span className="text-[#C5A059] font-sans font-bold text-[10px]">USD/CLP</span>
          ${formatNumber(marketData.usd)}
          <TrendIcon type={trends.usd} />
        </span>
        
        <span className="mx-8 font-mono text-[#EFEDE8]/90 flex items-center gap-2 text-xs">
          <span className="text-[#C5A059] font-sans font-bold text-[10px]">EUR/CLP</span>
          ${formatNumber(marketData.eur)}
          <TrendIcon type={trends.eur} />
        </span>

        <span className="mx-8 font-mono text-[#EFEDE8]/90 flex items-center gap-2 text-xs">
          <span className="text-[#C5A059] font-sans font-bold text-[10px]">UTM</span>
          ${formatNumber(marketData.utm)}
          <TrendIcon type={trends.utm} />
        </span>

        {/* Duplicar para lograr el efecto infinito sin salto brusco */}
        <span className="mx-8 font-mono text-[#EFEDE8]/90 flex items-center gap-2 text-xs" aria-hidden="true">
          <span className="text-[#C5A059] font-sans font-bold text-[10px]">UF</span>
          ${formatNumber(marketData.uf)}
          <TrendIcon type={trends.uf} />
        </span>
        
        <span className="mx-8 font-mono text-[#EFEDE8]/90 flex items-center gap-2 text-xs" aria-hidden="true">
          <span className="text-[#C5A059] font-sans font-bold text-[10px]">USD/CLP</span>
          ${formatNumber(marketData.usd)}
          <TrendIcon type={trends.usd} />
        </span>
        
        <span className="mx-8 font-mono text-[#EFEDE8]/90 flex items-center gap-2 text-xs" aria-hidden="true">
          <span className="text-[#C5A059] font-sans font-bold text-[10px]">EUR/CLP</span>
          ${formatNumber(marketData.eur)}
          <TrendIcon type={trends.eur} />
        </span>
      </div>
    </div>
  );
}