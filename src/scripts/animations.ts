import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero entrance: staggered fade-up on load, no scroll trigger.
document.querySelectorAll('[data-hero-in]').forEach((group) => {
  const items = group.querySelectorAll(':scope > *');
  if (reduceMotion) {
    gsap.set(items, { autoAlpha: 1, y: 0 });
    return;
  }
  gsap.set(items, { autoAlpha: 0, y: 24 });
  gsap.to(items, {
    autoAlpha: 1,
    y: 0,
    duration: 0.7,
    ease: 'power2.out',
    stagger: 0.12,
    delay: 0.1,
  });
});

// Single-element scroll reveal, coordinated with ScrollTrigger.batch so
// elements that enter the viewport together animate together.
const revealEls = gsap.utils.toArray<HTMLElement>('[data-reveal]');
if (revealEls.length) {
  if (reduceMotion) {
    gsap.set(revealEls, { autoAlpha: 1, y: 0 });
  } else {
    gsap.set(revealEls, { autoAlpha: 0, y: 32 });
    ScrollTrigger.batch(revealEls, {
      start: 'top 85%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1,
          overwrite: true,
        }),
    });
  }
}

// Grouped stagger reveal: animates the direct children of any
// [data-reveal-group] container together once it enters the viewport.
document.querySelectorAll('[data-reveal-group]').forEach((group) => {
  const items = group.querySelectorAll(':scope > *');
  if (!items.length) return;
  if (reduceMotion) {
    gsap.set(items, { autoAlpha: 1, y: 0 });
    return;
  }
  gsap.set(items, { autoAlpha: 0, y: 32 });
  ScrollTrigger.create({
    trigger: group,
    start: 'top 85%',
    once: true,
    onEnter: () =>
      gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.1 }),
  });
});

// Parallax: full-bleed photo bands shift slightly slower/faster than
// scroll. Images carrying [data-parallax] are sized 124% tall with a
// -12% top offset (see NikeLayout styles) so the shift never exposes
// an edge; the section's overflow:hidden clips the rest.
if (!reduceMotion) {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((img) => {
    const section = img.closest('section');
    if (!section) return;
    gsap.fromTo(
      img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
}

// FAQ accordion: keep native <details>/<summary> semantics (keyboard and
// screen-reader behavior untouched) but animate the panel height instead
// of the native instant show/hide. Skipped entirely under reduced motion.
if (!reduceMotion) {
  document.querySelectorAll<HTMLDetailsElement>('[data-faq]').forEach((details) => {
    const panel = details.querySelector<HTMLElement>('.faq-panel');
    const summary = details.querySelector('summary');
    if (!panel || !summary) return;

    let animation: gsap.core.Tween | null = null;
    gsap.set(panel, { height: 0, overflow: 'hidden' });

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      if (animation) animation.kill();

      if (details.open) {
        animation = gsap.to(panel, {
          height: 0,
          duration: 0.35,
          ease: 'power2.inOut',
          onComplete: () => {
            details.open = false;
          },
        });
      } else {
        details.open = true;
        animation = gsap.fromTo(
          panel,
          { height: 0 },
          { height: 'auto', duration: 0.35, ease: 'power2.inOut' }
        );
      }
    });
  });
}
