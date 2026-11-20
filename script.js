/* =========================================================
   Paphos Motorcycle Club – site script
   Content comes from:
     Google Sheet  – "Paphos MC - Events" (published as CSV, see EVENTS_SHEET_CSV)
  events.json   – backup list, used only if the sheet can't be loaded
  i18n.js       – English / Greek switch and all Greek translations
     gallery.json  – auto-generated from the gallery/ folder
     library.json  – auto-generated from the library/ folder
   ========================================================= */

// Language helpers from i18n.js (falls back to English if it isn't loaded)
const I18N = window.PMC_I18N || {
  lang: "en", t: (s) => s, field: (ev, k) => ev[k] || "",
  MONTHS: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  MONTHS_LONG: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  DAYS: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};
const t = I18N.t;

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const getJSON = (url) =>
  fetch(url, { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw new Error(`${url}: ${r.status}`);
    return r.json();
  });

/* ---------------- Mobile nav ---------------- */

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", t(open ? "Close menu" : "Open menu"));
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
}

/* ---------------- Events ---------------- */

// Events are edited in the Google Sheet "Paphos MC - Events".
// Columns: title, type, date (YYYY-MM-DD or DD/MM/YYYY), time, location, level, description, link
const EVENTS_SHEET_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQd4rM8sA7bPHL85u0CAlYMe_2lBVRyb4-RPwpfwrBmk8D6nkBEfgklOBMAC_DG1hj-r7I04vNLoF5Z/pub?output=csv";

// Minimal CSV parser (handles quotes, commas and line breaks inside cells)
function parseCSV(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const head = (rows.shift() || []).map((h) => h.trim().toLowerCase());
  return rows
    .filter((r) => r.some((v) => v.trim()))
    .map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])))
    .filter((ev) => ev.title);
}

async function getEvents() {
  try {
    const r = await fetch(EVENTS_SHEET_CSV, { cache: "no-cache" });
    if (!r.ok) throw new Error(`sheet: ${r.status}`);
    return parseCSV(await r.text());
  } catch (err) {
    console.warn("Events sheet unavailable, using events.json", err);
    return getJSON("events.json");
  }
}

const MONTHS = I18N.MONTHS;
const DAYS = I18N.DAYS;

function parseDate(str) {
  const s = String(str || "").trim();
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  m = /^(\d{1,2})[\/.](\d{1,2})[\/.](\d{4})$/.exec(s); // DD/MM/YYYY
  return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null;
}

function eventCard(raw) {
  // Use the Greek columns (title_el, description_el, ...) when the site is in Greek
  const ev = { ...raw };
  ["title", "type", "level", "location", "description"].forEach((k) => (ev[k] = I18N.field(raw, k)));
  const d = parseDate(ev.date);
  const dateBox = d
    ? `<div class="event-date-box"><span class="m">${MONTHS[d.getMonth()]}</span><span class="d">${d.getDate()}</span></div>`
    : `<div class="event-date-box tba"><span class="m">${t("Date")}</span><span class="d">TBA</span></div>`;
  const when = d
    ? `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
    : esc(t(ev.date || "Date to be announced"));

  return `
    <article class="card event-card">
      <div class="event-date">
        ${dateBox}
        <div class="event-when">${when}${ev.time ? `<small>${t("Meet at")} ${esc(ev.time)}</small>` : ""}</div>
      </div>
      <div class="event-body">
        <div class="event-tags">
          ${ev.type ? `<span class="tag tag-accent">${esc(ev.type)}</span>` : ""}
          ${ev.level ? `<span class="tag">${esc(ev.level)}</span>` : ""}
        </div>
        <h3>${esc(ev.title)}</h3>
        ${ev.location ? `<div class="event-loc"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>${esc(ev.location)}</div>` : ""}
        ${ev.description ? `<p class="event-desc">${esc(ev.description)}</p>` : ""}
        <div class="event-actions">
          ${ev.link
            ? `<a class="btn btn-primary" href="${esc(ev.link)}" target="_blank" rel="noopener">${t("Join this ride")}</a>`
            : `<button type="button" class="btn btn-primary js-join" data-title="${esc(ev.title)}" data-when="${esc(when)}">${t("Join this ride")}</button>`}
        </div>
      </div>
    </article>`;
}

async function loadEvents() {
  const el = document.getElementById("events-list");
  if (!el) return;
  try {
    const events = await getEvents();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Hide rides whose date has passed; dated rides first (soonest first), then TBA ones
    const upcoming = (Array.isArray(events) ? events : [])
      .filter((ev) => { const d = parseDate(ev.date); return !d || d >= today; })
      .sort((a, b) => {
        const da = parseDate(a.date), db = parseDate(b.date);
        if (da && db) return da - db;
        return da ? -1 : db ? 1 : 0;
      });

    el.innerHTML = upcoming.length
      ? upcoming.map(eventCard).join("")
      : `<div class="empty-state"><strong>No rides scheduled right now</strong>New dates are posted here and on our socials. Got a ride in mind?<br><a href="#ideas" class="btn btn-primary">Suggest a ride</a></div>`;
  } catch (err) {
    console.error(err);
    el.innerHTML = `<div class="empty-state"><strong>Couldn't load events</strong>Please check our Facebook or Instagram for the latest rides.</div>`;
  }
}

