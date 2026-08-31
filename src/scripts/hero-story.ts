// Homepage "story" hero: 3 models (SkiErg → BikeErg → RowErg) stacked in
// the same frame behind three scrolling stages, à la lightweight.info. No
// GSAP pin here - `.story-visual` is kept in view via plain CSS
// `position:sticky` (see index.astro), so the page never stops scrolling.
// A single scrubbed proxy tween drives a normalized 0-1 `progress`, which
// several small piecewise functions read to drive: each panel's own
// camera move through 3 shots - entry, optimal (held while its act is
// being read) and exit - a short opacity crossfade between panels at each
// stage boundary synced to the same entry/exit windows (the outgoing
// model fades and pans out as the incoming one fades and pans in - no
// lateral slide), and the shared light/vignette mood across the whole
// scroll range. The first panel also gets a one-off zoom+fade entrance
// tween on load, independent of scroll.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { withBase } from '../utils/url';

gsap.registerPlugin(ScrollTrigger);

type CameraShot = { azimuth: number; polar: number; radius: number };
type PanelShots = { entry: CameraShot; optimal: CameraShot; exit: CameraShot };

// Captured by hand via /debug-camera (drag/zoom each model, read the exact
// values off the live readout): for each model, the framing it enters on,
// the framing it settles into and holds while its act is being read, and
// the framing it drifts to as it exits. Placeholder values below reuse the
// previous shared boundary keyframes (entry == optimal, exit == next
// boundary) as a safe starting point - re-capture via /debug-camera for
// real per-model framing.
const PANEL_SHOTS: PanelShots[] = [
  {
    entry: { azimuth: -72.1, polar: 92.8, radius: 3.22 },
    optimal: { azimuth: -2.9, polar: 85.7, radius: 4.4 },
    exit: { azimuth: 71.8, polar: 96, radius: 2.48 },
  }, // SkiErg
  {
    entry: { azimuth: 71.8, polar: 96, radius: 2.48 },
    optimal: { azimuth: 4.3, polar: 76.7, radius: 5.38 },
    exit: { azimuth: 301.2, polar: 83.8, radius: 3.68 },
  }, // BikeErg
  {
    entry: { azimuth: 107.5, polar: 78.5, radius: 2.84 },
    optimal: { azimuth: 171.4, polar: 71.3, radius: 3.69 },
    exit: { azimuth: 237.4, polar: 92.8, radius: 2.43 },
  }, // RowErg
];

const PANELS = [
  {
    src: '/models/skierg.glb',
    label: 'SkiErg',
    shots: PANEL_SHOTS[0],
    span: [0, 1 / 3] as [number, number],
  },
  {
    src: '/models/bikeerg.glb',
    label: 'BikeErg',
    shots: PANEL_SHOTS[1],
    span: [1 / 3, 2 / 3] as [number, number],
  },
  {
    src: '/models/rowerg.glb',
    label: 'RowErg',
    shots: PANEL_SHOTS[2],
    span: [2 / 3, 1] as [number, number],
  },
];

// Wider than the raw captured light values on purpose - "plus marquant"
// per the approved plan. Reused shape (4 points at the exact thirds).
const LIGHT_STOPS = [0, 1 / 3, 2 / 3, 1];
const LIGHT = [
  { exposure: 0.5, shadowIntensity: 0.6, bgLightness: 1, vignette: 0.45 },
  { exposure: 0.9, shadowIntensity: 1.0, bgLightness: 9, vignette: 0.58 },
  { exposure: 1.25, shadowIntensity: 1.4, bgLightness: 18, vignette: 0.45 },
  { exposure: 1.5, shadowIntensity: 1.7, bgLightness: 26, vignette: 0.62 },
];
const EXPOSURE_VALUES = LIGHT.map((l) => l.exposure);
const SHADOW_VALUES = LIGHT.map((l) => l.shadowIntensity);
const BG_VALUES = LIGHT.map((l) => l.bgLightness);
const VIGNETTE_VALUES = LIGHT.map((l) => l.vignette);

