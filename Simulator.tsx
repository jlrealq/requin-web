import { useState, useEffect, useMemo } from 'react';
import { X, Calculator, ArrowRight, Activity, Percent, ShieldAlert, BadgeDollarSign, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

interface SimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Simulator({ isOpen, onClose }: SimulatorProps) {
  const [revenue, setRevenue] = useState(2.5); // USD Millones
  const [margin, setMargin] = useState(24);    // Porcentaje
  const [industry, setIndustry] = useState('Tecnología / SaaS');
  const [regime, setRegime] = useState('General (14A)');
  
  // Resultados Calculados
  const [score, setScore] = useState(78);
  const [recovery, setRecovery] = useState(142500);
  const [currentTax, setCurrentTax] = useState(0);
  const [optimizedTax, setOptimizedTax] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const riskFactors = useMemo(() => {
    let risks = [];
    if (regime === 'General (14A)' && revenue < 3) risks.push("Régimen Subóptimo para su nivel de ingresos");
    if (margin > 30) risks.push("Alta exposición a carga tributaria sobre utilidades");
    if (industry === 'Holding Exterior') risks.push("Posibles contingencias de Precios de Transferencia");
    if (risks.length === 0) risks.push("Estructura actual presenta oportunidades de mejora estándar");
    return risks;
  }, [revenue, margin, industry, regime]);

  useEffect(() => {
    setIsCalculating(true);
    
    // Simular un tiempo de cálculo "inteligente" para UX
    const timer = setTimeout(() => {
      // 1. Cálculo de Score Fiscal (0-100)
      let baseScore = 45;

      // Penalizaciones por tamaño sin estructura (más grandes pagan más si no optimizan)
      if (revenue > 8) baseScore -= 15;
      else if (revenue > 5) baseScore -= 10;
      else if (revenue > 2) baseScore -= 5;
      else baseScore += 10; // Pymes tienen más facilidad inicial

      // Penalización por alto margen
      if (margin > 40) baseScore -= 20;
      else if (margin > 25) baseScore -= 10;
      
      // Ajustes por Industria
      if (industry === 'Tecnología / SaaS') baseScore += 15; // Más incentivos disponibles
      else if (industry === 'Manufactura / Exportación') baseScore += 20; // IVA Exportador
      else if (industry === 'Real Estate / Inmobiliaria') baseScore += 5; // DFL2, depreciación
      
      // Ajustes por Régimen
      if (regime === 'Pro-Pyme (14D)' && revenue <= 3) baseScore += 15;
      else if (regime === 'General (14A)' && revenue <= 2.5) baseScore -= 20; // Ineficiente
      else if (regime === 'Holding Exterior') baseScore += 10; // Ya tiene algo de estructura

      const finalScore = Math.max(30, Math.min(95, baseScore));

      // 2. Cálculo Financiero Realista
      const ebitdaUSD = revenue * 1000000 * (margin / 100);
      const exchangeRate = 950; // Tipo de cambio conservador
      const ebitdaCLP = ebitdaUSD * exchangeRate;

      // Impuesto Actual Teórico
      let currentTaxRate = 0.27; // 14A por defecto
      if (regime === 'Pro-Pyme (14D)') currentTaxRate = 0.25; // O tasa transitoria 12.5% pero usamos la normal
      else if (regime === 'Holding Exterior') currentTaxRate = 0.35; // Considerando impuesto adicional

      const currentTaxCalc = ebitdaCLP * currentTaxRate;

      // Impuesto Optimizado (Meta)
      // Una buena optimización puede bajar la base imponible o utilizar créditos (I+D, DFL2, etc)
      let optimizationFactor = 0;
      if (industry === 'Tecnología / SaaS') optimizationFactor = 0.35; // Alto I+D
      else if (industry === 'Manufactura / Exportación') optimizationFactor = 0.28; // Recuperación IVA
      else if (industry === 'Real Estate / Inmobiliaria') optimizationFactor = 0.40; // Beneficios inmobiliarios
      else optimizationFactor = 0.25; // Servicios profesionales

      // Si ya tiene Pro-Pyme, el margen de mejora baja
      if (regime === 'Pro-Pyme (14D)') optimizationFactor -= 0.1;

      const taxSavings = currentTaxCalc * Math.max(0.15, optimizationFactor); // Al menos 15% de ahorro
      const optimizedTaxCalc = currentTaxCalc - taxSavings;

      setScore(Math.round(finalScore));
      setCurrentTax(Math.round(currentTaxCalc));
      setOptimizedTax(Math.round(optimizedTaxCalc));
      setRecovery(Math.round(taxSavings));
      setIsCalculating(false);
      
    }, 600); // 600ms de "pensamiento"

    return () => clearTimeout(timer);
  }, [revenue, margin, industry, regime]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] w-full max-w-5xl rounded-2xl shadow-2xl relative border border-white/10 flex flex-col md:flex-row overflow-hidden my-auto animate-in zoom-in-95 duration-300">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#EFEDE8]/50 hover:text-white transition-colors z-20 bg-black/20 rounded-full p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Panel Izquierdo: Inputs (Variables) */}
        <div className="w-full md:w-5/12 p-6 md:p-8 lg:p-10 border-b md:border-b-0 md:border-r border-white/5 relative bg-[#1A1A1A]/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C5A059] to-transparent"></div>
          
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-2 flex items-center gap-3">
              <Calculator className="text-[#C5A059] w-6 h-6" />
              Simulador de Rentabilidad
            </h2>
            <p className="text-[#EFEDE8]/50 text-xs leading-relaxed">
              Modifica los parámetros de tu empresa para descubrir instantáneamente tu potencial de ahorro fiscal anual y capital recuperable.
            </p>
          </div>

          <div className="space-y-8">
            {/* Input Facturación */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                  Facturación Anual (USD)
                </label>
                <span className="text-white font-mono font-bold">${revenue.toFixed(1)}M</span>
              </div>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="0.5"
                  max="15.0"
                  step="0.5"
                  value={revenue}
                  onChange={(e) => setRevenue(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#2D2D2D] rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                />
                <div className="flex justify-between text-[#EFEDE8]/30 text-[8px] mt-1.5 px-1 font-mono">
                  <span>$0.5M</span>
                  <span>$7.5M</span>
                  <span>$15M+</span>
                </div>
              </div>
            </div>

            {/* Input Margen */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                  Margen EBITDA (%)
                </label>
                <span className="text-white font-mono font-bold">{margin}%</span>
              </div>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#2D2D2D] rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                />
                <div className="flex justify-between text-[#EFEDE8]/30 text-[8px] mt-1.5 px-1 font-mono">
                  <span>5%</span>
                  <span>30%</span>
                  <span>60%</span>
                </div>
              </div>
            </div>

            {/* Selects */}
            <div className="space-y-5">
              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#EFEDE8]/70 mb-1.5">
                  Sector Industrial
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 text-white py-3 px-4 rounded-sm text-sm focus:ring-1 focus:ring-[#C5A059] outline-none appearance-none cursor-pointer"
                >
                  <option>Tecnología / SaaS</option>
                  <option>Manufactura / Exportación</option>
                  <option>Real Estate / Inmobiliaria</option>
                  <option>Servicios Profesionales</option>
                  <option>Holding Exterior</option>
                  <option>Otro</option>
                </select>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#EFEDE8]/70 mb-1.5 flex justify-between items-center">
                  Régimen Tributario Actual
                  <HelpCircle className="w-3 h-3 text-[#EFEDE8]/30" />
                </label>
                <select
                  value={regime}
                  onChange={(e) => setRegime(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 text-white py-3 px-4 rounded-sm text-sm focus:ring-1 focus:ring-[#C5A059] outline-none appearance-none cursor-pointer"
                >
                  <option>General (14A)</option>
                  <option>Pro-Pyme (14D N°3)</option>
                  <option>Transparencia (14D N°8)</option>
                  <option>Holding Exterior</option>
                  <option>No estoy seguro</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Resultados (Data) */}
        <div className="w-full md:w-7/12 p-6 md:p-8 lg:p-10 relative flex flex-col justify-between">
          {/* Capa de carga (simulada) */}
          {isCalculating && (
            <div className="absolute inset-0 bg-[#111111]/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-r-2xl">
              <Activity className="w-12 h-12 text-[#C5A059] animate-spin" />
            </div>
          )}

          {/* Header del Dashboard */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#EFEDE8]/50 font-bold mb-1">Diagnóstico Financiero</h3>
              <p className="text-white text-sm">Escenario proyectado a 12 meses</p>
            </div>
            
            {/* Score Radial */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Score de Eficiencia</p>
                <p className="text-[#EFEDE8]/50 text-xs">Salud Estructural</p>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#2D2D2D" strokeWidth="4" fill="none" />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke={score > 70 ? "#10B981" : score > 40 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${score * 1.76} 176`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-serif font-bold text-white">{score}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparativa Antes/Después */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Carga Actual */}
            <div className="bg-[#1A1A1A] p-5 rounded-lg border border-red-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <ShieldAlert className="w-12 h-12 text-red-500" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#EFEDE8]/50 font-bold block mb-2">
                Carga Tributaria Teórica
              </span>
              <span className="text-2xl font-serif text-white block mb-1">
                CLP ${Math.round(currentTax / 1000000).toLocaleString('es-CL')}M
              </span>
              <div className="flex items-center gap-1.5 mt-3 text-red-400/80 text-xs">
                <TrendingUp className="w-3 h-3" /> Exposición Alta
              </div>
            </div>

            {/* Carga Optimizada */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#221c10] p-5 rounded-lg border border-[#C5A059]/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Percent className="w-12 h-12 text-[#C5A059]" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold block mb-2 flex justify-between">
                Carga Optimizada 
                <span className="bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded text-[8px]">-{(100 - (optimizedTax/currentTax)*100).toFixed(0)}%</span>
              </span>
              <span className="text-2xl font-serif text-white block mb-1">
                CLP ${Math.round(optimizedTax / 1000000).toLocaleString('es-CL')}M
              </span>
              <div className="flex items-center gap-1.5 mt-3 text-green-400/80 text-xs">
                <TrendingDown className="w-3 h-3" /> Estructura Eficiente
              </div>
            </div>
          </div>

          {/* El Gran Número (Ahorro) */}
          <div className="bg-black/40 p-6 sm:p-8 rounded-xl border border-white/5 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
            <div className="bg-gradient-to-br from-[#C5A059]/20 to-transparent p-4 rounded-full shrink-0">
              <BadgeDollarSign className="w-10 h-10 text-[#C5A059]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#EFEDE8]/50 block mb-2 font-bold">
                Capital Recuperable Estimado / Año
              </span>
              <div className="flex items-end justify-center sm:justify-start gap-2">
                <span className="text-4xl sm:text-5xl font-serif text-[#C5A059] leading-none">
                  ${recovery.toLocaleString('es-CL')}
                </span>
                <span className="text-[#EFEDE8]/30 font-mono text-sm mb-1">CLP</span>
              </div>
              <ul className="mt-4 text-[10px] text-[#EFEDE8]/50 text-left list-disc list-inside ml-2 space-y-1">
                {riskFactors.slice(0, 2).map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[9px] text-[#EFEDE8]/40 uppercase tracking-wider max-w-xs text-center sm:text-left">
                * Simulación preliminar basada en el marco tributario chileno vigente. No constituye asesoría legal vinculante.
              </p>
              <a
                href="#contacto"
                onClick={onClose}
                className="w-full sm:w-auto bg-[#C5A059] text-[#1A1A1A] py-3.5 px-8 rounded-sm font-bold uppercase text-[11px] tracking-widest hover:bg-white hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all flex items-center justify-center gap-2"
              >
                Auditar Mi Empresa 
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}