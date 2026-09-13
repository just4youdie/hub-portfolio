/* ---------- Spline background: skip on mobile / reduced motion ----------
   The interactive 3D background is by far the heaviest thing on this
   site (a live WebGL scene, rendering continuously) - on phones
   especially, that can mean real battery drain and jank, which is why
   this only loads it for larger screens without a reduced-motion
   preference. Everyone else gets the flat dark background + gradient
   scrim underneath it instead (already designed to look intentional on
   its own, not just a "fallback"). This check runs once, before
   anything else, so mobile visitors never pay for the Spline script or
   scene download at all - not even a paused/hidden copy of it. */
(function initSplineBackground() {
  const bg = document.querySelector('.spline-bg');
  if (!bg) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmallScreen = window.matchMedia('(max-width: 850px)').matches;
  if (prefersReducedMotion || isSmallScreen) return;

  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://cdn.spline.design/@splinetool/viewer@2.0.9/build/spline-viewer.js';
  document.head.appendChild(script);

  const viewer = document.createElement('spline-viewer');
  viewer.setAttribute('url', 'https://prod.spline.design/R5h5fsEqatRWan44/scene.splinecode');
  bg.insertBefore(viewer, bg.firstChild);
})();

/* ---------- Shared project data ----------
   Single source of truth for every project across the site. Used by the
   Work page's category grids, the project detail page, and the Best
   Projects page - add a project once here and it's available everywhere.

   For 3D, Graphic Design, Contests, and Games, clicking a tile
   opens an internal detail page (project.html?id=...) showing the
   description and skills/tags below, with a "View full project" button
   linking to "link" - instead of jumping straight to an outside site.
   Commissions is the exception: those tiles link directly to their own
   dedicated case-study page (see commission-template.html), so they
   don't use "id"/"description" at all.

   "id" - required for 3D / Graphic Design / Contests / Games.
   A short, unique, URL-safe slug (no spaces) - this is what
   project.html?id=... looks up.

   "description" - shown on the project's detail page. Bracketed
   placeholders mean "replace me"; fill in the real brief/process/skills
   story whenever you have it.

   "link" - the "View full project" destination on the detail page:
   - a full URL (starting with http) opens in a NEW TAB (ArtStation,
     Rookies, itch.io, etc).
   - '' (empty) - the button is simply omitted; the detail page still
     shows the description/skills on their own.

   "image" is optional: leave it empty ('') to show a placeholder tile
   until you have a real image ready.

   "images" is optional: an array of extra image paths shown in a small
   gallery grid on the project's detail page, below the main cover/
   description (not shown on the grid tile itself, which only ever uses
   "image"). Use this when a project has more than one shot worth seeing
   (e.g. day/night renders, multiple angles).

   "fit" is optional: set to 'contain' for a cover image that should
   never be cropped (e.g. a wordmark/banner with transparent padding).
   Defaults to 'cover' (fills the tile, cropping as needed).

   "downloadUrl" / "viewUrl" are optional: when either is set, the detail
   page shows extra buttons - one to download a file directly, one to
   open a link (e.g. a PDF preview) in a new tab. */
