// Single featured 3D model ("Nos spécialités" on the homepage). Desktop:
// the section pins briefly while scroll drives a full 360° spin via
// model-viewer's cameraOrbit. Mobile and reduced-motion just reveal the
// model with its own gentle auto-rotate, no pin - same trade-off already
// used for the parallax bands and the exploded-view experiment.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { withBase } from '../utils/url';

gsap.registerPlugin(ScrollTrigger);

const MODEL_SRC = '/models/rowerg.glb';
const MODEL_LABEL = 'RowErg';

const container = document.querySelector<HTMLElement>('[data-m3d-hero]');
const mount = container?.querySelector<HTMLElement>('[data-m3d-mount]');

if (container && mount) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const skipHeavyMedia = connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';

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

        const viewer = document.createElement('model-viewer') as HTMLElement & { cameraOrbit: string };
        viewer.setAttribute('src', withBase(MODEL_SRC));
        viewer.setAttribute('alt', `Modèle 3D ${MODEL_LABEL}, machine entretenue par Ergo&Lift Maintenance`);
        viewer.setAttribute('shadow-intensity', '1.2');
        viewer.setAttribute('exposure', '1.0');
        viewer.setAttribute('environment-image', 'neutral');
        viewer.setAttribute('interaction-prompt', 'none');
        viewer.setAttribute('camera-orbit', '0deg 74deg auto');
        viewer.style.width = '100%';
        viewer.style.height = '100%';
        mount.appendChild(viewer);

        const isDesktop = window.matchMedia('(min-width: 1025px)').matches;

        if (reduceMotion || !isDesktop) {
          viewer.setAttribute('auto-rotate', '');
          viewer.setAttribute('camera-controls', '');
          viewer.setAttribute('touch-action', 'pan-y');
          return;
        }

        const spin = { azimuth: 0 };
        gsap.to(spin, {
          azimuth: 360,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '+=800',
            pin: true,
            scrub: 0.5,
          },
          onUpdate: () => {
            viewer.cameraOrbit = `${spin.azimuth}deg 74deg auto`;
          },
        });
      },
      { rootMargin: '300px' }
    ).observe(mount);
  }
}
