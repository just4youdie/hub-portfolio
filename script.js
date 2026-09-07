/* ---------- Shared project data ----------
   Single source of truth for every project across the site. Used by the
   Work page's category grids AND the homepage's rotating mosaic — add a
   project once here and it shows up in both places automatically.

   For 3D related, Graphic Designer, Contests, and Games, clicking a tile
   opens an internal detail page (project.html?id=...) showing the
   description and skills/tags below, with a "View full project" button
   linking to "link" — instead of jumping straight to an outside site.
   Commissions is the exception: those tiles link directly to their own
   dedicated case-study page (see commission-template.html), so they
   don't use "id"/"description" at all.

   "id" — required for 3D related / Graphic Designer / Contests / Games.
   A short, unique, URL-safe slug (no spaces) — this is what
   project.html?id=... looks up.

   "description" — shown on the project's detail page. Bracketed
   placeholders mean "replace me"; fill in the real brief/process/skills
   story whenever you have it.

   "link" — the "View full project" destination on the detail page:
   - a full URL (starting with http) opens in a NEW TAB (ArtStation,
     Rookies, itch.io, etc).
   - '' (empty) — the button is simply omitted; the detail page still
     shows the description/skills on their own.

   "image" is optional: leave it empty ('') to show a placeholder tile
   until you have a real image ready.

   "fit" is optional: set to 'contain' for a cover image that should
   never be cropped (e.g. a wordmark/banner with transparent padding).
   Defaults to 'cover' (fills the tile, cropping as needed).

   "downloadUrl" / "viewUrl" are optional: when either is set, the detail
   page shows extra buttons — one to download a file directly, one to
   open a link (e.g. a PDF preview) in a new tab. */
const PROJECTS = {
  '3d': [
    { id: '3d-001', title: 'Project 001', tags: ['3D Modelling'], link: 'https://www.therookies.co/projects/103669', image: 'images/work/3d/project-001.jpg', description: '[Add a short description of this project — the brief, the process, and any specific techniques or software used.]' },
    { id: '3d-002', title: 'Project 002', tags: ['3D Modelling', 'Detail'], link: 'https://www.therookies.co/projects/103670', image: 'images/work/3d/project-002.jpg', description: '[Add a short description of this project — the brief, the process, and any specific techniques or software used.]' },
    { id: '3d-003', title: 'Project 003', tags: ['3D Animation'], link: 'https://www.therookies.co/projects/104394', image: 'images/work/3d/project-003.jpg', description: '[Add a short description of this project — the brief, the process, and any specific techniques or software used.]' },
    { id: '3d-004', title: 'Project 004', tags: ['3D Modelling', 'Nature'], link: '', image: 'images/work/3d/project-004.jpg', description: '[Add a short description of this project — the brief, the process, and any specific techniques or software used.]' },
    { id: '3d-005', title: 'Project 005', tags: ['Game Asset'], link: '', image: 'images/work/3d/project-005.jpg', description: '[Add a short description of this project — the brief, the process, and any specific techniques or software used.]' },
    { id: '3d-006', title: 'Project 006', tags: ['Environment'], link: 'https://www.therookies.co/projects/104813', image: 'images/work/3d/project-006.jpg', description: '[Add a short description of this project — the brief, the process, and any specific techniques or software used.]' },
    { id: '3d-007', title: 'Project 007', tags: ['3D Modelling', 'Interior'], link: 'https://www.therookies.co/projects/105375', image: 'images/work/3d/project-007.jpg', description: '[Add a short description of this project — the brief, the process, and any specific techniques or software used.]' },
  ],
  graphic: [
    { id: 'graphic-icon-library', title: 'Icon Library', tags: ['Icon Design'], link: 'https://www.behance.net/gallery/253470149/Icon-Library-UrbanEye', image: 'images/work/commissions/urbaneyept-icon-library.jpg', description: 'A custom UI icon set designed for UrbanEyePT\u2019s product interface, covering actions like editing, sharing, image uploads, notifications and layout views.' },
  ],
  // Each tile links to its own internal case-study page (see
  // commission-template.html / commission-template-multi.html) rather
  // than an outside site.
  commissions: [
    { title: 'UrbanEyePT', tags: ['Graphic Design', '3D Modelling'], link: 'commission-urbaneyept.html', image: 'images/work/commissions/urbaneyept-mosaic.jpg' },
  ],
  // One tile per row, full width — set up in styles.css via the
  // "grid-full" class applied automatically to this category below.
  contests: [
    {
      id: 'contests-jorge',
      title: 'Jorge',
      tags: ['Game Jam!'],
      link: 'https://fmag.itch.io/jorge',
      image: 'images/work/contests/jorge-cover.png',
      fit: 'contain',
      downloadUrl: 'files/jorge-descriptive-memory.pdf',
      viewUrl: 'https://acrobat.adobe.com/id/urn:aaid:sc:eu:b65756da-3ff8-4b00-8046-59eacebe818a',
      description: 'A survival game made in 48 hours for Micro Jam 017: Islands, where a castaway named Roberto Rambo must escape a volcanic archipelago. Built with a 3-person team (Francisco Magueijo and Tom\u00e1s Gon\u00e7alves on programming); I created every 2D art asset in the game \u2014 environments, props, items and enemy sprites \u2014 using Aseprite for the first time.',
    },
  ],
  games: [],
};