const PROJECTS = {
  '3d': [
    { id: '3d-001', title: 'Tower - 001', tags: ['3D Modelling', 'Hard-Surface Modelling'], link: 'https://www.therookies.co/projects/103669', image: 'images/work/3d/project-001.webp', description: 'A hand-built medieval tower house, modelled from a single reference image. An early hard-surface modelling exercise focused on translating a 2D concept into a fully realised 3D structure in Blender.' },
    { id: '3d-002', title: 'Pocket Clock - 002', tags: ['3D Modelling', 'Detail', 'Shading & Materials'], link: 'https://www.therookies.co/projects/103670', image: 'images/work/3d/project-002.webp', description: "A detailed steampunk-style pocket clock, modelled and rendered in Blender. This project introduced fine hard-surface detailing at a small scale, along with a first custom material built from scratch using Blender's Shading Nodes." },
    { id: '3d-003', title: 'Star Destroyer - 003', tags: ['3D Animation', 'Geometry Nodes'], link: 'https://www.therookies.co/projects/104394', image: 'images/work/3d/project-003.webp', description: 'A Star Wars-inspired hyperspace jump animation built around an original Titan-class Star Destroyer. Modelled and animated in Blender using Geometry Nodes - an exercise in combining hard-surface spaceship design with procedural animation.' },
    { id: '3d-004', title: 'Project 004', tags: ['3D Modelling', 'Nature'], link: '', image: 'images/work/3d/project-004.webp', description: '[Add a short description of this project - the brief, the process, and any specific techniques or software used.]' },
    { id: '3d-005', title: 'Project 005', tags: ['Game Asset'], link: '', image: 'images/work/3d/project-005.webp', description: '[Add a short description of this project - the brief, the process, and any specific techniques or software used.]' },
    { id: '3d-006', title: 'Sand', tags: ['Environment', 'Procedural Shading'], link: 'https://www.therookies.co/projects/104813', image: 'images/work/3d/project-006.webp', description: "A close-up, realistic beach sand environment with a stylised edge. Several approaches were tested - displacement and Subdivision rendered in Cycles, then a lighter EEVEE-based setup using Geometry Nodes - with final colour work finished in Photoshop." },
    { id: '3d-007', title: 'Medieval Library Interior', tags: ['3D Modelling', 'Interior', 'Compositing'], link: 'https://www.therookies.co/projects/105375', image: 'images/work/3d/project-007.webp', description: "A low-poly medieval library interior, built as a foundations project exploring environment design and set dressing in Blender. Modelled from a curated reference board, then finished using Blender's Compositor, with renders compared between Eevee and Cycles." },
    { id: '3d-008', title: 'Exposição - Telefones do Mundo', tags: ['3D Modelling', 'University Work'], link: '', image: 'images/work/3d/project-008.webp', images: ['images/work/3d/project-008-b.webp', 'images/work/3d/project-008-c.webp', 'images/work/3d/project-008-d.webp'], description: 'In this project made during university we were tasked to create all the necessary graphic assets to build an expo about phones in a specific space we were given. It was a 3-person group; I was responsible for taking the graphic work made in Illustrator by my teammates and building a mockup of the exhibition space in Blender, placing the phones according to our vision for the exhibition.' },
  ],
  graphic: [
    { id: 'graphic-icon-library', title: 'Icon Library', tags: ['Icon Design'], link: 'https://www.behance.net/gallery/253470149/Icon-Library-UrbanEye', image: 'images/work/commissions/urbaneyept-icon-library.webp', description: 'A custom UI icon set designed for UrbanEyePT\u2019s product interface, covering actions like editing, sharing, image uploads, notifications and layout views.' },
  ],
  // Each tile links to its own internal case-study page (see
  // commission-template.html / commission-template-multi.html) rather
  // than an outside site.
  commissions: [
    { title: 'UrbanEyePT', tags: ['Graphic Design', '3D Modelling'], link: 'commission-urbaneyept.html', image: 'images/work/commissions/urbaneyept-mosaic.webp' },
  ],
  // One tile per row, full width - set up in styles.css via the
  // "grid-full" class applied automatically to this category below.
  contests: [
    {
      id: 'contests-jorge',
      title: 'Jorge',
      tags: ['Game Jam!'],
      link: 'https://fmag.itch.io/jorge',
      image: 'images/work/contests/jorge-cover.webp',
      fit: 'contain',
      downloadUrl: 'files/jorge-descriptive-memory.pdf',
      viewUrl: 'https://acrobat.adobe.com/id/urn:aaid:sc:eu:b65756da-3ff8-4b00-8046-59eacebe818a',
      description: 'A survival game made in 48 hours for Micro Jam 017: Islands, where a castaway named Roberto Rambo must escape a volcanic archipelago. Built with a 3-person team (Francisco Magueijo and Tom\u00e1s Gon\u00e7alves on programming); I created every 2D art asset in the game - environments, props, items and enemy sprites - using Aseprite for the first time.',
    },
  ],
  games: [],
  '3dprint': [
    {
      id: '3dprint-mysterybox',
      title: 'Mystery Box - Mystery Travel',
      tags: ['3D Printing', 'University Work'],
      link: '',
      image: 'images/work/3dprint/mysterybox.webp',
      images: ['images/work/3dprint/mysterybox-b.webp', 'images/work/3dprint/mysterybox-c.webp'],
      downloadUrl: 'files/mystery-box-project-report.pdf',
      description: "A university project for Design de Interfaces e Usabilidade III (3rd year, Design Communication and Audiovisual, ESART), built with a 3-person team (João Teixeira and Tiago Crispim): Mystery Travel, a surprise travel service centred on a physical Mystery Box. The box holds a symbolic coin and an NFC tag that opens a companion app revealing the trip. I designed the box itself in Blender - including the world-map side panels and lid branding - and sent it out for 3D printing (PLA); I was also responsible for the transition from the visual design into the app prototype using Adobe XD.",
    },
  ],
};

