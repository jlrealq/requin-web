import { Calendar, ArrowRight } from 'lucide-react';

import newsData from './src/data/news.json';

export function News() {
  const news = newsData;

  return (
    <section id="noticias" className="py-20 px-6 bg-[#EFEDE8]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 border-l-4 border-[#C5A059] pl-4">
          <h2 className="text-3xl font-serif text-[#1A1A1A] leading-tight">Noticias y Actualizaciones</h2>
          <p className="text-[#1A1A1A]/70 mt-4 max-w-3xl font-light">
            Mantente informado sobre las últimas novedades en arquitectura financiera, cambios normativos y tendencias del mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <article
              key={index}
              className="bg-white border border-[#1A1A1A]/5 rounded-sm p-6 hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2 text-xs text-[#C5A059] mb-3">
                <Calendar className="w-4 h-4" />
                <time>{new Date(item.date).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              </div>
              <span className="inline-block bg-[#C5A059]/10 text-[#C5A059] text-xs font-bold uppercase tracking-wider px-2 py-1 rounded mb-3">
                {item.category}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A] mb-3 group-hover:text-[#C5A059] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-[#1A1A1A]/70 leading-relaxed mb-4">
                {item.excerpt}
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-[#C5A059] group-hover:gap-3 transition-all">
                Leer más <ArrowRight className="w-4 h-4" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
