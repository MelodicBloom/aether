import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(96,165,250,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(167,139,250,0.05) 0%, transparent 70%)',
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/30">MelodicBloom</span>
          <h1
            className="text-6xl sm:text-8xl font-bold tracking-tight"
            style={{
              backgroundImage: 'linear-gradient(135deg, #a5f3fc 0%, #818cf8 40%, #f0abfc 80%, #fde68a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AETHER
          </h1>
          <p className="text-base text-white/40 max-w-sm leading-relaxed">
            Premium iridescent GLSL shader components for React&nbsp;/&nbsp;Next.js. Semantic controls. Live preview.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link href="/gallery" className="px-7 py-3 text-sm font-semibold rounded-2xl bg-white text-black hover:bg-white/90 transition-colors">
            Explore Gallery →
          </Link>
          <a
            href="https://github.com/MelodicBloom/aether"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 text-sm font-medium rounded-2xl border border-white/12 text-white/60 hover:text-white hover:border-white/25 transition-colors"
          >
            GitHub
          </a>
        </div>
        <div className="flex items-center gap-6 mt-4 text-xs text-white/30">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />5 free presets</span>
          <span className="w-px h-3 bg-white/10" />
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />15 presets in Pro</span>
          <span className="w-px h-3 bg-white/10" />
          <span>Semantic uniforms</span>
        </div>
      </div>
    </main>
  );
}
