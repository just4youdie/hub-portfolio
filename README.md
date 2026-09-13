# Ruben Alves - Portfolio

A dark, metallic, CGI-inspired portfolio in several pages. Your Spline
scene runs as a darkened, full-page background on every page.

## Pages

- `index.html` - Home / hero, with two buttons: "Explore selected work"
  (all categories) and "See my best projects" (a short curated list -
  see `best-projects.html` below).
- `work.html` - Six category tabs (3D / Graphic Design / 3D Printable /
  Contests / Commissions / Games). Each shows only the projects you've
  added - no filler tiles - plus a search bar that filters by tag. Search
  suggestions are built per-category from that category's own tags, so
  categories never share a keyword list.
  - **3D, Graphic Design, 3D Printable, Contests, Games**: clicking a tile
    opens that project's page on `project.html` - a short description
    plus its skill tags - with a "View full project" button that then
    sends people to the outside link (Rookies, ArtStation, itch.io, etc)
    in a new tab. Contests tiles are also full width, one per row.
  - **Commissions**: tiles link straight to their own dedicated
    case-study page instead (richer than the generic template) - see
    "Commissions" below.
- `project.html` - one shared, dynamic page for every 3D /
  Graphic Design / 3D Printable / Contests / Games project. It reads
  `?id=...` from the URL and fills itself in from `PROJECTS` - see below.
  Clicking the cover image or any image in a project's extra gallery
  opens it larger in a lightbox (click outside it, the ✕, or press Esc
  to close).
- `best-projects.html` - a short, hand-picked list of your strongest
  work, split into just two sections (3D and Graphic Design), nothing
  else - see "Best Projects page" below.
- `about.html` - Simple bio: location, availability, focus, and tools.
- `contact.html` - CV download + contact + social links.

## Work page - adding your real projects

Open `script.js` and find the `PROJECTS` object right at the top of the
file (it's shared by `project.html` and `best-projects.html` too, not
just the Work page grids). Each category is a plain array - add, remove,
or reorder entries and the grid updates to match exactly (no empty
placeholder tiles are ever generated beyond what you list).

```js
'3d': [
  { id: '3d-008', title: 'Product Render 08', tags: ['3D Modelling'], link: 'https://your-project-url', image: '', description: '[...]' },
],
```

- `id` - required for 3D / Graphic Design / Contests / Games (not
  needed for Commissions). A short, unique, URL-safe slug with no spaces -
  it's what `project.html?id=...` looks up, and what `BEST_PROJECTS`
  references (see "Best Projects page" below). Just make sure it's not
  already used by another project.
- `title` - shown on the tile and on its detail page.
- `tags` - an array of one or more tags. Shown as the badge on the tile
  and again as "skills applied" chips on the detail page, and used by the
  search bar to filter results within that category - the search box
  accepts multiple, comma-separated tags at once (see "Multi-tag search"
  below). Each category builds its own search suggestions automatically
  from whatever tags its projects use. Current 3D vocabulary:
  `3D Modelling`, `3D Animation`, `Detail`, `Environment`, `Nature`,
  `Interior`, `Game Asset`, `University Work`.
- `description` - shown on the project's detail page, next to the cover
  image. Bracketed placeholder text (`[...]`) means "write the real thing
  whenever you have it" - several 3D projects still have these
  since only you know the actual brief/process for each one.
- `link` - the "View full project" destination on the detail page (always
  opens in a **new tab**, since it's meant to send people to the more
  detailed version elsewhere - ArtStation, Rookies, itch.io, etc). Leave
  it as `''` and that button is simply left out; the description/skills
  still show on their own. (For Commissions, `link` instead points
  directly at that commission's own page - see below.)
- `image` - path to the cover image relative to the site root (e.g.
  `images/work/3d/project-001.jpg`). Leave it as `''` to show a placeholder
  tile until you have a real image.
- `images` - optional array of extra image paths, shown in a small
  gallery grid on the project's detail page (below the cover/
  description). Use this for a project with more than one worthwhile
  shot - e.g. Exposição - Telefones do Mundo shows a day and night
  render of two different views. Only `image` (the single cover) shows
  on the grid tile; the rest only appear once you click through. Every
  image here and the main cover are clickable - clicking either opens a
  full-size lightbox view (see "Image lightbox" below).
