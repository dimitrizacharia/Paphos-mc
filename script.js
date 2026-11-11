/* =========================================================
   Paphos Motorcycle Club – site script
   Content comes from:
     events.json   – edit this to add/remove rides
     gallery.json  – auto-generated from the gallery/ folder
     library.json  – auto-generated from the library/ folder
   ========================================================= */

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
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
}

/* ---------------- Events ---------------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parseDate(str) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(str || "").trim());
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}

function eventCard(ev) {
  const d = parseDate(ev.date);
  const dateBox = d
    ? `<div class="event-date-box"><span class="m">${MONTHS[d.getMonth()]}</span><span class="d">${d.getDate()}</span></div>`
    : `<div class="event-date-box tba"><span class="m">Date</span><span class="d">TBA</span></div>`;
  const when = d
    ? `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
    : esc(ev.date || "Date to be announced");

  return `
    <article class="card event-card">
      <div class="event-date">
        ${dateBox}
        <div class="event-when">${when}${ev.time ? `<small>Meet at ${esc(ev.time)}</small>` : ""}</div>
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
          <button type="button" class="btn btn-primary js-join" data-title="${esc(ev.title)}" data-when="${esc(when)}">Join this ride</button>
          ${ev.link ? `<a class="event-more" href="${esc(ev.link)}" target="_blank" rel="noopener">More details →</a>` : ""}
        </div>
      </div>
    </article>`;
}

async function loadEvents() {
  const el = document.getElementById("events-list");
  if (!el) return;
  try {
    const events = await getJSON("events.json");
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
    dlg.querySelector("#event-dialog-title").textContent = `Join: ${title}`;
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
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"][+m[2] - 1];
  return m[3] ? `${+m[3]} ${month} ${m[1]}` : `${month} ${m[1]}`;
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
          <small>${a.photos.length} photo${a.photos.length === 1 ? "" : "s"}${a.date && a.date.length === 10 ? " · " + albumDate(a.date) : ""}</small>
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
      document.title = "Gallery | Paphos Motorcycle Club";
      return;
    }
    photos = album.photos;
    document.getElementById("album-title").textContent = album.title;
    document.getElementById("album-meta").textContent =
      `${album.photos.length} photo${album.photos.length === 1 ? "" : "s"}${album.date && album.date.length === 10 ? " · " + albumDate(album.date) : ""}`;
    grid.innerHTML = photoGrid(album.photos);
    listEl.hidden = true;
    view.hidden = false;
    document.title = `${album.title} | Gallery | Paphos Motorcycle Club`;
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
