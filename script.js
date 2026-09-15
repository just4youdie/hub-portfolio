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
   (e.g. day/night renders, multiple angles). Like "image", each one
   needs a thumbs/ twin next to it.

   "fit" is optional: set to 'contain' for a cover image that should
   never be cropped (e.g. a wordmark/banner with transparent padding).
   Defaults to 'cover' (fills the tile, cropping as needed).

   "downloadUrl" / "viewUrl" are optional: when either is set, the detail
   page shows extra buttons - one to download a file directly, one to
   open a link (e.g. a PDF preview) in a new tab.

   "i18n" is optional but expected on anything with English prose: it
   holds the same "title"/"description" in the site's other languages,
   e.g. i18n: { pt: { title: '...', description: '...' } }. Anything
   missing falls back to the English field above, so a proper noun
   ("Jorge", "UrbanEyePT") simply doesn't need an entry. Tags are NOT
   repeated here - they're translated once in i18n.js, since the same
   tag is shared by many projects. */
const PROJECTS = {
  '3d': [
    {
      id: '3d-001',
      title: 'Tower - 001',
      tags: ['3D Modelling', 'Hard-Surface Modelling'],
      link: 'https://www.therookies.co/projects/103669',
      image: 'images/work/3d/project-001.webp',
      description: 'A hand-built medieval tower house, modelled from a single reference image. An early hard-surface modelling exercise focused on translating a 2D concept into a fully realised 3D structure in Blender.',
      i18n: {
        pt: {
          title: 'Torre - 001',
          description: 'Uma torre medieval construída de raiz, modelada a partir de uma única imagem de referência. Um exercício inicial de modelação hard-surface focado em traduzir um conceito 2D numa estrutura 3D completa em Blender.',
        },
      },
    },
    {
      id: '3d-002',
      title: 'Pocket Clock - 002',
      tags: ['3D Modelling', 'Detail', 'Shading & Materials'],
      link: 'https://www.therookies.co/projects/103670',
      image: 'images/work/3d/project-002.webp',
      description: "A detailed steampunk-style pocket clock, modelled and rendered in Blender. This project introduced fine hard-surface detailing at a small scale, along with a first custom material built from scratch using Blender's Shading Nodes.",
      i18n: {
        pt: {
          title: 'Relógio de Bolso - 002',
          description: 'Um relógio de bolso ao estilo steampunk, modelado e renderizado em Blender. Este projeto introduziu detalhe hard-surface fino em pequena escala, a par de um primeiro material personalizado construído de raiz com os Shading Nodes do Blender.',
        },
      },
    },
    {
      id: '3d-003',
      title: 'Star Destroyer - 003',
      tags: ['3D Animation', 'Geometry Nodes'],
      link: 'https://www.therookies.co/projects/104394',
      image: 'images/work/3d/project-003.webp',
      description: 'A Star Wars-inspired hyperspace jump animation built around an original Titan-class Star Destroyer. Modelled and animated in Blender using Geometry Nodes - an exercise in combining hard-surface spaceship design with procedural animation.',
      i18n: {
        pt: {
          description: 'Uma animação de salto para hiperespaço inspirada em Star Wars, construída à volta de um Star Destroyer original da classe Titan. Modelado e animado em Blender com Geometry Nodes - um exercício de combinação entre design hard-surface de naves e animação procedural.',
        },
      },
    },
    {
      id: '3d-004',
      title: 'Project 004',
      tags: ['3D Modelling', 'Nature'],
      link: '',
      image: 'images/work/3d/project-004.webp',
      description: '[Add a short description of this project - the brief, the process, and any specific techniques or software used.]',
      i18n: {
        pt: {
          title: 'Projeto 004',
          description: '[Adiciona uma breve descrição deste projeto - o briefing, o processo e quaisquer técnicas ou software utilizados.]',
        },
      },
    },
    {
      id: '3d-005',
      title: 'Project 005',
      tags: ['Game Asset'],
      link: '',
      image: 'images/work/3d/project-005.webp',
      description: '[Add a short description of this project - the brief, the process, and any specific techniques or software used.]',
      i18n: {
        pt: {
          title: 'Projeto 005',
          description: '[Adiciona uma breve descrição deste projeto - o briefing, o processo e quaisquer técnicas ou software utilizados.]',
        },
      },
    },
    {
      id: '3d-006',
      title: 'Sand',
      tags: ['Environment', 'Procedural Shading'],
      link: 'https://www.therookies.co/projects/104813',
      image: 'images/work/3d/project-006.webp',
      description: "A close-up, realistic beach sand environment with a stylised edge. Several approaches were tested - displacement and Subdivision rendered in Cycles, then a lighter EEVEE-based setup using Geometry Nodes - with final colour work finished in Photoshop.",
      i18n: {
        pt: {
          title: 'Areia',
          description: 'Um ambiente realista de areia de praia em grande plano, com um toque estilizado. Foram testadas várias abordagens - displacement e Subdivision renderizados em Cycles, depois uma montagem mais leve em EEVEE com Geometry Nodes - com o trabalho final de cor feito em Photoshop.',
        },
      },
    },
    {
      id: '3d-007',
      title: 'Medieval Library Interior',
      tags: ['3D Modelling', 'Interior', 'Compositing'],
      link: 'https://www.therookies.co/projects/105375',
      image: 'images/work/3d/project-007.webp',
      description: "A low-poly medieval library interior, built as a foundations project exploring environment design and set dressing in Blender. Modelled from a curated reference board, then finished using Blender's Compositor, with renders compared between Eevee and Cycles.",
      i18n: {
        pt: {
          title: 'Interior de Biblioteca Medieval',
          description: 'Um interior de biblioteca medieval em low-poly, criado como projeto de fundamentos para explorar design de ambientes e set dressing em Blender. Modelado a partir de um painel de referências, depois finalizado com o Compositor do Blender, comparando renders entre Eevee e Cycles.',
        },
      },
    },
    {
      id: '3d-008',
      title: 'Exposição - Telefones do Mundo',
      tags: ['3D Modelling', 'University Work'],
      link: '',
      image: 'images/work/3d/project-008.webp',
      images: ['images/work/3d/project-008-b.webp', 'images/work/3d/project-008-c.webp', 'images/work/3d/project-008-d.webp'],
      description: 'In this project made during university we were tasked to create all the necessary graphic assets to build an expo about phones in a specific space we were given. It was a 3-person group; I was responsible for taking the graphic work made in Illustrator by my teammates and building a mockup of the exhibition space in Blender, placing the phones according to our vision for the exhibition.',
      i18n: {
        pt: {
          description: 'Neste projeto académico foi-nos pedido que criássemos todos os materiais gráficos necessários para montar uma exposição sobre telefones num espaço que nos foi atribuído. Foi um grupo de 3 pessoas; fiquei responsável por pegar no trabalho gráfico feito em Illustrator pelos meus colegas e construir uma maquete do espaço da exposição em Blender, colocando os telefones de acordo com a nossa visão para a exposição.',
        },
      },
    },
  ],
  graphic: [
    {
      id: 'graphic-icon-library',
      title: 'Icon Library',
      tags: ['Icon Design'],
      link: 'https://www.behance.net/gallery/253470149/Icon-Library-UrbanEye',
      image: 'images/work/commissions/urbaneyept-icon-library.webp',
      description: 'A custom UI icon set designed for UrbanEyePT’s product interface, covering actions like editing, sharing, image uploads, notifications and layout views.',
      i18n: {
        pt: {
          title: 'Biblioteca de Ícones',
          description: 'Um conjunto de ícones de interface desenhado à medida para o produto da UrbanEyePT, cobrindo ações como edição, partilha, carregamento de imagens, notificações e vistas de layout.',
        },
      },
    },
  ],
  // Each tile links to its own internal case-study page (see
  // commission-template.html / commission-template-multi.html) rather
  // than an outside site. The client name is a proper noun, so there's
  // nothing to translate here - the page itself carries the copy.
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
      description: 'A survival game made in 48 hours for Micro Jam 017: Islands, where a castaway named Roberto Rambo must escape a volcanic archipelago. Built with a 3-person team (Francisco Magueijo and Tomás Gonçalves on programming); I created every 2D art asset in the game - environments, props, items and enemy sprites - using Aseprite for the first time.',
      i18n: {
        pt: {
          description: 'Um jogo de sobrevivência feito em 48 horas para a Micro Jam 017: Islands, em que um náufrago chamado Roberto Rambo tem de escapar de um arquipélago vulcânico. Feito com uma equipa de 3 pessoas (Francisco Magueijo e Tomás Gonçalves na programação); criei todos os assets de arte 2D do jogo - ambientes, adereços, itens e sprites de inimigos - usando Aseprite pela primeira vez.',
        },
      },
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
      i18n: {
        pt: {
          description: 'Um projeto académico para Design de Interfaces e Usabilidade III (3.º ano, Design de Comunicação e Audiovisual, ESART), feito com uma equipa de 3 pessoas (João Teixeira e Tiago Crispim): Mystery Travel, um serviço de viagens surpresa centrado numa Mystery Box física. A caixa contém uma moeda simbólica e uma tag NFC que abre uma app complementar a revelar a viagem. Desenhei a própria caixa em Blender - incluindo os painéis laterais com o mapa-múndi e a marca na tampa - e enviei-a para impressão 3D (PLA); fui também responsável pela transição do design visual para o protótipo da app em Adobe XD.',
        },
      },
    },
  ],
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
   used on that commission page (straight to Instagram, new tab). It
   takes the same optional "i18n" block as a normal project. */
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
      i18n: { pt: { title: 'UrbanEyePT - Publicação no Instagram' } },
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

