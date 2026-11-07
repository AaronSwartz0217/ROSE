/* =========================================================
   Rose（丞莘）— layout & interactions
   Fabric imagery is served as static images; karst ridges are drawn at runtime (canvas).
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- tiny seeded random ---------------- */
  function seeded(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------------- grain tile ---------------- */
  var grainCanvas = (function () {
    var c = document.createElement('canvas');
    c.width = c.height = 150;
    var x = c.getContext('2d');
    var img = x.createImageData(150, 150);
    for (var i = 0; i < img.data.length; i += 4) {
      var v = 120 + Math.random() * 130;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 22;
    }
    x.putImageData(img, 0, 0);
    return c;
  })();

  function addGrain(ctx, w, h) {
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = ctx.createPattern(grainCanvas, 'repeat');
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function vignette(ctx, w, h, power) {
    var g = ctx.createRadialGradient(w * 0.5, h * 0.44, Math.min(w, h) * 0.22, w * 0.5, h * 0.5, Math.max(w, h) * 0.74);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.62, 'rgba(0,0,0,' + (power * 0.24) + ')');
    g.addColorStop(1, 'rgba(0,0,0,' + power + ')');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  /* =========================================================
     HERO — layered karst ridges, 3 stacked canvases
     ========================================================= */
  var heroLayers = [
    [
      { base: 0.76, amp: 0.28, towers: 22, top: '#303334', bot: '#232526', edge: 0.12, seed: 7 },
      { base: 0.81, amp: 0.31, towers: 18, top: '#282b2c', bot: '#1c1e1f', edge: 0.1, seed: 19 }
    ],
    [
      { base: 0.87, amp: 0.34, towers: 16, top: '#1e2122', bot: '#161819', edge: 0.1, seed: 31 },
      { base: 0.92, amp: 0.37, towers: 13, top: '#181a1b', bot: '#111314', edge: 0.08, seed: 43 }
    ],
    [
      { base: 1.0, amp: 0.40, towers: 11, top: '#0f1111', bot: '#090a0b', edge: 0.08, seed: 59 },
      { base: 1.06, amp: 0.44, towers: 8, top: '#090a0b', bot: '#050606', edge: 0.06, seed: 71 }
    ]
  ];

  function towerProfile(rnd, w, count, baseY, amp, h) {
    var towers = [];
    for (var i = 0; i < count; i++) {
      towers.push({
        cx: (-0.06 + (i + 0.2 + rnd() * 0.6) / count * 1.12) * w,
        tw: (0.014 + rnd() * 0.034) * w,
        th: 0.55 + rnd() * 0.5
      });
    }
    var pts = [];
    for (var x = -20; x <= w + 20; x += 3) {
      var v = 0.14 + 0.05 * Math.sin(x * 0.0031 + count);
      for (var j = 0; j < towers.length; j++) {
        var t = towers[j];
        var d = Math.abs(x - t.cx) / t.tw;
        if (d < 1) {
          var val = t.th * Math.pow(1 - Math.pow(d, 8), 0.45);
          if (val > v) v = val;
        }
      }
      v += 0.008 * Math.sin(x * 0.07);
      pts.push([x, baseY - v * amp * h]);
    }
    return pts;
  }

  function drawRidgeLayer(ctx, w, h, cfg, seedOffset) {
    var rnd = seeded((cfg.seed + seedOffset) * 977);
    var baseY = cfg.base * h;
    var pts = towerProfile(rnd, w, cfg.towers, baseY, cfg.amp, h);

    var g = ctx.createLinearGradient(0, baseY - cfg.amp * h, 0, h);
    g.addColorStop(0, cfg.top);
    g.addColorStop(1, cfg.bot);

    ctx.beginPath();
    ctx.moveTo(-20, h + 4);
    ctx.lineTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.lineTo(w + 20, pts[pts.length - 1][1]);
    ctx.lineTo(w + 20, h + 4);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();

    /* lit rim */
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
    ctx.strokeStyle = 'rgba(232,228,219,' + cfg.edge + ')';
    ctx.lineWidth = 0.9;
    ctx.stroke();
  }

  function renderHero() {
    var canvases = document.querySelectorAll('.hero .ridge');
    canvases.forEach(function (cv, idx) {
      var w = cv.clientWidth;
      var h = cv.clientHeight;
      if (!w || !h) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      var ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      heroLayers[idx].forEach(function (cfg, i) {
        drawRidgeLayer(ctx, w, h, cfg, i * 13);
      });
    });
  }

  /* ---------------- scroll & pointer parallax ---------------- */
  var heroEl = document.querySelector('.hero');
  var ridgeEls = Array.prototype.slice.call(document.querySelectorAll('.hero .ridge'));
  var pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  if (heroEl && !reduceMotion) {
    window.addEventListener('pointermove', function (e) {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  /* =========================================================
     CRAFT — stitch structure diagrams (SVG)
     ========================================================= */
  function stitchSVG(type) {
    var cols = 13, rows = 8, cw = 32, ch = 28, pad = 26;
    var w = pad * 2 + cols * cw, h = pad * 2 + rows * ch;
    var light = '#ded9cd';
    var mid = 'rgba(222,217,205,.5)';
    var dim = 'rgba(222,217,205,.22)';
    var body = '';

    function vPath(x, y) {
      return 'M' + (x - 9) + ' ' + y + ' C' + (x - 7) + ' ' + (y + 13) + ',' + (x + 7) + ' ' + (y + 13) + ',' + (x + 9) + ' ' + y;
    }

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var x = pad + c * cw + cw / 2 + (r % 2 ? cw / 2 : 0);
        var y = pad + r * ch + ch * 0.55;
        if (x > w - pad) continue;

        var skip = false;
        if (type === 'eyelet') {
          var key = (c * 3 + r * 5) % 9;
          if (key === 0 || key === 4) skip = true;
        }

        if (skip) {
          var rr = type === 'eyelet' ? (key === 0 ? 9 : 5.5) : 6;
          body += '<circle cx="' + x + '" cy="' + y + '" r="' + rr + '" fill="#0a0b0b"/>';
          body += '<circle cx="' + x + '" cy="' + y + '" r="' + rr + '" fill="none" stroke="rgba(190,186,176,.34)" stroke-width="1"/>';
          continue;
        }

        var stroke = mid;
        var sw = 1.7;

        if (type === 'relief') {
          if (c % 4 === 0) {
            body += '<path d="' + vPath(x, y + 3) + '" fill="none" stroke="rgba(0,0,0,.85)" stroke-width="5.5" stroke-linecap="round"/>';
            stroke = light;
            sw = 3.4;
          } else if (c % 4 === 2) {
            stroke = dim;
            sw = 1.3;
          }
        }

        if (type === 'jacquard') {
          var block = (Math.floor(c / 4) + Math.floor(r / 3)) % 3;
          stroke = block === 0 ? light : (block === 1 ? 'rgba(190,170,146,.62)' : 'rgba(222,217,205,.3)');
          sw = block === 0 ? 2.2 : 1.6;
        }

        body += '<path d="' + vPath(x, y) + '" fill="none" stroke="' + stroke + '" stroke-width="' + sw + '" stroke-linecap="round"/>';
      }
    }

    if (type === 'cable') {
      for (var br = 0; br < 4; br++) {
        var by = pad + br * ch * 2.4 + ch;
        var bx = pad + 6 * cw + cw / 2;
        body += '<path d="M' + (bx - 26) + ' ' + (by - 8) + ' C' + (bx - 8) + ' ' + (by + 6) + ',' + (bx + 8) + ' ' + (by + 6) + ',' + (bx + 26) + ' ' + (by - 8) + '" fill="none" stroke="rgba(222,217,205,.75)" stroke-width="4" stroke-linecap="round"/>';
        body += '<path d="M' + (bx + 26) + ' ' + (by + 18) + ' C' + (bx + 8) + ' ' + (by + 32) + ',' + (bx - 8) + ' ' + (by + 32) + ',' + (bx - 26) + ' ' + (by + 18) + '" fill="none" stroke="rgba(222,217,205,.45)" stroke-width="4" stroke-linecap="round"/>';
      }
    }

    if (type === 'eyelet') {
      body += '<path d="M' + (pad + 3 * cw) + ' ' + (pad + 5) + ' Q' + (pad + 5 * cw) + ' ' + (pad + 30) + ' ' + (pad + 7 * cw) + ' ' + (pad + 5) + '" fill="none" stroke="rgba(222,217,205,.3)" stroke-width="1.4" stroke-dasharray="2 4"/>';
    }

    return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="组织结构示意">' +
      '<rect x="0.5" y="0.5" width="' + (w - 1) + '" height="' + (h - 1) + '" fill="#141516" stroke="rgba(238,234,226,.1)"/>' +
      body +
      '<text x="' + pad + '" y="' + (h - 8) + '" font-family="Helvetica, Arial, sans-serif" font-size="8" letter-spacing="2" fill="rgba(222,217,205,.32)">STITCH DIAGRAM</text>' +
      '</svg>';
  }

  function renderStitchFigures() {
    document.querySelectorAll('[data-stitch]').forEach(function (el) {
      el.innerHTML = stitchSVG(el.getAttribute('data-stitch'));
    });
  }

  /* =========================================================
     Interactions
     ========================================================= */
  var header = document.getElementById('siteHead');
  var progressBar = document.getElementById('progressBar');
  var navToggle = document.getElementById('navToggle');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));

  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));

  function updateParallax() {
    if (reduceMotion) return;
    var vh = window.innerHeight;
    parallaxEls.forEach(function (fig) {
      var r = fig.getBoundingClientRect();
      if (r.bottom < -120 || r.top > vh + 120) return;
      var img = fig.querySelector('img');
      if (!img) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      img.style.transform = 'scale(1.06) translate3d(0,' + (p * -16).toFixed(1) + 'px,0)';
    });
  }

  function onScroll() {
    var top = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-solid', top > 48);

    if (progressBar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? (top / max) * 100 : 0) + '%';
    }

    if (!reduceMotion) {
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      var heroH = heroEl ? heroEl.offsetHeight : 0;
      if (top < heroH + 200) {
        ridgeEls.forEach(function (cv, i) {
          var depth = parseFloat(cv.getAttribute('data-depth')) || 0.02;
          var tx = pointer.x * (6 + i * 5);
          var ty = top * depth + pointer.y * (3 + i * 2);
          cv.style.transform = 'translate3d(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px,0) scale(1.06)';
        });
      }
    }
    updateParallax();
  }

  var ticking = false;
  function requestTick() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
    }
  }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);

  /* pointer loop (independent of scroll) */
  if (!reduceMotion) {
    (function loop() {
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      window.requestAnimationFrame(loop);
    })();
  }

  /* mobile menu */
  function menuLabel(open) {
    var en = document.documentElement.getAttribute('data-lang') === 'en';
    return open ? (en ? 'Close menu' : '关闭菜单') : (en ? 'Open menu' : '打开菜单');
  }
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', menuLabel(open));
    });
  }
  navLinks.forEach(function (a) {
    a.addEventListener('click', function () {
      document.body.classList.remove('nav-open');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', menuLabel(false));
      }
    });
  });

  /* reveal */
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -2% 0px' });

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  /* active nav */
  if ('IntersectionObserver' in window) {
    var sections = ['philosophy', 'collections', 'field', 'craft', 'gallery', 'about', 'honours'];
    var map = {};
    navLinks.forEach(function (a) {
      map[a.getAttribute('href').replace('#', '')] = a;
    });
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.remove('is-active'); });
          var link = map[e.target.id];
          if (link) link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-46% 0px -50% 0px' });

    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) navIO.observe(el);
    });
  }

  /* craft tabs */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.craft-tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.craft-panel'));
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var idx = tab.getAttribute('data-tab');
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panels.forEach(function (p) {
        p.classList.toggle('is-active', p.getAttribute('data-panel') === idx);
      });
    });
  });

  /* =========================================================
     boot
     ========================================================= */
  function renderAll() {
    renderHero();
  }

  renderStitchFigures();
  renderAll();
  onScroll();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      renderHero();
      onScroll();
    }, 180);
  });

  window.addEventListener('load', function () {
    renderHero();
  });
})();
