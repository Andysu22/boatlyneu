"use client";

export default function Hero() {
  return (
    <section
      className="relative h-[80vh] bg-hero-pattern bg-cover bg-center flex items-center"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="relative z-10 mx-auto text-center px-4 max-w-2xl">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Miete dein Traumboot
        </h1>
        <p className="text-lg text-gray-200 mb-8">
          Entdecke Boote an über 100 Standorten in Deutschland – ganz einfach
          online buchen.
        </p>
      </div>
    </section>
  );
}
