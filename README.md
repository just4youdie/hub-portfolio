# Ruben Alves — Portfolio

A dark, metallic, CGI-inspired portfolio in four pages. Your Spline scene
runs as a darkened, full-page background on every page.

## Pages

- `index.html` — Home / hero, Spline scene as background, plus a
  5-tile rotating mosaic on the right showing real project covers (see
  "Homepage mosaic" below).
- `work.html` — Five category tabs (3D related / Graphic Designer /
  Contests / Commissions / Games). Each shows only the projects you've
  added — no filler tiles — plus a search bar that filters by tag. Search
  suggestions are built per-category from that category's own tags, so
  categories never share a keyword list.
  - **3D related, Graphic Designer, Contests, Games**: clicking a tile
    opens that project's page on `project.html` — a short description
    plus its skill tags — with a "View full project" button that then
    sends people to the outside link (Rookies, ArtStation, itch.io, etc)
    in a new tab. Contests tiles are also full width, one per row.
  - **Commissions**: tiles link straight to their own dedicated
    case-study page instead (richer than the generic template) — see
    "Commissions" below.
- `project.html` — one shared, dynamic page for every 3D related /
  Graphic Designer / Contests / Games project. It reads `?id=...` from
  the URL and fills itself in from `PROJECTS` — see below.
- `about.html` — Simple bio: location, availability, focus, and tools.
- `contact.html` — CV download + contact + social links.

## Work page — adding your real projects

Open `script.js` and find the `PROJECTS` object right at the top of the
file (it's shared by the homepage mosaic and `project.html` too, not just
the Work page grids). Each category is a plain array — add, remove, or
reorder entries and the grid updates to match exactly (no empty
placeholder tiles are ever generated beyond what you list).

```js
'3d': [
  { id: '3d-008', title: 'Product Render 08', tags: ['3D Modelling'], link: 'https://your-project-url', image: '', description: '[...]' },
],
```

- `id` — required for 3D related / Graphic Designer / Contests / Games (not
  needed for Commissions). A short, unique, URL-safe slug with no spaces —
  it's what `project.html?id=...` looks up. Just make sure it's not
  already used by another project.
- `title` — shown on the tile and on its detail page.
- `tags` — an array of one or more tags. Shown as the badge on the tile
  and again as "skills applied" chips on the detail page, and used by the
  search bar to filter results within that category. Each category
  builds its own search suggestions automatically from whatever tags its
  projects use. Current 3D related vocabulary: `3D Modelling`,
  `3D Animation`, `Detail`, `Environment`, `Nature`, `Interior`,
  `Game Asset`.
- `description` — shown on the project's detail page, under the cover
  image. Bracketed placeholder text (`[...]`) means "write the real thing
  whenever you have it" — several 3D related projects still have these
  since only you know the actual brief/process for each one.
