/* ---------- Bilingual site (English / Portuguese) ----------
   This site has no build step, so translation happens in the browser:
   every piece of visible copy lives here once per language, and each
   element in the HTML points at it with a data-i18n* attribute.

   Marking up a page
   -----------------
     data-i18n="key"                     -> replaces the element's text
     data-i18n-attr="attr:key;attr:key"  -> sets one or more attributes
                                            (placeholder, aria-label,
                                            alt, content, ...)

   A <title> is just text, so it uses data-i18n like anything else; a
   <meta name="description"> uses data-i18n-attr="content:...".

   Headings that mix styles are split rather than translated as markup,
   so no translation string ever contains HTML:

     <h1><span data-i18n="home.title.line1">...</span><br>
         <em data-i18n="home.title.line2">...</em></h1>

   Copy that only exists inside script.js (gallery captions, the project
   detail page, ...) is fetched with I18N.t('key') instead.

   Adding a language
   -----------------
   Add its code to SUPPORTED, add a matching block to TRANSLATIONS, and
   add a button to the .lang-switch in every page's header. CI fails if
   the languages don't define exactly the same keys, so a forgotten
   string is caught before it ships - see scripts/validate-site.mjs.

   Project titles and descriptions are NOT here: they live next to the
   project itself in script.js (PROJECTS[...].i18n.pt), so adding a
   project still means editing one place. Tags are shared vocabulary,
   so they are translated once in TAG_TRANSLATIONS below. */

const SUPPORTED_LANGUAGES = ['en', 'pt'];
const DEFAULT_LANGUAGE = 'en';
const LANGUAGE_STORAGE_KEY = 'preferredLanguage';

