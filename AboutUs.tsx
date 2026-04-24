export function AboutUs() {
  return (
    <section id="quienes-somos" className="py-20 px-6 bg-[#EFEDE8] border-b border-[#1A1A1A]/5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <div className="w-full md:w-1/2 relative group">
          <div className="absolute inset-0 bg-[#C5A059]/10 transform translate-x-4 translate-y-4 rounded-sm transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
          <img
            src="/Juan%20Luis%20Oficina%20Nueva.jpeg"
            alt="Fundador Requin & Asociados"
            className="relative z-10 w-full object-cover h-[450px] rounded-sm shadow-xl transition-all duration-700"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="relative z-10 w-full h-[450px] bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] rounded-sm shadow-xl items-center justify-center hidden">
            <div className="text-center text-[#EFEDE8] p-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[#C5A059]/20 flex items-center justify-center">
                <span className="text-6xl font-serif text-[#C5A059]">R&A</span>
              </div>
              <p className="text-sm italic opacity-80">Excelencia en Arquitectura Financiera</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-6">
          <span className="text-[#C5A059] text-xs font-bold tracking-[0.2em] uppercase">
            Quiénes Somos
          </span>
          <h2 className="text-3xl font-serif text-[#1A1A1A] leading-tight">
            Estrategia, control y protección patrimonial para emprendedores y empresas consolidadas.
          </h2>
          <div className="w-12 h-1 bg-[#C5A059]"></div>
          <p className="text-[#1A1A1A]/70 leading-relaxed font-light">
            En Requin & Asociados, no nos limitamos a reportar el pasado financiero; diseñamos el futuro corporativo. Nuestra metodología integra el rigor contable con estrategias legales de vanguardia, creando estructuras blindadas que maximizan la rentabilidad en entornos económicos inestables.
          </p>
          <p className="text-[#1A1A1A]/70 leading-relaxed font-light">
            Nuestra priorización de la discreción, precisión y visión global nos convierten en el aliado definitivo para el escalamiento seguro de sus operaciones y proyectos más ambiciosos.
          </p>
        </div>
      </div>
    </section>
  );
}
