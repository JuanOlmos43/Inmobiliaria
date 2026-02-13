import { Navbar, Footer } from "@/components/layout";
import { ScrollToTop } from "@/components/ui/navigation/ScrollToTop";

export default function GroupNFLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />

      <Navbar />

      {children}

      <Footer />
    </div>
  );
}