const CATEGORY_LABELS = {
  '3d': '3D Related',
  graphic: 'Graphic Designer',
  contests: 'Contest',
  games: 'Game',
  commissions: 'Commission',
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

/* ---------- Remember last-viewed Work category ----------
   Runs on every page. Any link pointing to work.html (e.g. every
   "← Back to Work" link on a commission page, contest download, etc.)
   automatically gets the last category the person was browsing appended
   to it, so "Back to Work" always returns to where they actually were —
   this applies to every current and future project detail page without
   needing any extra setup on that page. */
(function restoreBackToWorkLinks() {
  const savedCategory = sessionStorage.getItem('activeWorkCategory');
  if (!savedCategory) return;
  document.querySelectorAll('a[href="work.html"]').forEach((link) => {
    link.href = `work.html?tab=${encodeURIComponent(savedCategory)}`;
  });
})();

/* ---------- Homepage: rotating project mosaic ----------
   Pulls every project image already defined in PROJECTS above (no
   separate list to maintain) and cycles each tile through a random one
   every 5–7 seconds, with a slow crossfade. As soon as a new project is
   added anywhere in PROJECTS, its cover image joins this rotation
   automatically. No two tiles ever show the same project at the same
   time, and a tile never repeats the image it's already showing. */
(function homeGalleryRotation() {
  const gallery = document.querySelector('[data-home-gallery]');
  if (!gallery) return;

  const seen = new Set();
  const pool = [];
  Object.values(PROJECTS).forEach((list) => {
    list.forEach((project) => {
      if (project.image && !seen.has(project.image)) {
        seen.add(project.image);
        pool.push({ src: project.image, alt: project.title });
      }
    });
  });

  const tileEls = Array.from(gallery.querySelectorAll('[data-home-tile]'));
  if (pool.length === 0) {
    gallery.style.display = 'none';
    return;
  }

  const FADE_MS = 900; // keep in sync with the .home-gallery-img transition duration

  // Give every tile a different starting image where possible, and keep
  // track of what each tile is currently showing so future rotations can
  // avoid duplicating another tile's current image.
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const current = tileEls.map((tile, i) => {
    const pick = shuffled[i % shuffled.length];
    const img = tile.querySelector('img');
    img.src = pick.src;
    img.alt = pick.alt;
    return pick;
  });

  function pickNextFor(tileIndex) {
    const ownSrc = current[tileIndex].src;
    const shownElsewhere = current
      .filter((_, i) => i !== tileIndex)
      .map((p) => p.src);

    // Ideal case: not the tile's own current image, and not currently
    // shown by any other tile either.
    let candidates = pool.filter((p) => p.src !== ownSrc && !shownElsewhere.includes(p.src));

    // Not enough unique images to go around (more tiles than pool size) —
    // fall back to just avoiding this tile's own current image.
    if (candidates.length === 0) candidates = pool.filter((p) => p.src !== ownSrc);

    // Only one image exists in total — nothing else to pick.
    if (candidates.length === 0) candidates = pool;

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  tileEls.forEach((tile, index) => {
    const img = tile.querySelector('img');
    function rotate() {
      const next = pickNextFor(index);
      current[index] = next;
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = next.src;
        img.alt = next.alt;
        img.style.opacity = '1';
      }, FADE_MS);
    }
    // Random 5–7s on display per tile, staggered so they don't all flip together.
    setInterval(rotate, 5000 + Math.random() * 2000);
  });
})();

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
  // out — it already links to its own dedicated case-study page.
  const DETAIL_PAGE_CATEGORIES = ['3d', 'graphic', 'contests', 'games'];

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
    const visual = project.image
      ? `<img class="${imgClass}" src="${project.image}" alt="${project.title}">`
      : `<div class="gallery-visual ${variant}"><div class="gallery-shape"></div></div>`;

    // Most categories route through the shared project detail page, which
    // shows a description + skills before sending people to the outside
    // link — always same-tab since it's part of this site.
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

    // Fallback — used by Commissions, which link straight to their own
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

  function matchesQuery(project, query) {
    if (!query) return true;
    return project.tags.some((tag) => tag.toLowerCase().includes(query));
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
        ? `Search by tag — e.g. ${uniqueTags[0]}`
        : 'Search by tag';
    }
  }

  function renderGallery() {
    galleryGrid.classList.toggle('grid-full', FULL_WIDTH_CATEGORIES.includes(activeCategory));
    galleryGrid.innerHTML = '';
    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const allProjects = PROJECTS[activeCategory] || [];
    const projects = allProjects.filter((project) => matchesQuery(project, query));

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
      empty.textContent = `No projects tagged "${searchInput.value.trim()}".`;
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
   project" button linking out — plus download/view buttons for any
   attached document (see Jorge's PDF for an example). */
(function renderProjectDetail() {
  const titleEl = document.querySelector('[data-project-title]');
  if (!titleEl) return;

  const eyebrowEl = document.querySelector('[data-project-eyebrow]');
  const skillsEl = document.querySelector('[data-project-skills]');
  const coverWrapEl = document.querySelector('[data-project-cover-wrap]');
  const coverEl = document.querySelector('[data-project-cover]');
  const descEl = document.querySelector('[data-project-description]');
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
    return;
  }

  document.title = `${found.title} — Ruben Alves`;
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

  descEl.textContent =
    found.description ||
    "Add a short description of this project — the brief, the process, and what you're proud of.";

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
