import { SearchBlock } from "@/components/features/properties/search";
import { FeaturedProperties } from "@/components/features/properties/featured";

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