/* ---------- Language helpers ----------
   i18n.js is loaded first (in <head>), so I18N is ready by the time
   this file runs. These four wrappers are all the rest of the file
   needs to know about translation:

   - t()            UI copy, from the dictionary in i18n.js
   - titleOf() /
     descriptionOf() project copy, from PROJECTS[...].i18n
   - tagsOf()       project tags, translated via i18n.js

   Anything a language switch changes has to be redrawn, so each
   renderer below registers itself with onLanguageChange(). */
const t = (key, vars) => I18N.t(key, vars);
const localized = (project) => (project.i18n && project.i18n[I18N.language]) || {};
const titleOf = (project) => localized(project).title || project.title;
const descriptionOf = (project) => localized(project).description || project.description;
const tagsOf = (project) => (project.tags || []).map((tag) => I18N.tTag(tag));

const languageListeners = [];
function onLanguageChange(render) {
  languageListeners.push(render);
}
document.addEventListener('i18n:change', () => languageListeners.forEach((render) => render()));

/* Project titles are data, and several tiles are built as HTML strings,
   so everything interpolated into markup goes through this first - an
   apostrophe or angle bracket in a title should show up as text, not
   break the tile around it. */
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

/* sessionStorage is blocked outright in some privacy modes. Losing
   "which tab was I on" is fine; throwing on every page load is not. */
