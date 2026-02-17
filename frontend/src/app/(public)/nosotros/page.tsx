import { HeroSection } from "@/components/features/home";
import { Icon, ValueCard } from "@/components/ui";

export default function NosotrosPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="Sobre Nosotros"
        subtitle="Más de 15 años ayudando a las familias a encontrar su hogar ideal"
      />

      {/* Nuestra Historia */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-4xl font-bold text-(--primary)">
              Nuestra Historia
            </h2>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              InmoHogar nació en 2008 con una visión clara: revolucionar el
              mercado inmobiliario ofreciendo un servicio personalizado y
              transparente. Desde entonces, hemos ayudado a más de 5,000
              familias a encontrar su hogar perfecto.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              Nuestro equipo de profesionales altamente capacitados se dedica a
              entender las necesidades únicas de cada cliente, brindando
              asesoramiento experto en cada paso del proceso.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Hoy somos líderes en el sector, con presencia en las principales
              ciudades del país y un compromiso inquebrantable con la excelencia
              y la satisfacción del cliente.
            </p>
          </div>
          <div className="relative h-96 transform overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-(--primary) opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Icon
                  name="building"
                  className="mx-auto mb-4 h-24 w-24"
                  strokeWidth={1.5}
                />
                <p className="text-2xl font-bold">15+ Años</p>
                <p className="text-lg">de Experiencia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-4xl font-bold text-(--primary)">
            Nuestros Valores
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Valor 1 */}
            <ValueCard
              icon={<Icon name="check" className="h-12 w-12" strokeWidth={2} />}
              title="Transparencia"
              description="Creemos en la honestidad total. Cada propiedad, cada precio, cada detalle es presentado con claridad absoluta."
              color="dark"
            />

            {/* Valor 2 */}
            <ValueCard
              icon={
                <Icon name="briefcase" className="h-12 w-12" strokeWidth={2} />
              }
              title="Profesionalismo"
              description="Nuestro equipo está altamente capacitado y actualizado con las últimas tendencias del mercado inmobiliario."
              color="aqua"
            />

            {/* Valor 3 */}
            <ValueCard
              icon={
                <svg
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              }
              title="Compromiso"
              description="Tu satisfacción es nuestra prioridad. Trabajamos incansablemente hasta encontrar la propiedad perfecta para ti."
              color="dark"
            />
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="bg-linear-to-r from-(--primary) to-(--primary-light) py-16 text-white shadow-inner">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-4xl font-bold">
            Nuestros Logros
          </h2>
          <div className="grid gap-8 text-center md:grid-cols-4">
            <div className="transform transition-transform duration-300 hover:scale-110">
              <div className="mb-2 text-5xl font-bold text-(--accent)">
                5,000+
              </div>
              <p className="text-xl text-gray-100">Familias Felices</p>
            </div>
            <div className="transform transition-transform duration-300 hover:scale-110">
              <div className="mb-2 text-5xl font-bold text-(--accent)">15+</div>
              <p className="text-xl text-gray-100">Años de Experiencia</p>
            </div>
            <div className="transform transition-transform duration-300 hover:scale-110">
              <div className="mb-2 text-5xl font-bold text-(--accent)">50+</div>
              <p className="text-xl text-gray-100">Profesionales</p>
            </div>
            <div className="transform transition-transform duration-300 hover:scale-110">
              <div className="mb-2 text-5xl font-bold text-(--accent)">98%</div>
              <p className="text-xl text-gray-100">Satisfacción</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestro Equipo */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-4xl font-bold text-(--primary)">
          Nuestro Equipo
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Miembro 1 */}
          <div className="transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex h-64 items-center justify-center bg-linear-to-br from-(--primary) to-(--primary-light)">
              <Icon
                name="user"
                className="h-32 w-32 text-white"
                strokeWidth={1.5}
              />
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-2xl font-bold text-(--primary)">
                Carlos Rodríguez
              </h3>
              <p className="mb-3 font-semibold text-(--accent)">
                Director General
              </p>
              <p className="text-gray-600">
                Con más de 20 años en el sector inmobiliario, Carlos lidera
                nuestro equipo con pasión y visión estratégica.
              </p>
            </div>
          </div>

          {/* Miembro 2 */}
          <div className="transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex h-64 items-center justify-center bg-linear-to-br from-(--accent) to-(--accent-hover)">
              <Icon
                name="user"
                className="h-32 w-32 text-white"
                strokeWidth={1.5}
              />
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-2xl font-bold text-(--primary)">
                María González
              </h3>
              <p className="mb-3 font-semibold text-(--accent)">
                Gerente de Ventas
              </p>
              <p className="text-gray-600">
                Experta en negociación y relaciones con clientes, María
                garantiza que cada transacción sea exitosa.
              </p>
            </div>
          </div>

          {/* Miembro 3 */}
          <div className="transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex h-64 items-center justify-center bg-linear-to-br from-(--primary) to-(--primary-light)">
              <Icon
                name="user"
                className="h-32 w-32 text-white"
                strokeWidth={1.5}
              />
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-2xl font-bold text-(--primary)">
                Juan Pérez
              </h3>
              <p className="mb-3 font-semibold text-(--accent)">
                Asesor Senior
              </p>
              <p className="text-gray-600">
                Especialista en propiedades de lujo, Juan ofrece un servicio
                personalizado y de alta calidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-linear-to-r from-(--accent) to-(--accent-hover) py-16 text-white shadow-lg">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold">
            ¿Listo para encontrar tu hogar ideal?
          </h2>
          <p className="mb-8 text-xl text-gray-50">
            Nuestro equipo está esperando para ayudarte en cada paso del camino
          </p>
          <a
            href="/contacto"
            className="inline-block transform rounded-full bg-white px-10 py-4 text-lg font-bold text-(--primary) shadow-2xl transition-all duration-300 hover:scale-95 hover:bg-gray-100 hover:shadow-xl"
          >
            Contáctanos Ahora
          </a>
        </div>
      </section>
    </>
  );
}