const TRANSLATIONS = {
  en: {
    // --- Header / navigation (every page) ---
    'nav.home': 'Home',
    'nav.work': 'Work',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cv': 'Download CV ↓',
    'nav.aria.brand': 'Homepage',
    'nav.aria.primary': 'Primary navigation',
    'nav.aria.menu': 'Open menu',
    'nav.aria.language': 'Language',
    'nav.aria.langEn': 'Switch to English',
    'nav.aria.langPt': 'Mudar para português',

    // --- <title> and <meta name="description"> ---
    'meta.home.title': 'Ruben Alves - 3D Artist & Graphic Designer',
    'meta.home.desc': 'Portfolio of Ruben Alves, a 3D artist and graphic designer based in Castelo Branco, Portugal.',
    'meta.work.title': 'Work - Ruben Alves',
    'meta.work.desc': 'Selected 3D and graphic design work by Ruben Alves.',
    'meta.about.title': 'About - Ruben Alves',
    'meta.about.desc': 'About Ruben Alves - 3D artist and graphic designer based in Castelo Branco, Portugal.',
    'meta.contact.title': 'Contact - Ruben Alves',
    'meta.contact.desc': 'Get in touch with Ruben Alves, and download the full CV.',
    'meta.best.title': 'Best Projects - Ruben Alves',
    'meta.best.desc': "A short, curated list of Ruben Alves's strongest 3D and graphic design projects.",
    'meta.project.title': 'Project - Ruben Alves',
    'meta.project.desc': 'A project by Ruben Alves.',
    'meta.urbaneyept.title': 'UrbanEyePT - Ruben Alves',
    'meta.urbaneyept.desc': 'Commissioned work by Ruben Alves for UrbanEyePT - icon design and social media visuals.',

    // --- Home ---
    'home.eyebrow': '3D ARTIST · GRAPHIC DESIGNER',
    'home.title.line1': 'I build visuals',
    'home.title.line2': 'people remember.',
    'home.text': 'I combine 3D modelling, animation and graphic design to bring ideas to life - from product visualization and UI design to game art and personal 3D studies.',
    'home.cta.work': 'Explore selected work',
    'home.cta.best': 'See my best projects',

    // --- Work ---
    'work.eyebrow': 'SELECTED WORK',
    'work.title.line1': 'Projects with',
    'work.title.line2': 'a point of view.',
    'work.intro': 'Pick a category, then search by tag to narrow the results - separate multiple tags with a comma.',
    'work.tabs.aria': 'Work categories',
    'work.search.aria': 'Search projects by tag',
    'tab.3d': '3D',
    'tab.graphic': 'Graphic Design',
    'tab.3dprint': '3D Printable',
    'tab.contests': 'Contests',
    'tab.commissions': 'Commissions',
    'tab.games': 'Games',

    // --- Gallery tiles + search (rendered by script.js) ---
    'gallery.viewDetails': 'View details ↗',
    'gallery.viewProject': 'View project ↗',
    'gallery.viewCase': 'View case study ↗',
    'gallery.noLink': 'Link coming soon',
    'gallery.empty': 'Projects coming soon.',
    'gallery.noMatches': 'No projects tagged {tags}.',
    'gallery.searchHint': 'Search by tag - e.g. {tag} (comma for more)',
    'gallery.searchFallback': 'Search by tag',

    // --- Category names (project detail eyebrow) ---
    'cat.3d': '3D',
    'cat.graphic': 'Graphic Design',
    'cat.contests': 'Contest',
    'cat.games': 'Game',
    'cat.commissions': 'Commission',
    'cat.3dprint': '3D Printable',

    // --- About ---
    'about.eyebrow': 'ABOUT',
    'about.title.line1': '3D thinking.',
    'about.title.line2': 'Graphic discipline.',
    'about.lead': "I'm Ruben Alves, a 3D artist and graphic designer based in Castelo Branco, Portugal.",
    'about.body': 'My focus is on 3D work - particularly product visualization - alongside graphic design. I enjoy taking a concept from first sketch through modelling, materials, lighting and final delivery.',
    'about.facts.basedIn': 'Based in',
    'about.facts.basedInValue': 'Castelo Branco, Portugal',
    'about.facts.availableFor': 'Available for',
    'about.facts.availableForValue': 'Freelance',
    'about.facts.focus': 'Focus',
    'about.facts.focusValue': '3D Product Visualization · Graphic Design · 3D Game Assets Creator',
    'about.tools.familiar': 'Familiar with',
    'about.tools.some': 'Some experience with',
    'about.tools.learning': 'Currently learning',

    // --- Contact ---
    'contact.eyebrow.experience': 'EXPERIENCE',
    'contact.title.line1': 'Want the full',
    'contact.title.line2': 'story?',
    'contact.cvText': 'My CV includes experience, education, software skills and selected professional work.',
    'contact.cv.download': 'Download CV',
    'contact.cv.open': 'Open CV in browser ↗',
    'contact.eyebrow.work': "LET'S WORK",
    'contact.work.line1': 'Have a project',
    'contact.work.line2': 'in mind?',

    // --- Best projects ---
    'best.eyebrow': 'BEST WORK',
    'best.title.line1': 'A closer look at',
    'best.title.line2': 'my strongest work.',
    'best.intro': "A short, curated edit of the work I'm proudest of.",
    'best.section.3d': '3D',
    'best.section.graphic': 'Graphic Design',

    // --- Project detail ---
    'project.eyebrow': 'PROJECT',
    'project.skills': 'Skills Applied',
    'project.notFound.title': 'Project not found',
    'project.notFound.body': "This project doesn't exist, or may have moved. Head back to Work to find it.",
    'project.descFallback': "Add a short description of this project - the brief, the process, and what you're proud of.",
    'project.viewFull': 'View full project',
    'project.downloadPdf': 'Download PDF',
    'project.viewPdf': 'View PDF online',
    'project.galleryAlt': '{title} - image {n}',
    'project.lightbox.close': 'Close',

    // --- "Back to ..." links (label depends on where you came from) ---
    'back.template': '← Back to {target}',
    'back.work': 'Work',
    'back.best': 'Best Projects',

    // --- Commission pages (shared by every commission case study) ---
    'commission.eyebrow': 'COMMISSION',
    'commission.workFor': 'Work for',

    // --- UrbanEyePT commission page ---
    'urbaneyept.logoAlt': 'UrbanEyePT logo',
    'urbaneyept.body': 'UrbanEyePT is a platform for reporting and managing city issues - not just an app, but a new way to run cities. Work for them has covered icon design for the product and 3D-rendered visuals for social media.',
    'urbaneyept.icons.tag': 'GRAPHIC DESIGN',
    'urbaneyept.icons.title': 'Icon Library',
    'urbaneyept.icons.cta': 'View on Behance ↗',
    'urbaneyept.icons.alt': 'UrbanEye Icon Library',
    'urbaneyept.insta.tag': '3D / SOCIAL',
    'urbaneyept.insta.title': 'Instagram Post',
    'urbaneyept.insta.cta': 'View on Instagram ↗',
    'urbaneyept.insta.alt': 'UrbanEye Instagram post render',
  },

  pt: {
    // --- Cabeçalho / navegação (todas as páginas) ---
    'nav.home': 'Início',
    'nav.work': 'Trabalhos',
    'nav.about': 'Sobre',
    'nav.contact': 'Contacto',
    'nav.cv': 'Descarregar CV ↓',
    'nav.aria.brand': 'Página inicial',
    'nav.aria.primary': 'Navegação principal',
    'nav.aria.menu': 'Abrir menu',
    'nav.aria.language': 'Idioma',
    'nav.aria.langEn': 'Switch to English',
    'nav.aria.langPt': 'Mudar para português',

    // --- <title> e <meta name="description"> ---
    'meta.home.title': 'Ruben Alves - Artista 3D & Designer Gráfico',
    'meta.home.desc': 'Portfólio de Ruben Alves, artista 3D e designer gráfico em Castelo Branco, Portugal.',
    'meta.work.title': 'Trabalhos - Ruben Alves',
    'meta.work.desc': 'Trabalhos selecionados de 3D e design gráfico de Ruben Alves.',
    'meta.about.title': 'Sobre - Ruben Alves',
    'meta.about.desc': 'Sobre Ruben Alves - artista 3D e designer gráfico em Castelo Branco, Portugal.',
    'meta.contact.title': 'Contacto - Ruben Alves',
    'meta.contact.desc': 'Entra em contacto com Ruben Alves e descarrega o CV completo.',
    'meta.best.title': 'Melhores Projetos - Ruben Alves',
    'meta.best.desc': 'Uma seleção curta dos melhores projetos de 3D e design gráfico de Ruben Alves.',
    'meta.project.title': 'Projeto - Ruben Alves',
    'meta.project.desc': 'Um projeto de Ruben Alves.',
    'meta.urbaneyept.title': 'UrbanEyePT - Ruben Alves',
    'meta.urbaneyept.desc': 'Trabalho por encomenda de Ruben Alves para a UrbanEyePT - design de ícones e visuais para redes sociais.',

    // --- Início ---
    'home.eyebrow': 'ARTISTA 3D · DESIGNER GRÁFICO',
    'home.title.line1': 'Crio visuais',
    'home.title.line2': 'que ficam na memória.',
    'home.text': 'Combino modelação 3D, animação e design gráfico para dar vida a ideias - da visualização de produto e design de interfaces à arte para jogos e estudos 3D pessoais.',
    'home.cta.work': 'Ver trabalhos selecionados',
    'home.cta.best': 'Ver os meus melhores projetos',

    // --- Trabalhos ---
    'work.eyebrow': 'TRABALHOS SELECIONADOS',
    'work.title.line1': 'Projetos com',
    'work.title.line2': 'um ponto de vista.',
    'work.intro': 'Escolhe uma categoria e pesquisa por etiqueta para filtrar os resultados - separa várias etiquetas com vírgulas.',
    'work.tabs.aria': 'Categorias de trabalho',
    'work.search.aria': 'Pesquisar projetos por etiqueta',
    'tab.3d': '3D',
    'tab.graphic': 'Design Gráfico',
    'tab.3dprint': 'Impressão 3D',
    'tab.contests': 'Concursos',
    'tab.commissions': 'Encomendas',
    'tab.games': 'Jogos',

    // --- Grelha de projetos + pesquisa (gerados pelo script.js) ---
    'gallery.viewDetails': 'Ver detalhes ↗',
    'gallery.viewProject': 'Ver projeto ↗',
    'gallery.viewCase': 'Ver caso de estudo ↗',
    'gallery.noLink': 'Ligação em breve',
    'gallery.empty': 'Projetos em breve.',
    'gallery.noMatches': 'Nenhum projeto com a etiqueta {tags}.',
    'gallery.searchHint': 'Pesquisar por etiqueta - ex.: {tag} (vírgula para mais)',
    'gallery.searchFallback': 'Pesquisar por etiqueta',

    // --- Nomes das categorias (sobretítulo da página de projeto) ---
    'cat.3d': '3D',
    'cat.graphic': 'Design Gráfico',
    'cat.contests': 'Concurso',
    'cat.games': 'Jogo',
    'cat.commissions': 'Encomenda',
    'cat.3dprint': 'Impressão 3D',

    // --- Sobre ---
    'about.eyebrow': 'SOBRE',
    'about.title.line1': 'Pensamento 3D.',
    'about.title.line2': 'Disciplina gráfica.',
    'about.lead': 'Sou o Ruben Alves, artista 3D e designer gráfico em Castelo Branco, Portugal.',
    'about.body': 'O meu foco está no trabalho 3D - em particular na visualização de produto - a par do design gráfico. Gosto de levar um conceito do primeiro esboço até à modelação, materiais, iluminação e entrega final.',
    'about.facts.basedIn': 'Sediado em',
    'about.facts.basedInValue': 'Castelo Branco, Portugal',
    'about.facts.availableFor': 'Disponível para',
    'about.facts.availableForValue': 'Freelance',
    'about.facts.focus': 'Foco',
    'about.facts.focusValue': 'Visualização de Produto 3D · Design Gráfico · Criação de Assets 3D para Jogos',
    'about.tools.familiar': 'Domínio de',
    'about.tools.some': 'Alguma experiência com',
    'about.tools.learning': 'A aprender',

    // --- Contacto ---
    'contact.eyebrow.experience': 'EXPERIÊNCIA',
    'contact.title.line1': 'Queres a história',
    'contact.title.line2': 'completa?',
    'contact.cvText': 'O meu CV inclui experiência, formação, competências em software e trabalho profissional selecionado.',
    'contact.cv.download': 'Descarregar CV',
    'contact.cv.open': 'Abrir CV no navegador ↗',
    'contact.eyebrow.work': 'VAMOS TRABALHAR',
    'contact.work.line1': 'Tens um projeto',
    'contact.work.line2': 'em mente?',

    // --- Melhores projetos ---
    'best.eyebrow': 'MELHORES TRABALHOS',
    'best.title.line1': 'Um olhar mais atento sobre',
    'best.title.line2': 'os meus melhores trabalhos.',
    'best.intro': 'Uma seleção curta dos trabalhos de que mais me orgulho.',
    'best.section.3d': '3D',
    'best.section.graphic': 'Design Gráfico',

    // --- Página de projeto ---
    'project.eyebrow': 'PROJETO',
    'project.skills': 'Competências Aplicadas',
    'project.notFound.title': 'Projeto não encontrado',
    'project.notFound.body': 'Este projeto não existe ou pode ter mudado de sítio. Volta aos Trabalhos para o encontrar.',
    'project.descFallback': 'Adiciona uma breve descrição deste projeto - o briefing, o processo e aquilo de que te orgulhas.',
    'project.viewFull': 'Ver projeto completo',
    'project.downloadPdf': 'Descarregar PDF',
    'project.viewPdf': 'Ver PDF online',
    'project.galleryAlt': '{title} - imagem {n}',
    'project.lightbox.close': 'Fechar',

    // --- Ligações "Voltar a ..." (o destino depende de onde vieste) ---
    'back.template': '← Voltar aos {target}',
    'back.work': 'Trabalhos',
    'back.best': 'Melhores Projetos',

    // --- Páginas de encomenda (partilhado por todos os casos de estudo) ---
    'commission.eyebrow': 'ENCOMENDA',
    'commission.workFor': 'Trabalho para',

    // --- Página da encomenda UrbanEyePT ---
    'urbaneyept.logoAlt': 'Logótipo da UrbanEyePT',
    'urbaneyept.body': 'A UrbanEyePT é uma plataforma para reportar e gerir problemas urbanos - não é apenas uma app, mas uma nova forma de gerir cidades. O trabalho para eles incluiu design de ícones para o produto e visuais 3D para redes sociais.',
    'urbaneyept.icons.tag': 'DESIGN GRÁFICO',
    'urbaneyept.icons.title': 'Biblioteca de Ícones',
    'urbaneyept.icons.cta': 'Ver no Behance ↗',
    'urbaneyept.icons.alt': 'Biblioteca de ícones UrbanEye',
    'urbaneyept.insta.tag': '3D / REDES SOCIAIS',
    'urbaneyept.insta.title': 'Publicação no Instagram',
    'urbaneyept.insta.cta': 'Ver no Instagram ↗',
    'urbaneyept.insta.alt': 'Render da publicação de Instagram da UrbanEye',
  },
};

