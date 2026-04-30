import { TrendingDown, Globe, CheckSquare, Calculator } from 'lucide-react';

interface HeroProps {
  onSimulatorClick?: () => void;
}

export function Hero({ onSimulatorClick }: HeroProps) {
  return (
    <header id="inicio" className="relative px-6 py-20 overflow-hidden bg-[#DED9D0]/30">
      <div className="absolute inset-0 bg-gradient-to-br from-[#EFEDE8] to-[#DED9D0] opacity-50"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="text-[#C5A059] text-xs font-bold tracking-[0.3em] uppercase mb-6 block underline decoration-[#C5A059]/30 underline-offset-8">
          Arquitectura Financiera de Élite
        </span>
        <h1 className="text-3xl md:text-6xl font-serif text-[#1A1A1A] leading-tight mb-8">
          Impulsamos el crecimiento de tu empresa o patrimonio con estructura, eficiencia y menor carga tributaria.
        </h1>
        <h2 className="text-lg md:text-xl text-[#1A1A1A]/80 font-light leading-relaxed mb-12 max-w-3xl mx-auto italic">
          Estrategia y Arquitectura Financiera de Élite.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
          <div className="bg-white/50 backdrop-blur-sm p-6 border border-[#C5A059]/10 rounded-sm">
            <div className="text-[#C5A059] mb-3">
              <TrendingDown className="w-6 h-6" />
            </div>
            <p className="text-sm text-[#1A1A1A]/80 leading-relaxed">
              Reducimos tu carga fiscal con total transparencia, diseñando estructuras que acompañan tu crecimiento real.
            </p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-6 border border-[#C5A059]/10 rounded-sm">
            <div className="text-[#C5A059] mb-3">
              <Globe className="w-6 h-6" />
            </div>
            <p className="text-sm text-[#1A1A1A]/80 leading-relaxed">
              Preparamos tu empresa y tu patrimonio para expansión internacional, sucesión y eventual venta, minimizando riesgos legales y tributarios.
            </p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-6 border border-[#C5A059]/10 rounded-sm">
            <div className="text-[#C5A059] mb-3">
              <CheckSquare className="w-6 h-6" />
            </div>
            <p className="text-sm text-[#1A1A1A]/80 leading-relaxed">
              Trabajamos en 3 etapas claras: diagnóstico integral, propuesta de arquitectura financiera y legal, y ejecución controlada junto a tu equipo.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a
            href="#contacto"
            className="inline-block text-center bg-[#1A1A1A] text-[#EFEDE8] py-4 px-10 rounded-sm font-medium hover:bg-[#C5A059] hover:text-[#1A1A1A] transition-all uppercase text-xs tracking-widest shadow-lg"
          >
            Solicitar Diagnóstico
          </a>
          <button
            onClick={onSimulatorClick}
            className="inline-flex items-center justify-center gap-2 text-center border-2 border-[#C5A059] bg-white text-[#1A1A1A] py-4 px-10 rounded-sm font-bold hover:bg-[#C5A059] hover:text-white transition-all uppercase text-xs tracking-widest shadow-md hover:shadow-lg group"
          >
            <Calculator className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Simulador de Ahorro Fiscal
          </button>
        </div>
      </div>
    </header>
  );
}
