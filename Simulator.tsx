import { useState, useEffect } from 'react';
import { X, Calculator } from 'lucide-react';

interface SimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Simulator({ isOpen, onClose }: SimulatorProps) {
  const [revenue, setRevenue] = useState(2.5);
  const [margin, setMargin] = useState(24);
  const [industry, setIndustry] = useState('Tecnología / SaaS');
  const [regime, setRegime] = useState('General (14A)');
  const [score, setScore] = useState(78);
  const [recovery, setRecovery] = useState(142500);

  useEffect(() => {
    const calculateScore = () => {
      let baseScore = 50;

      if (revenue > 5) baseScore += 15;
      else if (revenue > 2) baseScore += 10;
      else baseScore += 5;

      if (margin > 30) baseScore += 15;
      else if (margin > 20) baseScore += 10;
      else baseScore += 5;

      if (industry === 'Tecnología / SaaS') baseScore += 10;
      else if (industry === 'Servicios Profesionales') baseScore += 8;
      else baseScore += 5;

      if (regime === 'Pro-Pyme (14D)') baseScore += 10;
      else if (regime === 'Holding Exterior') baseScore += 15;
      else baseScore += 5;

      return Math.min(100, baseScore);
    };

    const calculateRecovery = () => {
      const ebitda = revenue * 1000000 * (margin / 100);
      let taxSavings = 0;

      if (regime === 'General (14A)') {
        taxSavings = ebitda * 0.27;
      } else if (regime === 'Pro-Pyme (14D)') {
        taxSavings = ebitda * 0.25;
      } else {
        taxSavings = ebitda * 0.20;
      }

      const optimizationFactor = industry === 'Tecnología / SaaS' ? 0.35 :
                                  industry === 'Real Estate / Inmobiliaria' ? 0.40 : 0.30;

      return Math.round(taxSavings * optimizationFactor);
    };

    setScore(calculateScore());
    setRecovery(calculateRecovery());
  }, [revenue, margin, industry, regime]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-[#1A1A1A] max-w-2xl w-full rounded-lg shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#EFEDE8] hover:text-[#C5A059] transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Calculator className="w-8 h-8 text-[#C5A059]" />
              <h2 className="text-3xl font-serif text-[#EFEDE8]">Simulador de Eficiencia</h2>
            </div>
            <p className="text-[#EFEDE8]/60 text-sm">
              Proyección preliminar de optimización fiscal y financiera
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <div className="flex justify-between mb-3">
                <label className="text-xs uppercase tracking-widest text-[#C5A059]">
                  Facturación Anual
                </label>
                <span className="text-[#C5A059] font-bold">USD {revenue.toFixed(1)}M</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.5"
                value={revenue}
                onChange={(e) => setRevenue(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#2D2D2D] rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-3">
                <label className="text-xs uppercase tracking-widest text-[#C5A059]">
                  Margen EBITDA
                </label>
                <span className="text-[#C5A059] font-bold">{margin}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={margin}
                onChange={(e) => setMargin(parseInt(e.target.value))}
                className="w-full h-2 bg-[#2D2D2D] rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#EFEDE8]/60 mb-2">
                  Industria
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-[#2D2D2D] border border-[#C5A059]/20 text-[#EFEDE8] py-3 px-4 rounded-sm focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                >
                  <option>Tecnología / SaaS</option>
                  <option>Manufactura / Exportación</option>
                  <option>Real Estate / Inmobiliaria</option>
                  <option>Servicios Profesionales</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#EFEDE8]/60 mb-2">
                  Régimen Tributario
                </label>
                <select
                  value={regime}
                  onChange={(e) => setRegime(e.target.value)}
                  className="w-full bg-[#2D2D2D] border border-[#C5A059]/20 text-[#EFEDE8] py-3 px-4 rounded-sm focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                >
                  <option>General (14A)</option>
                  <option>Pro-Pyme (14D)</option>
                  <option>Holding Exterior</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#2D2D2D] p-8 rounded-lg border border-[#C5A059]/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#2D2D2D"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#C5A059"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${score * 3.51} 351`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-serif text-[#C5A059]">{score}</span>
                    <span className="text-[8px] uppercase tracking-tighter text-[#EFEDE8]/50">
                      Score Fiscal
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center md:text-right flex-1">
                <span className="text-xs uppercase tracking-[0.2em] text-[#EFEDE8]/50 block mb-2">
                  Ahorro Fiscal Anual Estimado
                </span>
                <span className="text-4xl md:text-5xl font-serif text-[#C5A059] block">
                  ${recovery.toLocaleString('es-CL')}
                </span>
                <p className="text-xs text-[#EFEDE8]/60 mt-4 max-w-md">
                  * Estimación basada en optimización fiscal legal. Resultados reales varían según cada caso.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="#contacto"
              onClick={onClose}
              className="inline-block bg-[#C5A059] text-[#1A1A1A] py-4 px-8 rounded-sm font-bold uppercase text-sm tracking-widest hover:bg-[#D4B171] transition-colors"
            >
              Solicitar Análisis Detallado
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
