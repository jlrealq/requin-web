import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';
const logoUrl = '/Logo-Requin.jpg';

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#EFEDE8] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <img 
              src={logoUrl} 
              alt="Requin & Asociados" 
              className="h-16 w-auto object-contain mb-4 mix-blend-screen invert"
            />
            <h3 className="font-serif text-xl mb-4 text-[#C5A059] hidden">Requin & Asociados</h3>
            <p className="text-[#EFEDE8]/70 text-sm leading-relaxed">
              Arquitectura Financiera de Élite para empresas que buscan crecer de manera segura y eficiente.
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase text-xs tracking-widest mb-4 text-[#C5A059]">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-[#EFEDE8]/70">
                <Mail className="w-4 h-4" />
                <a href="mailto:contacto@requinspa.com" className="hover:text-[#C5A059] transition">
                  contacto@requinspa.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#EFEDE8]/70">
                <span>🇨🇱</span>
                <a href="tel:+56993260101" className="hover:text-[#C5A059] transition">
                  +56 9 9326 0101
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#EFEDE8]/70">
                <span>🇪🇸</span>
                <a href="tel:+34682028354" className="hover:text-[#C5A059] transition">
                  +34 682 02 8354
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#EFEDE8]/70">
                <MapPin className="w-4 h-4" />
                <span>Santiago, Chile</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase text-xs tracking-widest mb-4 text-[#C5A059]">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/requin-asociados"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#2D2D2D] hover:bg-[#C5A059] rounded-full flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#EFEDE8]/10 pt-8 text-center text-xs text-[#EFEDE8]/50">
          <p>&copy; {new Date().getFullYear()} Requin & Asociados. Todos los derechos reservados.</p>
          <p className="mt-2">Diseñado para la excelencia financiera</p>
        </div>
      </div>
    </footer>
  );
}