const CATEGORY_LABELS = {
  '3d': '3D',
  graphic: 'Graphic Design',
  contests: 'Contest',
  games: 'Game',
  commissions: 'Commission',
  '3dprint': '3D Printable',
};

/* ---------- Best Projects (best-projects.html) ----------
   A short, hand-picked list for the "See my best projects" page.
   References existing projects by "id" (same PROJECTS object above, so
   there's nothing to duplicate or keep in sync) - each keeps its normal
   link/behaviour (3D / Graphic Design tiles still route
   through project.html, exactly as they do on the Work page).

   BEST_PROJECTS_EXTRA is for the one exception: the UrbanEyePT Instagram
   post isn't a standalone entry anywhere in PROJECTS (it's one of two
   works shown inside the UrbanEyePT commission page), so it's listed
   here directly with its own real link - kept identical to the link
   used on that commission page (straight to Instagram, new tab). */
const BEST_PROJECTS = {
  '3d': ['3d-007', '3d-006', '3d-003'],
  graphic: ['graphic-icon-library'],
};
const BEST_PROJECTS_EXTRA = {
  '3d': [
    {
      title: 'UrbanEyePT - Instagram Post',
      tags: ['3D Modelling'],
      image: 'images/work/commissions/urbaneyept-mosaic.webp',
      link: 'https://www.instagram.com/urbaneyept/',
    },
  ],
  graphic: [],
};

const ICONS = {
  download:
    '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>',
  view:
    '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
};

/* ---------- Nav menu toggle ---------- */
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menu) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', open);
  });
}
document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

/* ---------- Footer year (contact page only) ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- "Back" links always return to exactly where you were ----------
   Runs on every page. Two separate things happen here:

   1. The plain "Work" nav link (in the header, on every page) always
      goes to the Work page itself, restoring whichever category tab was
      last active there - it should never redirect to a different list
      page like Best Projects.

   2. Every "← Back to ..." link/button (marked with [data-smart-back] -
      used on commission pages, project.html, and any future detail
      page) returns to whichever list page the person actually arrived
      from - the Work page (with its tab) OR the Best Projects page -
      and its label updates to match ("Back to Work" / "Back to Best
      Projects"). This applies automatically to any future page that
      marks its own "back" links this way; no per-page setup needed. */
(function restoreSmartBackLinks() {
  const savedCategory = sessionStorage.getItem('activeWorkCategory');
  if (savedCategory) {
    document.querySelectorAll('a[href="work.html"]:not([data-smart-back])').forEach((link) => {
      link.href = `work.html?tab=${encodeURIComponent(savedCategory)}`;
    });
  }

  const lastPage = sessionStorage.getItem('lastListPage');
  const lastLabel = sessionStorage.getItem('lastListLabel') || 'Work';
  if (!lastPage) return;
  document.querySelectorAll('[data-smart-back]').forEach((link) => {
    link.href = lastPage;
    link.textContent = link.textContent.replace(/Back to .+$/i, `Back to ${lastLabel}`);
  });
})();

/* ---------- Shared helper: thumbnail path ----------
   Every full-size image in PROJECTS has a matching small thumbnail next
   to it (images/.../thumbs/<same filename>). Used by the Work page grid
   for categories whose tiles render small, to keep pages light -
   especially on mobile. */
function toThumbPath(imagePath) {
  const parts = imagePath.split('/');
  const filename = parts.pop();
  parts.push('thumbs', filename);
  return parts.join('/');
}

/* ---------- Work page: category tabs + tag search + gallery ---------- */
const galleryGrid = document.querySelector('[data-gallery-grid]');

