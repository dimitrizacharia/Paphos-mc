// Auto-set current year in footer + run events & gallery
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  loadEvents();
  loadGallery();
});

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

      events.forEach((event) => {
        const card = document.createElement("article");
        card.className = "event-card";

        card.innerHTML = `
          <div class="event-badge">
            <span></span>
            <strong>${event.type || "Event"}</strong>
          </div>
          <h3 class="event-title">${event.title}</h3>
          <div class="event-meta">
            ${event.date ? `<span>📅 ${event.date}</span>` : ""}
            ${event.time ? `<span>⏱ ${event.time}</span>` : ""}
            ${event.location ? `<span>📍 ${event.location}</span>` : ""}
          </div>
          ${event.level ? `<div class="event-level">${event.level}</div>` : ""}
          ${event.description ? `<p class="event-description">${event.description}</p>` : ""}
          ${
            event.link
              ? `<a class="event-cta" href="${event.link}" target="_blank" rel="noopener">More details / Registration →</a>`
              : ""
          }
        `;

        container.appendChild(card);
      });
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
