// Prefixes an absolute internal path with Astro's configured `base`
// (e.g. "/ergo-lift-maintenance" for the GitHub Pages deploy).
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
