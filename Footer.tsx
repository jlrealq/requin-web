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
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[#EFEDE8]/70">
                  <span>🇨🇱</span>
                  <a href="tel:+56993260101" className="hover:text-[#C5A059] transition">
                    +56 9 9326 0101
                  </a>
                </div>
                <a
                  href="https://wa.me/56993260101"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 ml-6 text-[#EFEDE8]/50 hover:text-[#25D366] transition text-xs"
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>+56 9 9326 0101</span>
                </a>
                <a
                  href="https://t.me/Requinspa_Bot?start=web_requinspa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 ml-6 text-[#EFEDE8]/50 hover:text-[#229ED9] transition text-xs"
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span>Telegram @Requinspa_Bot</span>
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
