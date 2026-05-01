export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-cream relative overflow-hidden">
      {/* Subtle ambient background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 animate-float"
          style={{
            background:
              "radial-gradient(circle, rgba(212,133,107,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(92,112,83,0.12) 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(212,133,107,0.1) 0%, transparent 70%)",
            animation: "float 10s ease-in-out infinite 4s",
          }}
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto">
        {/* Tree icon */}
        <div className="animate-fade-in-up mb-8">
          <div className="w-16 h-16 rounded-2xl bg-forest/10 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L8 8h2l-3 6h2l-3 6h12l-3-6h2l-3-6h2L12 2z"
                fill="#5C7053"
                opacity="0.85"
              />
              <rect x="11" y="18" width="2" height="4" rx="0.5" fill="#8B7355" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="animate-fade-in-up-delay-1 font-serif text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-tight"
          style={{ color: "#D4856B" }}
        >
          Alex&apos;s Treehouse
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up-delay-2 mt-6 text-lg sm:text-xl text-soft-text font-light leading-relaxed max-w-md">
          Your warm, focused companion — coming soon
        </p>

        {/* Decorative divider */}
        <div className="animate-fade-in-up-delay-3 mt-10 flex items-center gap-3">
          <div className="w-8 h-px bg-terracotta/30" />
          <div className="w-2 h-2 rounded-full bg-terracotta/40 animate-gentle-pulse" />
          <div className="w-8 h-px bg-terracotta/30" />
        </div>

        {/* Tagline */}
        <p className="animate-fade-in-up-delay-3 mt-8 text-sm text-warm-brown/60 tracking-wide uppercase">
          Stop fighting yourself. Start with Alex.
        </p>
      </main>

      {/* Bottom corner credit */}
      <footer className="absolute bottom-6 text-xs text-warm-brown/40 animate-fade-in">
        Built with care for college students who overthink everything ☕
      </footer>
    </div>
  );
}
