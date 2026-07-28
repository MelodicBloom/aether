'use client';

import { useMemo, useState } from 'react';
import { ShaderCanvas } from '@/components/ShaderCanvas';
import { InteractionLab } from '@/components/InteractionLab';
import { families, presets } from '@/lib/sourceMap';
import type { PresetDefinition } from '@/lib/types';

export default function HomePage() {
  const [family, setFamily] = useState<(typeof families)[number]>('all');
  const [selected, setSelected] = useState<PresetDefinition | null>(null);
  const filtered = useMemo(() => family === 'all' ? presets : presets.filter((preset) => preset.family === family), [family]);

  return (
    <main>
      <header className="site-header">
        <div><span className="eyebrow">MelodicBloom / Material Intelligence</span><h1>AETHER</h1></div>
        <a href="#gallery">Explore presets</a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Semantic GLSL surfaces</span>
          <h2>Light that explains what the interface is doing.</h2>
          <p>A production-minded shader library where material, motion, and meaning share one registry. Browse freely, inspect deeply, and translate every surface into interaction behavior.</p>
          <div className="hero-meta"><span>8 live presets</span><span>3 component applications</span><span>1 canonical source map</span></div>
        </div>
        <div className="hero-preview">
          <ShaderCanvas src="/shaders/abalone.frag" uniforms={presets[1].uniformsDefault} />
          <div className="hero-caption">video.establish × motion.transition.bloom</div>
        </div>
      </section>

      <section id="gallery" className="gallery-section">
        <div className="section-heading">
          <div><span className="eyebrow">Browse → inspect → understand</span><h3>Material families</h3></div>
          <div className="tabs" aria-label="Shader families">
            {families.map((item) => <button key={item} className={family === item ? 'active' : ''} onClick={() => setFamily(item)}>{item}</button>)}
          </div>
        </div>

        <div className="grid">
          {filtered.map((preset) => (
            <button className="preset-card" key={preset.id} onClick={() => setSelected(preset)}>
              <div className="card-preview">
                <ShaderCanvas src={preset.glslPath!} uniforms={preset.uniformsDefault} />
                <span className={`tier ${preset.tier}`}>{preset.tier}</span>
              </div>
              <div className="card-body"><div><span>{preset.family}</span><h4>{preset.title}</h4></div><p>{preset.description}</p><small>{preset.motionToken}</small></div>
            </button>
          ))}
        </div>
      </section>

      <InteractionLab />

      {selected && (
        <div className="drawer-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <aside className="drawer" role="dialog" aria-modal="true" aria-label={`${selected.title} details`} onClick={(event) => event.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)}>Close</button>
            <ShaderCanvas src={selected.glslPath!} uniforms={selected.uniformsDefault} />
            <span className="eyebrow">{selected.family} / {selected.tier}</span><h3>{selected.title}</h3><p>{selected.description}</p>
            <dl>
              <div><dt>Semantic role</dt><dd>{selected.semanticRole}</dd></div>
              <div><dt>Emotional gradient</dt><dd>{selected.emotionalGradient.join(' → ')}</dd></div>
              <div><dt>Motion token</dt><dd>{selected.motionToken}</dd></div>
              <div><dt>Uniform signature</dt><dd>speed {selected.uniformsDefault.speed} · flow {selected.uniformsDefault.flow} · depth {selected.uniformsDefault.depth} · edge {selected.uniformsDefault.edge}</dd></div>
            </dl>
            {selected.sourceGalleryRef && <a href={selected.sourceGalleryRef}>View upstream shader source</a>}
          </aside>
        </div>
      )}
    </main>
  );
}