if (galleryGrid) {
  const tabs = document.querySelectorAll('[data-tab]');
  const searchInput = document.querySelector('[data-gallery-search]');
  const tagOptions = document.getElementById('tag-options');

  const VARIANTS = ['gal-v1', 'gal-v2', 'gal-v3', 'gal-v4'];
  const FULL_WIDTH_CATEGORIES = ['contests'];
  // Categories whose tiles open the shared project.html detail page
  // instead of linking straight out. Commissions is deliberately left
  // out - it already links to its own dedicated case-study page.
  const DETAIL_PAGE_CATEGORIES = ['3d', 'graphic', 'contests', 'games', '3dprint'];

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get('tab');
  let activeCategory =
    (requestedCategory && PROJECTS[requestedCategory] ? requestedCategory : null) ||
    sessionStorage.getItem('activeWorkCategory') ||
    '3d';
  if (!PROJECTS[activeCategory]) activeCategory = '3d';

  function isExternalLink(link) {
    return /^https?:\/\//i.test(link);
  }

  function buildTile(project, index, category) {
    const variant = VARIANTS[index % VARIANTS.length];
    const imgClass = project.fit === 'contain' ? 'gallery-img contain' : 'gallery-img';
    // Full-width tiles (Contests) can render quite large, so they keep the
    // full-size image. Every other grid is small (3-column, or 1-column on
    // mobile but still narrow), so those use the pre-generated thumbnail -
    // meaningfully lighter, especially on phones.
    const isFullWidth = FULL_WIDTH_CATEGORIES.includes(category);
    const gridImageSrc = project.image ? (isFullWidth ? project.image : toThumbPath(project.image)) : '';
    const visual = project.image
      ? `<img class="${imgClass}" src="${gridImageSrc}" alt="${project.title}" loading="lazy" decoding="async">`
      : `<div class="gallery-visual ${variant}"><div class="gallery-shape"></div></div>`;

    // Most categories route through the shared project detail page, which
    // shows a description + skills before sending people to the outside
    // link - always same-tab since it's part of this site.
    if (DETAIL_PAGE_CATEGORIES.includes(category) && project.id) {
      const el = document.createElement('a');
      el.className = 'gallery-item';
      el.href = `project.html?id=${encodeURIComponent(project.id)}`;
      el.innerHTML = `
        ${visual}
        <span class="gallery-tag">${project.tags.join(' · ')}</span>
        <div class="gallery-caption"><h3>${project.title}</h3><p>View details ↗</p></div>
      `;
      return el;
    }

    // Fallback - used by Commissions, which link straight to their own
    // dedicated case-study page rather than the generic project template.
    const hasLink = Boolean(project.link);
    const el = document.createElement(hasLink ? 'a' : 'div');
    el.className = 'gallery-item';
    if (hasLink) {
      el.href = project.link;
      if (isExternalLink(project.link)) {
        el.target = '_blank';
        el.rel = 'noopener';
      }
      // relative links (internal pages, e.g. commission case studies)
      // intentionally open in the same tab.
    } else {
      el.classList.add('no-link');
    }

    let caption = 'Link coming soon';
    if (hasLink) {
      caption = isExternalLink(project.link) ? 'View project ↗' : 'View case study ↗';
    }

    el.innerHTML = `
      ${visual}
      <span class="gallery-tag">${project.tags.join(' · ')}</span>
      <div class="gallery-caption"><h3>${project.title}</h3><p>${caption}</p></div>
    `;

    return el;
  }

  function matchesQuery(project, terms) {
    if (terms.length === 0) return true;
    return terms.every((term) => project.tags.some((tag) => tag.toLowerCase().includes(term)));
  }

  // Rebuilds the search suggestions from whatever tags actually exist in
  // the active category, so categories never share a keyword list.
  function updateTagSuggestions(category) {
    if (!tagOptions) return;
    const projects = PROJECTS[category] || [];
    const uniqueTags = [...new Set(projects.flatMap((p) => p.tags))];
    tagOptions.innerHTML = uniqueTags.map((tag) => `<option value="${tag}">`).join('');
    if (searchInput) {
      searchInput.placeholder = uniqueTags.length
        ? `Search by tag - e.g. ${uniqueTags[0]} (comma for more)`
        : 'Search by tag';
    }
  }

  function renderGallery() {
    galleryGrid.classList.toggle('grid-full', FULL_WIDTH_CATEGORIES.includes(activeCategory));
    galleryGrid.innerHTML = '';
    const rawQuery = (searchInput ? searchInput.value : '').trim();
    const terms = rawQuery
      .split(',')
      .map((term) => term.trim().toLowerCase())
      .filter(Boolean);
    const allProjects = PROJECTS[activeCategory] || [];
    const projects = allProjects.filter((project) => matchesQuery(project, terms));

    if (allProjects.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'gallery-empty';
      empty.textContent = 'Projects coming soon.';
      galleryGrid.appendChild(empty);
      return;
    }

    if (projects.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'gallery-empty';
      const tagList = terms.map((term) => `"${term}"`).join(', ');
      empty.textContent = `No projects tagged ${tagList}.`;
      galleryGrid.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    projects.forEach((project, index) => fragment.appendChild(buildTile(project, index, activeCategory)));
    galleryGrid.appendChild(fragment);
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.tab;
      sessionStorage.setItem('activeWorkCategory', activeCategory);
      sessionStorage.setItem('lastListPage', `work.html?tab=${encodeURIComponent(activeCategory)}`);
      sessionStorage.setItem('lastListLabel', 'Work');
      if (searchInput) searchInput.value = '';
      updateTagSuggestions(activeCategory);
      renderGallery();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', renderGallery);
  }

  // Reflect the restored category in the tab bar, then clean up the URL
  // so refreshing the page doesn't keep re-appending ?tab=...
  sessionStorage.setItem('activeWorkCategory', activeCategory);
  sessionStorage.setItem('lastListPage', `work.html?tab=${encodeURIComponent(activeCategory)}`);
  sessionStorage.setItem('lastListLabel', 'Work');
  tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === activeCategory));
  if (requestedCategory) {
    window.history.replaceState({}, '', window.location.pathname);
  }

  updateTagSuggestions(activeCategory);
  renderGallery();
}

