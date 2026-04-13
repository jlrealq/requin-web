import { ArrowRight, TrendingUp, Building2, Globe2 } from 'lucide-react';
import { useState } from 'react';


export function CaseStudies() {
  const [activeCase, setActiveCase] = useState(0);

  const cases = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      company: 'TechFlow SpA',
      industry: 'SaaS B2B',
      challenge: 'Estructura inadecuada para levantar inversión Serie A',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800',
      situation: [
        'Startup tech con 3 años de operación y tracción validada',
        'Inversores interesados pero cuestionaban la estructura societaria',
        'Mezcla de activos personales y empresariales',
        'Falta de claridad en tabla de capitalización',
        'Carga tributaria del 27% sobre utilidades que querían reinvertir'
      ],
      solution: [
        'Creación de holding SpA con socios actuales y reserva para futuros inversionistas',
        'Separación clara de activos IP en sociedad independiente',
        'Implementación de régimen Pro-Pyme 14D para diferir impuestos',
        'Diseño de tabla de cap con anti-dilución y preferencias liquidación',
        'Preparación de data room y documentación para due diligence'
      ],
      results: [
        { metric: '$2.3M USD', label: 'Serie A levantada', icon: '💰' },
        { metric: '35%', label: 'Reducción carga fiscal anual', icon: '📉' },
        { metric: '40%', label: 'Incremento en valoración vs comparable', icon: '📈' },
        { metric: '8 semanas', label: 'Tiempo de implementación', icon: '⚡' }
      ],
      testimonial: {
        quote: 'Requin transformó nuestra estructura de caos a best-practice en 2 meses. Los inversores quedaron impresionados con la claridad.',
        author: 'Rodrigo Martínez, CEO TechFlow'
      }
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      company: 'Holding Familiar Valenzuela',
      industry: 'Real Estate & Inversiones',
      challenge: 'Sucesión familiar y expansión internacional sin plan',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      situation: [
        '3 generaciones con 12 empresas en diferentes rubros',
        'Sin separación patrimonial ni plan de sucesión',
        'Expansión a España en proceso sin estructura adecuada',
        'Conflictos potenciales entre herederos',
        'Doble tributación Chile-España no resuelta'
      ],
      solution: [
        'Creación de Family Office con gobierno corporativo claro',
        'Separación de activos operativos vs pasivos (inmuebles)',
        'Implementación de holding español con convenio doble tributación',
        'Protocolo familiar y acuerdo de accionistas vinculante',
        'Estructura fiduciaria para planificación sucesoria'
      ],
      results: [
        { metric: '12', label: 'Empresas ordenadas bajo holding', icon: '🏢' },
        { metric: '€800K', label: 'Ahorro anual tributario ESP-CHL', icon: '💶' },
        { metric: '3 generaciones', label: 'Con roles y responsabilidades claras', icon: '👨‍👩‍👧‍👦' },
        { metric: '100%', label: 'Alineamiento familiar logrado', icon: '✅' }
      ],
      testimonial: {
        quote: 'Pasamos de conflictos familiares constantes a una estructura profesional donde todos sabemos qué esperar. Invaluable.',
        author: 'María José Valenzuela, Directora Holding'
      }
    },
    {
      icon: <Globe2 className="w-8 h-8" />,
      company: 'Exportadora del Sur',
      industry: 'Exportación Agroindustrial',
      challenge: 'Doble tributación y complejidad operativa internacional',
      image: 'https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?auto=format&fit=crop&q=80&w=800',
      situation: [
        'Exportadora consolidada a 15 países europeos',
        'Operación europea desde Chile generaba doble tributación',
        'Sin separación entre producción y comercialización',
        'Márgenes presionados por carga fiscal del 45% efectiva',
        'Oportunidad de M&A pero estructura no preparada'
      ],
      solution: [
        'Creación de trading company en España para distribución europea',
        'Separación de producción (Chile) y comercialización (España)',
        'Optimización de precios de transferencia entre subsidiarias',
        'Implementación de treaty shopping legal bajo normativa UE',
        'Preparación para potencial venta a fondo de PE'
      ],
      results: [
        { metric: '42%', label: 'Reducción carga tributaria consolidada', icon: '📊' },
        { metric: '€1.2M', label: 'Ahorro fiscal anual recurrente', icon: '💰' },
        { metric: '6 meses', label: 'ROI de la inversión en reestructura', icon: '⏱️' },
        { metric: '$18M USD', label: 'Valoración en proceso M&A', icon: '🎯' }
      ],
      testimonial: {
        quote: 'La estructura que diseñó Requin no solo nos ahorró millones, nos posicionó para una venta exitosa que nunca creímos posible.',
        author: 'Andrés Poblete, Fundador'
      }
    }
  ];

  return (
    <section id="casos-exito" className="py-20 px-6 bg-[#EFEDE8]">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12 mt-16">
          <span className="text-[#C5A059] text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
            Casos de Éxito Detallados
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#1A1A1A] leading-tight mb-6">
            Transformaciones Reales
          </h2>
          <p className="text-[#1A1A1A]/70 text-lg max-w-3xl mx-auto">
            Resultados medibles en empresas que confiaron en nuestra metodología de arquitectura financiera.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {cases.map((caseItem, index) => (
            <button
              key={index}
              onClick={() => setActiveCase(index)}
              className={`flex items-center gap-2 px-6 py-3 rounded-sm font-bold text-sm uppercase tracking-wider transition-all ${
                activeCase === index
                  ? 'bg-[#C5A059] text-[#1A1A1A] shadow-lg'
                  : 'bg-white text-[#1A1A1A]/60 border border-[#1A1A1A]/10 hover:border-[#C5A059]/30'
              }`}
            >
              {caseItem.icon}
              <span className="hidden md:inline">{caseItem.industry}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-[#1A1A1A]/5">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={cases[activeCase].image}
              alt={cases[activeCase].company}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 text-[#EFEDE8]">
              <h3 className="text-3xl font-serif mb-2">{cases[activeCase].company}</h3>
              <p className="text-[#C5A059] uppercase text-sm font-bold tracking-wider">
                {cases[activeCase].industry}
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-8">
              <h4 className="text-2xl font-serif text-[#1A1A1A] mb-2">El Desafío</h4>
              <p className="text-lg text-[#C5A059] font-medium mb-4">
                {cases[activeCase].challenge}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h5 className="font-bold uppercase text-xs tracking-wider text-[#C5A059] mb-4">
                  Situación Inicial
                </h5>
                <ul className="space-y-3">
                  {cases[activeCase].situation.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#1A1A1A]/80">
                      <span className="text-[#C5A059] mt-1">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-bold uppercase text-xs tracking-wider text-[#C5A059] mb-4">
                  Nuestra Solución
                </h5>
                <ul className="space-y-3">
                  {cases[activeCase].solution.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#1A1A1A]/80">
                      <span className="text-[#C5A059] mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] rounded-lg p-8 mb-8">
              <h5 className="font-bold uppercase text-xs tracking-wider text-[#C5A059] mb-6 text-center">
                Resultados Alcanzados
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {cases[activeCase].results.map((result, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-4xl mb-2">{result.icon}</div>
                    <div className="text-2xl md:text-3xl font-serif text-[#C5A059] mb-2">
                      {result.metric}
                    </div>
                    <div className="text-xs text-[#EFEDE8]/70 uppercase tracking-wider">
                      {result.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#EFEDE8] border-l-4 border-[#C5A059] p-6 rounded-sm">
              <p className="text-[#1A1A1A]/80 italic leading-relaxed mb-3">
                "{cases[activeCase].testimonial.quote}"
              </p>
              <p className="text-sm text-[#C5A059] font-bold">
                — {cases[activeCase].testimonial.author}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 bg-[#1A1A1A] text-[#EFEDE8] py-4 px-10 rounded-sm font-bold uppercase text-sm tracking-widest hover:bg-[#C5A059] hover:text-[#1A1A1A] transition-all shadow-lg group"
          >
            Logra Resultados Similares
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
