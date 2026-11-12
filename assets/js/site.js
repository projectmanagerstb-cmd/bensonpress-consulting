(function () {
  "use strict";

  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("primary-nav");

  function setOpen(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("nav-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });
  }

  var params = new URLSearchParams(location.search);
  var thanks = document.getElementById("thanks");
  if (thanks && params.get("sent") === "1") thanks.hidden = false;

  var topic = document.getElementById("topic");
  var subject = document.getElementById("form-subject");
  if (topic) {
    var aliases = {
      "pm consulting": "PMO Setup & Consulting",
      "pm": "PMO Setup & Consulting",
      "pmo setup & consulting": "PMO Setup & Consulting",
      "ai governance": "AI Governance",
      "training & workshops": "Training & Workshops",
      "training": "Training & Workshops",
      "kit customization": "Kit Customization",
      "kit license inquiry": "Kit Customization",
      "other": "Other Inquiry"
    };
    var wanted = params.get("topic");
    if (wanted) {
      var key = wanted.toLowerCase();
      var label = aliases[key] || wanted;
      for (var i = 0; i < topic.options.length; i++) {
        if (topic.options[i].value === label || topic.options[i].text === label) {
          topic.selectedIndex = i;
          break;
        }
      }
    }
    function syncSubject() {
      if (!subject) return;
      subject.value = topic.value
        ? "Benson Press Consulting: " + topic.value
        : "Benson Press Consulting consultation";
    }
    topic.addEventListener("change", syncSubject);
    syncSubject();
  }

  var header = document.getElementById("site-header");
  var headerTicking = false;
  function updateHeader() {
    if (header) header.classList.toggle("is-condensed", window.scrollY > 18);
    headerTicking = false;
  }
  window.addEventListener("scroll", function () {
    if (!headerTicking) {
      headerTicking = true;
      window.requestAnimationFrame(updateHeader);
    }
  }, { passive: true });
  updateHeader();

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealNodes = document.querySelectorAll("main > section:not(.hero):not(.page-hero), .service-card, .featured-kit, .process-grid > article, .values-grid > article");
    revealNodes.forEach(function (el) { el.classList.add("reveal"); });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });
    revealNodes.forEach(function (el) { observer.observe(el); });
  }

  var dialog = document.getElementById("lightbox");
  if (!dialog || typeof dialog.showModal !== "function") return;
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-gallery-item]"));
  if (!items.length) return;
  var img = dialog.querySelector("img");
  var cap = dialog.querySelector("figcaption");
  var count = dialog.querySelector(".lightbox-count");
  var index = 0;
  var lastTrigger = null;

  function show(i) {
    index = (i + items.length) % items.length;
    var item = items[index];
    img.src = item.getAttribute("data-full");
    img.alt = item.getAttribute("data-alt") || "";
    cap.textContent = item.getAttribute("data-caption") || "";
    if (count) count.textContent = (index + 1) + " of " + items.length;
  }

  items.forEach(function (item, i) {
    item.addEventListener("click", function () {
      lastTrigger = item;
      show(i);
      dialog.showModal();
    });
  });
  var closeBtn = dialog.querySelector(".lightbox-close");
  if (closeBtn) closeBtn.addEventListener("click", function () { dialog.close(); });
  var prev = dialog.querySelector("[data-prev]");
  var next = dialog.querySelector("[data-next]");
  if (prev) prev.addEventListener("click", function () { show(index - 1); });
  if (next) next.addEventListener("click", function () { show(index + 1); });
  dialog.addEventListener("close", function () {
    if (lastTrigger) lastTrigger.focus();
  });
})();
