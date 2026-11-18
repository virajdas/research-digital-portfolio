import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends HTMLElement = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s);
const $$ = <T extends HTMLElement = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)];
// Line-based splits use autoSplit (see below) so the lines re-flow if the window is resized.
const LINES = { type: 'lines', mask: 'lines', linesClass: 'split-line' } as const;
const CHARS = { type: 'lines,words,chars', mask: 'lines', linesClass: 'split-line' } as const;

/* ---------- The film: one video, scrubbed by scroll ----------
   The film is divided into 8 equal segments between 9 "beats" (see site.ts).
   `filmBeats` says where on the page each beat should land; between those
   points the video moves in step with the scroll. */
const BEATS = 8;
let filmTick: (() => void) | null = null;
let filmRefresh: (() => void) | null = null;

function playFilm(filmBeats: () => [number, number][]) {
  const video = $<HTMLVideoElement>('#film');
  if (!video || !video.getAttribute('src')) return; // no video yet: the poster still stays up
  let points = filmBeats();
  const beatAt = (y: number) => {
    if (y <= points[0][0]) return points[0][1];
    for (let i = 1; i < points.length; i++) {
      const [y1, b1] = points[i], [y0, b0] = points[i - 1];
      if (y <= y1) return b0 + ((y - y0) / Math.max(1, y1 - y0)) * (b1 - b0);
    }
    return points[points.length - 1][1];
  };
  let asked = -1, askedAt = 0;
  filmRefresh = () => { points = filmBeats(); };
  ScrollTrigger.addEventListener('refresh', filmRefresh);
  filmTick = () => {
    if (!video.duration) return;
    // No easing: the frame shown is exactly the one this scroll position maps to.
    const t = Math.min(video.duration - 0.04, (beatAt(window.scrollY) / BEATS) * video.duration);
    // Seek when the frame would change. A seek the browser dropped or left hanging
    // (it happens while the file is still downloading) is issued again.
    const now = performance.now();
    const moved = Math.abs(t - asked) > 1 / 60;
    const dropped = !video.seeking && Math.abs(video.currentTime - t) > 0.05;
    const hung = video.seeking && now - askedAt > 400;
    if (moved || dropped || hung) { video.currentTime = t; asked = t; askedAt = now; }
  };
  gsap.ticker.add(filmTick);
}

/* ---------- Per-page setup (runs again after every page change) ---------- */
let ctx: gsap.Context | null = null;