// Crossfade window (as a fraction of total progress) around each stage
// boundary: the outgoing panel fades 1→0 while the incoming one fades
// 0→1 over the same span.
const WINDOW = 0.06;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function piecewise(stops: number[], values: number[], p: number) {
  let idx = 0;
  while (idx < stops.length - 2 && p > stops[idx + 1]) idx++;
  const span = stops[idx + 1] - stops[idx] || 1;
  const t = clamp01((p - stops[idx]) / span);
  return lerp(values[idx], values[idx + 1], t);
}

// Panel i fades in around the start of its span (unless it's the first
// panel - that one gets a one-off entrance tween instead) and fades out
// around the end of its span (unless it's the last panel).
function opacityForPanel(
  index: number,
  total: number,
  span: [number, number],
  p: number,
) {
  let op = 1;
  const [s0, s1] = span;
  if (index > 0) {
    op = Math.min(op, clamp01((p - (s0 - WINDOW)) / (2 * WINDOW)));
  }
  if (index < total - 1) {
    op = Math.min(op, 1 - clamp01((p - (s1 - WINDOW)) / (2 * WINDOW)));
  }
  return op;
}

// Camera moves entry -> optimal over the same window the panel fades in
// (clamped to the span start for the first panel, which has no crossfade
// to sync to), holds at optimal for the read of the span, then moves
// optimal -> exit over the same window the panel fades out (clamped to
// the span end for the last panel).
function cameraForPanel(
  index: number,
  total: number,
  span: [number, number],
  shots: PanelShots,
  p: number,
) {
  const [s0, s1] = span;
  const entryStart = index > 0 ? s0 - WINDOW : s0;
  const entryEnd = s0 + WINDOW;
  const exitStart = s1 - WINDOW;
  const exitEnd = index < total - 1 ? s1 + WINDOW : s1;
  const stops = [entryStart, entryEnd, exitStart, exitEnd];
  const values = [shots.entry, shots.optimal, shots.optimal, shots.exit];
  let idx = 0;
  while (idx < stops.length - 2 && p > stops[idx + 1]) idx++;
  const t = clamp01((p - stops[idx]) / (stops[idx + 1] - stops[idx] || 1));
  const a = values[idx];
  const b = values[idx + 1];
  return {
    azimuth: lerp(a.azimuth, b.azimuth, t),
    polar: lerp(a.polar, b.polar, t),
    radius: lerp(a.radius, b.radius, t),
  };
}

const grid = document.querySelector<HTMLElement>('[data-story-grid]');
const visual = grid?.querySelector<HTMLElement>('[data-story-visual]');
const track = grid?.querySelector<HTMLElement>('[data-m3d-mount]');
const vignetteEl = grid?.querySelector<HTMLElement>('[data-story-vignette]');
const stages = grid
  ? Array.from(grid.querySelectorAll<HTMLElement>('[data-story-stage]'))
  : [];
const railLinks = grid
  ? Array.from(grid.querySelectorAll<HTMLAnchorElement>('[data-story-rail]'))
  : [];

