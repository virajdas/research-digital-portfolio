/*
  GitHub Pages serves this site from a subfolder (/research-digital-portfolio/), while
  Vercel or a custom domain serves it from the root. `u()` puts the right prefix on any
  path that starts with "/", so content in site.ts can keep plain paths like '/media/x.jpg'.
*/
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const u = (path?: string) =>
  path && path.startsWith('/') && !path.startsWith('//') ? base + path : path;
/** The current page's path with that prefix removed again, e.g. '/research'. */
export const unbase = (pathname: string) =>
  (pathname.startsWith(base) ? pathname.slice(base.length) : pathname).replace(/\/$/, '') || '/';
