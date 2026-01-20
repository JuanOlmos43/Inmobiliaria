interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#0f172a] text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white animate-fade-in">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-[#14b8a6] max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
