interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className="relative bg-linear-to-b from-(--primary-light) via-(--primary) to-(--primary) py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="animate-fade-in mb-6 text-5xl font-bold text-white md:text-7xl">
            {title}
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-(--accent) md:text-2xl">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
