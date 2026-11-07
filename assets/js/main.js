/* =========================================================
   Rose（丞莘）— procedural textures & interactions
   Fabric textures and karst ridges are generated at runtime (canvas / svg).
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
     ATLAS — procedural textures
     ========================================================= */
  function texRibs(ctx, w, h) {
    var g = ctx.createLinearGradient(0, 0, w * 0.6, h);
    g.addColorStop(0, '#1c1d1e');
    g.addColorStop(1, '#0b0c0d');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    var step = Math.max(9, w / 30);
    var rnd = seeded(311);
    for (var x = -step; x < w + step; x += step) {
      var lift = 0.7 + rnd() * 0.3;
      var lg = ctx.createLinearGradient(x, 0, x + step, 0);
      lg.addColorStop(0, 'rgba(0,0,0,.85)');
      lg.addColorStop(0.22, 'rgba(74,78,79,' + (0.75 * lift) + ')');
      lg.addColorStop(0.5, 'rgba(104,108,108,' + (0.42 * lift) + ')');
      lg.addColorStop(0.72, 'rgba(20,22,23,.9)');
      lg.addColorStop(1, 'rgba(0,0,0,.85)');
      ctx.fillStyle = lg;
      ctx.fillRect(x, 0, step, h);

      /* loop rows */
      ctx.strokeStyle = 'rgba(0,0,0,.5)';
      ctx.lineWidth = 1;
      for (var y = (x % 7); y < h; y += step * 0.86) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + step * 0.5, y + step * 0.3, x + step, y);
        ctx.stroke();
      }
    }

    /* side light */
    var l = ctx.createLinearGradient(0, 0, w, h * 0.6);
    l.addColorStop(0, 'rgba(0,0,0,.6)');
    l.addColorStop(0.3, 'rgba(255,255,255,0)');
    l.addColorStop(0.55, 'rgba(226,222,213,.16)');
    l.addColorStop(0.75, 'rgba(0,0,0,.1)');
    l.addColorStop(1, 'rgba(0,0,0,.75)');
    ctx.fillStyle = l;
    ctx.fillRect(0, 0, w, h);

    vignette(ctx, w, h, 0.8);
  }

  function texHoles(ctx, w, h) {
    ctx.fillStyle = '#0e0f10';
    ctx.fillRect(0, 0, w, h);
    var rnd = seeded(523);

    var glow = ctx.createRadialGradient(w * 0.62, h * 0.16, 0, w * 0.62, h * 0.16, w * 0.9);
    glow.addColorStop(0, 'rgba(214,209,198,.34)');
    glow.addColorStop(0.4, 'rgba(140,145,140,.12)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    var count = 110;
    for (var i = 0; i < count; i++) {
      var cx = rnd() * w;
      var cy = rnd() * h;
      var r = (0.012 + Math.pow(rnd(), 2.2) * 0.085) * Math.min(w, h) * 1.5;
      var grad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.25, 0, cx, cy, r);
      grad.addColorStop(0, '#040506');
      grad.addColorStop(0.72, '#060708');
      grad.addColorStop(1, 'rgba(10,11,12,.35)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.98, Math.PI * 1.05, Math.PI * 1.85);
      ctx.strokeStyle = 'rgba(168,170,163,' + (0.08 + rnd() * 0.22) + ')';
      ctx.lineWidth = Math.max(0.7, r * 0.07);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.05, Math.PI * 0.1, Math.PI * 0.8);
      ctx.strokeStyle = 'rgba(0,0,0,.65)';
      ctx.lineWidth = Math.max(0.8, r * 0.12);
      ctx.stroke();
    }

    /* faint yarn mesh */
    ctx.strokeStyle = 'rgba(120,124,120,.05)';
    ctx.lineWidth = 1;
    for (var y = 0; y < h; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y + 6);
      ctx.stroke();
    }

    vignette(ctx, w, h, 0.86);
  }

  function texJacquard(ctx, w, h) {
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#202122');
    g.addColorStop(1, '#0e0f10');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    var rnd = seeded(733);
    var rowH = Math.max(16, h / 16);
    for (var y = 0; y < h; y += rowH) {
      var x = 0;
      while (x < w) {
        var bw = (2 + Math.floor(rnd() * 5)) * (w / 14);
        var tone = 28 + Math.floor(rnd() * 62);
        ctx.fillStyle = 'rgba(' + tone + ',' + (tone + 1) + ',' + tone + ',.85)';
        ctx.fillRect(x, y, bw, rowH - 1);
        /* stitch marks */
        ctx.strokeStyle = 'rgba(0,0,0,.35)';
        ctx.lineWidth = 1;
        for (var sx = x + 3; sx < x + bw; sx += 5) {
          ctx.beginPath();
          ctx.moveTo(sx, y + rowH * 0.15);
          ctx.quadraticCurveTo(sx + 2, y + rowH * 0.55, sx, y + rowH * 0.85);
          ctx.stroke();
        }
        x += bw;
      }
      ctx.fillStyle = 'rgba(0,0,0,.4)';
      ctx.fillRect(0, y + rowH - 1, w, 1);
    }

    var l = ctx.createLinearGradient(0, 0, w, h * 0.5);
    l.addColorStop(0, 'rgba(0,0,0,.55)');
    l.addColorStop(0.4, 'rgba(255,255,255,0)');
    l.addColorStop(0.62, 'rgba(228,224,214,.12)');
    l.addColorStop(1, 'rgba(0,0,0,.7)');
    ctx.fillStyle = l;
    ctx.fillRect(0, 0, w, h);

    vignette(ctx, w, h, 0.8);
  }

  function texRidges(ctx, w, h) {
    var sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#dcd8cf');
    sky.addColorStop(0.45, '#c8c4bb');
    sky.addColorStop(1, '#8f8d84');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    var layers = [
      { base: 0.56, amp: 0.30, towers: 15, col: 'rgba(150,148,139,.55)', edge: 'rgba(255,255,255,.18)', seed: 3 },
      { base: 0.68, amp: 0.32, towers: 12, col: 'rgba(116,115,108,.72)', edge: 'rgba(255,255,255,.14)', seed: 9 },
      { base: 0.8, amp: 0.34, towers: 10, col: 'rgba(78,79,75,.86)', edge: 'rgba(255,255,255,.11)', seed: 17 },
      { base: 0.92, amp: 0.36, towers: 8, col: 'rgba(38,40,39,.94)', edge: 'rgba(255,255,255,.09)', seed: 29 },
      { base: 1.06, amp: 0.38, towers: 6, col: '#141515', edge: 'rgba(255,255,255,.07)', seed: 41 }
    ];

    layers.forEach(function (cfg) {
      var rnd = seeded(cfg.seed * 613);
      var pts = towerProfile(rnd, w, cfg.towers, cfg.base * h, cfg.amp, h);
      ctx.beginPath();
      ctx.moveTo(-20, h + 4);
      ctx.lineTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.lineTo(w + 20, pts[pts.length - 1][1]);
      ctx.lineTo(w + 20, h + 4);
      ctx.closePath();
      ctx.fillStyle = cfg.col;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (var k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
      ctx.strokeStyle = cfg.edge;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    /* erosion streaks on foreground */
    var rr = seeded(101);
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    for (var i = 0; i < 60; i++) {
      var x = rr() * w;
      ctx.strokeStyle = 'rgba(0,0,0,' + (0.04 + rr() * 0.1) + ')';
      ctx.lineWidth = 0.7 + rr() * 1.6;
      ctx.beginPath();
      ctx.moveTo(x, h * 0.5);
      ctx.lineTo(x + (rr() - 0.5) * 10, h);
      ctx.stroke();
    }
    ctx.restore();

    /* mist at the bottom */
    var mist = ctx.createLinearGradient(0, h * 0.62, 0, h);
    mist.addColorStop(0, 'rgba(214,210,200,0)');
    mist.addColorStop(1, 'rgba(214,210,200,.5)');
    ctx.fillStyle = mist;
    ctx.fillRect(0, h * 0.62, w, h * 0.38);

    vignette(ctx, w, h, 0.45);
  }

  function texCavern(ctx, w, h) {
    ctx.fillStyle = '#08090a';
    ctx.fillRect(0, 0, w, h);

    var glow = ctx.createRadialGradient(w * 0.52, h * 0.36, 0, w * 0.52, h * 0.4, w * 0.62);
    glow.addColorStop(0, 'rgba(226,220,206,.72)');
    glow.addColorStop(0.18, 'rgba(198,192,178,.4)');
    glow.addColorStop(0.5, 'rgba(120,120,112,.12)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    var rnd = seeded(877);

    /* stalactites from the ceiling */
    for (var i = 0; i < 13; i++) {
      var x = rnd() * w;
      var len = (0.08 + rnd() * 0.34) * h;
      var wid = (0.012 + rnd() * 0.035) * w;
      var grd = ctx.createLinearGradient(x - wid, 0, x + wid, 0);
      grd.addColorStop(0, '#050607');
      grd.addColorStop(0.55, '#0d0f10');
      grd.addColorStop(1, '#020303');
      ctx.beginPath();
      ctx.moveTo(x - wid, -10);
      ctx.quadraticCurveTo(x - wid * 0.5, len * 0.6, x, len);
      ctx.quadraticCurveTo(x + wid * 0.5, len * 0.5, x + wid, -10);
      ctx.closePath();
      ctx.fillStyle = grd;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x - wid, -10);
      ctx.quadraticCurveTo(x - wid * 0.5, len * 0.6, x, len);
      ctx.strokeStyle = 'rgba(214,208,194,.14)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    /* rock walls */
    ctx.fillStyle = '#060708';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, h);
    ctx.lineTo(w * 0.17, h);
    ctx.bezierCurveTo(w * 0.22, h * 0.72, w * 0.05, h * 0.6, w * 0.12, h * 0.38);
    ctx.bezierCurveTo(w * 0.17, h * 0.2, w * 0.05, h * 0.12, 0, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w, h);
    ctx.lineTo(w, 0);
    ctx.bezierCurveTo(w * 0.9, h * 0.14, w * 0.97, h * 0.3, w * 0.88, h * 0.46);
    ctx.bezierCurveTo(w * 0.8, h * 0.64, w * 0.94, h * 0.8, w * 0.9, h);
    ctx.fill();

    /* stalagmites */
    for (var s = 0; s < 7; s++) {
      var sx = w * (0.1 + rnd() * 0.82);
      var sw = (0.02 + rnd() * 0.05) * w;
      var sh = (0.06 + rnd() * 0.2) * h;
      ctx.beginPath();
      ctx.moveTo(sx - sw, h);
      ctx.quadraticCurveTo(sx - sw * 0.3, h - sh * 0.6, sx, h - sh);
      ctx.quadraticCurveTo(sx + sw * 0.3, h - sh * 0.55, sx + sw, h);
      ctx.closePath();
      ctx.fillStyle = 'rgba(4,5,6,.92)';
      ctx.fill();
    }

    addGrain(ctx, w, h);
    vignette(ctx, w, h, 0.92);
  }

  function texGrooves(ctx, w, h) {
    var g = ctx.createLinearGradient(0, 0, w * 0.4, h);
    g.addColorStop(0, '#cfcbc1');
    g.addColorStop(0.55, '#b4b0a6');
    g.addColorStop(1, '#8f8c83');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    var rnd = seeded(431);
    var x = -10;
    while (x < w + 10) {
      var gw = 2 + rnd() * 11;
      var tilt = (rnd() - 0.5) * 16;
      var shade = 0.1 + rnd() * 0.34;

      ctx.beginPath();
      ctx.moveTo(x, -10);
      ctx.lineTo(x + tilt, h + 10);
      ctx.lineWidth = gw;
      ctx.strokeStyle = 'rgba(72,72,66,' + shade + ')';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + gw * 0.7, -10);
      ctx.lineTo(x + gw * 0.7 + tilt, h + 10);
      ctx.lineWidth = gw * 0.28;
      ctx.strokeStyle = 'rgba(255,253,246,' + (0.16 + rnd() * 0.22) + ')';
      ctx.stroke();

      x += gw + 4 + rnd() * 16;
    }

    /* solution pits */
    for (var i = 0; i < 26; i++) {
      var cx = rnd() * w;
      var cy = rnd() * h;
      var rx = 2 + rnd() * 9;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, rx * (0.4 + rnd() * 0.5), rnd() * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(58,58,53,.22)';
      ctx.fill();
    }

    var l = ctx.createLinearGradient(0, 0, w, h);
    l.addColorStop(0, 'rgba(255,255,255,.16)');
    l.addColorStop(0.5, 'rgba(0,0,0,0)');
    l.addColorStop(1, 'rgba(0,0,0,.35)');
    ctx.fillStyle = l;
    ctx.fillRect(0, 0, w, h);

    addGrain(ctx, w, h);
    vignette(ctx, w, h, 0.5);
  }

  function texFlow(ctx, w, h) {
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#151718');
    g.addColorStop(0.5, '#0d0f10');
    g.addColorStop(1, '#171a1a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    var rnd = seeded(977);
    for (var i = 0; i < 34; i++) {
      var y = h * (0.1 + rnd() * 0.85);
      var amp = h * (0.02 + rnd() * 0.1);
      var alpha = 0.04 + rnd() * 0.16;
      var lw = 0.6 + rnd() * 4.2;
      ctx.beginPath();
      ctx.moveTo(-20, y);
      ctx.bezierCurveTo(w * 0.3, y - amp, w * 0.65, y + amp, w + 20, y - amp * 0.4);
      ctx.strokeStyle = 'rgba(206,202,192,' + alpha + ')';
      ctx.lineWidth = lw;
      ctx.stroke();
    }

    /* mineral sediment glints */
    for (var j = 0; j < 240; j++) {
      var px = rnd() * w;
      var py = rnd() * h;
      var pr = rnd() * 1.4;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(230,226,214,' + (0.05 + rnd() * 0.3) + ')';
      ctx.fill();
    }

    var l = ctx.createRadialGradient(w * 0.3, h * 0.35, 0, w * 0.3, h * 0.35, w * 0.9);
    l.addColorStop(0, 'rgba(196,192,182,.12)');
    l.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = l;
    ctx.fillRect(0, 0, w, h);

    addGrain(ctx, w, h);
    vignette(ctx, w, h, 0.88);
  }

  function texStrata(ctx, w, h) {
    var tones = ['#8d897f', '#77746c', '#a19d92', '#5f5e59', '#b0aca1', '#6d6b64', '#939086', '#4c4c48'];
    ctx.fillStyle = '#5b5a55';
    ctx.fillRect(0, 0, w, h);

    var rnd = seeded(1193);
    var y = -h * 0.05;
    var idx = 0;
    while (y < h) {
      var bandH = (0.03 + rnd() * 0.1) * h;
      var amp = bandH * (0.12 + rnd() * 0.35);
      var phase = rnd() * Math.PI * 2;
      var freq = 1.1 + rnd() * 0.4;
      var col = tones[idx % tones.length];

      ctx.beginPath();
      ctx.moveTo(-10, y);
      for (var x = -10; x <= w + 20; x += 12) {
        var yy = y + Math.sin(x / w * Math.PI * freq + phase) * amp;
        ctx.lineTo(x, yy);
      }
      ctx.lineTo(w + 20, y + bandH);
      for (var x2 = w + 20; x2 >= -10; x2 -= 12) {
        var yy2 = y + bandH + Math.sin(x2 / w * Math.PI * freq + phase) * amp;
        ctx.lineTo(x2, yy2);
      }
      ctx.closePath();
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.82;
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.moveTo(-10, y + 1);
      for (var x3 = -10; x3 <= w + 20; x3 += 14) {
        ctx.lineTo(x3, y + Math.sin(x3 / w * Math.PI * 1.15 + phase) * amp);
      }
      ctx.strokeStyle = 'rgba(255,252,244,.16)';
      ctx.lineWidth = 1;
      ctx.stroke();

      y += bandH;
      idx++;
    }

    /* fractures */
    for (var f = 0; f < 6; f++) {
      var fx = rnd() * w;
      ctx.beginPath();
      ctx.moveTo(fx, -10);
      ctx.lineTo(fx + (rnd() - 0.5) * w * 0.2, h + 10);
      ctx.strokeStyle = 'rgba(20,20,18,.28)';
      ctx.lineWidth = 0.8 + rnd() * 1.6;
      ctx.stroke();
    }

    var l = ctx.createLinearGradient(0, 0, w, h);
    l.addColorStop(0, 'rgba(255,255,255,.12)');
    l.addColorStop(0.5, 'rgba(0,0,0,0)');
    l.addColorStop(1, 'rgba(0,0,0,.4)');
    ctx.fillStyle = l;
    ctx.fillRect(0, 0, w, h);

    addGrain(ctx, w, h);
    vignette(ctx, w, h, 0.55);
  }

  var textureMap = {
    ribs: texRibs,
    holes: texHoles,
    jacquard: texJacquard,
    ridges: texRidges,
    cavern: texCavern,
    grooves: texGrooves,
    flow: texFlow,
    strata: texStrata
  };

  function renderAtlas() {
    document.querySelectorAll('.tile canvas').forEach(function (cv) {
      var type = cv.getAttribute('data-tex');
      var fn = textureMap[type];
      if (!fn) return;
      var box = cv.parentElement.getBoundingClientRect();
      var w = Math.round(box.width);
      var h = Math.round(box.height);
      if (!w || !h) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      var ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      fn(ctx, w, h);
    });
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
    renderAtlas();
  }

  renderStitchFigures();
  renderAll();
  onScroll();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      renderHero();
      renderAtlas();
      onScroll();
    }, 180);
  });

  window.addEventListener('load', function () {
    renderHero();
    renderAtlas();
  });
})();
