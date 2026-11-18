# Scalable AI Memory: research portfolio

Digital portfolio for my AP Research project. Built with [Astro](https://astro.build) and [GSAP](https://gsap.com) (ScrollTrigger, SplitText). Scrolling is the browser's own, with no smoothing layer, so the film and pinned scenes follow the scroll exactly.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:4321.

## Edit the content

Almost everything is in two files:

| File | What is in it |
| --- | --- |
| `src/content/site.ts` | Every heading, paragraph, source, timeline entry, the about page, references, hero video path |
| `src/content/litreview.ts` | The literature review text, one string per paragraph |

Empty fields are hidden on the site, so nothing shows as a placeholder.

Rule for this project: nothing goes on the site that is not real. Figures need a citation. Results stay empty until the experiment has run.

### The background film

The home page has one continuous video behind it (`public/media/film.mp4`) that plays forward and backward as you scroll. It was generated as eight 5-second segments, each starting on the previous segment's last frame, then joined. `film` in `site.ts` lists the nine story beats, and `filmBeats` in `src/scripts/main.ts` pins each beat to a section of the page, so a replacement video of any length works as long as it tells the same story in nine evenly spaced beats.

To swap in a new video, encode it so every few frames is a keyframe (that is what makes scrubbing smooth), then replace the file:

```bash
ffmpeg -i input.mp4 -an -vf scale=1280:-2 -c:v libx264 -preset slow -crf 25 -g 3 -bf 0 -movflags +faststart public/media/film.mp4
```

The other pages show a single still from the film (`film.stills` in `site.ts`).

### Add media

Put files in `public/media/` and point to them from `src/content/site.ts`:

- **Portrait:** the About page shows a double exposure, which needs a photo of you with the background removed. To make one from an ordinary photo on a Mac:
  ```bash
  swift tools/cutout.swift path/to/photo.jpg cut.png && python3 tools/clean-cutout.py cut.png clean.png && cwebp -q 88 -alpha_q 100 clean.png -o public/media/portrait-cut.webp
  ```
  (`brew install webp` gives you `cwebp`; the clean-up step needs `pip install pillow numpy scipy`. It removes leftover sky or window light around the hair and softens the edge.) Then check `about.photo` in `site.ts` points at it. `about.exposure` is the second image that shows through your silhouette.
- **Resume or poster PDFs:** drop them in `public/` and link to them as `/filename.pdf`.

### Add a page or section

Pages live in `src/pages/` (`index`, `research`, `process`, `about`). Copy one, give it a new name, and add it to `nav` in `site.ts`. Shared layout is `src/layouts/Base.astro`; styles are in `src/styles/global.css`; animation and the scroll-driven film are in `src/scripts/main.ts`.

Likely additions as the project goes on: results and data, the research poster, a reflection.

## Deploy

**GitHub Pages (current).** Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it. Pages serves it from a subfolder named after the repository, so the workflow sets `BASE_PATH` for the build and `src/lib/url.ts` prefixes every link and media path with it. The URL is public, so it works for people outside FCS.

To check the Pages build locally:

```bash
BASE_PATH=/research-digital-portfolio npm run build && npx astro preview
```

**Vercel (alternative).** Import the repository at [vercel.com](https://vercel.com) and deploy. No settings are needed: without `BASE_PATH` the site builds for the root.
