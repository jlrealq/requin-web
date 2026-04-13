import { Wallet, Scale, ClipboardList, TrendingUp } from 'lucide-react';

export function Services() {
  const services = [
    {
      icon: <Wallet className="w-8 h-8" />,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
      title: 'Contabilidad y Auditoría Estratégica',
      items: [
        {
          title: 'Visión Financiera Clara',
          description: 'Contabilidad analítica diseñada para revelar oportunidades ocultas de rentabilidad y optimización de costos estructurales.'
        },
        {
          title: 'Auditoría de Alto Nivel',
          description: 'Dictámenes independientes y rigurosos que brindan certeza y solidez absoluta a inversores, bancos y directorios.'
        },
        {
          title: 'Auditoría Forense y Peritajes',
          description: 'Investigación corporativa especializada para la prevención, detección de fraudes y recuperación de activos con total respaldo legal y probatorio.'
        }
      ]
    },
    {
      icon: <Scale className="w-8 h-8" />,
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
      title: 'Asesoramiento Legal Especializado',
      items: [
        {
          title: 'Estrategia Tributaria Premium',
          description: 'Planificación fiscal inteligente de carácter internacional, que maximiza sus márgenes de beneficio respetando siempre el más estricto cumplimiento normativo (Compliance).'
        },
        {
          title: 'Blindaje Patrimonial Corporativo',
          description: 'Asesoría táctica en derecho civil y diseño de contratos para estructurar su negocio, blindando el patrimonio frente a exposiciones legales contingentes.'
        },
        {
          title: 'Derecho Laboral Preventivo',
          description: 'Modelamiento de políticas internas y contratos dinámicos que garantizan agilidad operativa, minimizando las fricciones sindicales y litigios prolongados.'
        }
      ]
    },
    {
      icon: <ClipboardList className="w-8 h-8" />,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      title: 'Estructuración de Proyectos corporativos',
      items: [
        {
          title: 'Evaluación Financiera Avanzada',
          description: 'Construcción de modelos econométricos robustos (VAN, TIR) y análisis de escenarios de estrés para asegurar la viabilidad comercial inobjetable antes de realizar la inversión.'
        },
        {
          title: 'Puesta en Marcha Táctica',
          description: 'Acompañamiento directivo en el despliegue fundacional del negocio, mitigando tempranamente brechas e ineficiencias mediante un enfoque ágil.'
        },
        {
          title: 'Cuadros de Mando (KPIs)',
          description: 'Diseño e implementación de tableros de control gerencial que orquestan el flujo de datos para una toma de decisiones informada, en tiempo real y orientada a la utilidad.'
        }
      ]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=800',
      title: 'Levantamiento de Capital y Financiamiento',
      items: [
        {
          title: 'Inyección de Fondos Públicos',
          description: 'Arquitectura integral de postulación a líneas de financiamiento gubernamentales (CORFO y fondos europeos) para subvencionar programas de innovación minimizando su exposición pecuniaria.'
        },
        {
          title: 'Private Equity y M&A',
          description: 'Conexión estratégica y negociación para procesos de inversión y adquisiciones, sincronizados perfectamente con las expectativas de salida o milestone de su crecimiento.'
        },
        {
          title: 'Estructuración de Deuda Inteligente',
          description: 'Calibración de pasivos corporativos y apalancamiento que otorga liquidez y agilidad sin asfixiar la caja operativa del núcleo del negocio.'
        }
      ]
    }
  ];

  return (
    <section id="servicios" className="py-20 px-6 bg-[#EFEDE8]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 border-l-4 border-[#C5A059] pl-4">
          <h2 className="text-2xl font-serif uppercase tracking-tight text-[#1A1A1A]">Servicios Premium</h2>
          <p className="text-[#1A1A1A]/50 text-sm mt-2">Soluciones de élite para desafíos globales.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white/80 flex flex-col border border-[#1A1A1A]/5 group hover:bg-white transition-all cursor-pointer overflow-hidden rounded-sm shadow-sm hover:shadow-lg"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#1A1A1A]/20 group-hover:bg-[#1A1A1A]/0 transition-colors duration-500"></div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-[#C5A059] mb-4">{service.icon}</div>
                <h3 className="font-serif text-xl mb-4 font-bold text-[#1A1A1A]">
                  {service.title}
                </h3>
                <ul className="text-sm text-[#1A1A1A]/80 leading-relaxed space-y-3 flex-1">
                  {service.items.map((item, idx) => (
                    <li key={idx}>
                      <strong className="text-[#1A1A1A] block mb-1">{item.title}</strong>
                      {item.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
