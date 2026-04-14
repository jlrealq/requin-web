import { Shield, Award, Building, Globe, Users, CheckCircle } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Compliance 100%',
      description: 'Todas nuestras estructuras cumplen normativa local e internacional'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: '+15 Años',
      description: 'Experiencia en arquitectura financiera y tributaria'
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: '+120 Empresas',
      description: 'Han confiado en nuestra metodología'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Chile - España - Europa',
      description: 'Especialistas en estructuras internacionales'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Equipo Multidisciplinario',
      description: 'Contadores, abogados y estrategas financieros'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: '$45M+ USD',
      description: 'En ahorro fiscal acumulado para clientes'
    }
  ];

  return (
    <section className="py-16 px-6 bg-white border-y border-[#1A1A1A]/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-serif text-[#1A1A1A] mb-2">
            Por qué confiar en Requin & Asociados
          </h3>
          <p className="text-[#1A1A1A]/60 text-sm">
            Respaldo, experiencia y resultados comprobables
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="text-center p-4 hover:bg-[#EFEDE8] rounded-sm transition-colors group"
            >
              <div className="text-[#C5A059] mb-3 flex justify-center group-hover:scale-110 transition-transform">
                {badge.icon}
              </div>
              <div className="font-bold text-sm text-[#1A1A1A] mb-1">
                {badge.title}
              </div>
              <div className="text-xs text-[#1A1A1A]/60 leading-tight">
                {badge.description}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-[#1A1A1A]/60">
            <Shield className="w-4 h-4 text-[#C5A059]" />
            <span>
              Todas nuestras operaciones están respaldadas por pólizas de responsabilidad profesional
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