- `link` — the "View full project" destination on the detail page (always
  opens in a **new tab**, since it's meant to send people to the more
  detailed version elsewhere — ArtStation, Rookies, itch.io, etc). Leave
  it as `''` and that button is simply left out; the description/skills
  still show on their own. (For Commissions, `link` instead points
  directly at that commission's own page — see below.)
- `image` — path to the cover image relative to the site root (e.g.
  `images/work/3d/project-001.jpg`). Leave it as `''` to show a placeholder
  tile until you have a real image.
- `fit` — optional. Set to `'contain'` for a cover image that shouldn't be
  cropped at all (e.g. a wordmark or banner with its own padding, like
  Jorge's cover). Leave it out for normal photo/render covers, which crop
  to fill as usual — this applies on both the grid tile and its detail page.
- `downloadUrl` / `viewUrl` — optional. Set either (or both) to add extra
  buttons on the project's detail page: one to download a file directly,
  one to open a link (e.g. a PDF preview) in a new tab. Used on Jorge to
  offer its descriptive-memory PDF alongside the itch.io link.

If a category's array is empty, the Work page shows a simple "Projects
coming soon" message instead of a blank grid. `graphic` and `games` are
sparse/empty for now — add entries the same way once you have work to
show there.

**3D related** is already populated with your 7 Rookies projects and their
cover images (in `images/work/3d/`), resized and compressed for the web.
5 of them (001, 002, 003, 006, 007) now have real titles, descriptions,
and skill tags pulled directly from what you wrote on each Rookies page.
Project 004 and 005 don't have a Rookies link yet, so their descriptions
are still placeholder text — fill those in (and give them a `link`) once
they're posted.

**Contests** has one real entry, Jorge (Micro Jam 017: Islands) — full
width on the grid, tagged "Game Jam!", with a real description already
written from your game jam memory document, linking to `fmag.itch.io/jorge`
plus its descriptive-memory PDF (in `files/`) via `downloadUrl`/`viewUrl`.

## Homepage mosaic

The 5 tiles on the right of the homepage hero automatically pull from
every cover image in `PROJECTS` (across all categories) — there's no
separate list to maintain. Each tile independently swaps to a new random
image every 5–7 seconds with a slow crossfade, staggered per tile so they
don't all flip at once.

- A tile never repeats the image it's already showing, and no two tiles
  ever display the same project at the same time — every rotation always
  picks something genuinely different from what's currently on screen
  (its own and every other tile's). That same image is still free to come
  back around later once others have had their turn.
- If a project's `image` is `''` (no cover yet), it's simply excluded
  from the rotation.
- If there are no images anywhere in `PROJECTS` yet, the whole mosaic
  hides itself rather than showing blank tiles.
- The mosaic is decorative (not clickable, and marked `aria-hidden` for
  screen readers) — its job is just to prove there's real work behind the
  "Explore selected work" button. Send people to Work for the actual,
  clickable gallery.
- Timing lives in `script.js` inside `homeGalleryRotation()`: `FADE_MS`
  controls the crossfade length (keep it matched to the CSS transition
  duration on `.home-gallery-img`), and the `setInterval(rotate, 5000 +
  Math.random() * 2000)` line controls how long each image stays on
  screen.

## "Wave" CTA styling

The homepage's "Explore selected work" button and the "Download CV" link
in the header (on every page) share a `wave-cta` modifier class: fully
rounded corners plus a slow, smooth greyscale/chrome shimmer that eases
back and forth continuously (no jump-cut) via `background-position`. It's
opt-in — add `wave-cta` alongside `button button-dark` or `nav-cv` on any
other link if you want the same effect elsewhere; every other button on
the site is unaffected. Colours and timing are set in `styles.css` under
`.button.wave-cta,.nav-cv.wave-cta` and the `waveFlow` keyframes (currently
a 14s ease-in-out loop). It respects `prefers-reduced-motion`.

## Returning to the exact category you were browsing

Every "← Back to Work" link on every project page (`project.html`,
commission pages, and any future internal page) automatically returns to
the exact category tab you were on — not just the Work page in general.
This is handled once, globally, in `script.js`:

- Whenever a tab is clicked, its key (e.g. `commissions`) is saved to
  `sessionStorage`.
- Any link on any page pointing to plain `work.html` gets that saved
  category appended (`work.html?tab=commissions`) automatically before
  the person can click it.
- `work.html` itself reads `?tab=...` on load and opens directly on that
  category.

Because this is automatic, you don't need to do anything extra when
adding a new project or project page — just link back with a plain
`href="work.html"` and it will resolve to the right category on its own.

## Commissions — adding a case study

Each commission gets its own page on the site (not an outside link), so
people can browse it without leaving your portfolio, and can always get
back to Work/About/Contact from the same header.

Two templates are available:

- **`commission-template.html`** — single work, one cover image.
- **`commission-template-multi.html`** — several works shown on one
  client page, each linking wherever you like (used for UrbanEyePT below).

1. Duplicate whichever template fits, rename it (e.g.
   `commission-acme.html`), and open it.
2. Replace every `[BRACKETED]` placeholder: client name (used in the page
   heading and title only — the badge under it shows just the logo, no
   repeated text), logo, cover image(s), description, and links.
3. Put the client's logo and cover image(s) in
   `images/work/commissions/`.
4. In `script.js`, add **one** entry to `PROJECTS.commissions` for the
   whole page (not one per work, even with the multi template):

```js
commissions: [
  { title: 'Acme Corp', tags: ['3D Modelling'], link: 'commission-acme.html', image: 'images/work/commissions/acme-cover.jpg' },
],
```

Note `link` is just the filename (no `https://`) — that's what makes the
work-page tile open it as an internal page instead of a new tab.

Every commission page keeps the full site header/nav plus an explicit
"← Back to Work" link (both at the top and in the footer), so nobody ends
up stuck on a page with no way back.

**UrbanEyePT** is already set up as a real example
(`commission-urbaneyept.html`) using the multi-work template — it shows
the Icon Library (linking to Behance) and an Instagram post render
(linking to Instagram) side by side under the UrbanEyePT logo. The Icon
Library also appears on its own under **Graphic Designer**, using the
same image and link.

## Before publishing

1. Put your CV PDF in this folder and name it exactly `cv.pdf`.
2. Add your real projects and images in `script.js` as described above.
3. Double check the social links in `contact.html` match your current
   profiles.

## Spline background

Each page includes the same block:

```html
<div class="spline-bg" aria-hidden="true">
  <spline-viewer url="YOUR_SPLINE_SCENE_URL"></spline-viewer>
  <div class="spline-scrim"></div>
</div>
```

Darkened via a CSS `filter` on the viewer plus a dark gradient overlay
(`.spline-scrim`) in `styles.css`, so page text stays readable.

## Mobile

All four pages are responsive: safe-area padding for notched phones,
`dvh`-based sizing so the mobile browser address bar doesn't cut off
content, a full-width tap-friendly nav drawer, and a gallery grid that
drops from 3 → 2 → 1 columns as the screen narrows.

## Publishing

Static site — host on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or
any normal web host. Keep all files in the same folder.
