(function () {
  "use strict";

  var LOYANG_WA = "https://wa.me/6588541677?text=Hi%20Camberley%20Pre-School!%20I%27d%20like%20to%20book%20a%20centre%20visit%20for%20my%20child.";

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("siteHeader");
  var lastY = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 8);
    lastY = y;
  }, { passive: true });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  var scrim = document.createElement("div");
  scrim.className = "nav-scrim";
  document.body.appendChild(scrim);

  function closeNav() {
    mainNav.classList.remove("open");
    scrim.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  function toggleNav() {
    var open = mainNav.classList.toggle("open");
    scrim.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }
  if (navToggle) navToggle.addEventListener("click", toggleNav);
  scrim.addEventListener("click", closeNav);
  mainNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });

  /* ---------- Book a visit CTAs: straight to WhatsApp ---------- */
  document.querySelectorAll("[data-open-visit]").forEach(function (el) {
    el.addEventListener("click", function () {
      window.open(LOYANG_WA, "_blank", "noopener");
    });
  });

  var floatCta = document.getElementById("floatCta");
  if (floatCta) {
    floatCta.addEventListener("click", function () {
      window.open(LOYANG_WA, "_blank", "noopener");
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      var answer = btn.nextElementSibling;
      // close others
      document.querySelectorAll(".faq-q").forEach(function (other) {
        if (other !== btn) {
          other.setAttribute("aria-expanded", "false");
          other.nextElementSibling.style.maxHeight = null;
        }
      });
      btn.setAttribute("aria-expanded", String(!expanded));
      answer.style.maxHeight = expanded ? null : answer.scrollHeight + "px";
    });
  });

  /* ---------- Testimonial slider ---------- */
  var track = document.getElementById("testimonialTrack");
  var dotsWrap = document.getElementById("testimonialDots");
  if (track) {
    var slides = Array.prototype.slice.call(track.children);
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      if (i === 0) dot.className = "active";
      dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(i) {
      track.scrollTo({ left: track.clientWidth * i, behavior: "smooth" });
    }
    function updateActive() {
      var i = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach(function (d, idx) { d.classList.toggle("active", idx === i); });
    }
    track.addEventListener("scroll", function () {
      window.requestAnimationFrame(updateActive);
    }, { passive: true });

    var autoplay = setInterval(function () {
      var i = Math.round(track.scrollLeft / track.clientWidth);
      var next = (i + 1) % slides.length;
      goTo(next);
    }, 6000);
    track.addEventListener("pointerdown", function () { clearInterval(autoplay); });
  }

  /* ---------- Ratio visualizer: build dots + reveal on scroll ---------- */
  document.querySelectorAll(".ratio-row").forEach(function (row) {
    var ecdaN = parseInt(row.getAttribute("data-ecda"), 10);
    var camN = parseInt(row.getAttribute("data-camberley"), 10);
    var ecdaRow = row.querySelector(".dot-row-ecda");
    var camRow = row.querySelector(".dot-row-camberley");
    for (var i = 0; i < ecdaN; i++) {
      var p = document.createElement("span");
      p.className = "pip";
      p.style.transitionDelay = (i * 18) + "ms";
      ecdaRow.appendChild(p);
    }
    for (var j = 0; j < camN; j++) {
      var p2 = document.createElement("span");
      p2.className = "pip";
      p2.style.transitionDelay = (j * 18) + "ms";
      camRow.appendChild(p2);
    }
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    document.querySelectorAll(".ratio-row").forEach(function (row) { io.observe(row); });
  } else {
    document.querySelectorAll(".ratio-row").forEach(function (row) { row.classList.add("in-view"); });
  }
})();
