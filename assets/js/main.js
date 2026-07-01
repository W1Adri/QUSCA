/* =====================================================================
   ACSAR — interaction layer
   Starfield · countdown to the ESA deadline · animated counters ·
   scorecard bars · scroll reveal · sticky nav · mobile menu
   ===================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---------------------------------------------------- year */
  var y = document.getElementById("year");
  if (y) y.textContent = "2026";

  /* ---------------------------------------------------- sticky nav */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------- mobile menu */
  var burger = document.getElementById("burger");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    var links = nav.querySelectorAll(".nav__links a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    }
  }

  /* ---------------------------------------------------- countdown */
  // Target: 2 Oct 2026, 13:00 CEST (UTC+2)  ->  11:00 UTC
  var target = Date.UTC(2026, 9, 2, 11, 0, 0);
  var cd = document.getElementById("countdown");

  function pad(n, w) { n = String(Math.floor(n)); while (n.length < (w || 2)) n = "0" + n; return n; }

  function tick() {
    if (!cd) return;
    var diff = target - Date.now();
    if (diff <= 0) { cd.textContent = "00d 00h 00m 00s"; return; }
    var s = Math.floor(diff / 1000);
    var days = Math.floor(s / 86400); s -= days * 86400;
    var hrs = Math.floor(s / 3600);  s -= hrs * 3600;
    var min = Math.floor(s / 60);    s -= min * 60;
    cd.textContent = pad(days, 3) + "d " + pad(hrs) + "h " + pad(min) + "m " + pad(s) + "s";
  }
  if (cd) { tick(); setInterval(tick, 1000); }

  /* ---------------------------------------------------- starfield */
  function Starfield(canvas) {
    var ctx = canvas.getContext("2d");
    var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var stars = [];

    function resize() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }
    function build() {
      var count = Math.round((w * h) / 11000); // restrained density
      count = Math.max(28, Math.min(150, count));
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.3 + 0.25,
          a: Math.random() * 0.6 + 0.2,
          tw: Math.random() * 0.02 + 0.004,
          ph: Math.random() * Math.PI * 2,
          drift: Math.random() * 0.06 + 0.01,
          violet: Math.random() > 0.78
        });
      }
    }
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var tw = reduce ? s.a : (s.a + Math.sin(t * s.tw + s.ph) * 0.28);
        if (tw < 0.04) tw = 0.04;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.violet
          ? "rgba(154,124,255," + tw + ")"
          : "rgba(220,232,255," + tw + ")";
        ctx.fill();
        if (!reduce) {
          s.y += s.drift;
          if (s.y > h + 2) { s.y = -2; s.x = Math.random() * w; }
        }
      }
    }

    resize();
    window.addEventListener("resize", debounce(resize, 200));

    if (reduce) {
      draw(0);
    } else {
      var raf;
      (function loop(t) { draw(t || 0); raf = requestAnimationFrame(loop); })();
    }
  }

  var s1 = document.getElementById("stars");
  var s2 = document.getElementById("stars2");
  if (s1) Starfield(s1);
  if (s2) Starfield(s2);

  /* ---------------------------------------------------- counters */
  function animateCount(el) {
    var endText = el.textContent;
    var to = parseFloat(el.getAttribute("data-count"));
    if (isNaN(to)) return;
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce || to === 0) { el.textContent = endText; return; }

    var dur = 1200, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = to * eased;
      el.textContent = val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = endText;
    }
    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------- scroll reveal + observers */
  var hasIO = "IntersectionObserver" in window;

  // assign reveal to content blocks (all below the hero fold -> no flash)
  var revealSel = ".sec-head, .move, .feature, .stat, .card, .ally, .tl, .bar, .mission__diagram, .note, .cta__inner";
  var revealEls = document.querySelectorAll(revealSel);

  if (hasIO && !reduce) {
    for (var r = 0; r < revealEls.length; r++) revealEls[r].classList.add("reveal");

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("is-in");

        // staggered children for grids
        var num = el.querySelector("[data-count]");
        if (num) animateCount(num);

        io.unobserve(el);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

    for (var o = 0; o < revealEls.length; o++) io.observe(revealEls[o]);

    // bars: animate fill when the bars container scrolls in
    var bars = document.querySelectorAll(".bar");
    var barIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); barIO.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    for (var b = 0; b < bars.length; b++) barIO.observe(bars[b]);

  } else {
    // no IO or reduced motion: show everything, set final numbers and bars
    for (var x = 0; x < revealEls.length; x++) revealEls[x].classList.add("is-in");
    var allBars = document.querySelectorAll(".bar");
    for (var bb = 0; bb < allBars.length; bb++) allBars[bb].classList.add("is-in");
  }

  /* ---------------------------------------------------- util */
  function debounce(fn, ms) {
    var t;
    return function () {
      var ctx = this, a = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, a); }, ms);
    };
  }
})();
