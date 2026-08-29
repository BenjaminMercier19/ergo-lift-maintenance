// Real Instagram feed on the homepage, via the Behold.so widget used by the
// source site itself (same feed-id, @ergoliftmaintenance's actual posts).
// Lazy-loaded like the 3D model: only fetch the third-party script once the
// section nears the viewport, and skip entirely on reduced motion or a
// metered/slow connection where the static "follow us" link is preferable.
const FEED_ID = 'P1EzQ7bOR5E4pra04VjH';

const section = document.querySelector<HTMLElement>('[data-ig-section]');
const mount = section?.querySelector<HTMLElement>('[data-ig-mount]');

if (section && mount) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const skipHeavyMedia = reduceMotion || connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';

  if (!skipHeavyMedia) {
    new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();

        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://w.behold.so/widget.js';
        document.head.appendChild(script);

        const widget = document.createElement('behold-widget');
        widget.setAttribute('feed-id', FEED_ID);
        mount.appendChild(widget);
      },
      { rootMargin: '300px' }
    ).observe(section);
  }
}