const session = {
  get(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      /* ignore - the page works without it */
    }
  },
};

/* ---------- Nav menu toggle ---------- */
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', open);
  });
}
document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => nav && nav.classList.remove('open'));
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
      marks its own "back" links this way; no per-page setup needed.

   What's stored is the label's translation KEY, not the label itself,
   so a visitor who switches language mid-visit gets the back link in
   the language they're reading now, not the one they arrived in. */
(function restoreSmartBackLinks() {
  const savedCategory = session.get('activeWorkCategory');
  if (savedCategory) {
    document.querySelectorAll('a[href="work.html"]:not([data-smart-back])').forEach((link) => {
      link.href = `work.html?tab=${encodeURIComponent(savedCategory)}`;
    });
  }

  function updateBackLinks() {
    const lastPage = session.get('lastListPage');
    const labelKey = session.get('lastListLabelKey') || 'back.work';
    document.querySelectorAll('[data-smart-back]').forEach((link) => {
      if (lastPage) link.href = lastPage;
      link.textContent = t('back.template', { target: t(labelKey) });
    });
  }

  updateBackLinks();
  onLanguageChange(updateBackLinks);
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
    session.get('activeWorkCategory') ||
    '3d';
  if (!PROJECTS[activeCategory]) activeCategory = '3d';

  function isExternalLink(link) {
    return /^https?:\/\//i.test(link);
  }

  function buildTile(project, index, category) {
    const variant = VARIANTS[index % VARIANTS.length];
    const imgClass = project.fit === 'contain' ? 'gallery-img contain' : 'gallery-img';
    const title = titleOf(project);
    const tags = tagsOf(project).join(' · ');
    // Full-width tiles (Contests) can render quite large, so they keep the
    // full-size image. Every other grid is small (3-column, or 1-column on
    // mobile but still narrow), so those use the pre-generated thumbnail -
    // meaningfully lighter, especially on phones.
    const isFullWidth = FULL_WIDTH_CATEGORIES.includes(category);
    const gridImageSrc = project.image ? (isFullWidth ? project.image : toThumbPath(project.image)) : '';
    const visual = project.image
      ? `<img class="${imgClass}" src="${esc(gridImageSrc)}" alt="${esc(title)}" loading="lazy" decoding="async">`
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
        <span class="gallery-tag">${esc(tags)}</span>
        <div class="gallery-caption"><h3>${esc(title)}</h3><p>${esc(t('gallery.viewDetails'))}</p></div>
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

    let caption = t('gallery.noLink');
    if (hasLink) {
      caption = isExternalLink(project.link) ? t('gallery.viewProject') : t('gallery.viewCase');
    }

    el.innerHTML = `
      ${visual}
      <span class="gallery-tag">${esc(tags)}</span>
      <div class="gallery-caption"><h3>${esc(title)}</h3><p>${esc(caption)}</p></div>
    `;

    return el;
  }

  // Search runs against the tags as they're shown on screen, so typing
  // "modelação" works in Portuguese and "modelling" works in English.
  function matchesQuery(project, terms) {
    if (terms.length === 0) return true;
    const tags = tagsOf(project).map((tag) => tag.toLowerCase());
    return terms.every((term) => tags.some((tag) => tag.includes(term)));
  }

  // Rebuilds the search suggestions from whatever tags actually exist in
  // the active category, so categories never share a keyword list.
  function updateTagSuggestions(category) {
    const projects = PROJECTS[category] || [];
    const uniqueTags = [...new Set(projects.flatMap((project) => tagsOf(project)))];
    if (tagOptions) {
      tagOptions.innerHTML = uniqueTags.map((tag) => `<option value="${esc(tag)}">`).join('');
    }
    if (searchInput) {
      searchInput.placeholder = uniqueTags.length
        ? t('gallery.searchHint', { tag: uniqueTags[0] })
        : t('gallery.searchFallback');
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
      empty.textContent = t('gallery.empty');
      galleryGrid.appendChild(empty);
      return;
    }

    if (projects.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'gallery-empty';
      const tagList = terms.map((term) => `"${term}"`).join(', ');
      empty.textContent = t('gallery.noMatches', { tags: tagList });
      galleryGrid.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    projects.forEach((project, index) => fragment.appendChild(buildTile(project, index, activeCategory)));
    galleryGrid.appendChild(fragment);
  }

  function syncTabs() {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === activeCategory;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
  }

  function rememberCategory() {
    session.set('activeWorkCategory', activeCategory);
    session.set('lastListPage', `work.html?tab=${encodeURIComponent(activeCategory)}`);
    session.set('lastListLabelKey', 'back.work');
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.tab === activeCategory) return;
      activeCategory = tab.dataset.tab;
      syncTabs();
      rememberCategory();
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
  rememberCategory();
  syncTabs();
  if (requestedCategory) {
    window.history.replaceState({}, '', window.location.pathname);
  }

  updateTagSuggestions(activeCategory);
  renderGallery();

  // A tag typed in one language won't match the other, so the box is
  // cleared rather than silently showing "no results".
  onLanguageChange(() => {
    if (searchInput) searchInput.value = '';
    updateTagSuggestions(activeCategory);
    renderGallery();
  });
}

/* ---------- Project detail page (project.html?id=...) ----------
   Looks up the requested id in PROJECTS (every category except
   Commissions, which uses its own dedicated pages), then fills in the
   title, skill tags, cover image, description, and a "View full
   project" button linking out - plus download/view buttons for any
   attached document (see Jorge's PDF for an example).

   Written so it can be run again from scratch when the language
   changes: every part it owns is cleared first. */
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

  // Everything added by the last run, so a language switch doesn't
  // stack a second set of buttons or skill pills on top of the first.
  function resetActions() {
    const backBtn = actionsEl.querySelector('[data-smart-back]');
    [...actionsEl.children].forEach((child) => {
      if (child !== backBtn) child.remove();
    });
    return backBtn;
  }

  function render() {
    skillsEl.innerHTML = '';
    const backBtn = resetActions();

    if (!found) {
      document.title = t('meta.project.title');
      eyebrowEl.textContent = t('project.eyebrow');
      titleEl.textContent = t('project.notFound.title');
      descEl.textContent = t('project.notFound.body');
      coverWrapEl.style.display = 'none';
      skillsEl.style.display = 'none';
      if (galleryEl) galleryEl.style.display = 'none';
      return;
    }

    const title = titleOf(found);
    document.title = `${title} - Ruben Alves`;
    eyebrowEl.textContent = t(`cat.${foundCategory}`).toUpperCase();
    titleEl.textContent = title;

    if (found.image) {
      coverWrapEl.style.display = '';
      coverEl.src = found.image;
      coverEl.alt = title;
      coverEl.classList.toggle('contain', found.fit === 'contain');
    } else {
      coverWrapEl.style.display = 'none';
    }

    skillsEl.style.display = '';
    tagsOf(found).forEach((tag) => {
      const pill = document.createElement('span');
      pill.className = 'tool-pill';
      pill.textContent = tag;
      skillsEl.appendChild(pill);
    });

    if (galleryEl) {
      galleryEl.innerHTML = '';
      const extraImages = found.images || [];
      // These render as small 3-up tiles, so they load the thumbnail;
      // the full-size file is only fetched if someone zooms into it.
      extraImages.forEach((src, i) => {
        const item = document.createElement('div');
        item.className = 'project-gallery-item';
        const img = document.createElement('img');
        img.src = toThumbPath(src);
        img.dataset.full = src;
        img.alt = t('project.galleryAlt', { title, n: i + 2 });
        img.loading = 'lazy';
        img.decoding = 'async';
        item.appendChild(img);
        galleryEl.appendChild(item);
      });
      galleryEl.style.display = extraImages.length > 0 ? '' : 'none';
    }

    descEl.textContent = descriptionOf(found) || t('project.descFallback');

    // Extra buttons inserted before the existing "Back to ..." button:
    // the outside link (if any), then download/view for an attached doc.
    if (found.link) {
      const linkBtn = document.createElement('a');
      linkBtn.className = 'button button-dark';
      linkBtn.href = found.link;
      linkBtn.target = '_blank';
      linkBtn.rel = 'noopener';
      linkBtn.innerHTML = `${esc(t('project.viewFull'))} <span>↗</span>`;
      actionsEl.insertBefore(linkBtn, backBtn);
    }
    if (found.downloadUrl) {
      const dlBtn = document.createElement('a');
      dlBtn.className = 'button button-light button-icon';
      dlBtn.href = found.downloadUrl;
      dlBtn.setAttribute('download', '');
      dlBtn.innerHTML = `${ICONS.download} ${esc(t('project.downloadPdf'))}`;
      actionsEl.insertBefore(dlBtn, backBtn);
    }
    if (found.viewUrl) {
      const viewBtn = document.createElement('a');
      viewBtn.className = 'button button-light button-icon';
      viewBtn.href = found.viewUrl;
      viewBtn.target = '_blank';
      viewBtn.rel = 'noopener';
      viewBtn.innerHTML = `${ICONS.view} ${esc(t('project.viewPdf'))}`;
      actionsEl.insertBefore(viewBtn, backBtn);
    }
  }

  render();
  onLanguageChange(render);
})();

