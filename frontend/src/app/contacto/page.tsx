'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0A2647] to-[#144272] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              <span className="text-[#C69B56]">Contáctanos</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Estamos aquí para ayudarte a encontrar tu hogar ideal
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Contenido Principal */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Información de Contacto */}
          <div>
            <h2 className="text-4xl font-bold text-[#0A2647] mb-8">
              Información de Contacto
            </h2>
            
            {/* Tarjetas de Contacto */}
            <div className="space-y-6">
              {/* Dirección */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-[#C69B56]">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">📍</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0A2647] mb-2">Dirección</h3>
                    <p className="text-gray-600">
                      Av. Principal 1234, Piso 5<br />
                      Ciudad Autónoma de Buenos Aires<br />
                      CP: 1425
                    </p>
                  </div>
                </div>
              </div>

              {/* Teléfono */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-[#C69B56]">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">📞</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0A2647] mb-2">Teléfono</h3>
                    <p className="text-gray-600">
                      <a href="tel:+541112345678" className="hover:text-[#C69B56] transition-colors">
                        +54 11 1234-5678
                      </a>
                      <br />
                      <a href="tel:+541187654321" className="hover:text-[#C69B56] transition-colors">
                        +54 11 8765-4321
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-[#C69B56]">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">📧</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0A2647] mb-2">Email</h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@inmohogar.com" className="hover:text-[#C69B56] transition-colors">
                        info@inmohogar.com
                      </a>
                      <br />
                      <a href="mailto:ventas@inmohogar.com" className="hover:text-[#C69B56] transition-colors">
                        ventas@inmohogar.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-[#C69B56]">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">🕐</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0A2647] mb-2">Horarios de Atención</h3>
                    <p className="text-gray-600">
                      Lunes a Viernes: 9:00 - 19:00<br />
                      Sábados: 9:00 - 14:00<br />
                      Domingos: Cerrado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold text-[#0A2647] mb-6">
                Envíanos un Mensaje
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
                  <p className="font-bold">¡Mensaje enviado con éxito!</p>
                  <p>Nos pondremos en contacto contigo pronto.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-semibold text-[#0A2647] mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C69B56] focus:border-transparent transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 [color-scheme:light]"
                    placeholder="Tu nombre"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#0A2647] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C69B56] focus:border-transparent transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 [color-scheme:light]"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="block text-sm font-semibold text-[#0A2647] mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C69B56] focus:border-transparent transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 [color-scheme:light]"
                    placeholder="+54 11 1234-5678"
                  />
                </div>

                {/* Asunto */}
                <div>
                  <label htmlFor="asunto" className="block text-sm font-semibold text-[#0A2647] mb-2">
                    Asunto *
                  </label>
                  <select
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C69B56] focus:border-transparent transition-all duration-300 bg-white text-gray-900 [color-scheme:light]"
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="compra">Consulta sobre Compra</option>
                    <option value="venta">Consulta sobre Venta</option>
                    <option value="alquiler">Consulta sobre Alquiler</option>
                    <option value="tasacion">Solicitar Tasación</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                {/* Mensaje */}
                <div>
                  <label htmlFor="mensaje" className="block text-sm font-semibold text-[#0A2647] mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C69B56] focus:border-transparent transition-all duration-300 resize-none bg-white text-gray-900 placeholder-gray-500 [color-scheme:light]"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                  />
                </div>

                {/* Botón de Envío */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-[#C69B56] to-[#B38A45] text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#B38A45] hover:to-[#C69B56]'
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
                    'Enviar Mensaje'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      </div>
      <Footer />
    </div>
  );
}
