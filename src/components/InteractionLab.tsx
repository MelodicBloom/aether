'use client';

import { useEffect, useRef, useState } from 'react';
import { ShaderCanvas } from './ShaderCanvas';
import { presets } from '@/lib/sourceMap';

const shell = presets.find((preset) => preset.family === 'shell')!;
const aurora = presets.find((preset) => preset.family === 'aurora')!;
const holo = presets.find((preset) => preset.family === 'holographic')!;
const plasma = presets.find((preset) => preset.family === 'plasma')!;
const opal = presets.find((preset) => preset.family === 'opal-glass')!;
const mesh = presets.find((preset) => preset.family === 'electric-mesh')!;

export function InteractionLab() {
  const [active, setActive] = useState(false);
  const [listening, setListening] = useState(false);
  const [progress, setProgress] = useState(0);
  const [focus, setFocus] = useState(false);
  const [chip, setChip] = useState('Flow');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height + window.innerHeight);
      setProgress(Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="interaction-lab" ref={sectionRef}>
      <div className="lab-heading">
        <span className="eyebrow">Material → behavior translation</span>
        <h3>Interface application laboratory</h3>
        <p>Each demo binds a material family to a concrete event signature, state model, duration, distance, easing curve, and visible output.</p>
      </div>

      <div className="component-grid">
        <article className="component-demo">
          <div className="demo-stage">
            <button className={`shader-button ${active ? 'is-active' : ''}`} onClick={() => setActive(v => !v)} onPointerEnter={() => setListening(true)} onPointerLeave={() => setListening(false)}>
              <ShaderCanvas src={shell.glslPath!} uniforms={{ ...shell.uniformsDefault, speed: listening ? .16 : .08 }} />
              <span>{active ? 'Material active' : listening ? 'Listening' : 'Activate surface'}</span>
            </button>
          </div>
          <div className="signature"><strong>Button / press-depth bloom</strong><code>pointerenter | pointerleave | pointerdown | click | keydown</code><p>Hover lifts 4 px in 220 ms with cubic-bezier(0.22,1,0.36,1). Press compresses 2 px and scales to 0.985 in 90 ms. Release resolves in 360 ms with stiffness 220, damping 24, mass 0.82.</p></div>
        </article>

        <article className="component-demo">
          <div className="demo-stage switch-stage">
            <button role="switch" aria-checked={active} className={`shader-switch ${active ? 'is-on' : ''}`} onClick={() => setActive(v => !v)}>
              <span className="switch-track"><ShaderCanvas src={aurora.glslPath!} uniforms={aurora.uniformsDefault} /></span><span className="switch-thumb" />
            </button><span>{active ? 'On / transmitting' : 'Off / dormant'}</span>
          </div>
          <div className="signature"><strong>Switch / state-transfer current</strong><code>click | keydown(Space) | aria-checked</code><p>Thumb travels 34 px in 280 ms using cubic-bezier(0.34,1.56,0.64,1). Saturation rises from 42% to 100% in 240 ms. Deactivation settles over 420 ms.</p></div>
        </article>

        <article className="component-demo scroll-demo">
          <div className="demo-stage scroll-stage"><div className="mock-scroll-region"><div className="mock-content">SCROLL SIGNAL<br />DEPTH<br />POSITION<br />MOMENTUM</div><div className="shader-scrollbar"><div className="shader-scrollbar-fill" style={{ transform:`scaleY(${Math.max(.08,progress)})` }}><ShaderCanvas src={holo.glslPath!} uniforms={holo.uniformsDefault} /></div></div></div></div>
          <div className="signature"><strong>Scrollbar / positional telemetry</strong><code>scroll(passive) | resize | intersection</code><p>Progress maps 0–1 to an 8%–100% fill without easing during input. Residual shimmer decays over 480 ms with cubic-bezier(0.16,1,0.3,1). Track expands 10→14 px in 180 ms.</p></div>
        </article>

        <article className="component-demo">
          <div className="demo-stage"><label className={`shader-field ${focus ? 'is-focus' : ''}`}><span className="field-material"><ShaderCanvas src={opal.glslPath!} uniforms={{...opal.uniformsDefault,speed:focus?.14:.06}} /></span><span>Material query</span><input onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder="Search surfaces" /></label></div>
          <div className="signature"><strong>Input / refractive focus well</strong><code>focus | blur | input | Escape</code><p>Focus expands the luminous inset by 6 px over 260 ms using cubic-bezier(0.16,1,0.3,1). Border energy rises in 180 ms. Blur decays over 420 ms; typed input produces a 120 ms caustic pulse.</p></div>
        </article>

        <article className="component-demo">
          <div className="demo-stage"><div className="shader-chipset">{['Flow','Charge','Calm'].map(label => <button key={label} className={chip===label?'is-selected':''} onClick={() => setChip(label)}><span><ShaderCanvas src={mesh.glslPath!} uniforms={mesh.uniformsDefault} /></span>{label}</button>)}</div></div>
          <div className="signature"><strong>Choice chips / network commit</strong><code>click | arrow keys | Enter | roving tabindex</code><p>Selection translates 3 px upward in 180 ms and emits a 320 ms travelling-current pulse. Neighboring chips dim to 58% over 160 ms. Commit easing: cubic-bezier(0.2,0.8,0.2,1).</p></div>
        </article>

        <article className="component-demo">
          <div className="demo-stage"><button className="pressure-pad" onPointerDown={e => e.currentTarget.classList.add('is-pressed')} onPointerUp={e => e.currentTarget.classList.remove('is-pressed')} onPointerLeave={e => e.currentTarget.classList.remove('is-pressed')}><ShaderCanvas src={plasma.glslPath!} uniforms={plasma.uniformsDefault}/><span>Hold to energize</span></button></div>
          <div className="signature"><strong>Pressure surface / electric compression</strong><code>pointerdown | pointerup | pointercancel | keydown</code><p>Press depth is 5 px over 110 ms with cubic-bezier(0.4,0,1,1). Glow radius grows 18→42 px over 240 ms. Release rebounds in 390 ms with stiffness 260, damping 20, mass 0.76.</p></div>
        </article>
      </div>
    </section>
  );
}