/* ---------- Best Projects page (best-projects.html) ---------- */
(function renderBestProjects() {
  const threeDGrid = document.querySelector('[data-best-3d]');
  if (!threeDGrid) return;

  // So "← Back to ..." links on project.html (reached by clicking a tile
  // here) return to this page instead of defaulting to the Work page.
  session.set('lastListPage', 'best-projects.html');
  session.set('lastListLabelKey', 'back.best');

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
      ? `<img class="gallery-img" src="${esc(toThumbPath(image))}" alt="${esc(title)}" loading="lazy" decoding="async">`
      : `<div class="gallery-visual ${variant}"><div class="gallery-shape"></div></div>`;
    const caption = external ? t('gallery.viewProject') : t('gallery.viewDetails');
    el.innerHTML = `
      ${visual}
      <span class="gallery-tag">${esc(tags.join(' · '))}</span>
      <div class="gallery-caption"><h3>${esc(title)}</h3><p>${esc(caption)}</p></div>
    `;
    return el;
  }

  function renderSection(grid, category) {
    if (!grid) return;
    grid.innerHTML = '';
    let index = 0;
    (BEST_PROJECTS[category] || []).forEach((id) => {
      const project = findById(id);
      if (!project) return;
      grid.appendChild(
        buildBestTile(
          {
            title: titleOf(project),
            tags: tagsOf(project),
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
        buildBestTile(
          { title: titleOf(item), tags: tagsOf(item), image: item.image, href: item.link, external: true },
          index++
        )
      );
    });
  }

  function render() {
    renderSection(threeDGrid, '3d');
    renderSection(graphicGrid, 'graphic');
  }

  render();
  onLanguageChange(render);
})();

/* ---------- Project image lightbox ----------
   On project.html, clicking the cover image or any image in the extra
   gallery opens it larger in an overlay. Uses event delegation on
   document so it works no matter when those images get added to the
   page (they're inserted dynamically by renderProjectDetail above). */
(function projectLightbox() {
  const lightbox = document.querySelector('[data-lightbox]');
  if (!lightbox) return;

  lightbox.setAttribute('aria-hidden', 'true');
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
    // Gallery tiles show a thumbnail but zoom to the full-size file.
    if (clickedImg) openLightbox(clickedImg.dataset.full || clickedImg.src, clickedImg.alt);
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();
