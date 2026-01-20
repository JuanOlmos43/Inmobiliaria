'use client';

import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ContactInfoCard from '@/components/ContactInfoCard';
import FormInput from '@/components/FormInput';
import FormTextarea from '@/components/FormTextarea';
import FormSelect from '@/components/FormSelect';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulación de envío (aquí conectarías con tu backend)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      });
      
      // Resetear el mensaje de éxito después de 5 segundos
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="flex-grow bg-gray-50">
      {/* Hero Section */}
      <HeroSection 
        title="Contáctanos"
        subtitle="Estamos aquí para ayudarte a encontrar tu hogar ideal"
      />

      {/* Contenido Principal */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Información de Contacto */}
          <div>
            <h2 className="text-4xl font-bold text-[#0f172a] mb-8">
              Información de Contacto
            </h2>
            
            {/* Tarjetas de Contacto */}
            <div className="space-y-6">
              {/* Dirección */}
              <ContactInfoCard 
                icon={
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                }
                title="Dirección"
                content={
                  <>
                    Av. Principal 1234, Piso 5<br />
                    Entre Ríos<br />
                    CP: 3100
                  </>
                }
              />

              {/* Teléfono */}
              <ContactInfoCard 
                icon={
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                }
                title="Teléfono"
                content={
                  <>
                    <a href="tel:+541112345678" className="hover:text-[#14b8a6] transition-colors">
                      +54 11 1234-5678
                    </a>
                    <br />
                    <a href="tel:+541187654321" className="hover:text-[#14b8a6] transition-colors">
                      +54 11 8765-4321
                    </a>
                  </>
                }
              />

              {/* Email */}
              <ContactInfoCard 
                icon={
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                }
                title="Email"
                content={
                  <>
                    <a href="mailto:info@inmohogar.com" className="hover:text-[#14b8a6] transition-colors">
                      info@inmohogar.com
                    </a>
                    <br />
                    <a href="mailto:ventas@inmohogar.com" className="hover:text-[#14b8a6] transition-colors">
                      ventas@inmohogar.com
                    </a>
                  </>
                }
              />

              {/* Horarios */}
              <ContactInfoCard 
                icon={
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                  </svg>
                }
                title="Horarios de Atención"
                content={
                  <>
                    Lunes a Viernes: 9:00 - 19:00<br />
                    Sábados: 9:00 - 14:00<br />
                    Domingos: Cerrado
                  </>
                }
              />
              </div>
            </div>

          {/* Formulario de Contacto */}
          <div>
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">
                Envíanos un Mensaje
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded">
                  <p className="font-bold text-sm">¡Mensaje enviado con éxito!</p>
                  <p className="text-sm">Nos pondremos en contacto contigo pronto.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <FormInput
                  label="Nombre Completo"
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                  className="text-sm"
                />

                {/* Email */}
                <FormInput
                  label="Email"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                  className="text-sm"
                />

                {/* Teléfono */}
                <FormInput
                  label="Teléfono"
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+54 11 1234-5678"
                  className="text-sm"
                />

                {/* Asunto */}
                <FormSelect
                  label="Asunto"
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  required
                  className="text-sm"
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="compra">Consulta sobre Compra</option>
                  <option value="venta">Consulta sobre Venta</option>
                  <option value="alquiler">Consulta sobre Alquiler</option>
                </FormSelect>

                {/* Mensaje */}
                <FormTextarea
                  label="Mensaje"
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  className="text-sm"
                />

                {/* Botón de Envío */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-[#0f172a] to-[#334155] text-white py-3 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#334155] hover:to-[#0f172a]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Enviar Mensaje
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">o también puedes</span>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/5493434123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl gap-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span className="text-lg">Consultar por WhatsApp</span>
                </a>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