- `fit` - optional. Set to `'contain'` for a cover image that shouldn't be
  cropped at all (e.g. a wordmark or banner with its own padding, like
  Jorge's cover). Leave it out for normal photo/render covers, which crop
  to fill as usual - this applies on both the grid tile and its detail page.
- `downloadUrl` / `viewUrl` - optional. Set either (or both) to add extra
  buttons on the project's detail page: one to download a file directly,
  one to open a link (e.g. a PDF preview) in a new tab. Used on Jorge to
  offer its descriptive-memory PDF alongside the itch.io link.

If a category's array is empty, the Work page shows a simple "Projects
coming soon" message instead of a blank grid. `graphic` and `games` are
sparse/empty for now - add entries the same way once you have work to
show there.

**3D** now has 8 projects and their cover images (in `images/work/3d/`),
resized and compressed for the web. 5 of the original 7 (001, 002, 003,
006, 007) have real titles, descriptions, and skill tags pulled directly
from what you wrote on each Rookies page; project 008 (Exposição -
Telefones do Mundo) is a university project with its own 4-image set (1
cover + 3 in its gallery) and no outside link. Project 004 and 005 don't
have a Rookies link yet, so their descriptions are still placeholder text
- fill those in (and give them a `link`) once they're posted.

**3D Printable** is a new category for physical/3D-printed objects,
separate from the render-only work in **3D**. It has one real entry,
Mystery Box - Mystery Travel, a university project (team: João Teixeira
and Tiago Crispim) - a 3-photo set (1 cover + 2 in its gallery), tagged
"3D Printing" and "University Work", with the project's full PDF report
(in `files/`) attached via `downloadUrl`.

**Contests** has one real entry, Jorge (Micro Jam 017: Islands) - full
width on the grid, tagged "Game Jam!", with a real description already
written from your game jam memory document, linking to `fmag.itch.io/jorge`
plus its descriptive-memory PDF (in `files/`) via `downloadUrl`/`viewUrl`.

## Image lightbox

On `project.html`, clicking the cover image or any image in a project's
extra gallery (`images` field) opens it larger in a full-screen overlay -
close it by clicking outside the image, the ✕ button, or pressing Esc.
This is handled once, globally, in `script.js` (`projectLightbox()`)
using event delegation, so it automatically applies to every current and
future project - no per-project setup needed, and it keeps working even
though those images are inserted dynamically after the page loads.

## Multi-tag search

The Work page search box accepts more than one tag at once - separate
them with a comma (e.g. `3D Modelling, Detail`) and it only shows
projects that have **all** of those tags, not just any one of them. This
is implemented in `matchesQuery()` in `script.js`. One small limitation
worth knowing: the tag-suggestion dropdown (native browser autocomplete)
only matches against the very start of what you've typed, so it stops
offering suggestions once you type a comma and start a second tag - you
can still type the rest by hand, it just won't autocomplete.

## Best Projects page

`best-projects.html` is a short, curated shortcut to your strongest work
- no tabs, no search, just two labelled sections (3D, then Graphic
Design) with larger, 2-column tiles so there's more to look at per
project. It's linked from the homepage's "See my best projects" button
and isn't in the main nav - it's meant to feel like a special shortcut,
not another everyday page.

The list lives in `script.js`, just above the `renderProjectDetail`
function:

```js
const BEST_PROJECTS = {
  '3d': ['3d-007', '3d-006', '3d-003'],
  graphic: ['graphic-icon-library'],
};
```

Each entry is just an `id` from `PROJECTS` - nothing is duplicated, so
editing a project's title/image/description once updates it everywhere,
including here. To change the picks, edit these two arrays (order = the
order tiles appear in). Clicking a tile behaves exactly like it does on
the Work page - same link, same destination.

One exception: **`BEST_PROJECTS_EXTRA`**, right below it, is for the
UrbanEyePT Instagram post - it isn't a standalone entry in `PROJECTS`
(it's one of two works shown inside the UrbanEyePT commission page), so
it's listed here directly with its own title/image/link instead of an
`id`. Its link goes straight to Instagram, same as it does on the
commission page - not through `project.html`.

## Image sizes and formats

Every cover image ships as WebP (smaller than the original JPEG/PNG at
the same visual quality) in two sizes:

- `images/.../project-name.webp` - the full-size version (up to 1400px
  wide), used on the project detail page, and on grid tiles for
  full-width categories (Contests) where tiles can render quite large.
- `images/.../thumbs/project-name.webp` - a small version (up to 640px
  wide) with the exact same filename, used on every other grid tile
  (Work page's 3-column categories, Commissions, and Best Projects) -
  those never render large enough to need the full-size file.
  `toThumbPath()` in `script.js` derives this path automatically from
  `image`, so you never set it separately - just make sure a `thumbs/`
  version with a matching filename exists alongside the full one.

Grid images also load with `loading="lazy"` so they don't download until
they're about to scroll into view. When adding a new project image, run
it through the same resize/compress step (both sizes, WebP) rather than
dropping in an original photo/render straight from Blender or Photoshop -
those are typically many megabytes and will make the site noticeably
heavier, especially on mobile connections.

## "Wave" CTA and the featured button

The homepage's "Explore selected work" button and the "Download CV" link
in the header (on every page) share a `wave-cta` modifier class: fully
rounded corners plus a slow, smooth greyscale/chrome shimmer that eases
back and forth continuously (no jump-cut) via `background-position`. It's
opt-in - add `wave-cta` alongside `button button-dark` or `nav-cv` on any
other link if you want the same effect elsewhere; every other button on
the site is unaffected. Colours and timing are set in `styles.css` under
`.button.wave-cta,.nav-cv.wave-cta` and the `waveFlow` keyframes (currently
a 14s ease-in-out loop). It respects `prefers-reduced-motion`.

"See my best projects" uses a different modifier, `button-feature`: a
charcoal/navy glass panel with a slow breathing navy glow (`featurePulse`
in `styles.css`) instead of a moving shimmer - deliberately distinct from
`wave-cta` so it reads as its own, separate kind of call-to-action, while
still using the site's existing palette (charcoal + the navy accent
colour used sparingly elsewhere). Also opt-in, also respects
`prefers-reduced-motion`.

## "Back" links always return to exactly where you were

Every "← Back to ..." link/button on every detail page (`project.html`,
commission pages, and any future page) returns to whichever list page
the person actually came from - the Work page, with the exact tab they
had open, **or** the Best Projects page - not just "Work" by default.
This is handled once, globally, in `script.js`, and the button's own
label updates too ("Back to Work" / "Back to Best Projects").

How it works:

- `work.html` and `best-projects.html` are the two "list" pages. Each one
  saves its own identity to `sessionStorage` as soon as it loads (or a
  tab is switched, on Work) - a page to return to (e.g.
  `work.html?tab=commissions`) and a label to show (e.g. `Work`).
- Any element marked `data-smart-back` (every existing "← Back to Work"
  link and button already has this) gets its `href` and visible label
  rewritten to match whichever list page was saved most recently.
- The plain "Work" link in the header nav is deliberately **not** marked
  `data-smart-back` - it always goes to the Work page itself (restoring
  its last tab), never to Best Projects, since it's a permanent nav item
  rather than a "return to where I was" action.

Because this is automatic, adding a new detail page just means linking
back with `href="work.html" data-smart-back` (as the existing templates
already do) - no extra setup needed for it to resolve correctly.

## Commissions - adding a case study

Each commission gets its own page on the site (not an outside link), so
people can browse it without leaving your portfolio, and can always get
back to Work/About/Contact from the same header.

Two templates are available:

- **`commission-template.html`** - single work, one cover image.
- **`commission-template-multi.html`** - several works shown on one
  client page, each linking wherever you like (used for UrbanEyePT below).

1. Duplicate whichever template fits, rename it (e.g.
   `commission-acme.html`), and open it.
2. Replace every `[BRACKETED]` placeholder: client name (used in the page
   heading and title only - the badge under it shows just the logo, no
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

Note `link` is just the filename (no `https://`) - that's what makes the
work-page tile open it as an internal page instead of a new tab.

Every commission page keeps the full site header/nav plus an explicit
"← Back to Work" link (both at the top and in the footer), so nobody ends
up stuck on a page with no way back.

**UrbanEyePT** is already set up as a real example
(`commission-urbaneyept.html`) using the multi-work template - it shows
the Icon Library (linking to Behance) and an Instagram post render
(linking to Instagram) side by side under the UrbanEyePT logo. The Icon
Library also appears on its own under **Graphic Design**, using the
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
  <div class="spline-scrim"></div>
</div>
```

Note there's no `<spline-viewer>` element in the HTML itself anymore -
`initSplineBackground()` at the very top of `script.js` inserts it (and
loads the Spline script) only when the visitor is on a screen wider than
850px **and** hasn't asked their OS/browser for reduced motion. On
mobile, or with reduced motion on, that function returns early and does
nothing - no script download, no scene fetch, no WebGL canvas at all.
What's left is just the flat dark background plus the `.spline-scrim`
gradient overlay, which was already designed to look intentional on its
own rather than like a fallback.

This was a deliberate performance choice: a live 3D WebGL scene is
easily the single heaviest thing on this site, and phones feel that cost
far more than desktops do (battery drain, jank, weaker GPUs). If you
ever want the interactive scene on mobile too, delete the
`isSmallScreen` check in `initSplineBackground()` - the URL and darkening
filter live in the same function/`.spline-bg spline-viewer` CSS rule as
before.

Darkened via a CSS `filter` on the viewer plus a dark gradient overlay
(`.spline-scrim`) in `styles.css`, so page text stays readable.

## Mobile

All four pages are responsive: safe-area padding for notched phones,
`dvh`-based sizing so the mobile browser address bar doesn't cut off
content, a full-width tap-friendly nav drawer, and a gallery grid that
drops from 3 → 2 → 1 columns as the screen narrows.

## Publishing

Static site - host on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or
any normal web host. Keep all files in the same folder.
