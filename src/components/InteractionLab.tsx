'use client';

import { useEffect, useRef, useState } from 'react';
import { ShaderCanvas } from './ShaderCanvas';
import { presets } from '@/lib/sourceMap';

const shell = presets.find((preset) => preset.family === 'shell')!;
const aurora = presets.find((preset) => preset.family === 'aurora')!;
const holo = presets.find((preset) => preset.family === 'holographic')!;

export function InteractionLab() {
  const [active, setActive] = useState(false);
  const [listening, setListening] = useState(false);
  const [progress, setProgress] = useState(0);
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
        <p>Every example binds a material family to an explicit event signature, state transition, duration, distance, and easing curve.</p>
      </div>

      <div className="component-grid">
        <article className="component-demo">
          <div className="demo-stage">
            <button
              className={`shader-button ${active ? 'is-active' : ''}`}
              onClick={() => setActive((value) => !value)}
              onPointerEnter={() => setListening(true)}
              onPointerLeave={() => setListening(false)}
            >
              <ShaderCanvas src={shell.glslPath!} uniforms={{ ...shell.uniformsDefault, speed: listening ? 0.16 : 0.08 }} />
              <span>{active ? 'Material active' : listening ? 'Listening' : 'Activate surface'}</span>
            </button>
          </div>
          <div className="signature">
            <strong>Button / press-depth bloom</strong>
            <code>pointerenter | pointerleave | click | keydown(Enter, Space)</code>
            <p>Hover raises the control 4 px over 220 ms using cubic-bezier(0.22, 1, 0.36, 1). Press compresses 2 px over 90 ms using cubic-bezier(0.4, 0, 1, 1). Release resolves over 360 ms with spring-equivalent dynamics: stiffness 220, damping 24, mass 0.82.</p>
          </div>
        </article>

        <article className="component-demo">
          <div className="demo-stage switch-stage">
            <button
              role="switch"
              aria-checked={active}
              className={`shader-switch ${active ? 'is-on' : ''}`}
              onClick={() => setActive((value) => !value)}
            >
              <span className="switch-track"><ShaderCanvas src={aurora.glslPath!} uniforms={aurora.uniformsDefault} /></span>
              <span className="switch-thumb" />
            </button>
            <span>{active ? 'On / transmitting' : 'Off / dormant'}</span>
          </div>
          <div className="signature">
            <strong>Switch / state-transfer current</strong>
            <code>click | keydown(Space) | aria-checked mutation</code>
            <p>Thumb travels exactly 34 px in 280 ms using cubic-bezier(0.34, 1.56, 0.64, 1). Track saturation rises from 42% to 100% over 240 ms. Active-state shader velocity increases 1.6×; deactivation decelerates over 420 ms.</p>
          </div>
        </article>

        <article className="component-demo scroll-demo">
          <div className="demo-stage scroll-stage">
            <div className="mock-scroll-region">
              <div className="mock-content">SCROLL SIGNAL<br />DEPTH<br />POSITION<br />MOMENTUM</div>
              <div className="shader-scrollbar">
                <div className="shader-scrollbar-fill" style={{ transform: `scaleY(${Math.max(0.08, progress)})` }}>
                  <ShaderCanvas src={holo.glslPath!} uniforms={holo.uniformsDefault} />
                </div>
              </div>
            </div>
          </div>
          <div className="signature">
            <strong>Scrollbar / positional telemetry</strong>
            <code>scroll(passive) | resize | intersection</code>
            <p>Progress maps 0–1 to an 8%–100% vertical fill. Visual response is frame-synchronous with no easing while scrolling; after input stops, residual shimmer decays for 480 ms using cubic-bezier(0.16, 1, 0.3, 1). Track width is 10 px; hover expansion is 4 px over 180 ms.</p>
          </div>
        </article>
      </div>
    </section>
  );
}