import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setError(false);

    try {
      const response = await fetch('https://formspree.io/f/mvzrarkk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-20 px-6 bg-[#1A1A1A] text-[#EFEDE8]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif mb-4">Solicita tu Diagnóstico</h2>
          <p className="text-[#EFEDE8]/60 text-sm">
            Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.
          </p>
        </div>

        {submitted && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <p className="text-green-500 text-sm">¡Mensaje enviado con éxito! Te contactaremos pronto.</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-500 text-sm">Hubo un error al enviar el mensaje. Intenta nuevamente.</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-2">
                Nombre Completo *
              </label>
              <input
                {...register('name', { required: 'El nombre es requerido' })}
                className="w-full bg-[#2D2D2D] border border-[#C5A059]/20 text-[#EFEDE8] py-3 px-4 rounded-sm focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                placeholder="Juan Pérez"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-2">
                Email *
              </label>
              <input
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                type="email"
                className="w-full bg-[#2D2D2D] border border-[#C5A059]/20 text-[#EFEDE8] py-3 px-4 rounded-sm focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                placeholder="juan@empresa.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-2">
                Teléfono *
              </label>
              <input
                {...register('phone', { required: 'El teléfono es requerido' })}
                type="tel"
                className="w-full bg-[#2D2D2D] border border-[#C5A059]/20 text-[#EFEDE8] py-3 px-4 rounded-sm focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                placeholder="+56 9 9326 0101"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-2">
                Empresa
              </label>
              <input
                {...register('company')}
                className="w-full bg-[#2D2D2D] border border-[#C5A059]/20 text-[#EFEDE8] py-3 px-4 rounded-sm focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                placeholder="Mi Empresa SpA"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#C5A059] mb-2">
              Mensaje *
            </label>
            <textarea
              {...register('message', { required: 'El mensaje es requerido' })}
              rows={5}
              className="w-full bg-[#2D2D2D] border border-[#C5A059]/20 text-[#EFEDE8] py-3 px-4 rounded-sm focus:ring-2 focus:ring-[#C5A059] focus:border-transparent resize-none"
              placeholder="Cuéntanos sobre tu empresa y qué necesitas..."
            />
            {errors.message && (
              <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#C5A059] text-[#1A1A1A] py-4 px-8 rounded-sm font-bold uppercase text-sm tracking-widest hover:bg-[#D4B171] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-[#1A1A1A]/30 border-t-[#1A1A1A] rounded-full animate-spin"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar Mensaje
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
