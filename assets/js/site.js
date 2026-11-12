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
      "pmo": "PMO Setup & Consulting",
      "pmo setup & consulting": "PMO Setup & Consulting",
      "ai governance": "AI Governance",
      "ai-governance": "AI Governance",
      "training & workshops": "Training & Workshops",
      "training": "Training & Workshops",
      "licensing": "Licensing",
      "kit license inquiry": "Licensing",
      "kits": "Kit information",
      "kit customization": "Kit information",
      "consulting": "Consulting",
      "other": "Other Inquiry",
      "other inquiry": "Other Inquiry",
      "pmo setup kit": "PMO Setup & Consulting"
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
  var scale = 1;
  var panX = 0;
  var panY = 0;
  var MIN_ZOOM = 1;
  var MAX_ZOOM = 4;
  var pointers = {};
  var drag = null;
  var pinch = null;
  var lastTap = 0;

  var viewport = document.createElement("div");
  viewport.className = "lightbox-viewport";
  viewport.tabIndex = 0;
  img.parentNode.insertBefore(viewport, img);
  viewport.appendChild(img);

  var zoomBar = document.createElement("div");
  zoomBar.className = "lightbox-zoom";
  zoomBar.setAttribute("role", "group");
  zoomBar.setAttribute("aria-label", "Zoom");
  zoomBar.innerHTML =
    '<button type="button" class="btn" data-zoom="out" aria-label="Zoom out">−</button>' +
    '<button type="button" class="btn" data-zoom="reset" aria-label="Reset zoom to 100%">100%</button>' +
    '<button type="button" class="btn" data-zoom="in" aria-label="Zoom in">+</button>';
  var bar = dialog.querySelector(".lightbox-bar");
  if (bar) bar.appendChild(zoomBar);

  var status = document.createElement("p");
  status.className = "visually-hidden";
  status.setAttribute("aria-live", "polite");
  dialog.appendChild(status);

  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

  function clampPan() {
    var rect = viewport.getBoundingClientRect();
    var iw = img.offsetWidth * scale;
    var ih = img.offsetHeight * scale;
    panX = clamp(panX, Math.min(0, rect.width - iw), 0);
    panY = clamp(panY, Math.min(0, rect.height - ih), 0);
  }

  function applyZoom() {
    img.style.transform = "translate(" + panX + "px, " + panY + "px) scale(" + scale + ")";
    viewport.classList.toggle("is-zoomed", scale > 1.001);
    var zoomIn = zoomBar.querySelector('[data-zoom="in"]');
    var zoomOut = zoomBar.querySelector('[data-zoom="out"]');
    if (zoomIn) zoomIn.disabled = scale >= MAX_ZOOM - 0.001;
    if (zoomOut) zoomOut.disabled = scale <= MIN_ZOOM + 0.001;
    status.textContent = "Zoom " + Math.round(scale * 100) + " percent";
  }

  function setZoom(next, px, py) {
    next = clamp(next, MIN_ZOOM, MAX_ZOOM);
    var rect = viewport.getBoundingClientRect();
    if (px == null) { px = rect.width / 2; py = rect.height / 2; }
    var ratio = scale === 0 ? 1 : next / scale;
    panX = px - (px - panX) * ratio;
    panY = py - (py - panY) * ratio;
    scale = next;
    if (scale <= MIN_ZOOM + 0.001) { scale = MIN_ZOOM; panX = 0; panY = 0; }
    clampPan();
    applyZoom();
  }

  function resetZoom() { setZoom(1, 0, 0); }

  function show(i) {
    resetZoom();
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
      viewport.focus();
    });
  });
  var closeBtn = dialog.querySelector(".lightbox-close");
  if (closeBtn) closeBtn.addEventListener("click", function () { dialog.close(); });
  var prev = dialog.querySelector("[data-prev]");
  var next = dialog.querySelector("[data-next]");
  if (prev) prev.addEventListener("click", function () { show(index - 1); });
  if (next) next.addEventListener("click", function () { show(index + 1); });
  dialog.addEventListener("close", function () {
    resetZoom();
    if (lastTrigger) lastTrigger.focus();
  });

  zoomBar.addEventListener("click", function (event) {
    var button = event.target.closest("[data-zoom]");
    if (!button) return;
    var action = button.getAttribute("data-zoom");
    if (action === "in") setZoom(scale + 0.5);
    else if (action === "out") setZoom(scale - 0.5);
    else resetZoom();
  });

  viewport.addEventListener("wheel", function (event) {
    event.preventDefault();
    var rect = viewport.getBoundingClientRect();
    var step = event.deltaY < 0 ? 0.25 : -0.25;
    setZoom(scale + step, event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });

  viewport.addEventListener("dblclick", function (event) {
    event.preventDefault();
    var rect = viewport.getBoundingClientRect();
    if (scale > 1.05) resetZoom();
    else setZoom(2, event.clientX - rect.left, event.clientY - rect.top);
  });

  viewport.addEventListener("pointerdown", function (event) {
    if (event.target.closest("button")) return;
    pointers[event.pointerId] = { x: event.clientX, y: event.clientY };
    viewport.setPointerCapture(event.pointerId);
    var ids = Object.keys(pointers);
    if (ids.length >= 2) {
      drag = null;
      var a = pointers[ids[0]];
      var b = pointers[ids[1]];
      pinch = {
        dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        scale: scale
      };
      return;
    }
    if (scale > 1) {
      drag = { x: event.clientX, y: event.clientY, moved: false };
      viewport.classList.add("is-dragging");
    }
  });

  viewport.addEventListener("pointermove", function (event) {
    if (!pointers[event.pointerId]) return;
    pointers[event.pointerId] = { x: event.clientX, y: event.clientY };
    var ids = Object.keys(pointers);
    if (ids.length >= 2 && pinch) {
      var a = pointers[ids[0]];
      var b = pointers[ids[1]];
      var dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      var rect = viewport.getBoundingClientRect();
      setZoom(pinch.scale * (dist / pinch.dist), (a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top);
      return;
    }
    if (!drag) return;
    var dx = event.clientX - drag.x;
    var dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > 3) drag.moved = true;
    panX += dx;
    panY += dy;
    drag.x = event.clientX;
    drag.y = event.clientY;
    clampPan();
    applyZoom();
  });

  function endPointer(event) {
    var wasDrag = drag && drag.moved;
    delete pointers[event.pointerId];
    if (Object.keys(pointers).length < 2) pinch = null;
    if (Object.keys(pointers).length === 0) {
      drag = null;
      viewport.classList.remove("is-dragging");
    }
    if (event.pointerType !== "mouse" && !wasDrag) {
      var now = Date.now();
      if (now - lastTap < 300) {
        var rect = viewport.getBoundingClientRect();
        if (scale > 1.05) resetZoom();
        else setZoom(2, event.clientX - rect.left, event.clientY - rect.top);
        lastTap = 0;
      } else {
        lastTap = now;
      }
    }
  }
  viewport.addEventListener("pointerup", endPointer);
  viewport.addEventListener("pointercancel", endPointer);

  dialog.addEventListener("keydown", function (event) {
    var key = event.key;
    if (key === "+" || key === "=") { event.preventDefault(); setZoom(scale + 0.5); }
    else if (key === "-" || key === "_") { event.preventDefault(); setZoom(scale - 0.5); }
    else if (key === "0") { event.preventDefault(); resetZoom(); }
    else if (scale > 1 && (key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown")) {
      event.preventDefault();
      if (key === "ArrowLeft") panX += 40;
      if (key === "ArrowRight") panX -= 40;
      if (key === "ArrowUp") panY += 40;
      if (key === "ArrowDown") panY -= 40;
      clampPan();
      applyZoom();
    }
  });

  applyZoom();
})();