/* ---------------- Event sign-up dialog ---------------- */

function initEventDialog() {
  const dlg = document.getElementById("event-dialog");
  if (!dlg) return;
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-join");
    if (!btn) return;
    const title = btn.dataset.title || "PMC Ride";
    dlg.querySelector("#event-dialog-title").textContent = `${t("Join:")} ${title}`;
    dlg.querySelector("#event-dialog-meta").textContent = btn.dataset.when || "";
    dlg.querySelector("#event-name").value = `${title} (${btn.dataset.when || ""})`;
    const form = dlg.querySelector("form.js-ajax-form");
    form.hidden = false;
    form.querySelector(".form-status").textContent = "";
    dlg.showModal();
  });
  // click outside to close
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
}

/* ---------------- Forms (stay on page, no redirect) ---------------- */

function initForms() {
  document.querySelectorAll(".js-ajax-form").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = form.querySelector(".form-status");
      const btn = form.querySelector('button[type="submit"]');
      const label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending…";
      status.className = "form-status";
      status.textContent = "";
      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.classList.add("ok");
        status.textContent = "Thanks! We got it and will be in touch soon.";
        const dlg = form.closest("dialog");
        if (dlg) setTimeout(() => dlg.open && dlg.close(), 2200);
      } catch (err) {
        console.error(err);
        status.classList.add("err");
        status.textContent = "Something went wrong. Please try again, or message us on Facebook/Instagram.";
      } finally {
        btn.disabled = false;
        btn.textContent = label;
      }
    });
  });
}

/* ---------------- Gallery (albums) + lightbox ---------------- */

let photos = [];   // photos currently browsable in the lightbox
let current = 0;

// Supports the album format {albums:[...]} and older flat lists
function normaliseGallery(data) {
  if (data && Array.isArray(data.albums)) return data.albums;
  const list = (Array.isArray(data) ? data : []).map((p) =>
    typeof p === "string" ? { src: `gallery/${p}`, thumb: `gallery/${p}`, w: 4, h: 3 } : p
  );
  return list.length ? [{ id: "all", title: "Photos", date: "", cover: list[0].thumb, photos: list }] : [];
}

function albumDate(d) {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(d || "");
  if (!m) return "";
  const month = I18N.MONTHS_LONG[+m[2] - 1];
  if (m[3]) return `${+m[3]} ${month} ${m[1]}`;
  // Greek month on its own uses a different ending (Δεκέμβριος, not Δεκεμβρίου)
  const NOM = ["Ιανουάριος","Φεβρουάριος","Μάρτιος","Απρίλιος","Μάιος","Ιούνιος","Ιούλιος","Αύγουστος","Σεπτέμβριος","Οκτώβριος","Νοέμβριος","Δεκέμβριος"];
  return `${I18N.lang === "el" ? NOM[+m[2] - 1] : month} ${m[1]}`;
}

function photoGrid(list) {
  return list
    .map(
      (p, i) => `<button type="button" class="gallery-item" data-i="${i}" aria-label="Open photo ${i + 1}">
        <img src="${esc(p.thumb)}" width="${p.w}" height="${p.h}" alt="${esc(p.alt || "Club ride photo")}" loading="lazy" decoding="async">
      </button>`
    )
    .join("");
}