if (grid && visual && track && vignetteEl) {
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  const skipHeavyMedia =
    connection?.saveData ||
    connection?.effectiveType === 'slow-2g' ||
    connection?.effectiveType === '2g';

  // Scrollspy on the rail: cheap, runs regardless of 3D/motion state.
  if (railLinks.length && stages.length) {
    railLinks[0]?.setAttribute('data-active', '');
    const setActive = (id: string) => {
      railLinks.forEach((link) => {
        if (link.dataset.storyRail === id) link.setAttribute('data-active', '');
        else link.removeAttribute('data-active');
      });
    };
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = (entry.target as HTMLElement).dataset.storyStage;
          if (id) setActive(id);
        });
      },
      { threshold: 0.5 },
    );
    stages.forEach((stage) => spy.observe(stage));
  }

  if (!skipHeavyMedia) {
    let libraryRequested = false;
    const loadLibrary = () => {
      if (libraryRequested) return;
      libraryRequested = true;
      const script = document.createElement('script');
      script.type = 'module';
      script.src =
        'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      document.head.appendChild(script);
    };

    new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        loadLibrary();

        const isDesktop = window.matchMedia('(min-width: 1025px)').matches;

        type Viewer = HTMLElement & { cameraOrbit: string; exposure: number };
        const makeViewer = (src: string, label: string, shot: CameraShot) => {
          const viewer = document.createElement('model-viewer') as Viewer;
          viewer.setAttribute('src', withBase(src));
          viewer.setAttribute(
            'alt',
            `Modèle 3D ${label}, machine entretenue par Ergo&Lift Maintenance`,
          );
          viewer.setAttribute('environment-image', 'neutral');
          viewer.setAttribute('interaction-prompt', 'none');
          viewer.setAttribute(
            'camera-orbit',
            `${shot.azimuth}deg ${shot.polar}deg ${shot.radius}m`,
          );
          return viewer;
        };

        if (reduceMotion || !isDesktop) {
          // Simple fallback: one auto-rotating model, no crossfade.
          const viewer = makeViewer(
            PANELS[0].src,
            PANELS[0].label,
            PANELS[0].shots.optimal,
          );
          viewer.setAttribute('auto-rotate', '');
          viewer.setAttribute('camera-controls', '');
          viewer.setAttribute('touch-action', 'pan-y');
          viewer.setAttribute('exposure', '1');
          viewer.setAttribute('shadow-intensity', '1');
          track.appendChild(viewer);
          return;
        }

        const panels = PANELS.map((cfg) => {
          const panelEl = document.createElement('div');
          panelEl.className = 'story-panel';
          const viewer = makeViewer(cfg.src, cfg.label, cfg.shots.entry);
          viewer.style.width = '100%';
          viewer.style.height = '100%';
          panelEl.appendChild(viewer);
          track.appendChild(panelEl);
          return { panelEl, viewer, shots: cfg.shots, span: cfg.span };
        });

        const applyProgress = (p: number) => {
          const exposure = piecewise(LIGHT_STOPS, EXPOSURE_VALUES, p);
          const shadow = piecewise(LIGHT_STOPS, SHADOW_VALUES, p);
          const bg = piecewise(LIGHT_STOPS, BG_VALUES, p);
          const vignette = piecewise(LIGHT_STOPS, VIGNETTE_VALUES, p);
          visual.style.backgroundColor = `hsl(0 0% ${bg}%)`;
          vignetteEl.style.background = `radial-gradient(circle at 65% 50%, transparent 30%, rgba(0,0,0,${vignette}) 100%)`;

          panels.forEach((panel, i) => {
            const shot = cameraForPanel(
              i,
              panels.length,
              panel.span,
              panel.shots,
              p,
            );
            panel.viewer.cameraOrbit = `${shot.azimuth}deg ${shot.polar}deg ${shot.radius}m`;
            panel.viewer.exposure = exposure;
            panel.viewer.setAttribute('shadow-intensity', String(shadow));
            panel.panelEl.style.opacity = String(
              opacityForPanel(i, panels.length, panel.span, p),
            );
          });
        };
        applyProgress(0);

        // One-off entrance for the first panel: starts zoomed in and
        // transparent, settles into place - independent of scroll. This
        // branch only runs when !reduceMotion (see early return above).
        gsap.fromTo(
          panels[0].panelEl,
          { opacity: 0, scale: 1.18 },
          { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
        );

        const proxy = { progress: 0 };
        gsap.to(proxy, {
          progress: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: grid,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
          onUpdate: () => applyProgress(proxy.progress),
        });
      },
      { rootMargin: '300px' },
    ).observe(track);
  }
}