/* ---------- Project detail page (project.html?id=...) ----------
   Looks up the requested id in PROJECTS (every category except
   Commissions, which uses its own dedicated pages), then fills in the
   title, skill tags, cover image, description, and a "View full
   project" button linking out - plus download/view buttons for any
   attached document (see Jorge's PDF for an example). */
(function renderProjectDetail() {
  const titleEl = document.querySelector('[data-project-title]');
  if (!titleEl) return;

  const eyebrowEl = document.querySelector('[data-project-eyebrow]');
  const skillsEl = document.querySelector('[data-project-skills]');
  const coverWrapEl = document.querySelector('[data-project-cover-wrap]');
  const coverEl = document.querySelector('[data-project-cover]');
  const descEl = document.querySelector('[data-project-description]');
  const galleryEl = document.querySelector('[data-project-gallery]');
  const actionsEl = document.querySelector('[data-project-actions]');
  const backBtn = actionsEl.querySelector('a[href="work.html"]');

  const id = new URLSearchParams(window.location.search).get('id');

  let found = null;
  let foundCategory = null;
  Object.entries(PROJECTS).forEach(([category, list]) => {
    list.forEach((project) => {
      if (project.id && project.id === id) {
        found = project;
        foundCategory = category;
      }
    });
  });

  if (!found) {
    eyebrowEl.textContent = 'PROJECT';
    titleEl.textContent = 'Project not found';
    descEl.textContent = "This project doesn't exist, or may have moved. Head back to Work to find it.";
    coverWrapEl.style.display = 'none';
    skillsEl.style.display = 'none';
    if (galleryEl) galleryEl.style.display = 'none';
    return;
  }

  document.title = `${found.title} - Ruben Alves`;
  eyebrowEl.textContent = (CATEGORY_LABELS[foundCategory] || 'Project').toUpperCase();
  titleEl.textContent = found.title;

  if (found.image) {
    coverEl.src = found.image;
    coverEl.alt = found.title;
    if (found.fit === 'contain') coverEl.classList.add('contain');
  } else {
    coverWrapEl.style.display = 'none';
  }

  (found.tags || []).forEach((tag) => {
    const pill = document.createElement('span');
    pill.className = 'tool-pill';
    pill.textContent = tag;
    skillsEl.appendChild(pill);
  });

  if (galleryEl) {
    galleryEl.innerHTML = '';
    const extraImages = found.images || [];
    if (extraImages.length > 0) {
      extraImages.forEach((src, i) => {
        const item = document.createElement('div');
        item.className = 'project-gallery-item';
        item.innerHTML = `<img src="${src}" alt="${found.title} - image ${i + 2}" loading="lazy" decoding="async">`;
        galleryEl.appendChild(item);
      });
      galleryEl.style.display = '';
    } else {
      galleryEl.style.display = 'none';
    }
  }

  descEl.textContent =
    found.description ||
    "Add a short description of this project - the brief, the process, and what you're proud of.";

  // Extra buttons inserted before the existing "Back to Work" button:
  // the outside link (if any), then download/view for an attached doc.
  if (found.link) {
    const linkBtn = document.createElement('a');
    linkBtn.className = 'button button-dark';
    linkBtn.href = found.link;
    linkBtn.target = '_blank';
    linkBtn.rel = 'noopener';
    linkBtn.innerHTML = 'View full project <span>↗</span>';
    actionsEl.insertBefore(linkBtn, backBtn);
  }
  if (found.downloadUrl) {
    const dlBtn = document.createElement('a');
    dlBtn.className = 'button button-light button-icon';
    dlBtn.href = found.downloadUrl;
    dlBtn.setAttribute('download', '');
    dlBtn.innerHTML = `${ICONS.download} Download PDF`;
    actionsEl.insertBefore(dlBtn, backBtn);
  }
  if (found.viewUrl) {
    const viewBtn = document.createElement('a');
    viewBtn.className = 'button button-light button-icon';
    viewBtn.href = found.viewUrl;
    viewBtn.target = '_blank';
    viewBtn.rel = 'noopener';
    viewBtn.innerHTML = `${ICONS.view} View PDF online`;
    actionsEl.insertBefore(viewBtn, backBtn);
  }
})();

