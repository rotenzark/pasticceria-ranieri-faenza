/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'pasticceria-ranieri-faenza',
    whatsapp: {
      number: '', // WhatsApp non dichiarato: si ordina al banco o per telefono (02 816470)
      message: '',
      ids: [],
    },
    /* Google (28/9/2026): lunedì chiuso, martedì–sabato 8:30–13 e 15:30–19:30, domenica 8:30–13 */
    hours: {
      0: [['08:30', '13:00']],
      1: [],
      2: [['08:30', '13:00'], ['15:30', '19:30']],
      3: [['08:30', '13:00'], ['15:30', '19:30']],
      4: [['08:30', '13:00'], ['15:30', '19:30']],
      5: [['08:30', '13:00'], ['15:30', '19:30']],
      6: [['08:30', '13:00'], ['15:30', '19:30']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Pasticceria Ranieri, back to the top",
      "m.sotto": "Pastry shop · Viale Faenza 18",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.bancone": "The counter",
      "n.torte": "Cakes",
      "n.dicono": "Reviews",
      "n.orari": "Hours",
      "n.feste": "Holidays",
      "n.bottega": "The shop",
      "n.orariDove": "Hours and where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "h.sopra": "Pastry shop · Viale Faenza 18, Milan",
      "h.titolo": "A sure thing for over 40 years.",
      "h.chi": "Gabriele Gandini, in a review on Google («Una certezza da oltre 40 anni»)",
      "h.testo": "The Barona’s pastry shop, on Viale Faenza: mignon pastries and single pastries at the counter, cakes to order written by hand in chocolate, Easter eggs and holiday sweets. Cakes are ordered at the counter or by phone.",
      "h.voto": "75 reviews on Google",
      "h.chiama": "Call to order",
      "h.indicazioni": "Directions",
      "to.titolo": "A cake from Pasticceria Ranieri, drawn",
      "to.desc": "A two-tier cake on a paper doily and a gold board: pink whipped-cream sides, a border of pink cream shells, chocolate piping, four sugar roses with leaves, and on top the word Auguri (best wishes) written in chocolate script.",
      "to.nota": "One of their cakes, drawn: the pink cream border, the chocolate piping, the sugar roses, «Auguri» (best wishes).",
      "to.etichetta": "Write a name on the cake",
      "to.segnaposto": "a name",
      "to.scrivi": "Write",
      "to.gioco": "It’s a game: the name stays here. Tell them the real one at the counter.",
      "to.rifai": "Decorate it again",
      "b.placca": "the counter",
      "b.titolo": "Mignon pastries, pastries and cakes in the window",
      "b.testo": "At the counter, on gold trays: mignon pastries — fruit tartlets, cream horns, cream puffs, sfogliatelle, meringues — chocolate squares, single pastries. In the window, whole cakes on paper doilies, with the Sacher written on its glaze. People who have been going for years mention the chocolate «fiamma» and the marron glacé semifreddo.",
      "a.vetrina": "The mignon display: sfogliatelle, tartlets with strawberries, banana and kiwi, cream horns, cream puffs, bars.",
      "c.vetrina": "The mignon display.",
      "a.cioccolatini": "Trays of chocolate sweets: squares with a treble clef drawn in white, chocolate mice, red hearts.",
      "c.cioccolatini": "The treble clef and the chocolate mice.",
      "a.raso": "An assortment of mignon pastries on a small scalloped gold tray: the cream horn, the strawberry tartlet, the truffle, the chocolate square.",
      "c.raso": "An assortment on the small gold tray.",
      "a.vassoio": "A gold tray of mignon pastries: glazed cream puffs, cream horns, tartlets, puff pastry squares with icing sugar.",
      "c.vassoio": "A tray of mignon pastries, in a customer’s photo.",
      "a.torteVetrina": "Cakes in the window on paper doilies: the Sacher with its name written on the glaze, cakes with cream puffs and swirls of cream, a tart with stars and moons.",
      "c.torteVetrina": "Cakes in the window, on doilies.",
      "tr.placca": "the cakes",
      "tr.titolo": "Cakes written by hand",
      "tr.testo": "For a birthday, a graduation, a party. Cakes are ordered at the counter or by phone, and you choose the writing: «Auguri», a name, «Buon Compleanno», in chocolate script, on the cream or on a chocolate plaque. Around it, the cream border, the piping, the sugar roses: like in the photos below.",
      "tr.chiama": "Call for a cake",
      "a.auguri": "A two-tier cake with a pink cream border, chocolate piping and red sugar roses with leaves; on top, «Auguri» written in chocolate and a name, blurred.",
      "c.auguri": "«Auguri», the pink cream border and the roses: the cake drawn at the top of the page. The name is blurred.",
      "a.placca": "The chocolate plaque with curled edges and «Buon Compleanno» (happy birthday) written in cream, over meringues, marrons glacés and a lattice of cream; the name is blurred.",
      "c.placca": "«Buon Compleanno» on the chocolate plaque. The name is blurred.",
      "a.cuore": "A heart-shaped cake on a doily, with a chocolate border, curls and «Auguri» written in chocolate.",
      "c.cuore": "A heart, with «Auguri».",
      "a.noce": "A cake wrapped in a chocolate collar, with cream, a walnut, sugar leaves and chocolate flakes.",
      "c.noce": "The chocolate collar and the walnut.",
      "a.panna": "A cake covered in a lattice of cream dusted with cocoa, on a doily.",
      "c.panna": "Cream lattice and cocoa.",
      "f.placca": "the holidays",
      "f.titolo": "Holidays, and gifts",
      "f.carnevale": "Carnival",
      "f.carnevaleT": "Frittelle, the carnival fritters.",
      "f.giuseppe": "Saint Joseph’s Day",
      "f.giuseppeT": "Mignon cream puffs and zeppole with sour cherries.",
      "a.zeppole": "Mini zeppole for Saint Joseph’s Day with sour cherries, and mushroom-shaped meringues half-dipped in dark chocolate, on a gold tray.",
      "c.zeppole": "Mini zeppole and mushroom meringues.",
      "f.pasqua": "Easter",
      "f.pasquaT": "Chocolate eggs decorated by hand: flowers, little mushrooms, sugar bunnies.",
      "a.uovo1": "A chocolate Easter egg decorated by hand with pink flowers, red mushrooms and sugar grass.",
      "c.uovo1": "Flowers and mushrooms.",
      "a.uovo2": "A chocolate Easter egg decorated by hand with a bunny, flowers and sugar lace.",
      "c.uovo2": "The bunny.",
      "f.anno": "All year round",
      "f.annoT": "Sweet gift ideas: boxes of chocolates, tins of jellies. And for a birthday, the cake with the writing.",
      "r.placca": "reviews",
      "r.titolo": "Customers for thirty, forty, fifty years",
      "r.voto": "on Google, 75 reviews",
      "r.a5": "Google, 5 years ago",
      "r.a2": "Google, 2 years ago",
      "r.a3": "Google, 3 years ago",
      "r.m7": "Google, 7 months ago",
      "r.a4": "Google, 4 years ago",
      "r.nota": "From the reviews on Google, as they were written (in Italian); cuts are marked […].",
      "r.tutte": "All the reviews on Google",
      "g.placca": "the shop",
      "g.titolo": "Dark wood, the long display, the chocolate frieze",
      "a.negozio": "Inside the pastry shop: the long mignon display, dark wood shelves with gift boxes, ceiling lights, and high up the painted tile frieze.",
      "c.negozio": "Inside: the long display and, high up, the frieze.",
      "g.testo": "Dark wood counters and shelves, the long mignon display, the gift boxes. Behind the counter runs a frieze of painted tiles that tells the story of chocolate: the cocoa harvest, the sacks, the grinding mill, the pot, the moulds.",
      "a.fregio": "The sepia painted tile frieze: the cocoa harvest, the sacks, the mill, the pot, the chocolate moulds.",
      "c.fregio": "The frieze, behind the counter.",
      "g.panna": "And on the counter, the sign written in script:",
      "a.cartello": "The «Panna Montata» (whipped cream) sign in blue script, on the counter.",
      "g.fuori": "Outside, at number 18 Viale Faenza, look for <b>the brown and cream striped awning with RANIERI in red</b>.",
      "a.tenda": "The brown and cream striped awning with a scalloped edge and the word RANIERI in red on the valance.",
      "c.tenda": "The awning, at 18 Viale Faenza.",
      "o.placca": "hours",
      "o.titolo": "Closed on Mondays, open on Sunday mornings",
      "o.cap": "Opening hours",
      "d.lun": "Monday",
      "d.mar": "Tuesday",
      "d.mer": "Wednesday",
      "d.gio": "Thursday",
      "d.ven": "Friday",
      "d.sab": "Saturday",
      "d.dom": "Sunday",
      "d.chiuso": "closed",
      "o.ordina": "Cakes are ordered <b>at the counter or by phone</b>, on <a href=\"tel:+3902816470\" class=\"intero\">+39 02 816470</a>.",
      "o.dove": "Viale Faenza 18, 20142 Milan, near Piazza Miani. The <b>Viale Faenza – Piazza Miani</b> bus stop (lines 74 and 47) is 60 metres away; <b>M2 Famagosta</b> is about 1.3 km away, <b>Romolo</b> 1.4.",
      "o.mappa": "Map: Pasticceria Ranieri, Viale Faenza 18, Milan",
      "q.placca": "questions",
      "q.titolo": "Before you drop by",
      "q.1": "How do I order a cake?",
      "q.1r": "At the counter or by phone, on +39 02 816470. You choose the writing.",
      "q.2": "When are you open?",
      "q.2r": "Tuesday to Saturday from 8.30 am to 1 pm and from 3.30 pm to 7.30 pm; Sunday from 8.30 am to 1 pm. We are closed on Mondays.",
      "q.3": "Do you have gift ideas?",
      "q.3r": "Yes: boxes of chocolates, tins of jellies, and at Easter the hand-decorated eggs.",
      "q.4": "Where are you?",
      "q.4r": "At Viale Faenza 18, near Piazza Miani: buses 74 and 47 stop 60 metres away. Look for the brown and cream striped awning with RANIERI in red.",
      "q.5": "Are you the same Ranieri as the one in Via della Moscova?",
      "q.5r": "No: this is Pasticceria Ranieri at Viale Faenza 18, in the Barona. They are two different pastry shops.",
      "z.sotto": "Pastry shop · Viale Faenza 18, Milan",
      "z.frase": "Until the next cake.",
      "z.orario": "Tuesday to Sunday, closed on Mondays",
      "z.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos are the owner’s and the customers’, from the Google listing (the names written on the cakes and the price tags are blurred); hours and reviews from Google (September 2026). The cake at the top is a drawing.",
      "z.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ PASTICCERIA RANIERI — «Una certezza da oltre 40 anni.» ══════════
     La pagina è la vetrina: le placche di cioccolato scritte in panna, le foto sul vassoio dorato a festoni, il cordone di panna.
     la FIRMA — una loro torta (la foto r07) che si decora: la torta si posa sul centrino; la tasca fa le conchiglie di panna rosa
     una a una lungo i due bordi; poi i ricami di cioccolato; poi scrive «Auguri» col cioccolato (e sotto il nome, se qualcuno
     l'ha scritto nel campo; se no, uno svolazzo); poi la tasca si alza e si posano le roselline.
     «Scrivete un nome sulla torta»: il nome (14 lettere al massimo) si scrive col cioccolato sotto «Auguri», come sulle loro
     torte; non esce dalla pagina e non si salva.
     Stato finale = l'HTML/SVG (senza nome, con lo svolazzo). La tasca c'è solo col JS. Senza JS: lo stato finale. Con
     reduced-motion: lo stato finale, e il nome si scrive subito. L'attesa è la classe firma-attesa dell'head (resta il vassoio
     col centrino, via CSS, solo dentro .torta__svg), tolta dall'head dopo 2,5 s se il codice non arriva. Un rAF a tempo: la
     firma non dipende da GSAP. I dati vengono da _prf_torta.mjs. */
  var DATI = {"tempi":{"inizio":200,"torta":450,"conchiglie":700,"passoConchiglia":26,"conchiglia":200,"ricami":2692,"passoRicamo":70,"ricamo":320,"scritta":3472,"durataScritta":1000,"svolazzo":320,"nome":900,"alzata":380,"passoRosa":120,"rosa":300,"coda":120},"conchiglie":[{"x":460.8,"y":236.9},{"x":477,"y":248.3},{"x":489.6,"y":260.6},{"x":498.4,"y":273.7},{"x":503.1,"y":287.2},{"x":503.7,"y":300.9},{"x":500.2,"y":314.5},{"x":492.6,"y":327.7},{"x":481,"y":340.3},{"x":465.8,"y":351.9},{"x":447.2,"y":362.5},{"x":425.6,"y":371.6},{"x":401.4,"y":379.3},{"x":375.2,"y":385.2},{"x":347.5,"y":389.4},{"x":318.7,"y":391.6},{"x":289.6,"y":391.9},{"x":260.8,"y":390.2},{"x":232.7,"y":386.6},{"x":205.9,"y":381.2},{"x":181.1,"y":374},{"x":158.8,"y":365.3},{"x":139.2,"y":355.1},{"x":123,"y":343.7},{"x":110.4,"y":331.4},{"x":101.6,"y":318.3},{"x":96.9,"y":304.8},{"x":96.3,"y":291.1},{"x":99.8,"y":277.5},{"x":107.4,"y":264.3},{"x":119,"y":251.7},{"x":134.2,"y":240.1},{"x":152.8,"y":229.5},{"x":441.2,"y":226.7},{"x":300,"y":144},{"x":324.3,"y":145.1},{"x":347.7,"y":148.2},{"x":369.5,"y":153.3},{"x":388.9,"y":160.2},{"x":405.3,"y":168.6},{"x":418.2,"y":178.4},{"x":427,"y":189},{"x":431.4,"y":200.3},{"x":431.4,"y":211.7},{"x":427,"y":223},{"x":418.2,"y":233.6},{"x":405.3,"y":243.4},{"x":388.9,"y":251.8},{"x":369.5,"y":258.7},{"x":347.7,"y":263.8},{"x":324.3,"y":266.9},{"x":300,"y":268},{"x":275.7,"y":266.9},{"x":252.3,"y":263.8},{"x":230.5,"y":258.7},{"x":211.1,"y":251.8},{"x":194.7,"y":243.4},{"x":181.8,"y":233.6},{"x":173,"y":223},{"x":168.6,"y":211.7},{"x":168.6,"y":200.3},{"x":173,"y":189},{"x":181.8,"y":178.4},{"x":194.7,"y":168.6},{"x":211.1,"y":160.2},{"x":230.5,"y":153.3},{"x":252.3,"y":148.2},{"x":275.7,"y":145.1}],"ricami":[{"x":135.8,"y":316.7},{"x":155.8,"y":338.4},{"x":247.5,"y":372.1},{"x":300,"y":376},{"x":352.5,"y":372.1},{"x":444.2,"y":338.4},{"x":464.2,"y":316.7}],"rose":4,"scritta":{"x":300,"y":212,"size":58},"nome":{"x":300,"y":252,"size":38,"min":20,"max":158}};
  var prendi = function (id) { return document.getElementById(id); };
  var figuraT = prendi('torta');
  var svgT = figuraT ? figuraT.querySelector('.torta__svg') : null;
  var corpiT = [prendi('corpoSotto'), prendi('corpoSopra')];
  var gruppiT = [prendi('conchiglieSotto'), prendi('conchiglieSopra'), prendi('ricami'), prendi('scritta'), prendi('rose')];
  var concEl = svgT ? [].slice.call(svgT.querySelectorAll('.torta__c')) : [];
  var ricamiEl = svgT ? [].slice.call(svgT.querySelectorAll('.torta__r')) : [];
  var roseEl = svgT ? [].slice.call(svgT.querySelectorAll('.torta__rosa')) : [];
  var auguriEl = prendi('tortaAuguri'), svolazzoEl = prendi('svolazzo'), puntinoEl = prendi('puntino'), nomeEl = prendi('tortaNome');
  var tascaEl = prendi('tasca');
  var formN = prendi('nomeForm'), campoN = prendi('nomeCampo'), rifaiB = prendi('rifai'), leggiEl = prendi('tortaLeggi');
  var TT = DATI.tempi, NOME = DATI.nome, SCR = DATI.scritta, CONC = DATI.conchiglie, RIC = DATI.ricami;
  var faseT = 'fatta', modoT = '', rafT = 0, guardiaT = 0, larghezzaAvvioT = 0, corseT = 0, nomeT = '';
  var bbA = null, bbN = null, fsN = NOME.size, svolazzoPrima = false, nomePrima = false;
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var esce = function (t) { return 1 - Math.pow(1 - t, 3); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var LEGGI = { it: 'Sulla torta c’è scritto: Auguri', en: 'On the cake it says: Auguri' };
  function linguaT() { return (root.getAttribute('lang') || 'it').slice(0, 2) === 'en' ? 'en' : 'it'; }
  /* il nome: solo lettere, spazi, apostrofi, punti e trattini; al massimo 14 */
  function pulisciNome(v) {
    var n = String(v || '');
    try { n = n.replace(/[^\p{L}\p{M}\s'’.\-]/gu, ''); } catch (e) { n = n.replace(/[<>&"0-9]/g, ''); }
    return n.replace(/\s+/g, ' ').trim().slice(0, 14);
  }
  /* un nome lungo si stringe: la riga non esce dalla torta */
  function adattaNome() {
    nomeEl.setAttribute('font-size', NOME.size);
    var w = 0; try { w = nomeEl.getComputedTextLength(); } catch (e) {}
    if (w > NOME.max) nomeEl.setAttribute('font-size', Math.max(NOME.min, Math.floor(NOME.size * NOME.max / w)));
    fsN = +nomeEl.getAttribute('font-size');
  }
  function preparaNome() {
    nomeEl.removeAttribute('display'); nomeEl.textContent = nomeT; adattaNome();
    try { bbN = nomeEl.getBBox(); } catch (e) { bbN = { x: NOME.x - 60, y: NOME.y - fsN, width: 120, height: fsN }; }
  }
  /* la seconda riga allo stato finale: il nome, o lo svolazzo col puntino */
  function secondaRiga() {
    if (nomeT) {
      preparaNome();
      svolazzoEl.setAttribute('display', 'none'); puntinoEl.setAttribute('display', 'none');
    } else {
      nomeEl.setAttribute('display', 'none'); nomeEl.textContent = '';
      svolazzoEl.removeAttribute('display'); puntinoEl.removeAttribute('display');
    }
  }
  var PROP = ['opacity', 'transform', 'clip-path', 'stroke-dasharray', 'stroke-dashoffset'];
  function pulisciT(el) { if (!el) return; PROP.forEach(function (p) { el.style.removeProperty(p); }); if (!el.getAttribute('style')) el.removeAttribute('style'); }
  function tuttiT() { return corpiT.concat(gruppiT, concEl, ricamiEl, roseEl, [auguriEl, svolazzoEl, puntinoEl, nomeEl]); }
  function nascondiTasca() { tascaEl.setAttribute('display', 'none'); tascaEl.removeAttribute('transform'); pulisciT(tascaEl); }
  function mettiTasca(p) {
    tascaEl.removeAttribute('display');
    tascaEl.setAttribute('transform', 'translate(' + r3(p.x) + ' ' + r3(p.y) + ')');
    tascaEl.setAttribute('class', 'torta__tasca ' + (p.c ? 'tasca--cioccolato' : 'tasca--panna'));
    if (p.a !== undefined && p.a < 1) tascaEl.style.opacity = r3(p.a); else tascaEl.style.removeProperty('opacity');
  }
  var tra = function (a, b, k) { return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }; };
  /* la guardia: se i fotogrammi smettono di arrivare per 1,5 s (scheda in background) la torta va allo stato finale; si
     riarma a ogni fotogramma (#229) */
  function sorvegliaT() { clearTimeout(guardiaT); guardiaT = setTimeout(chiudiTorta, 1500); }
  function chiudiTorta() {
    cancelAnimationFrame(rafT); rafT = 0;
    clearTimeout(guardiaT);
    tuttiT().forEach(pulisciT);
    nascondiTasca();
    secondaRiga();
    figuraT.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseT = 'fatta';
  }
  /* la fine della corsa: la seconda riga (il nome o lo svolazzo), la tasca che si alza, le roselline */
  function tempiCoda(modo) {
    if (modo === 'tutta') {
      var s2 = TT.scritta + TT.durataScritta, alza = s2 + (nomeT ? TT.nome : TT.svolazzo), rose = alza + 60;
      return { s2: s2, alza: alza, rose: rose, fine: rose + (DATI.rose - 1) * TT.passoRosa + TT.rosa + TT.coda };
    }
    if (nomeT) return { s2: 300, alza: 300 + TT.nome, rose: -1, fine: 300 + TT.nome + TT.alzata + 40 };
    return { s2: 150, alza: -1, rose: -1, fine: 150 + TT.svolazzo + 60 };
  }
  var PARTENZA = { x: 560, y: 30 };
  /* la punta della tasca sulla seconda riga, a p (0..1) */
  function puntaRiga(p) {
    if (nomeT) return { x: bbN.x + bbN.width * p, y: NOME.y - fsN * 0.3 + Math.sin(p * Math.PI * 10) * fsN * 0.14 };
    return { x: NOME.x - 62 + 124 * p, y: NOME.y - 14 - Math.sin(p * Math.PI * 2) * 6 };
  }
  function scriviRiga(t, K) {
    if (nomeT) {
      var pn = c01((t - K.s2) / TT.nome);
      if (pn < 1) nomeEl.style.clipPath = 'inset(0 ' + r3((1 - pn) * 100) + '% 0 0)'; else nomeEl.style.removeProperty('clip-path');
      return pn;
    }
    var pv = c01((t - K.s2) / TT.svolazzo);
    if (pv <= 0) svolazzoEl.style.opacity = '0'; else svolazzoEl.style.removeProperty('opacity');
    if (pv < 1) { svolazzoEl.style.strokeDasharray = '1'; svolazzoEl.style.strokeDashoffset = r3(1 - pv); puntinoEl.style.opacity = '0'; }
    else { svolazzoEl.style.removeProperty('stroke-dasharray'); svolazzoEl.style.removeProperty('stroke-dashoffset'); puntinoEl.style.removeProperty('opacity'); }
    return pv;
  }
  function fotogrammaTutta(t, K) {
    var punta = null, i, p;
    /* la torta si posa sul centrino */
    var pc = c01((t - TT.inizio) / TT.torta);
    corpiT.forEach(function (g) {
      if (pc < 1) { g.style.opacity = r3(pc); g.style.transform = 'translateY(' + r3(-14 * (1 - esce(pc))) + 'px)'; }
      else { g.style.removeProperty('opacity'); g.style.removeProperty('transform'); }
    });
    /* le conchiglie di panna, una a una, e la tasca che va dall'una all'altra */
    var P = TT.passoConchiglia, n = concEl.length, tC0 = TT.conchiglie, tC1 = TT.conchiglie + (n - 1) * P + TT.conchiglia;
    for (i = 0; i < n; i++) {
      p = c01((t - tC0 - i * P) / TT.conchiglia);
      if (p <= 0) { concEl[i].style.opacity = '0'; concEl[i].style.transform = 'scale(.2)'; }
      else if (p < 1) { concEl[i].style.opacity = r3(c01(p * 3)); concEl[i].style.transform = 'scale(' + r3(0.2 + 0.8 * esce(p)) + ')'; }
      else { concEl[i].style.removeProperty('opacity'); concEl[i].style.removeProperty('transform'); }
    }
    if (t >= tC0 - 260 && t < tC0) punta = tra(PARTENZA, CONC[0], esce(c01((t - tC0 + 260) / 260)));
    else if (t >= tC0 && t < tC1) {
      var k = Math.min(n - 1, Math.floor((t - tC0) / P));
      punta = tra(CONC[Math.max(0, k - 1)], CONC[k], c01(((t - tC0) - k * P) / P * 1.8));
    }
    /* i ricami di cioccolato */
    var nr = ricamiEl.length, tR1 = TT.ricami + (nr - 1) * TT.passoRicamo + TT.ricamo;
    for (i = 0; i < nr; i++) {
      p = c01((t - TT.ricami - i * TT.passoRicamo) / TT.ricamo);
      var re = ricamiEl[i];
      if (p <= 0) { re.style.opacity = '0'; re.style.strokeDasharray = '1'; re.style.strokeDashoffset = '1'; }
      else if (p < 1) { re.style.removeProperty('opacity'); re.style.strokeDasharray = '1'; re.style.strokeDashoffset = r3(1 - p); }
      else { re.style.removeProperty('opacity'); re.style.removeProperty('stroke-dasharray'); re.style.removeProperty('stroke-dashoffset'); }
    }
    var inizioRic = { x: RIC[0].x - 22, y: RIC[0].y };
    if (t >= tC1 && t < TT.ricami) punta = tra(CONC[n - 1], inizioRic, c01((t - tC1) / Math.max(1, TT.ricami - tC1)));
    else if (t >= TT.ricami && t < tR1) {
      var kr = Math.min(nr - 1, Math.floor((t - TT.ricami) / TT.passoRicamo));
      var fr = c01((t - TT.ricami - kr * TT.passoRicamo) / TT.ricamo);
      punta = { x: RIC[kr].x - 22 + 44 * fr, y: RIC[kr].y };
    }
    /* «Auguri»: la punta segue la scritta da sinistra */
    var tS1 = TT.scritta + TT.durataScritta;
    var ps = c01((t - TT.scritta) / TT.durataScritta);
    if (ps < 1) auguriEl.style.clipPath = 'inset(0 ' + r3((1 - ps) * 100) + '% 0 0)'; else auguriEl.style.removeProperty('clip-path');
    var inizioA = { x: bbA.x, y: SCR.y - SCR.size * 0.3 };
    if (t >= tR1 && t < TT.scritta) punta = tra({ x: RIC[nr - 1].x + 22, y: RIC[nr - 1].y }, inizioA, c01((t - tR1) / Math.max(1, TT.scritta - tR1)));
    else if (t >= TT.scritta && t < tS1) punta = { x: bbA.x + bbA.width * ps, y: SCR.y - SCR.size * 0.3 + Math.sin(ps * Math.PI * 12) * SCR.size * 0.14 };
    /* la seconda riga: il nome, o lo svolazzo */
    var pr = scriviRiga(t, K);
    if (t >= tS1 && t < K.alza) punta = puntaRiga(pr);
    /* la tasca si alza */
    if (t >= K.alza && t < K.alza + TT.alzata) {
      var pa = esce(c01((t - K.alza) / TT.alzata)), ultima = puntaRiga(1);
      punta = { x: ultima.x + 50 * pa, y: ultima.y - 90 * pa, a: 1 - pa };
    }
    /* le roselline si posano */
    for (i = 0; i < roseEl.length; i++) {
      p = c01((t - K.rose - i * TT.passoRosa) / TT.rosa);
      if (p <= 0) { roseEl[i].style.opacity = '0'; roseEl[i].style.transform = 'scale(.3)'; }
      else if (p < 1) { roseEl[i].style.opacity = r3(c01(p * 2.5)); roseEl[i].style.transform = 'scale(' + r3(0.3 + 0.7 * esce(p) + 0.14 * Math.sin(p * Math.PI)) + ')'; }
      else { roseEl[i].style.removeProperty('opacity'); roseEl[i].style.removeProperty('transform'); }
    }
    if (punta) { punta.c = t >= TT.ricami - 120; mettiTasca(punta); } else if (tascaEl.getAttribute('display') !== 'none') nascondiTasca();
  }
  /* solo la seconda riga: un nome nuovo (lo svolazzo o il nome di prima spariscono), o il nome cancellato (torna lo svolazzo) */
  function fotogrammaNome(t, K) {
    var punta = null, pf = c01(t / 200);
    if (nomeT) {
      if (svolazzoPrima) { svolazzoEl.style.opacity = r3(1 - pf); puntinoEl.style.opacity = r3(1 - pf); }
      var pn = scriviRiga(t, K);
      if (t < K.s2) punta = tra(PARTENZA, puntaRiga(0), esce(c01(t / K.s2)));
      else if (t < K.alza) punta = puntaRiga(pn);
      else if (t < K.alza + TT.alzata) {
        var pa = esce(c01((t - K.alza) / TT.alzata)), ultima = puntaRiga(1);
        punta = { x: ultima.x + 50 * pa, y: ultima.y - 90 * pa, a: 1 - pa };
      }
    } else {
      if (nomePrima) nomeEl.style.opacity = r3(1 - c01(t / 150));
      scriviRiga(t, K);
    }
    if (punta) { punta.c = true; mettiTasca(punta); } else if (tascaEl.getAttribute('display') !== 'none') nascondiTasca();
  }
  function avviaTorta(modo) {
    cancelAnimationFrame(rafT); rafT = 0;
    tuttiT().forEach(pulisciT);
    nascondiTasca();
    modoT = modo;
    if (modo === 'tutta') {
      /* dalla classe d'attesa agli stili in linea senza cambiare un pixel: sul vassoio solo il centrino */
      corpiT.forEach(function (g) { g.style.opacity = '0'; });
      concEl.forEach(function (el) { el.style.opacity = '0'; });
      ricamiEl.forEach(function (el) { el.style.opacity = '0'; });
      roseEl.forEach(function (el) { el.style.opacity = '0'; });
      auguriEl.style.clipPath = 'inset(0 100% 0 0)';
      if (nomeT) {
        preparaNome(); nomeEl.style.clipPath = 'inset(0 100% 0 0)';
        svolazzoEl.setAttribute('display', 'none'); puntinoEl.setAttribute('display', 'none');
      } else {
        nomeEl.setAttribute('display', 'none'); nomeEl.textContent = '';
        svolazzoEl.removeAttribute('display'); puntinoEl.removeAttribute('display');
        svolazzoEl.style.opacity = '0'; puntinoEl.style.opacity = '0';
      }
    } else {
      svolazzoPrima = svolazzoEl.getAttribute('display') !== 'none';
      nomePrima = nomeEl.getAttribute('display') !== 'none';
      if (nomeT) { preparaNome(); nomeEl.style.clipPath = 'inset(0 100% 0 0)'; }
      else { svolazzoEl.removeAttribute('display'); puntinoEl.removeAttribute('display'); svolazzoEl.style.opacity = '0'; puntinoEl.style.opacity = '0'; }
    }
    try { bbA = auguriEl.getBBox(); } catch (e) { bbA = { x: SCR.x - 80, y: SCR.y - SCR.size, width: 160, height: SCR.size }; }
    root.classList.remove('firma-attesa');
    faseT = 'corre'; figuraT.setAttribute('data-firma', 'corre');
    larghezzaAvvioT = window.innerWidth;
    var K = tempiCoda(modo), t0 = null, corsa = ++corseT;
    function fotogramma(ts) {
      rafT = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseT !== 'corre' || corsa !== corseT) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      if (modo === 'tutta') fotogrammaTutta(t, K); else fotogrammaNome(t, K);
      if (t >= K.fine) { chiudiTorta(); return; }
      sorvegliaT();
      rafT = requestAnimationFrame(fotogramma);
    }
    sorvegliaT();
    rafT = requestAnimationFrame(fotogramma);
  }
  function annuncia() { if (leggiEl) leggiEl.textContent = LEGGI[linguaT()] + (nomeT ? ' ' + nomeT : '') + '.'; }
  /* «Scrivi»: il nome va sulla torta (se la torta si sta ancora decorando, prima si finisce) */
  function scrivi(v) {
    var nuovo = pulisciNome(v);
    if (campoN) campoN.value = nuovo;
    if (nuovo === nomeT && faseT === 'fatta' && !root.classList.contains('firma-attesa')) { annuncia(); return; }
    nomeT = nuovo;
    annuncia();
    if (faseT === 'corre' || root.classList.contains('firma-attesa')) chiudiTorta();
    if (reducedMotion) { chiudiTorta(); return; }
    avviaTorta('nome');
  }
  /* la torta è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra);
     l'altezza è quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaT() {
    if (!svgT) return false;
    var r = svgT.getBoundingClientRect();
    return abbastanza(r.top, r.bottom, r.height, altezzaVista());
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche nella sezione degli orari, col pallino verde quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  new MutationObserver(copiaStato).observe(root, { attributes: true, attributeFilter: ['lang'] });

  /* il modulo del nome non va mai da nessuna parte, neanche se la firma mancasse */
  if (formN) formN.addEventListener('submit', function (e) { e.preventDefault(); });

  if (figuraT && svgT && corpiT[0] && corpiT[1] && gruppiT.every(Boolean) && concEl.length === CONC.length && ricamiEl.length === RIC.length && roseEl.length === DATI.rose && auguriEl && svolazzoEl && puntinoEl && nomeEl && tascaEl) {
    try { clearTimeout(window.__attesaTorta); } catch (e) {}
    window.__torta = {
      stato: function () { return { fase: faseT, modo: modoT, corse: corseT, nome: nomeT, tasca: tascaEl.getAttribute('display') !== 'none' }; },
      tempi: TT,
      coda: function (modo) { return tempiCoda(modo || 'tutta'); },
    };
    var daFare = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancora = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaT();
    /* perché la firma è partita o no (lo legge il check) */
    window.__torta.avvio = { daFare: daFare, ancora: !!ancora, inVista: inVista, top: svgT.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFare || ancora) chiudiTorta();
    else if (inVista) avviaTorta('tutta');
    else if ('IntersectionObserver' in window) {
      /* la torta sotto la piega (telefoni): parte quando se ne vede abbastanza; fino ad allora c'è solo il centrino */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioT = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioT.disconnect();
        if (faseT === 'fatta' && root.classList.contains('firma-attesa')) avviaTorta('tutta');
      }, { threshold: soglie });
      ioT.observe(svgT);
      window.__torta.avvio.aspetta = true;
    } else chiudiTorta();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseT !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioT) <= 1) return;
      chiudiTorta();
    });
    if (formN && campoN) formN.addEventListener('submit', function () { scrivi(campoN.value); });
    if (rifaiB) rifaiB.addEventListener('click', function () {
      if (reducedMotion) { chiudiTorta(); return; }
      avviaTorta('tutta');
    });
  }
})();
