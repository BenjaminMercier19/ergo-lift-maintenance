// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://benjaminmercier19.github.io',
  base: '/ergo-lift-maintenance',
  integrations: [icon()],
  vite: {
    plugins: [tailwindcss()]
  }
});