/* ---------- Best Projects page (best-projects.html) ---------- */
(function renderBestProjects() {
  const threeDGrid = document.querySelector('[data-best-3d]');
  if (!threeDGrid) return;

  // So "← Back to ..." links on project.html (reached by clicking a tile
  // here) return to this page instead of defaulting to the Work page.
  sessionStorage.setItem('lastListPage', 'best-projects.html');
  sessionStorage.setItem('lastListLabel', 'Best Projects');

  const graphicGrid = document.querySelector('[data-best-graphic]');

  const VARIANTS = ['gal-v1', 'gal-v2', 'gal-v3', 'gal-v4'];

  function findById(id) {
    let found = null;
    Object.values(PROJECTS).forEach((list) => {
      list.forEach((project) => {
        if (project.id === id) found = project;
      });
    });
    return found;
  }

  function buildBestTile({ title, tags, image, href, external }, index) {
    const variant = VARIANTS[index % VARIANTS.length];
    const el = document.createElement('a');
    el.className = 'gallery-item';
    el.href = href;
    if (external) {
      el.target = '_blank';
      el.rel = 'noopener';
    }
    const visual = image
      ? `<img class="gallery-img" src="${toThumbPath(image)}" alt="${title}" loading="lazy" decoding="async">`
      : `<div class="gallery-visual ${variant}"><div class="gallery-shape"></div></div>`;
    const caption = external ? 'View project ↗' : 'View details ↗';
    el.innerHTML = `
      ${visual}
      <span class="gallery-tag">${tags.join(' · ')}</span>
      <div class="gallery-caption"><h3>${title}</h3><p>${caption}</p></div>
    `;
    return el;
  }

  function renderSection(grid, category) {
    if (!grid) return;
    let index = 0;
    (BEST_PROJECTS[category] || []).forEach((id) => {
      const project = findById(id);
      if (!project) return;
      grid.appendChild(
        buildBestTile(
          {
            title: project.title,
            tags: project.tags,
            image: project.image,
            href: `project.html?id=${encodeURIComponent(project.id)}`,
            external: false,
          },
          index++
        )
      );
    });
    (BEST_PROJECTS_EXTRA[category] || []).forEach((item) => {
      grid.appendChild(
        buildBestTile({ ...item, href: item.link, external: true }, index++)
      );
    });
  }

  renderSection(threeDGrid, '3d');
  renderSection(graphicGrid, 'graphic');
})();

/* ---------- Project image lightbox ----------
   On project.html, clicking the cover image or any image in the extra
   gallery opens it larger in an overlay. Uses event delegation on
   document so it works no matter when those images get added to the
   page (they're inserted dynamically by renderProjectDetail above). */
(function projectLightbox() {
  const lightbox = document.querySelector('[data-lightbox]');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('[data-lightbox-img]');
  const closeBtn = lightbox.querySelector('[data-lightbox-close]');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const clickedImg = e.target.closest('[data-project-cover-wrap] img, .project-gallery-item img');
    if (clickedImg) openLightbox(clickedImg.src, clickedImg.alt);
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();
