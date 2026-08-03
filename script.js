(function () {
  "use strict";

  var CAMPUSES = {
    kovan: {
      name: "Kovan",
      phone: "+6588064598",
      phoneLabel: "8806 4598",
      wa: "https://wa.me/6588064598?text=Hi%20Camberley%20Pre-School%20(Kovan)!%20I%27d%20like%20to%20book%20a%20centre%20visit%20for%20my%20child."
    },
    loyang: {
      name: "Loyang",
      phone: "+6588541677",
      phoneLabel: "8854 1677",
      wa: "https://wa.me/6588541677?text=Hi%20Camberley%20Pre-School%20(Loyang)!%20I%27d%20like%20to%20book%20a%20centre%20visit%20for%20my%20child."
    }
  };

  var STORAGE_KEY = "camberley_campus";

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

  /* ---------- Campus picker modal ---------- */
  var overlay = document.getElementById("pickerOverlay");
  var pickerClose = document.getElementById("pickerClose");
  var pickerOptions = document.querySelectorAll(".picker-option");
  var pendingHref = null; // if a specific visit-card link was clicked, we could honor it directly

  function openPicker() {
    overlay.classList.add("open");
  }
  function closePicker() {
    overlay.classList.remove("open");
  }
  pickerClose.addEventListener("click", closePicker);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closePicker();
  });

  function setCampus(key) {
    try { localStorage.setItem(STORAGE_KEY, key); } catch (e) {}
    applyCampus(key);
  }

  function getCampus() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function applyCampus(key) {
    var c = CAMPUSES[key];
    var phoneQuick = document.getElementById("phoneQuickLabel");
    var phoneLink = document.getElementById("phoneQuick");
    var floatLabel = document.getElementById("floatCtaLabel");
    if (c) {
      if (phoneQuick) phoneQuick.textContent = "Call " + c.name;
      if (phoneLink) phoneLink.setAttribute("href", "tel:" + c.phone);
      if (floatLabel) floatLabel.textContent = "WhatsApp " + c.name;
    }
  }

  pickerOptions.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-campus");
      setCampus(key);
      closePicker();
      window.open(CAMPUSES[key].wa, "_blank", "noopener");
    });
  });

  /* Any element with data-open-visit: if campus already chosen, go straight to WhatsApp; else open picker */
  document.querySelectorAll("[data-open-visit]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var key = getCampus();
      if (key && CAMPUSES[key]) {
        window.open(CAMPUSES[key].wa, "_blank", "noopener");
      } else {
        openPicker();
      }
    });
  });

  /* Floating CTA: direct to remembered campus, else open picker */
  var floatCta = document.getElementById("floatCta");
  floatCta.addEventListener("click", function () {
    var key = getCampus();
    if (key && CAMPUSES[key]) {
      window.open(CAMPUSES[key].wa, "_blank", "noopener");
    } else {
      openPicker();
    }
  });

  /* Phone quick link: default to Kovan until a campus is chosen */
  (function initPhoneAndFloat() {
    var key = getCampus();
    applyCampus(key || "kovan");
    if (!document.getElementById("phoneQuick").getAttribute("href") || document.getElementById("phoneQuick").getAttribute("href") === "#") {
      document.getElementById("phoneQuick").setAttribute("href", "tel:" + CAMPUSES.kovan.phone);
    }
  })();

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
