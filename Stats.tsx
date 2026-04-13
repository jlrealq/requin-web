import { useEffect, useState, useRef } from 'react';

export function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const stats = [
    {
      value: 120,
      suffix: '+',
      label: 'Empresas Asesoradas',
      description: 'Desde startups hasta holdings consolidados'
    },
    {
      value: 45,
      suffix: 'M+',
      label: 'USD en Ahorro Fiscal',
      description: 'Acumulado para nuestros clientes'
    },
    {
      value: 15,
      suffix: '+',
      label: 'Años de Experiencia',
      description: 'En arquitectura financiera internacional'
    },
    {
      value: 98,
      suffix: '%',
      label: 'Tasa de Retención',
      description: 'Clientes satisfechos que renuevan'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
      <span>
        {count}
        {suffix}
      </span>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="py-16 px-6 bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 border border-[#C5A059]/20 rounded-lg backdrop-blur-sm bg-[#2D2D2D]/50 hover:bg-[#2D2D2D]/80 transition-all group"
            >
              <div className="text-4xl md:text-5xl font-serif text-[#C5A059] mb-2 group-hover:scale-110 transition-transform">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-bold text-[#EFEDE8] mb-2 text-sm md:text-base">
                {stat.label}
              </div>
              <div className="text-xs text-[#EFEDE8]/60 leading-tight">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
