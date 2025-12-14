import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBlock from '@/components/SearchBlock';
import FeaturedProperties from '@/components/FeaturedProperties';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchBlock />
      
      <main className="flex-grow bg-[#F4F6F8]">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#0A2647] to-[#061829] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Las mejores propiedades en las mejores ubicaciones
            </h2>
            <p className="text-lg md:text-xl text-gray-200">
              Tu socio de confianza en bienes raíces
            </p>
          </div>
        </section>

        {/* Featured Properties */}
        <FeaturedProperties />

        {/* Content Section */}
    
      </main>

      <Footer />
    </div>
  );
}

