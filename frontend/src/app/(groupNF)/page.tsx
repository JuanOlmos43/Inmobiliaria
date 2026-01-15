import SearchBlock from '@/components/SearchBlock';
import FeaturedProperties from '@/components/FeaturedProperties';

export default function Home() {
  return (
    <>
      <SearchBlock />
      
      <main className="flex-grow bg-[#f8fafc]">
        
        {/* Propiedades destacadas */}
        <FeaturedProperties />
      </main>
    </>
  );
}

