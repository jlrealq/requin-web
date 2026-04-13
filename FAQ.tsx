import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: '¿Cuánto tiempo toma el proceso de diagnóstico?',
      answer: 'El diagnóstico integral toma entre 2 a 4 semanas, dependiendo del tamaño y complejidad de tu empresa. Incluye análisis financiero, tributario, legal y de estructura corporativa.'
    },
    {
      question: '¿Trabajan con empresas fuera de Chile?',
      answer: 'Sí, especialmente con empresas que buscan expandirse a España y otros mercados europeos. Diseñamos estructuras binacionales que optimizan la carga fiscal en ambas jurisdicciones.'
    },
    {
      question: '¿Cuál es la inversión aproximada para sus servicios?',
      answer: 'Nuestros servicios se personalizan según cada caso. Después del diagnóstico inicial, presentamos una propuesta con alcance, cronograma y inversión específica. La mayoría de nuestros clientes recuperan la inversión en ahorros fiscales durante el primer año.'
    },
    {
      question: '¿Qué diferencia a Requin de otras consultoras?',
      answer: 'Integramos contabilidad, asesoría legal y estrategia financiera en una sola metodología. No solo reportamos, diseñamos estructuras que minimizan riesgos y maximizan rentabilidad a largo plazo.'
    },
    {
      question: '¿Necesito cambiar mi contador o abogado actual?',
      answer: 'No necesariamente. Podemos trabajar complementando tu equipo actual, o podemos asumir completamente la gestión financiera y legal según prefieras.'
    },
    {
      question: '¿Cómo miden el éxito de su trabajo?',
      answer: 'A través de KPIs concretos: reducción de carga fiscal, aumento de eficiencia operativa, preparación para inversión o venta, y cumplimiento normativo sin contingencias. Cada proyecto tiene métricas específicas acordadas con el cliente.'
    }
  ];

  return (
    <section id="faq" className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-[#1A1A1A] mb-4">Preguntas Frecuentes</h2>
          <p className="text-[#1A1A1A]/60 text-sm">
            Resolvemos las dudas más comunes sobre nuestros servicios
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[#1A1A1A]/10 rounded-sm overflow-hidden bg-[#EFEDE8]/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[#EFEDE8]/50 transition-colors"
              >
                <span className="font-bold text-[#1A1A1A] pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#C5A059] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-5 pb-5 text-[#1A1A1A]/80 leading-relaxed text-sm">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
