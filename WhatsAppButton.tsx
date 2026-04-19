import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const phoneNumber = '56993260101';
  const message = 'Hola, me gustaría obtener más información sobre los servicios de Requin & Asociados.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[100px] right-[28px] z-[9998] bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center w-[56px] h-[56px]"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#1A1A1A] text-[#EFEDE8] text-xs px-3 py-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        ¿Necesitas ayuda?
      </span>
    </a>
  );
}
