import SearchBlock from "@/components/SearchBlock";
import FeaturedProperties from "@/components/FeaturedProperties";

export default function Home() {
  return (
    <>
      <SearchBlock />

      <main>
        {/* Propiedades destacadas */}
        <FeaturedProperties />
      </main>
    </>
  );
}
