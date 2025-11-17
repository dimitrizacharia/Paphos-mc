
// Auto-set current year in footer
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  loadEvents();
});

function loadGallery() {
  const galleryFolder = "gallery/";
  const galleryEl = document.getElementById("auto-gallery");

  const images = [
    // Just list your images here – OR auto-generate later
    "hero.jpg",
    "ride1.jpg",
    "ride2.jpg",
    // Add more here…
  ];

  images.forEach(filename => {
    const figure = document.createElement("figure");
    figure.className = "gallery-item";

    figure.innerHTML = `
      <img src="${galleryFolder}${filename}" alt="${filename}">
      <figcaption>${filename.replace(/\.[^/.]+$/, "")}</figcaption>
    `;

    galleryEl.appendChild(figure);
  });
}

// Run both on load
document.addEventListener("DOMContentLoaded", () => {
  loadEvents();
  loadGallery();
});
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
          ${
            event.level
              ? `<div class="event-level">${event.level}</div>`
              : ""
          }
          ${
            event.description
              ? `<p class="event-description">${event.description}</p>`
              : ""
          }
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
