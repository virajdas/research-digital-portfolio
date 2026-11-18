import { defineConfig } from 'astro/config';

// Static site. On Vercel it is served from the root and needs no settings.
// The GitHub Pages workflow sets SITE and BASE_PATH so links work under /<repo>/.
export default defineConfig({
  site: process.env.SITE || undefined,
  base: process.env.BASE_PATH || '/',
});
