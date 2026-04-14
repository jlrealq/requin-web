import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle2, AlertCircle, ShieldCheck, Timer } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  _gotcha: string; // Honeypot field para Formspree
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [utms, setUtms] = useState<{ source: string, medium: string, campaign: string }>({
    source: '', medium: '', campaign: ''
  });

  // Extraer parámetros UTM para rastreo
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setUtms({
        source: urlParams.get('utm_source') || 'direct',
        medium: urlParams.get('utm_medium') || 'web',
        campaign: urlParams.get('utm_campaign') || 'organic'
      });
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields, touchedFields },
    reset,
    watch
  } = useForm<ContactFormData>({
    mode: 'onChange' // Permite validación en tiempo real
  });

  const onSubmit = async (data: ContactFormData) => {
    // Si el honeypot está lleno, es spam
    if (data._gotcha) return;

    setSubmitting(true);
    setError(false);

    try {
      // Inyectar UTMs ocultos al payload
      const finalData = {
        ...data,
        utm_source: utms.source,
        utm_medium: utms.medium,
        utm_campaign: utms.campaign
      };

      const response = await fetch('https://formspree.io/f/mvzrarkk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalData)
      });

      if (response.ok) {
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 8000);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const InputWrapper = ({ children, fieldName, errorMsg }: any) => {
    const isTouched = touchedFields[fieldName as keyof ContactFormData];
    const hasError = !!errors[fieldName as keyof ContactFormData];
    const isValid = isTouched && !hasError;

    return (
      <div className="relative">
        {children}
        {isValid && (
          <CheckCircle2 className="absolute right-3 top-10 w-4 h-4 text-green-500 pointer-events-none" />
        )}
        {errorMsg && (
          <p className="text-red-400 text-[10px] uppercase tracking-wider mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errorMsg}
          </p>
        )}
      </div>
    );
  };

  return (
    <section id="contacto" className="py-24 px-6 bg-[#1A1A1A] text-[#EFEDE8] relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/10 text-[#C5A059] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-[#C5A059]/20">
            <Timer className="w-4 h-4 animate-pulse" />
            Últimos 3 cupos este mes
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white">Solicita tu Diagnóstico Gratuito</h2>
          <p className="text-[#EFEDE8]/60 text-sm md:text-base max-w-xl mx-auto">
            Descubre cuánto capital estás perdiendo por ineficiencias fiscales y estructurales. Completa el formulario y nuestro equipo experto te contactará en menos de 24 horas.
          </p>
        </div>

        {submitted && (
          <div className="mb-8 p-6 bg-green-500/10 border-l-4 border-green-500 rounded-r-md flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-green-500/20 p-3 rounded-full shrink-0">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-green-500 font-bold text-lg mb-1">¡Solicitud Recibida con Éxito!</h3>
              <p className="text-[#EFEDE8]/80 text-sm">
                Hemos enviado una confirmación a tu correo. Un socio de Requin & Asociados analizará tu perfil y te contactará a la brevedad para agendar tu diagnóstico de 30 minutos.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-md flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <p className="text-red-500 text-sm">Hubo un error de conexión al enviar el mensaje. Por favor, intenta nuevamente o escríbenos por WhatsApp.</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-[#2D2D2D]/50 p-8 md:p-10 rounded-2xl border border-white/5 backdrop-blur-sm shadow-2xl">
          
          {/* Honeypot anti-spam de Formspree (invisible para el usuario) */}
          <input type="text" {...register('_gotcha')} className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWrapper fieldName="name" errorMsg={errors.name?.message}>
              <label className="block text-[10px] uppercase tracking-widest text-[#C5A059] mb-2 font-bold">
                Nombre Completo *
              </label>
              <input
                {...register('name', { required: 'El nombre es requerido', minLength: { value: 3, message: 'Nombre demasiado corto' } })}
                className={`w-full bg-[#1A1A1A] border ${errors.name ? 'border-red-500/50 focus:ring-red-500/20' : touchedFields.name && !errors.name ? 'border-green-500/50 focus:ring-green-500/20' : 'border-white/10 focus:ring-[#C5A059]/30'} text-white py-3.5 px-4 rounded-sm focus:ring-2 focus:border-transparent transition-all outline-none`}
                placeholder="Ej. Juan Pérez"
              />
            </InputWrapper>

            <InputWrapper fieldName="email" errorMsg={errors.email?.message}>
              <label className="block text-[10px] uppercase tracking-widest text-[#C5A059] mb-2 font-bold">
                Email Corporativo *
              </label>
              <input
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Ingresa un email válido'
                  }
                })}
                type="email"
                className={`w-full bg-[#1A1A1A] border ${errors.email ? 'border-red-500/50 focus:ring-red-500/20' : touchedFields.email && !errors.email ? 'border-green-500/50 focus:ring-green-500/20' : 'border-white/10 focus:ring-[#C5A059]/30'} text-white py-3.5 px-4 rounded-sm focus:ring-2 focus:border-transparent transition-all outline-none pr-10`}
                placeholder="juan@tuempresa.com"
              />
            </InputWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWrapper fieldName="phone" errorMsg={errors.phone?.message}>
              <label className="block text-[10px] uppercase tracking-widest text-[#C5A059] mb-2 font-bold">
                Teléfono / WhatsApp *
              </label>
              <input
                {...register('phone', { 
                  required: 'El teléfono es requerido',
                  pattern: { value: /^\+?[0-9\s-]{8,}$/, message: 'Formato de teléfono inválido' }
                })}
                type="tel"
                className={`w-full bg-[#1A1A1A] border ${errors.phone ? 'border-red-500/50 focus:ring-red-500/20' : touchedFields.phone && !errors.phone ? 'border-green-500/50 focus:ring-green-500/20' : 'border-white/10 focus:ring-[#C5A059]/30'} text-white py-3.5 px-4 rounded-sm focus:ring-2 focus:border-transparent transition-all outline-none pr-10`}
                placeholder="+56 9 9326 0101"
              />
            </InputWrapper>

            <InputWrapper fieldName="company">
              <label className="block text-[10px] uppercase tracking-widest text-[#C5A059] mb-2 font-bold">
                Empresa
              </label>
              <input
                {...register('company')}
                className="w-full bg-[#1A1A1A] border border-white/10 text-white py-3.5 px-4 rounded-sm focus:ring-2 focus:ring-[#C5A059]/30 focus:border-transparent transition-all outline-none"
                placeholder="Mi Empresa SpA"
              />
            </InputWrapper>
          </div>

          <InputWrapper fieldName="message" errorMsg={errors.message?.message}>
            <label className="block text-[10px] uppercase tracking-widest text-[#C5A059] mb-2 font-bold">
              Desafío Principal *
            </label>
            <textarea
              {...register('message', { 
                required: 'Cuéntanos un poco sobre tu situación',
                minLength: { value: 10, message: 'El mensaje es muy corto' }
              })}
              rows={4}
              className={`w-full bg-[#1A1A1A] border ${errors.message ? 'border-red-500/50 focus:ring-red-500/20' : touchedFields.message && !errors.message ? 'border-green-500/50 focus:ring-green-500/20' : 'border-white/10 focus:ring-[#C5A059]/30'} text-white py-3.5 px-4 rounded-sm focus:ring-2 focus:border-transparent transition-all outline-none resize-none`}
              placeholder="¿Buscas optimizar impuestos, reestructurar tu empresa, expandirte a España...?"
            />
          </InputWrapper>

          <div className="pt-4 flex flex-col md:flex-row items-center gap-6">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full md:w-auto bg-gradient-to-r from-[#C5A059] to-[#D4B171] text-[#1A1A1A] py-4 px-10 rounded-sm font-bold uppercase text-xs tracking-[0.2em] hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${submitting ? 'scale-95' : 'hover:-translate-y-1'}`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#1A1A1A]/30 border-t-[#1A1A1A] rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : (
                <>
                  Solicitar Diagnóstico Ahora
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
            
            <div className="flex items-center gap-2 text-[#EFEDE8]/40 text-[10px] uppercase tracking-widest font-medium">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Tus datos están protegidos y encriptados</span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}