// Home page: a small strip of the latest photos linking to gallery.html
async function loadGalleryTeaser() {
  const el = document.getElementById("gallery-teaser");
  if (!el) return;
  try {
    const albums = normaliseGallery(await getJSON("gallery.json"));
    const latest = albums.flatMap((a) => a.photos).slice(0, 4);
    el.innerHTML = latest
      .map((p) => `<span class="teaser-item"><img src="${esc(p.thumb)}" alt="" loading="lazy" decoding="async"></span>`)
      .join("");
  } catch (err) {
    console.error(err);
    el.remove();
  }
}

// Gallery page: album list <-> single album (gallery.html#album=<id>)
async function loadGalleryPage() {
  const listEl = document.getElementById("album-list");
  if (!listEl) return;
  const view = document.getElementById("album-view");
  const grid = document.getElementById("album-photos");
  let albums = [];

  try {
    albums = normaliseGallery(await getJSON("gallery.json"));
  } catch (err) {
    console.error(err);
    listEl.innerHTML = `<p class="muted">Couldn't load the gallery right now.</p>`;
    return;
  }
  if (!albums.length) {
    listEl.innerHTML = `<p class="muted">Photos coming soon.</p>`;
    return;
  }

  listEl.innerHTML = albums
    .map(
      (a) => `<a class="album-card" href="#album=${encodeURIComponent(a.id)}">
        <span class="album-cover"><img src="${esc(a.cover)}" alt="" loading="lazy" decoding="async"></span>
        <span class="album-info">
          <strong>${esc(a.title)}</strong>
          <small>${a.photos.length} ${t(a.photos.length === 1 ? "photo" : "photos")}${a.date && a.date.length === 10 ? " · " + albumDate(a.date) : ""}</small>
        </span>
      </a>`
    )
    .join("");

  function route() {
    const id = decodeURIComponent((location.hash.match(/album=([^&]+)/) || [])[1] || "");
    const album = albums.find((a) => a.id === id);
    if (!album) {
      view.hidden = true;
      listEl.hidden = false;
      document.title = t("Gallery | Paphos Motorcycle Club");
      return;
    }
    photos = album.photos;
    document.getElementById("album-title").textContent = album.title;
    document.getElementById("album-meta").textContent =
      `${album.photos.length} ${t(album.photos.length === 1 ? "photo" : "photos")}${album.date && album.date.length === 10 ? " · " + albumDate(album.date) : ""}`;
    grid.innerHTML = photoGrid(album.photos);
    listEl.hidden = true;
    view.hidden = false;
    document.title = `${album.title} | ${t("Gallery")} | Paphos Motorcycle Club`;
    window.scrollTo({ top: 0 });
  }

  grid.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (item) openLightbox(+item.dataset.i);
  });
  document.getElementById("album-back").addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState("", document.title, location.pathname);
    route();
  });
  window.addEventListener("hashchange", route);
  route();
}

function showPhoto(i) {
  current = (i + photos.length) % photos.length;
  const img = document.getElementById("lightbox-img");
  img.src = photos[current].src;
  img.alt = photos[current].alt || "Club ride photo";
}

function openLightbox(i) {
  const lb = document.getElementById("lightbox");
  showPhoto(i);
  lb.showModal();
}

function initLightbox() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.querySelector(".lb-close").addEventListener("click", () => lb.close());
  lb.querySelector(".lb-prev").addEventListener("click", () => showPhoto(current - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => showPhoto(current + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showPhoto(current - 1);
    if (e.key === "ArrowRight") showPhoto(current + 1);
  });
  // swipe on phones
  let x0 = null;
  lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) showPhoto(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

/* ---------------- Library ---------------- */

function fmtSize(b) {
  if (!b && b !== 0) return "";
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

async function loadLibrary() {
  const list = document.getElementById("library-list");
  if (!list) return;
  try {
    const docs = await getJSON("library.json");
    if (!docs.length) {
      list.innerHTML = `<li class="muted">No documents yet.</li>`;
      return;
    }
    list.innerHTML = docs
      .map(
        (d) => `<li><a class="doc" href="${encodeURI(d.file)}" target="_blank" rel="noopener">
          <span class="doc-icon">PDF</span>
          <span class="doc-title">${esc(d.title)}<small>${fmtSize(d.size)}</small></span>
          <svg class="doc-dl" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>
        </a></li>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    list.innerHTML = `<li class="muted">Unable to load documents right now.</li>`;
  }
}

/* ---------------- Init ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  initNav();
  initForms();
  initEventDialog();
  initLightbox();
  loadEvents();
  loadGalleryTeaser();
  loadGalleryPage();
  loadLibrary();
});