/* ---------- Tag vocabulary ----------
   Tags are shared across projects, so they are translated once here
   instead of per project. A tag with no entry is shown as written -
   handy for names that shouldn't be translated (Blender, Game Jam!,
   Geometry Nodes...). The Work page search matches against the tags as
   displayed, so searching works in whichever language is on screen. */
const TAG_TRANSLATIONS = {
  pt: {
    '3D Modelling': 'Modelação 3D',
    'Hard-Surface Modelling': 'Modelação Hard-Surface',
    'Detail': 'Detalhe',
    'Shading & Materials': 'Shading & Materiais',
    '3D Animation': 'Animação 3D',
    'Nature': 'Natureza',
    'Game Asset': 'Asset de Jogo',
    'Environment': 'Ambiente',
    'Procedural Shading': 'Shading Procedural',
    'Interior': 'Interior',
    'University Work': 'Trabalho Académico',
    'Icon Design': 'Design de Ícones',
    'Graphic Design': 'Design Gráfico',
    '3D Printing': 'Impressão 3D',
  },
};

/* ---------- Runtime ----------
   Loaded in <head> on every page, before script.js, so that:
   - <html lang> is correct before anything is painted, and
   - script.js can call I18N.t() straight away when it renders tiles.
   The static copy in the markup is swapped as soon as the DOM is ready. */
