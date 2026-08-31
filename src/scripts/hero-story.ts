// Homepage "story" hero: one SkiErg model stays sticky behind three
// scrolling stages (01 Présentation / 02 Réparation / 03 Entretien), à la
// lightweight.info. No GSAP pin here - `.story-visual` is kept in view via
// plain CSS `position:sticky` (see index.astro), so the page never stops
// scrolling. A single scrubbed proxy tween drives a normalized 0-1
// `progress`, which we map through 4 keyframes at the exact thirds that
// match the 3 equal-height stages, so the camera/light "mood" change stays
// in sync with whichever stage is actually on screen.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { withBase } from '../utils/url';

gsap.registerPlugin(ScrollTrigger);

const MODEL_SRC = '/models/skierg.glb';
const MODEL_LABEL = 'SkiErg';

const grid = document.querySelector<HTMLElement>('[data-story-grid]');
const visual = grid?.querySelector<HTMLElement>('[data-story-visual]');
const mount = grid?.querySelector<HTMLElement>('[data-m3d-mount]');
const stages = grid ? Array.from(grid.querySelectorAll<HTMLElement>('[data-story-stage]')) : [];
const railLinks = grid ? Array.from(grid.querySelectorAll<HTMLAnchorElement>('[data-story-rail]')) : [];

if (grid && visual && mount) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const skipHeavyMedia = connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';

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
      { threshold: 0.5 }
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
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      document.head.appendChild(script);
    };

    new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        loadLibrary();

        const viewer = document.createElement('model-viewer') as HTMLElement & { cameraOrbit: string; exposure: number };
        viewer.setAttribute('src', withBase(MODEL_SRC));
        viewer.setAttribute('alt', `Modèle 3D ${MODEL_LABEL}, machine entretenue par Ergo&Lift Maintenance`);
        viewer.setAttribute('environment-image', 'neutral');
        viewer.setAttribute('interaction-prompt', 'none');
        viewer.setAttribute('camera-orbit', '-20deg 74deg 2.2m');
        viewer.style.width = '100%';
        viewer.style.height = '100%';
        mount.appendChild(viewer);

        const isDesktop = window.matchMedia('(min-width: 1025px)').matches;

        if (reduceMotion || !isDesktop) {
          viewer.setAttribute('auto-rotate', '');
          viewer.setAttribute('camera-controls', '');
          viewer.setAttribute('touch-action', 'pan-y');
          viewer.setAttribute('exposure', '1');
          viewer.setAttribute('shadow-intensity', '1');
          return;
        }

        // 4 keyframes (start of 01, boundary 01/02, boundary 02/03, end of
        // 03) mapped to the exact thirds of total scroll, since the 3
        // stages are equal height - keeps the "mood" change synced to
        // whichever stage is actually centered in the viewport.
        const keyframes = [
          { azimuth: -20, radius: 2.2, exposure: 0.6, shadowIntensity: 0.7, bgLightness: 2 },
          { azimuth: 110, radius: 1.75, exposure: 0.95, shadowIntensity: 1, bgLightness: 7 },
          { azimuth: 250, radius: 1.3, exposure: 1.2, shadowIntensity: 1.3, bgLightness: 11 },
          { azimuth: 340, radius: 1.05, exposure: 1.35, shadowIntensity: 1.5, bgLightness: 14 },
        ];
        const stops = [0, 1 / 3, 2 / 3, 1];

        const applyProgress = (p: number) => {
          let idx = 0;
          while (idx < stops.length - 2 && p > stops[idx + 1]) idx++;
          const span = stops[idx + 1] - stops[idx] || 1;
          const t = (p - stops[idx]) / span;
          const from = keyframes[idx];
          const to = keyframes[idx + 1];
          const lerp = (a: number, b: number) => a + (b - a) * t;
          const azimuth = lerp(from.azimuth, to.azimuth);
          const radius = lerp(from.radius, to.radius);
          viewer.cameraOrbit = `${azimuth}deg 74deg ${radius}m`;
          viewer.exposure = lerp(from.exposure, to.exposure);
          viewer.setAttribute('shadow-intensity', String(lerp(from.shadowIntensity, to.shadowIntensity)));
          visual.style.backgroundColor = `hsl(0 0% ${lerp(from.bgLightness, to.bgLightness)}%)`;
        };
        applyProgress(0);

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
      { rootMargin: '300px' }
    ).observe(mount);
  }
}
