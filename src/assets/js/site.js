// Balm site behaviour. Small, no libraries, and the site still works without it.
(function () {
  "use strict";

  // Mobile menu
  var menu = document.getElementById("mobile-menu");
  var openBtn = document.querySelector("[data-menu-open]");
  var closeBtn = document.querySelector("[data-menu-close]");
  function setMenu(open) {
    if (!menu) return;
    menu.setAttribute("data-open", open ? "true" : "false");
    if (openBtn) openBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
    if (open && closeBtn) closeBtn.focus();
    if (!open && openBtn) openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener("click", function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener("click", function () { setMenu(false); });
  if (menu) menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });

  // Desktop Services dropdown: close on outside click or Escape
  var dropdown = document.querySelector(".nav .dropdown");
  document.addEventListener("click", function (e) {
    if (dropdown && dropdown.open && !dropdown.contains(e.target)) dropdown.open = false;
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (dropdown && dropdown.open) { dropdown.open = false; dropdown.querySelector("summary").focus(); }
    if (menu && menu.getAttribute("data-open") === "true") setMenu(false);
  });

  // Pressed-button groups: support finder and team filter
  document.querySelectorAll("[data-pick-group]").forEach(function (group) {
    var buttons = group.querySelectorAll("[data-pick]");
    var targetSel = group.getAttribute("data-pick-group");
    var targets = document.querySelectorAll(targetSel);
    function show(value) {
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-pick") === value ? "true" : "false"); });
      var shown = 0;
      targets.forEach(function (t) {
        var keys = (t.getAttribute("data-keys") || "").split(" ");
        var on = value === "all" || keys.indexOf(value) !== -1;
        t.hidden = !on;
        if (on) shown++;
      });
      var empty = document.querySelector(group.getAttribute("data-empty") || "#none");
      if (empty) empty.hidden = shown !== 0;
      var wa = document.querySelector(group.getAttribute("data-wa-target") || "#none");
      var pressed = group.querySelector('[data-pick="' + value + '"]');
      if (wa && pressed && pressed.getAttribute("data-wa")) wa.href = pressed.getAttribute("data-wa");
    }
    buttons.forEach(function (b) { b.addEventListener("click", function () { show(b.getAttribute("data-pick")); }); });
    var start = group.querySelector('[aria-pressed="true"]');
    if (start) show(start.getAttribute("data-pick"));
  });

  // Tabs (contact forms)
  document.querySelectorAll("[role=tablist]").forEach(function (list) {
    var tabs = list.querySelectorAll("[role=tab]");
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          var next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
          select(next); next.focus();
        }
      });
    });
    if (location.hash === "#organisations") { var org = list.querySelector('[aria-controls="panel-org"]'); if (org) select(org); }
  });


  // Hide upcoming events whose date has passed, in case the site hasn't been rebuilt since.
  var today = new Date(); today.setHours(0, 0, 0, 0);
  document.querySelectorAll(".event[data-ends]").forEach(function (ev) {
    var end = new Date(ev.getAttribute("data-ends") + "T23:59:59");
    if (end < today) ev.hidden = true;
  });

  // Forms: send to Web3Forms and show a friendly message without leaving the page
  document.querySelectorAll("form[data-web3forms]").forEach(function (form) {
    var status = form.querySelector(".status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("[type=submit]");
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = "Sending…";
      fetch("https://api.web3forms.com/submit", { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            form.reset();
            status.setAttribute("data-state", "ok");
            status.textContent = form.getAttribute("data-ok") || "Thank you. We've received your message and will be in touch soon.";
          } else { throw new Error(); }
        })
        .catch(function () {
          status.setAttribute("data-state", "error");
          status.textContent = "Sorry, that didn't send. Please message us on WhatsApp or call +234 814 019 6264.";
        })
        .finally(function () { btn.disabled = false; btn.textContent = label; status.focus(); });
    });
  });
})();
