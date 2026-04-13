import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Rodrigo Martínez',
      position: 'CEO',
      company: 'TechFlow SpA',
      industry: 'SaaS',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      quote: 'Requin reestructuró completamente nuestra arquitectura financiera antes de nuestra Serie A. Redujimos la carga fiscal en 35% y logramos una valoración 40% superior gracias a la claridad de nuestra estructura.',
      results: [
        { metric: '35%', label: 'Reducción fiscal' },
        { metric: '$2.3M', label: 'Ahorro anual' }
      ],
      rating: 5
    },
    {
      name: 'María José Valenzuela',
      position: 'Directora',
      company: 'Holding Familiar Valenzuela',
      industry: 'Real Estate',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      quote: 'Necesitábamos ordenar 3 generaciones de empresas familiares. Requin diseñó una estructura que protege el patrimonio, facilita la sucesión y nos permitió expandirnos a España sin duplicar impuestos.',
      results: [
        { metric: '12', label: 'Empresas ordenadas' },
        { metric: '€800K', label: 'Ahorro fiscal España-Chile' }
      ],
      rating: 5
    },
    {
      name: 'Andrés Poblete',
      position: 'Fundador',
      company: 'Exportadora del Sur',
      industry: 'Exportación',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      quote: 'Antes de trabajar con Requin, pagábamos impuestos innecesarios por no tener separadas las operaciones de Chile y Europa. La nueva estructura nos ahorró más de lo que invertimos en 6 meses.',
      results: [
        { metric: '42%', label: 'Reducción de carga tributaria' },
        { metric: '6 meses', label: 'ROI de la inversión' }
      ],
      rating: 5
    },
    {
      name: 'Carolina Fernández',
      position: 'CFO',
      company: 'InnovaHealth',
      industry: 'HealthTech',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      quote: 'El due diligence para nuestra adquisición hubiera sido un caos sin la estructura que Requin implementó. Los compradores valoraron la claridad y transparencia, lo que aceleró el proceso y mejoró el precio.',
      results: [
        { metric: '22%', label: 'Incremento en valoración' },
        { metric: '45 días', label: 'Reducción tiempo DD' }
      ],
      rating: 5
    },
    {
      name: 'Juan Pablo Soto',
      position: 'Socio Fundador',
      company: 'FinanceHub',
      industry: 'Fintech',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      quote: 'Como fintech, el compliance es crítico. Requin no solo optimizó nuestra estructura tributaria, sino que blindó la operación legalmente. Pasamos auditorías de inversionistas institucionales sin observaciones.',
      results: [
        { metric: '100%', label: 'Compliance score' },
        { metric: '$4.5M', label: 'Ronda levantada' }
      ],
      rating: 5
    },
    {
      name: 'Patricia Muñoz',
      position: 'Gerente General',
      company: 'Alimentos Premium SA',
      industry: 'Alimentos',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
      quote: 'Llevábamos años con contadores tradicionales que solo "cumplían". Requin piensa estratégicamente: nos ayudaron a estructurar la expansión a 4 países nuevos minimizando riesgos y maximizando rentabilidad.',
      results: [
        { metric: '4 países', label: 'Expansión exitosa' },
        { metric: '28%', label: 'Ahorro fiscal consolidado' }
      ],
      rating: 5
    }
  ];

  return (
    <section id="testimonios" className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-[#EFEDE8] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C5A059] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C5A059] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#C5A059] text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
            Casos de Éxito
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#EFEDE8] leading-tight mb-6">
            Resultados que Hablan por Nosotros
          </h2>
          <p className="text-[#EFEDE8]/70 text-lg max-w-3xl mx-auto">
            Empresas de diversos sectores han confiado en nuestra arquitectura financiera para crecer de manera segura y eficiente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <article
              key={index}
              className="bg-[#2D2D2D] border border-[#C5A059]/10 rounded-lg p-6 hover:border-[#C5A059]/30 transition-all hover:shadow-xl hover:shadow-[#C5A059]/10 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-[#EFEDE8] mb-1">{testimonial.name}</h3>
                  <p className="text-xs text-[#EFEDE8]/60">
                    {testimonial.position}
                  </p>
                  <span className="inline-block mt-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    Sector {testimonial.industry}
                  </span>
                </div>
              </div>

              <div className="flex gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                ))}
              </div>

              <div className="relative mb-4">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#C5A059]/20" />
                <p className="text-sm text-[#EFEDE8]/80 leading-relaxed italic pl-6">
                  "{testimonial.quote}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#C5A059]/10">
                {testimonial.results.map((result, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl font-serif text-[#C5A059] mb-1">
                      {result.metric}
                    </div>
                    <div className="text-[10px] text-[#EFEDE8]/60 uppercase tracking-wider">
                      {result.label}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-[#EFEDE8]/50 text-sm mb-6">
            ¿Quieres resultados similares para tu empresa?
          </p>
          <a
            href="#contacto"
            className="inline-block bg-[#C5A059] text-[#1A1A1A] py-4 px-10 rounded-sm font-bold uppercase text-sm tracking-widest hover:bg-[#D4B171] transition-colors shadow-lg"
          >
            Solicita tu Diagnóstico Gratuito
          </a>
        </div>
      </div>
    </section>
  );
}