const I18N = (function initI18n() {
  const isSupported = (lang) => SUPPORTED_LANGUAGES.includes(lang);

  // localStorage throws in some privacy modes - a language preference is
  // never worth breaking the page over, so every access is guarded.
  function readStoredLanguage() {
    try {
      return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch {
      return null;
    }
  }
  function storeLanguage(lang) {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      /* preference just won't survive this visit */
    }
  }

  // ?lang= wins (so a link can force a language), then the visitor's
  // saved choice, then what their browser asks for, then English.
  function resolveLanguage() {
    const params = new URLSearchParams(window.location.search);
    const requested = (params.get('lang') || '').toLowerCase();
    if (isSupported(requested)) return requested;

    const stored = readStoredLanguage();
    if (isSupported(stored)) return stored;

    for (const tag of navigator.languages || [navigator.language || '']) {
      const base = String(tag).toLowerCase().split('-')[0];
      if (isSupported(base)) return base;
    }
    return DEFAULT_LANGUAGE;
  }

  let current = resolveLanguage();
  document.documentElement.lang = current;

  // ?lang= has done its job once it's been read; drop just that
  // parameter so it doesn't stick to every link that gets shared,
  // while leaving ?id= / ?tab= for the pages that need them.
  (function dropLangParam() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('lang')) return;
    params.delete('lang');
    const query = params.toString();
    window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
  })();

  function t(key, vars) {
    const dict = TRANSLATIONS[current] || {};
    const value = key in dict ? dict[key] : TRANSLATIONS[DEFAULT_LANGUAGE][key];
    if (value === undefined) return key; // CI fails on this; don't crash the page
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
  }

  const tTag = (tag) => (TAG_TRANSLATIONS[current] || {})[tag] || tag;

  // Swaps the static copy in the markup. Safe to run repeatedly - it
  // reads the keys off the elements, never off the current text.
  function applyTranslations(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      for (const pair of el.dataset.i18nAttr.split(';')) {
        const [attr, key] = pair.split(':').map((part) => part.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      }
    });
  }

  function syncSwitchButtons() {
    document.querySelectorAll('.lang-switch [data-lang]').forEach((btn) => {
      const isActive = btn.dataset.lang === current;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  function setLanguage(lang) {
    if (!isSupported(lang) || lang === current) return;
    current = lang;
    storeLanguage(lang);
    document.documentElement.lang = lang;
    applyTranslations();
    syncSwitchButtons();
    // script.js listens for this to redraw the parts it built itself
    // (gallery tiles, the project detail page, "back to ..." links).
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } }));
  }

  function hydrate() {
    applyTranslations();
    syncSwitchButtons();
    document.addEventListener('click', (event) => {
      const btn = event.target.closest('.lang-switch [data-lang]');
      if (btn) setLanguage(btn.dataset.lang);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hydrate);
  else hydrate();

  return {
    t,
    tTag,
    setLanguage,
    applyTranslations,
    get language() {
      return current;
    },
  };
})();
