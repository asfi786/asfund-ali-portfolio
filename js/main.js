/* ============================================================
   AS FUND ALI — PORTFOLIO SCRIPTS
   Theme toggle · mobile nav · scroll spy · reveal animations
   skill bars · project filter · counters · contact form
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Theme toggle (dark / light, remembered) ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  try {
    var saved = localStorage.getItem("aa-theme");
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) { /* private mode — ignore */ }
  function syncThemeLabel() {
    var isLight = root.getAttribute("data-theme") === "light";
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  }
  themeToggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("aa-theme", next); } catch (e) { /* ignore */ }
    syncThemeLabel();
  });
  syncThemeLabel();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.classList.contains("nav-link")) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Scroll spy (active nav link) ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        links.forEach(function (l) {
          l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(function (s) { spy.observe(s); });

  /* ---------- Reveal on scroll ---------- */
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("in-view");
        revealer.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { revealer.observe(el); });

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var counterObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, target = parseInt(el.getAttribute("data-count"), 10), t0 = null;
      counterObs.unobserve(el);
      function tick(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 1200, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + "+";
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach(function (c) { counterObs.observe(c); });

  /* ---------- Project filter ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var cards = document.querySelectorAll(".project-card");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      var f = btn.getAttribute("data-filter");
      cards.forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-category") === f;
        card.classList.toggle("hidden", !show);
        if (show) { card.classList.remove("in-view"); requestAnimationFrame(function(){ requestAnimationFrame(function(){ card.classList.add("in-view"); }); }); }
      });
    });
  });

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById("toTop");
  window.addEventListener("scroll", function () {
    toTop.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Contact form (FormSubmit AJAX — no account needed) ----------
     EDIT: the address below is where messages go. The FIRST message you
     receive triggers an activation email from FormSubmit — click it once
     and the form works forever. Details in README.md. */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var sendBtn = document.getElementById("sendBtn");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("fName").value.trim();
    var email = document.getElementById("fEmail").value.trim();
    var subject = document.getElementById("fSubject").value.trim();
    var message = document.getElementById("fMessage").value.trim();

    if (!name || !email || !message) {
      status.textContent = "Please fill in your name, email, and message.";
      status.className = "form-status err";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = "That email address doesn't look right — please check it.";
      status.className = "form-status err";
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending…";
    status.textContent = "";
    status.className = "form-status";

    fetch("https://formsubmit.co/ajax/asfundali22@gmail.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        name: name, email: email, message: message,
        _subject: (subject || "New portfolio inquiry") + " — from " + name
      })
    })
      .then(function (res) {
        if (!res.ok) throw new Error("send failed");
        return res.json();
      })
      .then(function () {
        status.textContent = "Message sent! I'll get back to you soon. ✅";
        status.className = "form-status ok";
        form.reset();
      })
      .catch(function () {
        status.textContent = "Couldn't send right now — please email me directly at asfundali22@gmail.com.";
        status.className = "form-status err";
      })
      .finally(function () {
        sendBtn.disabled = false;
        sendBtn.textContent = "Send Message";
      });
  });
})();