function common() {
  gsap.to('.nav__progress i', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

  $$('[data-rise]').forEach((el) => {
    SplitText.create(el, {
      ...LINES, autoSplit: true,
      onSplit: (s) => gsap.from(s.lines, { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.09, scrollTrigger: { trigger: el, start: 'top 88%' } }),
    });
  });

  $$('[data-words]').forEach((el) => {
    const s = SplitText.create(el, { type: 'words' });
    // Text that is already on screen when the page opens reveals itself once, on a timer.
    // Text further down reveals as you scroll to it.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.82) {
      gsap.fromTo(s.words, { opacity: 0.16 }, { opacity: 1, duration: 0.6, ease: 'power1.out', stagger: 0.05, delay: 0.6 });
      return;
    }
    gsap.fromTo(s.words, { opacity: 0.16 }, {
      opacity: 1, ease: 'none', stagger: 0.5,
      scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: true },
    });
  });

  $$('.rows').forEach((list) => {
    gsap.from($$('.row', list), { autoAlpha: 0, y: 28, duration: 0.9, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: list, start: 'top 85%' } });
  });

  const title = $('.page-title');
  if (title) {
    SplitText.create(title, {
      ...CHARS, autoSplit: true,
      onSplit: (s) => gsap.from(s.chars, { yPercent: 110, duration: 1.2, ease: 'power4.out', stagger: 0.035 }),
    });
    gsap.from('.page-lede', { autoAlpha: 0, y: 20, duration: 1, ease: 'power3.out', delay: 0.5 });
    gsap.to('.page-head', { autoAlpha: 0.1, yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.page-head', start: 'top top', end: 'bottom top', scrub: true } });
  }
  // The still behind a subpage arrives, drifts as you scroll, and darkens once you start reading.
  if ($('.backdrop img')) {
    gsap.from('.backdrop img', { autoAlpha: 0, scale: 1.08, duration: 2.2, ease: 'power2.out' });
    gsap.to('.backdrop img', { yPercent: -6, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    gsap.fromTo('.backdrop__scrim', { opacity: 0.45 }, { opacity: 0.86, ease: 'none', scrollTrigger: { start: 0, end: () => window.innerHeight * 0.8, scrub: true } });
  }
}

function home() {
  const copy = $('.hero__copy')!;

  /* Load */
  SplitText.create('.hero__title', {
    ...CHARS, autoSplit: true,
    onSplit: (s) => gsap.from(s.chars, { yPercent: 110, duration: 1.3, ease: 'power4.out', stagger: 0.03, delay: 0.2 }),
  });
  gsap.set(copy, { visibility: 'visible' });
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .from('#film', { autoAlpha: 0, scale: 1.06, duration: 2, ease: 'power2.out' }, 0)
    .from('.hero__lede, .hero__cta, .hero__byline', { autoAlpha: 0, y: 18, duration: 1, stagger: 0.1 }, 0.7);

  /* Hero: held while the pane lifts, floats and turns into a window (beats 0 to 2) */
  const hero = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=170%', pin: '.hero__pin', scrub: true } });
  hero.to(copy, { autoAlpha: 0, y: -80, duration: 0.35, ease: 'power1.in' }, 0)
    .fromTo('.backdrop__scrim', { opacity: 0.12 }, { opacity: 0.5, duration: 0.3, ease: 'none', immediateRender: false }, 0.7);

  /* The problem: the galaxy overloads as this section scrolls by (beats 3 to 4) */
  const pips = $$('.prob__pips i');
  const n = pips.length;
  const pair = (sel: string) => {
    const [a, b] = $$(`${sel} span`);
    gsap.set(b, { yPercent: 105 });
    return [a, b];
  };
  const [numA, numB] = pair('.prob__num');
  const [capA, capB] = pair('.prob__cap');
  // Not pinned: the section scrolls past normally and the animation plays as it crosses the screen.
  const prob = gsap.timeline({ scrollTrigger: { trigger: '.prob', start: 'top 62%', end: 'bottom 78%', scrub: true } });
  pips.forEach((pip, i) => { if (i) prob.to(pip, { scaleY: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }, i - 0.5); });
  prob.fromTo('.backdrop__scrim', { opacity: 0.5 }, { opacity: 0.66, duration: n - 1, ease: 'none', immediateRender: false }, 0) // the overload frame is bright
    .to([numA, capA], { yPercent: -105, duration: 0.8, ease: 'power3.inOut' }, n - 1)
    .to([numB, capB], { yPercent: 0, duration: 0.8, ease: 'power3.inOut' }, n - 1);

  /* How it works: held while the memories are sorted, biased and retrieved (beats 5 to 7) */
  const bars = $$('.how__bars .bar');
  const steps = $$('.how__steps li');
  const pitch = 44;
  const widths = bars.map((b) => parseFloat(b.style.getPropertyValue('--w')));
  const sorted = widths.map((w, i) => ({ w, i })).sort((x, y) => y.w - x.w).map((o) => o.i);
  const biased = [...sorted];
  [biased[1], biased[2]] = [biased[2], biased[1]];
  [biased[3], biased[4]] = [biased[4], biased[3]];
  bars.forEach((b, i) => gsap.set(b, { y: i * pitch }));
  const setStep = (k: number) => steps.forEach((li, i) => li.classList.toggle('is-on', i === k));
  setStep(0);
  const how = gsap.timeline({
    scrollTrigger: {
      trigger: '.how', start: 'top top', end: '+=2400', pin: '.how__pin', scrub: true,
      onUpdate: (st) => setStep(st.progress < 0.36 ? 0 : st.progress < 0.7 ? 1 : 2),
    },
  });
  sorted.forEach((bar, rank) => how.to(bars[bar], { y: rank * pitch, duration: 1, ease: 'power3.inOut' }, 0.15 + rank * 0.04));
  how.to(bars, { borderColor: 'rgba(242,242,243,0.55)', duration: 0.6 }, 0.4)
    .fromTo('.how__bias', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 1.7);
  biased.forEach((bar, rank) => how.to(bars[bar], { y: rank * pitch, duration: 0.9, ease: 'power3.inOut' }, 2.3));
  biased.forEach((bar, rank) => {
    if (rank < 3) {
      how.to(bars[bar], { left: 100 - widths[bar] + '%', borderColor: '#f2f2f3', duration: 0.9, ease: 'power3.inOut' }, 3.7 + rank * 0.08)
        .to($('i', bars[bar]), { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 3.7 + rank * 0.08);
    } else {
      how.to(bars[bar], { opacity: 0.22, duration: 0.6 }, 3.7);
    }
  });
  how.fromTo('.how__tag--out', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 3.9)
    .to({}, { duration: 0.6 });

  gsap.from('.status__empty', { autoAlpha: 0, y: 30, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.status__empty', start: 'top 85%' } });
  gsap.from('.more li', { autoAlpha: 0, y: 40, duration: 1, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.more', start: 'top 80%' } });

  /* Where each beat of the film lands on the page: [scroll position, beat] */
  const H = hero.scrollTrigger!, P = prob.scrollTrigger!, W = how.scrollTrigger!;
  return (): [number, number][] => {
    const closing = $('.status')!.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4;
    return [
      [H.start, 0],                                   // pane lifting from the row
      [H.start + (H.end - H.start) * 0.5, 1],         // floating, centred
      [H.end, 2],                                     // a window onto the galaxy
      [P.start, 3],                                   // inside the galaxy
      [P.end, 4],                                     // overload, as the score drops
      [W.start, 5],                                   // sorted
      [W.start + (W.end - W.start) * 0.5, 6],         // the layer beneath
      [W.start + (W.end - W.start) * 0.92, 7],        // three retrieved
      [closing, 8],                                   // back outside the pane
    ];
  };
}

function process() {
  $$('.method__steps li').forEach((li) => {
    gsap.fromTo(li, { opacity: 0.25 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: li, start: 'top 85%', end: 'top 55%', scrub: true } });
  });
  gsap.to('.time__line i', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.time__list', start: 'top 70%', end: 'bottom 60%', scrub: true } });
  gsap.from('.time__list li', { autoAlpha: 0, x: -24, duration: 0.9, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.time__list', start: 'top 78%' } });
  gsap.from('.status__measures li', { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.status__measures', start: 'top 92%' } });
}

function research() {
  const links = $$<HTMLAnchorElement>('.review__toc a');
  $$('.review__text article').forEach((a, i) => {
    ScrollTrigger.create({
      trigger: a, start: 'top 45%', end: 'bottom 45%',
      onToggle: (st) => st.isActive && links.forEach((l, j) => l.classList.toggle('is-here', i === j)),
    });
  });
}

function about() {
  SplitText.create('.me__name', {
    ...CHARS, autoSplit: true,
    onSplit: (s) => gsap.from(s.chars, { yPercent: 110, duration: 1.4, ease: 'power4.out', stagger: 0.05 }),
  });

  // Double exposure: the portrait arrives first, then the second image develops inside it.
  // While you read, that second image keeps drifting slowly through the silhouette.
  if ($('.dx')) {
    gsap.from('.dx__portrait', { autoAlpha: 0, duration: 1.6, ease: 'power2.out' });
    gsap.from('.dx__fill', { autoAlpha: 0, duration: 2.6, ease: 'power2.inOut', delay: 0.5 });
    gsap.fromTo('.dx__sky', { scale: 1.25, xPercent: 6, yPercent: -5 }, {
      scale: 1, xPercent: -6, yPercent: 5, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true },
    });
  }

  gsap.from('.facts dl div', { autoAlpha: 0, y: 24, duration: 0.9, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.facts', start: 'top 85%' } });
  if ($('.more')) gsap.from('.more li', { autoAlpha: 0, y: 40, duration: 1, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.more', start: 'top 85%' } });
}

function init() {
  const page = $('main')!.dataset.page;
  let filmBeats: (() => [number, number][]) | undefined;

  if (!reduced) {
    ctx = gsap.context(() => {
      if (page === 'home') filmBeats = home();
      if (page === 'about') about();
      common();
      if (page === 'process') process();
      if (page === 'research') research();
    });
  }
  ScrollTrigger.refresh();
  if (filmBeats) playFilm(filmBeats);

  // Arriving at /#how from another page: jump there once the pinned sections have their real heights.
  const target = location.hash && document.querySelector<HTMLElement>(location.hash);
  if (target) {
    const y = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, y);
    ScrollTrigger.update();
  }
}

/* Same-page anchor links scroll to their target */
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
  if (!a || a.target === '_blank') return;
  const url = new URL(a.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
  const target = document.querySelector<HTMLElement>(url.hash);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  history.replaceState(null, '', url.hash);
});

document.addEventListener('astro:before-swap', () => {
  if (filmTick) gsap.ticker.remove(filmTick);
  if (filmRefresh) ScrollTrigger.removeEventListener('refresh', filmRefresh);
  filmTick = filmRefresh = null;
  ctx?.revert();
  ctx = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
document.addEventListener('astro:after-swap', () => window.scrollTo(0, 0));
document.addEventListener('astro:page-load', () => document.fonts.ready.then(init));
