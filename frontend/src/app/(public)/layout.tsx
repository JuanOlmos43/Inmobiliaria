import { Navbar, Footer } from "@/components/layout";
import { ScrollToTop } from "@/components/ui/navigation/ScrollToTop";

export default function GroupNFLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />

      <Navbar />

      {children}

      <Footer />
    </div>
  );
}

