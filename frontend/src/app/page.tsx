import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBlock from '@/components/SearchBlock';
import FeaturedProperties from '@/components/FeaturedProperties';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <SearchBlock />
      
      <main className="flex-grow bg-[#f8fafc]">
        
        {/* Featured Properties */}
        <FeaturedProperties />
      </main>

      <Footer />
    </div>
  );
}

