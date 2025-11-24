// ---------- GITHUB CONFIG FOR LIBRARY ----------
const GITHUB_OWNER = "dimitrizacharia"; // e.g. "paphosmc"
const GITHUB_REPO  = "Paphos-mc";       // e.g. "paphosmc.github.io"
const GITHUB_BRANCH = "main";                // or "master" if your repo uses that
const LIBRARY_FOLDER = "library";
// Auto-set current year in footer + run events & gallery
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  loadEvents();
  loadGallery();
  loadLibrary();   
});
});
// ---------- LIBRARY (PDF) LOADER ----------

async function loadLibrary() {
  const grid = document.getElementById("library-grid");
  const statusEl = document.getElementById("library-status");

  if (!grid) return; // no library section on this page

  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${LIBRARY_FOLDER}?ref=${GITHUB_BRANCH}`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const files = await res.json();

    // Filter PDFs only
    const pdfFiles = files.filter(
      (file) =>
        file.type === "file" &&
        file.name.toLowerCase().endsWith(".pdf")
    );

    if (pdfFiles.length === 0) {
      statusEl.textContent = "No documents available yet. Check back soon!";
      return;
    }

    statusEl.textContent = ""; // clear "Loading..." text

    grid.innerHTML = pdfFiles
      .map((file) => {
        const title = prettifyFileName(file.name);
        const size = formatFileSize(file.size);

        return `
          <article class="library-card">
            <div class="library-card-icon">📄</div>
            <h3 class="library-card-title">${title}</h3>
            <p class="library-card-meta">${size}</p>
            <a href="${file.download_url}" target="_blank" class="btn library-btn">
              Download
            </a>
          </article>
        `;
      })
      .join("");
  } catch (err) {
    console.error(err);
    if (statusEl) {
      statusEl.textContent =
        "Unable to load documents right now. Please try again later.";
    }
  }
}

function prettifyFileName(fileName) {
  // remove extension
  const nameWithoutExt = fileName.replace(/\.pdf$/i, "");
  // replace _ and - with spaces, capitalize words
  return nameWithoutExt
    .split(/[_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}
// ---------------- GALLERY ----------------

function loadGallery() {
  const galleryFolder = "gallery/";
  const galleryEl = document.getElementById("auto-gallery");
  if (!galleryEl) return;

  fetch("gallery.json")
    .then((res) => res.json())
    .then((images) => {
      if (!Array.isArray(images) || images.length === 0) {
        galleryEl.innerHTML = `
          <p style="color:#a6a7b5; font-size:0.9rem;">
            No photos in the gallery yet. Add images to the <code>gallery</code> folder.
          </p>`;
        return;
      }

      images.forEach((filename) => {
        const figure = document.createElement("figure");
        figure.className = "gallery-item";

        figure.innerHTML = `
          <img src="${galleryFolder}${filename}" alt="${filename}">
          <figcaption>${filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")}</figcaption>
        `;

        galleryEl.appendChild(figure);
      });
    })
    .catch((err) => {
      console.error("Error loading gallery:", err);
      galleryEl.innerHTML = `
        <p style="color:#a6a7b5; font-size:0.9rem;">
          Could not load gallery (check <code>gallery.json</code> in the repo).
        </p>`;
    });
}

// ---------------- EVENTS ----------------

function loadEvents() {
  fetch("events.json")
    .then((res) => res.json())
    .then((events) => {
      const container = document.getElementById("events-list");
      if (!container) return;

      container.innerHTML = "";

      if (!Array.isArray(events) || events.length === 0) {
        container.innerHTML = `
          <p style="color:#a6a7b5; font-size:0.9rem;">
            No upcoming events added yet. Check back soon!
          </p>`;
        return;
      }

      events.forEach((ev) => {
        const card = document.createElement("article");
        card.className = "event-card";

        card.innerHTML = `
          <div class="event-badge">
            <span></span>
            <strong>${ev.type || "Event"}</strong>
          </div>
          <h3 class="event-title">${ev.title}</h3>
          <div class="event-meta">
            ${ev.date ? `<span>📅 ${ev.date}</span>` : ""}
            ${ev.time ? `<span>⏱ ${ev.time}</span>` : ""}
            ${ev.location ? `<span>📍 ${ev.location}</span>` : ""}
          </div>
          ${ev.level ? `<div class="event-level">${ev.level}</div>` : ""}
          ${ev.description ? `<p class="event-description">${ev.description}</p>` : ""}
          ${
            ev.link
              ? `<a class="event-cta" href="${ev.link}" target="_blank" rel="noopener">More details →</a>`
              : ""
          }
          <button class="event-cta join-event-btn" data-event-title="${ev.title}">
            Join this ride
          </button>
        `;

        container.appendChild(card);
      });

      // After events are rendered, attach click handlers
      attachEventJoinHandlers();
    })
    .catch((err) => {
      console.error("Error loading events:", err);
      const container = document.getElementById("events-list");
      if (container) {
        container.innerHTML = `
          <p style="color:#a6a7b5; font-size:0.9rem;">
            Could not load events (check <code>events.json</code> in the repo).
          </p>`;
      }
    });
}
// ---------- EVENT SIGNUP MODAL ----------

const eventModal      = document.getElementById("event-modal");
const eventModalClose = document.getElementById("event-modal-close");
const eventNameInput  = document.getElementById("event-name");
const eventModalTitle = document.getElementById("event-modal-title");

function openEventModal(eventTitle) {
  if (!eventModal) return;
  eventModal.classList.remove("hidden");
  if (eventNameInput) eventNameInput.value = eventTitle;
  if (eventModalTitle) eventModalTitle.textContent = `Join: ${eventTitle}`;
}

function closeEventModal() {
  if (!eventModal) return;
  eventModal.classList.add("hidden");
}

// Called after events are rendered
function attachEventJoinHandlers() {
  const buttons = document.querySelectorAll(".join-event-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-event-title") || "PMC Ride";
      openEventModal(title);
    });
  });
}

// Close icon
if (eventModalClose) {
  eventModalClose.addEventListener("click", closeEventModal);
}

// Click on dark backdrop to close
if (eventModal) {
  eventModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      closeEventModal();
    }
  });
}
