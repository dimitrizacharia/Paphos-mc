/* =========================================================
   Paphos Motorcycle Club – English / Greek switch
   ---------------------------------------------------------
   HOW TO EDIT:
   - Every Greek translation is in the EL list below:
       "English text exactly as on the page": "Greek text",
   - If you change English text in index.html or gallery.html,
     change the matching English text here too (otherwise that
     line simply stays in English on the Greek version).
   - Events: add title_el / description_el / location_el /
     level_el / type_el columns in the Google Sheet. Empty cells
     fall back to the English text.
   ========================================================= */

(function () {
  const EL = {
    // ---- Page titles & meta ----
    "Paphos Motorcycle Club | Enduro, Adventure & Off-Road Rides in Cyprus":
      "Paphos Motorcycle Club | Enduro, Adventure & Off-Road βόλτες στην Κύπρο",
    "Paphos Motorcycle Club – enduro, hard enduro, adventure rides, coaching days and local events in Paphos, Cyprus. Join a ride or become a member.":
      "Paphos Motorcycle Club – enduro, hard enduro, βόλτες περιπέτειας, μέρες εκπαίδευσης και τοπικές εκδηλώσεις στην Πάφο, Κύπρος. Έλα σε μια βόλτα ή γίνε μέλος.",
    "Gallery | Paphos Motorcycle Club": "Φωτογραφίες | Paphos Motorcycle Club",
    "Photo albums from Paphos Motorcycle Club rides, races, coaching days and adventures in Cyprus.":
      "Άλμπουμ φωτογραφιών από βόλτες, αγώνες, μέρες εκπαίδευσης και περιπέτειες του Paphos Motorcycle Club στην Κύπρο.",

    // ---- Header & navigation ----
    "Skip to content": "Μετάβαση στο περιεχόμενο",
    "Paphos Motorcycle Club – home": "Paphos Motorcycle Club – αρχική",
    "Off-Road & Adventure": "Off-Road & Περιπέτεια",
    "Open menu": "Άνοιγμα μενού",
    "Close menu": "Κλείσιμο μενού",
    "Main": "Κύριο μενού",
    "Footer": "Υποσέλιδο",
    "Rides & Events": "Βόλτες",
    "Join": "Εγγραφή",
    "Gallery": "Φωτογραφίες",
    "Library": "Βιβλιοθήκη",
    "Suggest a Ride": "Προτάσεις",
    "Shop ORH31": "Κατάστημα ORH31",

    // ---- Hero ----
    "Paphos · Cyprus": "Πάφος · Κύπρος",
    "Street. Dirt. Adventure.": "Άσφαλτος. Χώμα. Περιπέτεια.",
    "We ride it all.": "Τα καβαλάμε όλα.",
    "Enduro, hard enduro, adventure rides, coaching days and local events, for every level of rider, from first trail to race day.":
      "Enduro, hard enduro, βόλτες περιπέτειας, μέρες εκπαίδευσης και τοπικές εκδηλώσεις, για αναβάτες κάθε επιπέδου, από το πρώτο μονοπάτι μέχρι τη μέρα του αγώνα.",
    "See upcoming rides": "Δες τις επόμενες βόλτες",
    "Join the club": "Γίνε μέλος",

    // ---- What we do ----
    "What we do": "Τι κάνουμε",
    "Technical trails across the Paphos hills, from rocky riverbeds to forest single-track.":
      "Τεχνικά μονοπάτια στους λόφους της Πάφου, από πετρώδεις κοίτες ποταμών μέχρι στενά δασικά μονοπάτια.",
    "Adventure Rides": "Βόλτες Περιπέτειας",
    "Big-bike days from coast to mountains, with coffee and lunch stops along the way.":
      "Μέρες με μεγάλες μοτοσυκλέτες από την ακτή μέχρι τα βουνά, με στάσεις για καφέ και φαγητό στη διαδρομή.",
    "Coaching & Events": "Εκπαίδευση & Εκδηλώσεις",
    "Skill days, friendly races and scrambles. Beginners are welcome.":
      "Μέρες εξάσκησης, φιλικοί αγώνες και scrambles. Οι αρχάριοι είναι ευπρόσδεκτοι.",

    // ---- Events ----
    "Ride with us": "Έλα μαζί μας",
    "Upcoming rides & events": "Επόμενες βόλτες & εκδηλώσεις",
    "Tap": "Πάτα",
    "Join this ride": "Συμμετοχή",
    "and we'll get back to you on WhatsApp with the details.": "και θα σου στείλουμε τις λεπτομέρειες στο WhatsApp.",
    "No rides scheduled right now": "Δεν υπάρχουν προγραμματισμένες βόλτες αυτή τη στιγμή",
    "New dates are posted here and on our socials. Got a ride in mind?":
      "Οι νέες ημερομηνίες ανακοινώνονται εδώ και στα social μας. Έχεις κάποια βόλτα στο μυαλό σου;",
    "Suggest a ride": "Πρότεινε βόλτα",
    "Couldn't load events": "Δεν ήταν δυνατή η φόρτωση των εκδηλώσεων",
    "Please check our Facebook or Instagram for the latest rides.": "Δες το Facebook ή το Instagram μας για τις τελευταίες βόλτες.",
    "Meet at": "Συνάντηση στις",
    "Date": "Ημ/νία",
    "Date to be announced": "Η ημερομηνία θα ανακοινωθεί",
    "More details →": "Περισσότερα →",
    "Join:": "Συμμετοχή:",
    // common event types / levels / locations used in the sheet
    "Coaching": "Εκπαίδευση",
    "Race": "Αγώνας",
    "Hard Enduro Race": "Αγώνας Hard Enduro",
    "Adventure Ride": "Βόλτα Περιπέτειας",
    "Enduro ride": "Βόλτα Enduro",
    "All levels (A/B/C)": "Όλα τα επίπεδα (A/B/C)",
    "Intermediate / Advanced": "Μέσο / Προχωρημένο",
    "Start: Paphos": "Αφετηρία: Πάφος",
    "Let us know when you would like to ride": "Πες μας πότε θες να βγούμε",

    // ---- Membership ----
    "Membership": "Μέλη",
    "Become a member": "Γίνε μέλος",
    "Join our off-road family. Membership supports events, tracks and coaching in Paphos.":
      "Γίνε μέρος της off-road οικογένειάς μας. Η συνδρομή στηρίζει εκδηλώσεις, πίστες και εκπαίδευση στην Πάφο.",
    "Organised off-road rides & events": "Οργανωμένες off-road βόλτες & εκδηλώσεις",
    "Coaching & skill-building days": "Μέρες εκπαίδευσης & βελτίωσης δεξιοτήτων",
    "A local community of riders & friends": "Μια τοπική παρέα αναβατών & φίλων",
    "Prefer to talk first? Message us on": "Θες να μιλήσουμε πρώτα; Στείλε μας μήνυμα στο",
    "or": "ή στο",
    ", or email": ", ή email στο",
    "Membership registration": "Αίτηση εγγραφής μέλους",
    "Full name *": "Ονοματεπώνυμο *",
    "Phone / WhatsApp": "Τηλέφωνο / WhatsApp",
    "Riding level": "Επίπεδο οδήγησης",
    "Beginner": "Αρχάριο",
    "Intermediate": "Μέσο",
    "Advanced": "Προχωρημένο",
    "Pro / Racer": "Pro / Αγωνιζόμενος",
    "Bike(s)": "Μοτοσυκλέτα(ες)",
    "e.g. KTM 300 EXC": "π.χ. KTM 300 EXC",
    "Message": "Μήνυμα",
    "Tell us a bit about you and the riding you like.": "Πες μας λίγα για σένα και το είδος οδήγησης που σου αρέσει.",
    "Send membership request": "Αποστολή αίτησης",

    // ---- Gallery ----
    "From the trail": "Από τα μονοπάτια",
    "Races, training days, adventures and hard enduro from the PMC crew.":
      "Αγώνες, μέρες εκπαίδευσης, περιπέτειες και hard enduro από την παρέα του PMC.",
    "Races, training days, adventures and hard enduro from the PMC crew, newest first.":
      "Αγώνες, μέρες εκπαίδευσης, περιπέτειες και hard enduro από την παρέα του PMC, τα πιο πρόσφατα πρώτα.",
    "Open the gallery →": "Δες τις φωτογραφίες →",
    "Open the gallery": "Δες τις φωτογραφίες",
    "← All albums": "← Όλα τα άλμπουμ",
    "Photos coming soon.": "Οι φωτογραφίες έρχονται σύντομα.",
    "Couldn't load the gallery right now.": "Δεν ήταν δυνατή η φόρτωση των φωτογραφιών.",
    "photo": "φωτογραφία",
    "photos": "φωτογραφίες",
    "Photo viewer": "Προβολή φωτογραφιών",
    "Previous photo": "Προηγούμενη φωτογραφία",
    "Next photo": "Επόμενη φωτογραφία",
    "Club ride photo": "Φωτογραφία από βόλτα του συλλόγου",

    // ---- ORH31 band ----
    "ORH31 shop": "Κατάστημα ORH31",
    "Gear · Parts · Upgrades": "Εξοπλισμός · Ανταλλακτικά · Αναβαθμίσεις",
    "Need parts or gear for your next ride?": "Χρειάζεσαι ανταλλακτικά ή εξοπλισμό για την επόμενη βόλτα;",
    "Visit": "Επισκέψου το",
    "for off-road accessories, protection and performance upgrades, including parts for the Stark Varg EX.":
      "για off-road αξεσουάρ, προστατευτικά και αναβαθμίσεις απόδοσης, μαζί με ανταλλακτικά για το Stark Varg EX.",
    "Visit ORH31.com": "Επισκέψου το ORH31.com",

    // ---- Library ----
    "Club library": "Βιβλιοθήκη συλλόγου",
    "Rules & documents": "Κανονισμοί & έγγραφα",
    "Regulations, statutes and guides for our rides and events.":
      "Κανονισμοί, καταστατικό και οδηγοί για τις βόλτες και τις εκδηλώσεις μας.",
    "Loading documents…": "Φόρτωση εγγράφων…",
    "No documents yet.": "Δεν υπάρχουν έγγραφα ακόμα.",
    "Unable to load documents right now.": "Δεν ήταν δυνατή η φόρτωση των εγγράφων.",

    // ---- Ideas ----
    "Your ideas": "Οι ιδέες σου",
    "Suggest a ride, route or coaching day": "Πρότεινε βόλτα, διαδρομή ή μέρα εκπαίδευσης",
    "Know a great trail? Want a training day on a specific skill? Tell us, and we're always looking for new trails, race formats and social rides.":
      "Ξέρεις ένα ωραίο μονοπάτι; Θες μια μέρα εκπαίδευσης σε κάποια συγκεκριμένη τεχνική; Πες μας, ψάχνουμε πάντα νέα μονοπάτια, μορφές αγώνων και κοινωνικές βόλτες.",
    "Share your idea": "Μοιράσου την ιδέα σου",
    "Name *": "Όνομα *",
    "Idea type": "Τύπος ιδέας",
    "Ride / Trip": "Βόλτα / Εκδρομή",
    "Coaching session": "Εκπαίδευση",
    "Race / Event": "Αγώνας / Εκδήλωση",
    "Other": "Άλλο",
    "Your idea *": "Η ιδέα σου *",
    "Route, level, location, or what you'd like us to organise.": "Διαδρομή, επίπεδο, τοποθεσία ή τι θα ήθελες να οργανώσουμε.",
    "Send idea": "Αποστολή ιδέας",

    // ---- Forms (status messages) ----
    "Sending…": "Αποστολή…",
    "Thanks! We got it and will be in touch soon.": "Ευχαριστούμε! Το λάβαμε και θα επικοινωνήσουμε σύντομα μαζί σου.",
    "Something went wrong. Please try again, or message us on Facebook/Instagram.":
      "Κάτι πήγε στραβά. Δοκίμασε ξανά ή στείλε μας μήνυμα στο Facebook/Instagram.",

    // ---- Join-ride dialog ----
    "Join ride": "Συμμετοχή",
    "Close": "Κλείσιμο",
    "Your name *": "Το όνομά σου *",
    "Phone / WhatsApp *": "Τηλέφωνο / WhatsApp *",
    "Riders in your group *": "Αναβάτες στην παρέα σου *",
    "1 rider": "1 αναβάτης",
    "2 riders": "2 αναβάτες",
    "3 riders": "3 αναβάτες",
    "4 riders": "4 αναβάτες",
    "5 riders": "5 αναβάτες",
    "6+ riders": "6+ αναβάτες",
    "Notes": "Σημειώσεις",
    "Bike type, level, anything we should know": "Τύπος μοτοσυκλέτας, επίπεδο, ό,τι άλλο πρέπει να ξέρουμε",
    "Send": "Αποστολή",

    // ---- Footer ----
    "Off-road · Hard Enduro · Adventure": "Off-road · Hard Enduro · Περιπέτεια",
    "Paphos, Cyprus": "Πάφος, Κύπρος",
    "Shop at ORH31.com ↗": "Κατάστημα ORH31.com ↗",
    "Paphos Motorcycle Club. All rights reserved.": "Paphos Motorcycle Club. Με την επιφύλαξη παντός δικαιώματος.",
  };

  const MONTHS = {
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    el: ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαΐ", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"],
  };
  const MONTHS_LONG = {
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    el: ["Ιανουαρίου", "Φεβρουαρίου", "Μαρτίου", "Απριλίου", "Μαΐου", "Ιουνίου", "Ιουλίου", "Αυγούστου", "Σεπτεμβρίου", "Οκτωβρίου", "Νοεμβρίου", "Δεκεμβρίου"],
  };
  const DAYS = {
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    el: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"],
  };

  // ---- Pick the language: ?lang=el in the URL > saved choice > phone/browser language ----
  let lang = "en";
  try {
    const q = new URLSearchParams(location.search).get("lang");
    const saved = localStorage.getItem("pmc-lang");
    if (q === "el" || q === "en") { lang = q; localStorage.setItem("pmc-lang", q); }
    else if (saved === "el" || saved === "en") lang = saved;
    else if (/^el\b/i.test(navigator.language || "")) lang = "el";
  } catch (e) {
    if (/^el\b/i.test(navigator.language || "")) lang = "el";
  }

  const norm = (s) => String(s).replace(/\s+/g, " ").trim();
  const t = (s) => (lang === "el" && EL[norm(s)]) || s;

  // Pick a Greek column from an event if there is one
  const field = (ev, key) => (lang === "el" && ev[key + "_el"]) || ev[key] || "";

  window.PMC_I18N = { lang, t, field, MONTHS: MONTHS[lang], MONTHS_LONG: MONTHS_LONG[lang], DAYS: DAYS[lang] };

  // ---- Styles for the switch (+ Greek-capable fonts, since Barlow has no Greek letters) ----
  const css = [
    ".lang-switch { display: flex; align-items: center; gap: 0.15rem; padding-left: 0.4rem;",
    "font-family: var(--font-display); font-weight: 700; font-size: 0.95rem; letter-spacing: 0.04em; }",
    ".lang-switch button { background: none; border: 0; color: var(--muted); cursor: pointer;",
    "padding: 0.3rem 0.35rem; font: inherit; border-radius: 6px; }",
    ".lang-switch button:hover { color: var(--text); }",
    '.lang-switch button[aria-pressed="true"] { color: var(--accent); }',
    ".lang-switch span { color: var(--line); }",
    "@media (max-width: 1020px) { .lang-switch { justify-content: center; padding: 1rem 0 0; font-size: 1.1rem; } }",
    'html[lang="el"] { --font-display: "Barlow Condensed", "Roboto Condensed", "Arial Narrow", system-ui, sans-serif;',
    '--font-body: "Barlow", "Roboto", system-ui, -apple-system, "Segoe UI", sans-serif; }',
    'html[lang="el"] .main-nav a { white-space: nowrap; }',
    "html.i18n-pending body { visibility: hidden; }",
  ].join("\n");
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  document.documentElement.lang = lang;

  if (lang === "el") {
    // Greek letters come from Roboto; Latin letters keep using Barlow
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@600;700;800&family=Roboto:wght@400;500;600&display=swap";
    document.head.appendChild(font);
    // Hide the page for a moment so English doesn't flash before the Greek appears
    document.documentElement.classList.add("i18n-pending");
    setTimeout(() => document.documentElement.classList.remove("i18n-pending"), 1500);
  }

  // ---- Translate the page ----
  const ATTRS = ["placeholder", "aria-label", "alt", "title"];

  function translateNode(root) {
    if (lang !== "el" || !root) return;
    if (root.nodeType === 3) {
      const key = norm(root.nodeValue);
      if (key && EL[key]) {
        const lead = root.nodeValue.match(/^\s*/)[0];
        const trail = root.nodeValue.match(/\s*$/)[0];
        root.nodeValue = lead + EL[key] + trail;
      }
      return;
    }
    if (root.nodeType !== 1 || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(root.tagName)) return;
    ATTRS.forEach((a) => {
      if (root.hasAttribute(a)) {
        const v = root.getAttribute(a);
        if (EL[norm(v)]) root.setAttribute(a, EL[norm(v)]);
      }
    });
    root.childNodes.forEach(translateNode);
  }

  function addSwitch() {
    const nav = document.getElementById("main-nav");
    if (!nav || nav.querySelector(".lang-switch")) return;
    const box = document.createElement("div");
    box.className = "lang-switch";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Language / Γλώσσα");
    box.innerHTML =
      '<button type="button" data-lang="en" aria-pressed="' + (lang === "en") + '" lang="en">EN</button>' +
      '<span aria-hidden="true">|</span>' +
      '<button type="button" data-lang="el" aria-pressed="' + (lang === "el") + '" lang="el">ΕΛ</button>';
    box.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-lang]");
      if (!b || b.dataset.lang === lang) return;
      try { localStorage.setItem("pmc-lang", b.dataset.lang); } catch (err) {}
      const url = new URL(location.href);
      url.searchParams.delete("lang");
      location.href = url.toString();
    });
    const social = nav.querySelector(".nav-social");
    nav.insertBefore(box, social || null);
  }

  document.addEventListener("DOMContentLoaded", () => {
    addSwitch();
    if (lang === "el") {
      document.title = t(document.title);
      const md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute("content", t(md.getAttribute("content")));
      translateNode(document.body);
      // Translate content added later (events, forms, gallery)
      new MutationObserver((muts) => {
        muts.forEach((m) => m.addedNodes.forEach(translateNode));
      }).observe(document.body, { childList: true, subtree: true });
    }
    document.documentElement.classList.remove("i18n-pending");
  });
})();
