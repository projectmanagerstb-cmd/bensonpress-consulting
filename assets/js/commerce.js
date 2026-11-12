(function () {
  "use strict";

  var CHECKOUT_URL = "https://bensonpress-checkout.bensonpress.workers.dev/checkout";
  var SKUS = {
    pmo: {
      individual: "pmo-individual",
      team: "pmo-team",
      enterprise: "pmo-enterprise"
    },
    ai: {
      individual: "aig-individual",
      team: "aig-team",
      enterprise: "aig-enterprise"
    },
    raci: {
      individual: "raci-individual",
      team: "raci-team",
      enterprise: "raci-enterprise"
    }
  };

  function show(form, message, isError) {
    var el = form.querySelector(".form-feedback");
    if (!el) return;
    el.hidden = false;
    el.textContent = message;
    el.classList.toggle("is-error", !!isError);
  }

  function post(form, payload) {
    var button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    show(form, "Connecting to Square…", false);
    fetch(CHECKOUT_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(function (body) {
          return { ok: res.ok, body: body };
        });
      })
      .then(function (result) {
        if (!result.ok || !result.body || !result.body.url) {
          show(form, (result.body && result.body.error) || "Could not start checkout. Please try again.", true);
          if (button) button.disabled = false;
          return;
        }
        window.location.href = result.body.url;
      })
      .catch(function () {
        show(form, "Could not reach checkout. Check your connection and try again.", true);
        if (button) button.disabled = false;
      });
  }

  function amountCents(form) {
    var input = form.querySelector('[name="amount"]');
    var amount = parseFloat(input && input.value, 10);
    if (!isFinite(amount) || amount < 1 || amount > 25000) return null;
    var cents = Math.round(amount * 100);
    if (cents < 100 || cents > 2500000) return null;
    return cents;
  }

  document.querySelectorAll("form[data-checkout]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var kind = form.getAttribute("data-checkout");
      if (kind === "kit") {
        var product = form.getAttribute("data-product");
        var selected = form.querySelector('input[name="license"]:checked');
        var license = selected ? selected.value : "individual";
        var sku = SKUS[product] && SKUS[product][license];
        if (!sku) {
          show(form, "Choose a license to continue.", true);
          return;
        }
        post(form, { items: [{ sku: sku, qty: 1 }] });
        return;
      }
      var cents = amountCents(form);
      if (cents === null) {
        show(form, "Enter an amount between $1 and $25,000.", true);
        return;
      }
      var noteInput = form.querySelector('[name="note"]');
      var note = noteInput ? String(noteInput.value || "").trim() : "";
      if (kind === "invoice" && note.length < 2) {
        show(form, "Enter the invoice number or a short reference.", true);
        return;
      }
      var skuName = kind === "custom" ? "pay-any-amount" : "invoice-payment";
      post(form, { items: [{ sku: skuName, qty: 1 }], amount_cents: cents, note: note });
    });
  });
})();
