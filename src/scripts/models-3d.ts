// 3D equipment viewers ("Nos spécialités"). Each [data-m3d-card] mounts its
// own <model-viewer> lazily, only once scrolled near the viewport - same
// approach as the source site, since these .glb files run 0.9 to 7.7MB each
// and there are 5 of them. The model-viewer library itself is also fetched
// lazily from its CDN rather than bundled, so pages without this section
// never pay for it.
import { withBase } from '../utils/url';

const cards = document.querySelectorAll<HTMLElement>('[data-m3d-card]');
if (cards.length) {
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

    cards.forEach((card) => {
      const mount = card.querySelector<HTMLElement>('[data-m3d-mount]');
      const src = card.dataset.m3dCard;
      const label = card.dataset.m3dLabel ?? '';
      if (!mount || !src) return;

      new IntersectionObserver(
        (entries, obs) => {
          if (!entries[0].isIntersecting) return;
          obs.disconnect();
          loadLibrary();

          const viewer = document.createElement('model-viewer');
          viewer.setAttribute('src', withBase(src));
          viewer.setAttribute('alt', `Modèle 3D ${label}, machine entretenue par Ergo&Lift Maintenance`);
          viewer.setAttribute('camera-orbit', '-35deg 74deg auto');
          viewer.setAttribute('shadow-intensity', '1.2');
          viewer.setAttribute('exposure', '1.0');
          viewer.setAttribute('environment-image', 'neutral');
          viewer.setAttribute('interaction-prompt', 'none');
          viewer.setAttribute('camera-controls', '');
          viewer.setAttribute('touch-action', 'pan-y');
          if (!reduceMotion) viewer.setAttribute('auto-rotate', '');
          viewer.style.width = '100%';
          viewer.style.height = '100%';
          mount.appendChild(viewer);
        },
        { rootMargin: '300px' }
      ).observe(mount);
    });
  }
}