/* ---------- Floating particles in the hero (lightweight canvas) ---------- */
(function () {
  var canvas = document.getElementById("stars");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // calm mode: no particles
  var ctx = canvas.getContext("2d");
  var W = 0, H = 0, parts = [], running = true, raf = 0;

  function accent() {
    var c = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    return c || "#4d6bff";
  }
  var COLOR = accent();
  // re-read accent when theme toggles
  document.getElementById("themeToggle").addEventListener("click", function () {
    setTimeout(function () { COLOR = accent(); }, 60);
  });

  function resize() {
    var r = canvas.parentElement.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function make(anyY) {
    return {
      x: Math.random() * W,
      y: anyY ? Math.random() * H : H + 8,
      r: Math.random() * 1.9 + 0.5,
      vy: -(Math.random() * 0.32 + 0.1),   // slow upward drift
      vx: (Math.random() - 0.5) * 0.18,    // gentle sideways sway
      o: Math.random() * 0.45 + 0.15,      // base opacity
      ph: Math.random() * Math.PI * 2,     // twinkle phase
      sp: Math.random() * 0.9 + 0.4        // twinkle speed
    };
  }
  function seed() {
    var n = Math.max(28, Math.min(85, Math.floor(W / 16)));
    parts = [];
    for (var i = 0; i < n; i++) parts.push(make(true));
  }
  function frame(t) {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.x += p.vx + Math.sin(t / 2400 + p.ph) * 0.12;
      p.y += p.vy;
      if (p.y < -10 || p.x < -10 || p.x > W + 10) parts[i] = p = make(false);
      var tw = p.o * (0.55 + 0.45 * Math.sin(t / 1000 * p.sp + p.ph));
      ctx.globalAlpha = Math.max(0, Math.min(1, tw));
      ctx.fillStyle = COLOR;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  resize(); seed();
  raf = requestAnimationFrame(frame);
  window.addEventListener("resize", function () { resize(); seed(); });
  document.addEventListener("visibilitychange", function () {
    document.hidden ? stop() : start();
  });
})();

/* ---------- Typewriter rotating roles ---------- */
(function () {
  var el = document.getElementById("typewriter");
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  /* EDIT: rotate words — change this list */
  var words = ["Web Developer", "AI Automation Specialist", "Freelancer", "BSIT Final-Year Student"];
  var wi = 0, ci = words[0].length, del = false;
  function tick() {
    var w = words[wi];
    el.textContent = w.slice(0, ci); /* render FIRST — last character was being skipped */
    if (!del) {
      if (ci >= w.length) { del = true; setTimeout(tick, 1700); return; }
      ci++;
      setTimeout(tick, 72);
    } else {
      if (ci <= 0) { del = false; wi = (wi + 1) % words.length; setTimeout(tick, 380); return; }
      ci--;
      setTimeout(tick, 40);
    }
  }
  setTimeout(tick, 1900);
})();

/* ---------- Staggered directional reveals ---------- */
(function () {
  function stagger(sel, v) {
    var els = document.querySelectorAll(sel);
    for (var i = 0; i < els.length; i++) {
      els[i].style.setProperty("--d", ((i % 6) * 85) + "ms");
      if (v) els[i].setAttribute("data-v", typeof v === "function" ? v(i) : v);
    }
  }
  stagger(".skills-grid .skill-card", "zoom");
  stagger(".projects-grid .project-card", function (i) { return i % 2 ? "right" : "left"; });
  stagger(".services-grid .service-card", "zoom");
  stagger(".testi-grid .testi-card", function (i) { return i % 2 ? "right" : "left"; });
  stagger(".stats .stat", "zoom");
  stagger(".timeline-item", function (i) { return i % 2 ? "right" : "left"; });
  var at = document.querySelector(".about-text");
  if (at) at.setAttribute("data-v", "left");
  var af = document.querySelector(".about-facts");
  if (af) af.setAttribute("data-v", "right");
})();

/* ---------- 3D tilt on cards (desktop) ---------- */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(hover: none)").matches) return;
  var cards = document.querySelectorAll(".project-card, .service-card, .skill-card");
  for (var n = 0; n < cards.length; n++) (function (card) {
    card.classList.add("tilt");
    var raf = 0, rx = 0, ry = 0, tx = 0, ty = 0, lift = 0, liftT = 0;
    function render() {
      rx += (tx - rx) * 0.16; ry += (ty - ry) * 0.16; lift += (liftT - lift) * 0.2;
      card.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(" + lift.toFixed(1) + "px)";
      if (Math.abs(tx - rx) > 0.02 || Math.abs(ty - ry) > 0.02 || Math.abs(liftT - lift) > 0.1) {
        raf = requestAnimationFrame(render);
      } else { raf = 0; }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(render); }
    card.addEventListener("mousemove", function (e) {
      if (!card.dataset.tiltReady) {
        card.dataset.tiltReady = "1";
        card.style.transitionProperty = "opacity, box-shadow, border-color";
      }
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      ty = px * 9; tx = -py * 9; liftT = -6;
      kick();
    });
    card.addEventListener("mouseleave", function () { tx = 0; ty = 0; liftT = 0; kick(); });
  })(cards[n]);
})();

/* ---------- Timeline progress fill on scroll ---------- */
(function () {
  var tls = document.querySelectorAll(".timeline");
  if (!tls.length) return;
  var ticking = false;
  function update() {
    ticking = false;
    for (var i = 0; i < tls.length; i++) {
      var bar = tls[i].querySelector(".tl-progress");
      if (!bar) continue;
      var r = tls[i].getBoundingClientRect();
      var p = (window.innerHeight * 0.62 - r.top) / r.height;
      p = Math.max(0, Math.min(1, p));
      bar.style.height = "calc(" + (p * 100).toFixed(1) + "% - 12px)";
    }
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

/* ---------- Cursor glow follower (desktop) ---------- */
(function () {
  var g = document.getElementById("cursorGlow");
  if (!g) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(hover: none)").matches) return;
  var x = -500, y = -500, tx = x, ty = y, shown = false;
  document.addEventListener("mousemove", function (e) {
    tx = e.clientX; ty = e.clientY;
    if (!shown) { shown = true; g.style.opacity = "1"; }
  });
  document.addEventListener("mouseleave", function () { shown = false; g.style.opacity = "0"; });
  (function follow() {
    x += (tx - x) * 0.085; y += (ty - y) * 0.085;
    g.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) translate(-50%,-50%)";
    requestAnimationFrame(follow);
  })();
})();
