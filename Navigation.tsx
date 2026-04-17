import { useState } from 'react';
import { Menu, X } from 'lucide-react';
const logoUrl = '/Logo-Requin.jpg';

interface NavigationProps {
  onSimulatorClick: () => void;
}

export function Navigation({ onSimulatorClick }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Quiénes Somos', href: '#quienes-somos' },
    { label: 'Para Quién', href: '#segmentos' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Casos de Éxito', href: '#testimonios' },
    { label: 'Noticias', href: '#noticias' },
    { label: 'FAQ', href: '#faq' }
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href === '#inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#EFEDE8]/95 backdrop-blur-md border-b border-[#1A1A1A]/5 px-6 py-4 flex justify-between items-center">
        <a href="#inicio" onClick={() => handleNavClick('#inicio')} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <img
            src={logoUrl}
            alt="Requin & Asociados Logo"
            className="h-16 md:h-20 w-auto object-contain mix-blend-multiply"
          />
          <div className="h-12 md:h-14 w-12 md:w-14 bg-[#1A1A1A] rounded-md items-center justify-center hidden">
            <span className="text-[#C5A059] font-bold text-2xl font-serif">R</span>
          </div>
          <span className="font-serif text-xl md:text-2xl font-bold tracking-tight uppercase text-[#1A1A1A]">
            Requin <span className="text-[#C5A059]">&</span> Asociados
          </span>
        </a>

        <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest items-center">
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className="hover:text-[#C5A059] transition text-[#1A1A1A]/80 whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={onSimulatorClick}
            className="hover:text-[#C5A059] transition text-[#1A1A1A]/80 cursor-pointer"
          >
            Rentabilidad
          </button>
          <a
            href="#contacto"
            className="bg-[#1A1A1A] px-4 py-2 text-[#EFEDE8] hover:bg-[#C5A059] transition"
          >
            Contacto
          </a>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1"
        >
          <Menu className="text-[#1A1A1A] w-6 h-6" />
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#1A1A1A]/95 backdrop-blur-md z-[60] flex flex-col justify-center items-center gap-8 text-[#EFEDE8] uppercase tracking-widest text-sm font-bold">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-[#EFEDE8] hover:text-[#C5A059] transition"
          >
            <X className="w-8 h-8" />
          </button>
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className="hover:text-[#C5A059] transition"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={() => {
              onSimulatorClick();
              setMobileMenuOpen(false);
            }}
            className="hover:text-[#C5A059] transition"
          >
            Rentabilidad
          </button>
          <a
            href="#contacto"
            onClick={() => handleNavClick('#contacto')}
            className="bg-[#C5A059] px-6 py-3 text-[#1A1A1A] rounded-sm"
          >
            Contacto
          </a>
        </div>
      )}
    </>
  );
}
