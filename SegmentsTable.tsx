export function SegmentsTable() {
  const segments = [
    {
      segment: 'Pymes con crecimiento sostenido',
      pain: 'Sienten que están pagando de más en impuestos o exponiéndose sin estructuras planificadas. Operan bien, pero su base financiera y tributaria no está preparada para el salto de escala.',
      solution: 'Estructura de Crecimiento',
      solutionDetail: 'Reestructuramos tu empresa para que tu carga fiscal se reduzca y tu estructura acompañe el crecimiento. Diseñamos una arquitectura financiera clara y sostenible, que soporte asociaciones, inversiones y expansión.'
    },
    {
      segment: 'Holdings y grupos empresariales familiares',
      pain: 'No tienen una visión global de su estructura patrimonial y empresarial. Tienen riesgos en sucesión, falta de separación de activos y exposición fiscal innecesaria.',
      solution: 'Orden Patrimonial',
      solutionDetail: 'Ordenamos tu grupo de empresas y patrimonios en una estructura coherente y defendible. Preparamos sucesión, separación de riesgos y expansión internacional, especialmente hacia España.'
    },
    {
      segment: 'Startups y empresas de alto crecimiento',
      pain: 'Su estructura fue pensada para la fase inicial y no resiste rondas de inversión o expansión. Temen errores básicos de estructuración que encarecen la internacionalización o una eventual salida.',
      solution: 'Arquitectura para Escalar',
      solutionDetail: 'Diseñamos una arquitectura financiera y legal pensada para inversionistas, due diligence y expansión. Ajustamos holdings, socios y activos para que el modelo sea sólido antes de la siguiente ronda o salida.'
    },
    {
      segment: 'Empresas con expansión a España u otros mercados',
      pain: 'No saben cómo estructurar procesos, socios y contratos en dos jurisdicciones. Temen pagar impuestos excesivos o exponerse legalmente por errores de diseño.',
      solution: 'Puente Internacional',
      solutionDetail: 'Creamos una estructura coordinada entre Chile y España (u otros mercados) que minimice impuestos y riesgos. Preparamos tu empresa para operar con menores fricciones, bases imponibles más bajas y cumplimiento seguro.'
    },
    {
      segment: 'Patrimonios y familias empresarias con visión global',
      pain: 'Mezclan activos operativos con personales sin separación clara. No tienen un plan de sucesión ni estructura preparada para transmisión ordenada.',
      solution: 'Protección de Legado',
      solutionDetail: 'Diseñamos una estructura patrimonial y empresarial que separe riesgos, proteja el legado y planifique la sucesión. Creamos una arquitectura que funcione tanto en Chile como en España, pensada en el largo plazo.'
    }
  ];

  return (
    <section id="segmentos" className="py-20 px-6 bg-white/50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 border-l-4 border-[#C5A059] pl-4">
          <h2 className="text-3xl font-serif text-[#1A1A1A] leading-tight">
            Para quién diseñamos nuestra arquitectura
          </h2>
          <p className="text-[#1A1A1A]/70 mt-4 max-w-3xl font-light">
            Ayudamos a pymes en crecimiento, holdings familiares, startups y empresas que preparan su expansión a España y otros mercados, diseñando estructuras financieras y legales que minimizan impuestos, riesgos y fricciones operativas.
          </p>
        </div>

        <div className="overflow-x-auto shadow-xl border border-[#1A1A1A]/5 rounded-sm">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-[#1A1A1A]/10 p-5 text-left text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Segmento
                </th>
                <th className="border border-[#1A1A1A]/10 p-5 text-left text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Principal dolor
                </th>
                <th className="border border-[#1A1A1A]/10 p-5 text-left text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Nuestra solución
                </th>
              </tr>
            </thead>
            <tbody>
              {segments.map((item, index) => (
                <tr key={index} className="hover:bg-[#FDFDFB] transition-colors">
                  <td className="border border-[#1A1A1A]/10 p-5 font-bold text-[#1A1A1A] text-sm">
                    {item.segment}
                  </td>
                  <td className="border border-[#1A1A1A]/10 p-5 text-[#1A1A1A]/80 text-sm leading-relaxed">
                    {item.pain}
                  </td>
                  <td className="border border-[#1A1A1A]/10 p-5 bg-[#C5A059]/5 text-[#1A1A1A]/90 text-sm leading-relaxed">
                    <span className="font-bold text-[#C5A059] block mb-2">{item.solution}</span>
                    {item.solutionDetail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
