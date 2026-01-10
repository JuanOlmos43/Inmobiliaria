import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Icon from '@/components/Icon';

export default function NosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0f172a] via-[#0f172a] to-[#334155] text-white py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#14b8a6] rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Sobre <span className="bg-gradient-to-r from-[#14b8a6] to-[#2dd4bf] bg-clip-text text-transparent">Nosotros</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
              Más de 15 años ayudando a las familias a encontrar su hogar ideal
            </p>
          </div>
        </div>

      </section>

      {/* Nuestra Historia */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-[#0f172a] mb-6">
              Nuestra Historia
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              InmoHogar nació en 2008 con una visión clara: revolucionar el mercado inmobiliario 
              ofreciendo un servicio personalizado y transparente. Desde entonces, hemos ayudado 
              a más de 5,000 familias a encontrar su hogar perfecto.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Nuestro equipo de profesionales altamente capacitados se dedica a entender las 
              necesidades únicas de cada cliente, brindando asesoramiento experto en cada paso 
              del proceso.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Hoy somos líderes en el sector, con presencia en las principales ciudades del país 
              y un compromiso inquebrantable con la excelencia y la satisfacción del cliente.
            </p>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-[#0f172a] opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Icon name="building" className="w-24 h-24 mb-4 mx-auto" strokeWidth={1.5} />
                <p className="text-2xl font-bold">15+ Años</p>
                <p className="text-lg">de Experiencia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[#0f172a] mb-12">
            Nuestros Valores
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Valor 1 */}
            <div className="bg-gradient-to-br from-[#0f172a] to-[#334155] p-8 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <Icon name="check" className="w-12 h-12 mb-4" strokeWidth={2} />
              <h3 className="text-2xl font-bold mb-4">Transparencia</h3>
              <p className="text-gray-100 leading-relaxed">
                Creemos en la honestidad total. Cada propiedad, cada precio, cada detalle 
                es presentado con claridad absoluta.
              </p>
            </div>

            {/* Valor 2 */}
            <div className="bg-gradient-to-br from-[#14b8a6] to-[#0d9488] p-8 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <Icon name="briefcase" className="w-12 h-12 mb-4" strokeWidth={2} />
              <h3 className="text-2xl font-bold mb-4">Profesionalismo</h3>
              <p className="text-gray-50 leading-relaxed">
                Nuestro equipo está altamente capacitado y actualizado con las últimas 
                tendencias del mercado inmobiliario.
              </p>
            </div>

            {/* Valor 3 */}
            <div className="bg-gradient-to-br from-[#0f172a] to-[#334155] p-8 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <Icon name="heart" className="w-12 h-12 mb-4" strokeWidth={2} />
              <h3 className="text-2xl font-bold mb-4">Compromiso</h3>
              <p className="text-gray-100 leading-relaxed">
                Tu satisfacción es nuestra prioridad. Trabajamos incansablemente hasta 
                encontrar la propiedad perfecta para ti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-gradient-to-r from-[#0f172a] to-[#334155] text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Nuestros Logros
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold text-[#14b8a6] mb-2">5,000+</div>
              <p className="text-xl text-gray-100">Familias Felices</p>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold text-[#14b8a6] mb-2">15+</div>
              <p className="text-xl text-gray-100">Años de Experiencia</p>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold text-[#14b8a6] mb-2">50+</div>
              <p className="text-xl text-gray-100">Profesionales</p>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold text-[#14b8a6] mb-2">98%</div>
              <p className="text-xl text-gray-100">Satisfacción</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestro Equipo */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-[#0f172a] mb-12">
          Nuestro Equipo
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Miembro 1 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="h-64 bg-gradient-to-br from-[#0f172a] to-[#334155] flex items-center justify-center">
              <Icon name="user" className="w-32 h-32 text-white" strokeWidth={1.5} />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#0f172a] mb-2">Carlos Rodríguez</h3>
              <p className="text-[#14b8a6] font-semibold mb-3">Director General</p>
              <p className="text-gray-600">
                Con más de 20 años en el sector inmobiliario, Carlos lidera nuestro equipo 
                con pasión y visión estratégica.
              </p>
            </div>
          </div>

          {/* Miembro 2 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="h-64 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center">
              <Icon name="user" className="w-32 h-32 text-white" strokeWidth={1.5} />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#0f172a] mb-2">María González</h3>
              <p className="text-[#14b8a6] font-semibold mb-3">Gerente de Ventas</p>
              <p className="text-gray-600">
                Experta en negociación y relaciones con clientes, María garantiza que cada 
                transacción sea exitosa.
              </p>
            </div>
          </div>

          {/* Miembro 3 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="h-64 bg-gradient-to-br from-[#0f172a] to-[#334155] flex items-center justify-center">
              <Icon name="user" className="w-32 h-32 text-white" strokeWidth={1.5} />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#0f172a] mb-2">Juan Pérez</h3>
              <p className="text-[#14b8a6] font-semibold mb-3">Asesor Senior</p>
              <p className="text-gray-600">
                Especialista en propiedades de lujo, Juan ofrece un servicio personalizado 
                y de alta calidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para encontrar tu hogar ideal?
          </h2>
          <p className="text-xl mb-8 text-gray-50">
            Nuestro equipo está esperando para ayudarte en cada paso del camino
          </p>
          <a 
            href="/contacto" 
            className="inline-block bg-white text-[#0f172a] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-xl"
          >
            Contáctanos Ahora
          </a>
        </div>
      </section>
      </div>
      <Footer />
    </div>
  );
}
