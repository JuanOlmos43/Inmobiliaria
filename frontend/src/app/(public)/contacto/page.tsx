"use client";

import { useState } from "react";
import { HeroSection } from "@/components/features/home";
import {
  ContactInfoCard,
  FormInput,
  FormTextarea,
  FormSelect,
  Icon,
} from "@/components/ui";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulación de envío (aquí conectarías con tu backend)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      });

      // Resetear el mensaje de éxito después de 5 segundos
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="Contáctanos"
        subtitle="Estamos aquí para ayudarte a encontrar tu hogar ideal"
      />

      {/* Contenido Principal */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 md:grid-cols-2">
          {/* Información de Contacto */}
          <div>
            <h2 className="mb-8 text-4xl font-bold text-(--primary)">
              Información de Contacto
            </h2>

            {/* Tarjetas de Contacto */}
            <div className="space-y-6">
              {/* Dirección */}
              <ContactInfoCard
                icon={
                  <Icon
                    name="location"
                    className="h-6 w-6 text-white"
                    fill="currentColor"
                  />
                }
                title="Dirección"
                content={
                  <>
                    Av. Principal 1234, Piso 5<br />
                    Entre Ríos
                    <br />
                    CP: 3100
                  </>
                }
              />

              {/* Teléfono */}
              <ContactInfoCard
                icon={<Icon name="whatsapp" className="h-6 w-6 text-white" />}
                title="Teléfono"
                content={
                  <>
                    +54 11 1234-5678
                    <br />
                    +54 11 8765-4321
                  </>
                }
              />

              {/* Email */}
              <ContactInfoCard
                icon={<Icon name="mail" className="h-6 w-6 text-white" />}
                title="Email"
                content={
                  <>
                    info@inmohogar.com
                    <br />
                    ventas@inmohogar.com
                  </>
                }
              />

              {/* Horarios */}
              <ContactInfoCard
                icon={
                  <svg
                    className="h-6 w-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
                  </svg>
                }
                title="Horarios de Atención"
                content={
                  <>
                    Lunes a Viernes: 9:00 - 19:00
                    <br />
                    Sábados: 9:00 - 14:00
                    <br />
                    Domingos: Cerrado
                  </>
                }
              />
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div>
            <div className="rounded-2xl border-l-4 border-(--accent) bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold text-(--primary)">
                Envíanos un Mensaje
              </h2>

              {submitStatus === "success" && (
                <div className="mb-4 rounded border-l-4 border-(--success) bg-(--success)/20 p-3 text-(--success)">
                  <p className="text-sm font-bold">
                    ¡Mensaje enviado con éxito!
                  </p>
                  <p className="text-sm">
                    Nos pondremos en contacto contigo pronto.
                  </p>
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
                  maxLength={100}
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
                  maxLength={255}
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
                  maxLength={20}
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
                  maxLength={1000}
                />

                {/* Botón de Envío */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex w-full transform items-center justify-center gap-2 rounded-lg bg-(--primary)/95 py-3 text-base font-bold text-white shadow-lg transition-all duration-300 hover:scale-95 hover:bg-(--primary) hover:shadow-xl ${
                    isSubmitting ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    <>
                      <Icon name="mail" className="h-5 w-5" />
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
                    <span className="bg-white px-4 text-gray-500">
                      o también puedes
                    </span>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/5493434123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full transform items-center justify-center gap-3 rounded-lg bg-(--success)/95 px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-95 hover:bg-(--success) hover:shadow-xl"
                >
                  <Icon name="whatsapp" className="h-6 w-6" />
                  <span className="text-lg">Consultar por WhatsApp</span>
                </a>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
