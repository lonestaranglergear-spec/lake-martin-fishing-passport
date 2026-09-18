
/* =============================================================================
   LAKE MARTIN FISHING PASSPORT — script.js
   Static, no build step. Works as-is on GitHub Pages.
   =============================================================================
   FILE MAP (search these headings to jump around):
     1. PURCHASE_URL           — replace with your real checkout link
     2. lakeInfo               — general, public orientation copy
     3. passportData           — Fishing Passport fields + sample entry
     4. calendarData           — 12-month calendar (1 unlocked, 11 locked)
     5. fishingSpots           — premium map pins (add verified coordinates here)
     6. speciesData            — general species notes
     7. tripPlannerData        — trip-planning checklist
     8. Rendering + unlock logic
     9. Interactive map (Leaflet)
     10. Sticky CTA / floating button / misc UI wiring
   ============================================================================= */


/* =============================================================================
   1. PURCHASE_URL
   =============================================================================
   Every "$17" button and locked-content CTA on the page links here.
   Replace this one value with your real Stripe / PayPal / Gumroad / other
   checkout link and every CTA on the site updates automatically.
   ========================================================================= */
const PURCHASE_URL = "https://your-payment-link.example.com"; // TODO: replace with your real checkout URL


/* =============================================================================
   2. lakeInfo — general, public orientation (free preview item A)
   ========================================================================= */
const lakeInfo = {
  name: "Lake Martin",
  parish: "St. Martin Parish, Louisiana",
  center: { lat: 30.23673, lng: -91.75390 },
  orientation:
    "Lake Martin is in St. Martin Parish, Louisiana, in the Atchafalaya Basin " +
    "region near the Cypress Island Preserve — an area generally known for " +
    "bald cypress trees, backwater sloughs and wading-bird rookeries. This is " +
    "general public orientation, not fishing intel."
};


/* =============================================================================
   3. passportData — Fishing Passport
   =============================================================================
   `fields` is the full list of what a passport entry can capture.
   `sampleEntry` is the ONE example shown for free — clearly labeled as an
   example, not a real trip report or a claim about Lake Martin fishing.
   ========================================================================= */
const passportData = {
  fields: [
    "Trip Date",
    "Target Species",
    "Fishing Method",
    "Boat / Kayak / Bank",
    "Weather Notes",
    "Water Conditions",
    "Bait / Lure",
    "Catch Notes",
    "Personal Fishing Notes",
    "Favorite Area",
    "Photo / Memory Placeholder"
  ],
  sampleEntry: {
    label: "Sample Entry — Example Only",
    "Trip Date": "Example: a spring morning trip",
    "Target Species": "Example: Bass",
    "Fishing Method": "Example: Casting near cover",
    "Boat / Kayak / Bank": "Example: Kayak",
    "Weather Notes": "Example: Overcast, light wind",
    "Water Conditions": "Example: Slightly stained",
    "Bait / Lure": "Example: Soft plastic worm",
    "Catch Notes": "Example: A few short strikes, no solid hookups",
    "Personal Fishing Notes": "Example: Worth trying again earlier in the day",
    "Favorite Area": "Unlocks in the full Passport",
    "Photo / Memory Placeholder": "Add your own photo once you're keeping entries"
  }
};


/* =============================================================================
   4. calendarData — 12-Month Fishing Calendar
   =============================================================================
   Every month's seasonalPattern / structureFocus / etc. below is GENERAL
   freshwater-fishing seasonal knowledge (spawn in spring, deep structure in
   summer heat, and so on) — not a verified, Lake-Martin-specific claim.
   CALENDAR_DISCLAIMER is shown under every month card so that stays clear.
   Only calendarData[0] (January) is unlocked in the free preview; edit the
   `UNLOCKED_MONTH_INDEX` constant below if you'd rather feature a different
   month for free.
   ========================================================================= */
const CALENDAR_DISCLAIMER = "General seasonal pattern — not verified specifically for Lake Martin.";
const UNLOCKED_MONTH_INDEX = 0; // 0 = January

const calendarData = [
  { month: "January", targetSpecies: ["Bass", "Crappie"], seasonalPattern: "Fish tend to hold deeper and feed less aggressively in cold water.", structureFocus: "Deeper cover and channel edges.", startingStrategy: "Slow presentations near deeper structure.", tackleCategory: "Slow-moving jigs and soft plastics.", weatherConsiderations: "Watch for warming trends after cold fronts.", tripPlanningNote: "Shorter days — plan around the warmest part of the afternoon." },
  { month: "February", targetSpecies: ["Bass", "Crappie"], seasonalPattern: "Pre-spawn staging can begin as water starts to warm.", structureFocus: "Transition areas between deep water and shallow cover.", startingStrategy: "Cover water to locate staging fish before committing to an area.", tackleCategory: "Medium-diving crankbaits and jigs.", weatherConsiderations: "Water temperature swings are common — conditions can change fast.", tripPlanningNote: "Track a few days of warming weather before planning a trip." },
  { month: "March", targetSpecies: ["Bass", "Crappie", "Bluegill / Sunfish"], seasonalPattern: "Spawning activity often increases as shallows warm.", structureFocus: "Shallow cover, cypress edges and protected coves.", startingStrategy: "Start shallow and work toward deeper water if shallow bites slow.", tackleCategory: "Shallow-running lures and light jigs.", weatherConsiderations: "Stable, warming weather tends to help shallow activity.", tripPlanningNote: "Mornings after a stretch of warm nights are often worth planning around." },
  { month: "April", targetSpecies: ["Bass", "Crappie", "Bluegill / Sunfish"], seasonalPattern: "Spawn activity can continue with fish using shallow cover.", structureFocus: "Cypress cover, brush and shallow flats.", startingStrategy: "Fish visible cover methodically before moving on.", tackleCategory: "Soft plastics and light spinning tackle.", weatherConsiderations: "Rain and rising water can muddy access — check conditions first.", tripPlanningNote: "A good month to explore several shallow areas in one trip." },
  { month: "May", targetSpecies: ["Bass", "Bluegill / Sunfish"], seasonalPattern: "Post-spawn fish often move toward nearby deeper water.", structureFocus: "Edges just outside spawning flats.", startingStrategy: "Work the drop from shallow to slightly deeper water.", tackleCategory: "Moving baits like spinnerbaits or swimbaits.", weatherConsiderations: "Increasing heat can push activity earlier in the day.", tripPlanningNote: "Early starts become more worthwhile as days warm." },
  { month: "June", targetSpecies: ["Bass", "Bluegill / Sunfish", "Channel Catfish"], seasonalPattern: "Summer patterns set in with fish often relating to deeper, shaded structure.", structureFocus: "Deeper cover, shaded banks and channel edges.", startingStrategy: "Fish early or late; target shade and deeper water midday.", tackleCategory: "Deeper-diving baits and bottom presentations.", weatherConsiderations: "Heat and low water can concentrate fish around remaining cover.", tripPlanningNote: "Plan around early morning or evening to avoid peak heat." },
  { month: "July", targetSpecies: ["Bass", "Channel Catfish"], seasonalPattern: "Hot-weather patterns typically continue with deeper, shaded holding areas.", structureFocus: "Deep structure and current-influenced areas if present.", startingStrategy: "Slow bottom presentations in deeper holding areas.", tackleCategory: "Bottom rigs and slow-moving soft plastics.", weatherConsiderations: "High heat — plan for hydration and shade.", tripPlanningNote: "Early-morning trips tend to be more comfortable and active." },
  { month: "August", targetSpecies: ["Bass", "Channel Catfish"], seasonalPattern: "Similar late-summer holding patterns generally continue.", structureFocus: "Deep cover and shaded structure.", startingStrategy: "Target the coolest, most shaded water available.", tackleCategory: "Bottom presentations and slow-moving baits.", weatherConsiderations: "Afternoon storms are common in late summer — watch the forecast.", tripPlanningNote: "Have a backup plan if afternoon weather moves in." },
  { month: "September", targetSpecies: ["Bass", "Crappie"], seasonalPattern: "Cooling water can trigger a fall transition and more active feeding.", structureFocus: "Transition zones from deep to shallow structure.", startingStrategy: "Follow bait activity as fish move shallower.", tackleCategory: "Moving baits and reaction lures.", weatherConsiderations: "Watch for the first real cool front of the season.", tripPlanningNote: "A good month to fish a wider range of depths in one trip." },
  { month: "October", targetSpecies: ["Bass", "Crappie"], seasonalPattern: "Fall feeding activity often increases as water continues cooling.", structureFocus: "Shallow-to-mid structure near baitfish activity.", startingStrategy: "Cover water to find active feeding areas.", tackleCategory: "Reaction baits like crankbaits and spinnerbaits.", weatherConsiderations: "More comfortable temperatures generally support longer trips.", tripPlanningNote: "One of the more flexible months for planning trip length." },
  { month: "November", targetSpecies: ["Bass", "Crappie"], seasonalPattern: "Fish often continue feeding before winter, sometimes near deeper cover.", structureFocus: "Mid-depth structure and cover transition points.", startingStrategy: "Slow down presentations as water temperature drops.", tackleCategory: "Jigs and slow-rolled soft plastics.", weatherConsiderations: "Cold fronts can slow activity quickly — plan around stable stretches.", tripPlanningNote: "Watch the week's forecast rather than just the day of your trip." },
  { month: "December", targetSpecies: ["Bass", "Crappie"], seasonalPattern: "Winter patterns typically set in with fish holding deeper and feeding less often.", structureFocus: "Deeper structure and channel edges.", startingStrategy: "Fish slowly and thoroughly in a smaller number of areas.", tackleCategory: "Slow presentations, jigs and finesse rigs.", weatherConsiderations: "Shorter, colder days — dress and plan accordingly.", tripPlanningNote: "Midday warmth is often the most productive window." }
];


/* =============================================================================
   5. fishingSpots — Secret Fishing Areas Map
   =============================================================================
   PASTE VERIFIED COORDINATES HERE:
     For each area, replace  lat: null, lng: null  with real numbers, then set
     verified: true. Fill in targetSpecies / structure / seasonalTiming /
     startingApproach / boatNotes / bankNotes / source with real notes.
     Exact coordinates are only ever shown on the map when verified === true
     AND both lat and lng are provided — everything else always displays
     "VERIFICATION REQUIRED" instead of a number.
   ========================================================================= */
const fishingSpots = [
  { id: 1, name: "Secret Area 01", lat: null, lng: null, verified: false, targetSpecies: [], structure: "", seasonalTiming: "", startingApproach: "", boatNotes: "", bankNotes: "", source: "", premium: true },
  { id: 2, name: "Secret Area 02", lat: null, lng: null, verified: false, targetSpecies: [], structure: "", seasonalTiming: "", startingApproach: "", boatNotes: "", bankNotes: "", source: "", premium: true },
  { id: 3, name: "Secret Area 03", lat: null, lng: null, verified: false, targetSpecies: [], structure: "", seasonalTiming: "", startingApproach: "", boatNotes: "", bankNotes: "", source: "", premium: true },
  { id: 4, name: "Secret Area 04", lat: null, lng: null, verified: false, targetSpecies: [], structure: "", seasonalTiming: "", startingApproach: "", boatNotes: "", bankNotes: "", source: "", premium: true },
  { id: 5, name: "Secret Area 05", lat: null, lng: null, verified: false, targetSpecies: [], structure: "", seasonalTiming: "", startingApproach: "", boatNotes: "", bankNotes: "", source: "", premium: true },
  { id: 6, name: "Secret Area 06", lat: null, lng: null, verified: false, targetSpecies: [], structure: "", seasonalTiming: "", startingApproach: "", boatNotes: "", bankNotes: "", source: "", premium: true }
];

// Single, non-premium geographic reference marker — the lake itself, not a
// fishing hotspot. Uses the same public center point as the base map.
const lakeReference = {
  name: lakeInfo.name,
  lat: lakeInfo.center.lat,
  lng: lakeInfo.center.lng,
  popupTitle: "Lake Martin",
  popupBody: "St. Martin Parish, Louisiana"
};


/* =============================================================================
   6. speciesData — general species notes (not lake-verified)
   ========================================================================= */
const speciesData = [
  { species: "Largemouth Bass", note: "Widely present in Louisiana lake and backwater fisheries in general." },
  { species: "White Crappie", note: "Commonly associated with brush, timber and cypress cover in Louisiana lakes generally." },
  { species: "Bluegill / Sunfish", note: "Typically found around shallow cover in warm-water lakes region-wide." },
  { species: "Channel Catfish", note: "Generally present in Louisiana lakes and backwaters; often bottom-oriented." }
];


/* =============================================================================
   7. tripPlannerData — trip-planning checklist
   ========================================================================= */
const tripPlannerData = {
  checklist: [
    "Rods and reels matched to your target species",
    "Terminal tackle (hooks, weights, swivels)",
    "Life jacket / PFD",
    "Sun protection (hat, sunscreen, polarized sunglasses)",
    "Drinking water",
    "First aid basics",
    "Phone or GPS device",
    "Local fishing regulations reference"
  ]
};


/* =============================================================================
   8. Rendering + unlock logic
   ========================================================================= */

// Wires every purchase CTA (existing at load, or newly injected into a modal)
// to PURCHASE_URL. Call again after injecting new HTML containing a
// ".js-purchase-link" element.
function wirePurchaseLinks(scope){
  const root = scope || document;
  root.querySelectorAll(".js-purchase-link").forEach(function(el){
    if (el.tagName === "A"){
      el.href = PURCHASE_URL;
    } else if (!el.dataset.purchaseWired){
      el.dataset.purchaseWired = "true";
      el.addEventListener("click", function(){ window.location.href = PURCHASE_URL; });
    }
  });
}

// Renders the one free sample passport entry.
function renderPassportSample(){
  const el = document.getElementById("passport-sample");
  if (!el) return;
  const entry = passportData.sampleEntry;
  const rows = passportData.fields.map(function(field){
    return '<div class="spot-fact"><div class="spot-fact-label">' + field + '</div><div class="spot-fact-value">' + (entry[field] || "—") + "</div></div>";
  }).join("");
  el.innerHTML =
    '<span class="modal-eyebrow">' + entry.label + "</span>" +
    '<div class="spot-fact-grid" style="margin-top:14px;">' + rows + "</div>";
}

// Renders the trip-planning checklist preview (first few items free, rest noted as locked).
function renderChecklistPreview(){
  const el = document.getElementById("checklist-preview");
  if (!el) return;
  const freeCount = 3;
  const items = tripPlannerData.checklist;
  const shown = items.slice(0, freeCount).map(function(item){
    return "<li>" + item + "</li>";
  }).join("");
  el.innerHTML =
    '<ul class="checklist-list">' + shown + "</ul>" +
    '<p class="spot-modal-note">+ ' + (items.length - freeCount) + ' more items in the full Passport checklist.</p>';
}

// Renders 12 calendar month cards — one unlocked, eleven locked.
function renderCalendar(){
  const grid = document.getElementById("calendar-grid");
  if (!grid) return;

  const html = calendarData.map(function(m, index){
    const isUnlocked = index === UNLOCKED_MONTH_INDEX;

    if (isUnlocked){
      return (
        '<div class="month-card">' +
          '<div class="month-card-head"><h3>' + m.month + "</h3><span class=\"month-tag\">Free Preview</span></div>" +
          '<div class="spot-fact-grid">' +
            '<div class="spot-fact"><div class="spot-fact-label">Target Species</div><div class="spot-fact-value">' + m.targetSpecies.join(", ") + "</div></div>" +
            '<div class="spot-fact"><div class="spot-fact-label">Seasonal Pattern</div><div class="spot-fact-value">' + m.seasonalPattern + "</div></div>" +
            '<div class="spot-fact"><div class="spot-fact-label">Structure Focus</div><div class="spot-fact-value">' + m.structureFocus + "</div></div>" +
            '<div class="spot-fact"><div class="spot-fact-label">Starting Strategy</div><div class="spot-fact-value">' + m.startingStrategy + "</div></div>" +
            '<div class="spot-fact"><div class="spot-fact-label">Tackle Category</div><div class="spot-fact-value">' + m.tackleCategory + "</div></div>" +
            '<div class="spot-fact"><div class="spot-fact-label">Weather Considerations</div><div class="spot-fact-value">' + m.weatherConsiderations + "</div></div>" +
          "</div>" +
          '<p class="spot-modal-note">' + m.tripPlanningNote + " " + CALENDAR_DISCLAIMER + "</p>" +
        "</div>"
      );
    }

    return (
      '<div class="month-card is-locked">' +
        '<div class="lock-pin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="10.5" width="14" height="9" rx="1.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg></div>' +
        '<div class="fade-content">' +
          "<h4>" + m.month + "</h4>" +
          '<div class="fake-line"></div><div class="fake-line"></div><div class="fake-line"></div>' +
        "</div>" +
      "</div>"
    );
  }).join("");

  grid.innerHTML = html;
  grid.insertAdjacentHTML("afterend",
    '<div style="text-align:center;margin-top:22px;">' +
      '<p style="color:var(--ink-faint);font-size:13.5px;margin-bottom:14px;">11 MONTHS LOCKED</p>' +
      '<a href="#" class="btn btn-primary js-purchase-link">Unlock the Full Calendar</a>' +
    "</div>"
  );
  wirePurchaseLinks(grid.parentElement);
}

// Renders the locked "FULL PASSPORT" field-preview grid.
function renderPassportLocked(){
  const el = document.getElementById("passport-locked");
  if (!el) return;
  const lines = passportData.fields.map(function(){
    return '<div class="fake-line"></div>';
  }).join("");
  el.innerHTML =
    '<div class="lock-pin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="10.5" width="14" height="9" rx="1.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg></div>' +
    '<div class="fade-content"><h4>Full Passport — Locked</h4>' + lines + "</div>";
}

document.addEventListener("DOMContentLoaded", function(){
  renderPassportSample();
  renderPassportLocked();
  renderChecklistPreview();
  renderCalendar();
  wirePurchaseLinks(document);
});


/* =============================================================================
   9. Interactive map (Leaflet)
   ========================================================================= */
const MAP_CENTER = [lakeReference.lat, lakeReference.lng];
const MAP_DEFAULT_ZOOM = 14;

// Demo-only layout radius (degrees) used purely to spread out spots that
// still have lat/lng of null so the map is easy to preview before real
// coordinates exist. Never shown as a number — always "VERIFICATION REQUIRED".
const DEMO_RADIUS = 0.01;

let map;
let markerLayer;
let referenceMarker;
let MAP_UNLOCKED = false; // demo flag only — this is a static prototype, no real payment check

function hasVerifiedCoords(spot){
  return spot.verified === true && spot.lat !== null && spot.lng !== null;
}

function demoPosition(spot, index, total){
  const angle = (index / Math.max(total, 1)) * Math.PI * 2;
  return [
    MAP_CENTER[0] + Math.sin(angle) * DEMO_RADIUS,
    MAP_CENTER[1] + Math.cos(angle) * DEMO_RADIUS
  ];
}

function buildPremiumIcon(locked, unverified){
  const classes = ["spot-marker", "cat-bass"];
  if (locked) classes.push("is-locked");
  if (unverified) classes.push("is-demo");
  return L.divIcon({
    className: "",
    html: '<div class="' + classes.join(" ") + '"><span>' + (locked ? "🔒" : "🎣") + "</span></div>",
    iconSize: [34, 34],
    iconAnchor: [17, 30],
    popupAnchor: [0, -28]
  });
}

function buildReferenceIcon(){
  return L.divIcon({
    className: "",
    html: '<div class="spot-marker cat-starting"><span>📍</span></div>',
    iconSize: [34, 34],
    iconAnchor: [17, 30],
    popupAnchor: [0, -28]
  });
}

/* renderFishingSpots() — clears and redraws every premium marker plus the
   lake reference marker. Call again any time fishingSpots or MAP_UNLOCKED
   changes. */
function renderFishingSpots(){
  if (!map) return;

  if (!referenceMarker){
    referenceMarker = L.marker([lakeReference.lat, lakeReference.lng], { icon: buildReferenceIcon() })
      .bindPopup("<strong>" + lakeReference.popupTitle + "</strong><br>" + lakeReference.popupBody)
      .addTo(map);
  }

  if (markerLayer) markerLayer.clearLayers();
  else markerLayer = L.layerGroup().addTo(map);

  fishingSpots.forEach(function(spot, index){
    const verified = hasVerifiedCoords(spot);
    const position = verified ? [spot.lat, spot.lng] : demoPosition(spot, index, fishingSpots.length);
    const effectivelyLocked = spot.premium && !MAP_UNLOCKED;
    const marker = L.marker(position, { icon: buildPremiumIcon(effectivelyLocked, !verified) });

    marker.on("click", function(){
      if (effectivelyLocked) lockPremiumSpot(spot);
      else showSpotDetails(spot);
    });

    marker.addTo(markerLayer);
  });
}

/* showSpotDetails(spot) — opens the modal with full (unlocked) area info. */
function showSpotDetails(spot){
  const coordLabel = hasVerifiedCoords(spot)
    ? spot.lat.toFixed(5) + ", " + spot.lng.toFixed(5)
    : "VERIFICATION REQUIRED";

  const body =
    '<span class="modal-eyebrow">🎣 Premium Fishing Area</span>' +
    '<h3 id="spot-modal-title">' + spot.name + "</h3>" +
    '<p class="modal-desc">' + (spot.startingApproach || "Starting-approach notes will appear here once added.") + "</p>" +
    '<div class="spot-fact-grid">' +
      '<div class="spot-fact"><div class="spot-fact-label">Coordinates</div><div class="spot-fact-value">' + coordLabel + "</div></div>" +
      '<div class="spot-fact"><div class="spot-fact-label">Structure / Cover</div><div class="spot-fact-value">' + (spot.structure || "—") + "</div></div>" +
      '<div class="spot-fact"><div class="spot-fact-label">Target Species</div><div class="spot-fact-value">' + (spot.targetSpecies && spot.targetSpecies.length ? spot.targetSpecies.join(", ") : "—") + "</div></div>" +
      '<div class="spot-fact"><div class="spot-fact-label">Seasonal Timing</div><div class="spot-fact-value">' + (spot.seasonalTiming || "—") + "</div></div>" +
      '<div class="spot-fact"><div class="spot-fact-label">Boat Notes</div><div class="spot-fact-value">' + (spot.boatNotes || "—") + "</div></div>" +
      '<div class="spot-fact"><div class="spot-fact-label">Bank Notes</div><div class="spot-fact-value">' + (spot.bankNotes || "—") + "</div></div>" +
      '<div class="spot-fact"><div class="spot-fact-label">Source</div><div class="spot-fact-value">' + (spot.source || "Unverified") + "</div></div>" +
    "</div>" +
    '<p class="spot-modal-note">Treat this as planning information, not a guaranteed catch location. Always verify current regulations and access conditions before fishing.</p>';

  openSpotModal(body);
}

/* lockPremiumSpot(spot) — opens the modal in its locked / teaser state. */
function lockPremiumSpot(spot){
  const body =
    '<span class="modal-eyebrow">🎣 Premium Fishing Area</span>' +
    '<h3 id="spot-modal-title">Secret Fishing Area</h3>' +
    '<p class="modal-desc">Exact location and detailed fishing notes are part of the premium passport.</p>' +
    '<a href="#" class="btn btn-primary btn-block js-purchase-link">Unlock the Secret Map — $17</a>';

  openSpotModal(body);
}

/* unlockPremiumMap() — demo-only toggle. This is a static GitHub Pages
   prototype with no real authentication; call this once a real
   purchase/entitlement check succeeds (e.g. from your checkout's success
   redirect), and every marker re-renders in its unlocked state. */
function unlockPremiumMap(){
  MAP_UNLOCKED = true;
  renderFishingSpots();
  const flag = document.getElementById("demo-flag");
  if (flag) flag.textContent = "Unlocked (demo) · placeholder pins";
}

function openSpotModal(bodyHtml){
  const body = document.getElementById("spot-modal-body");
  body.innerHTML = bodyHtml;
  wirePurchaseLinks(body);
  document.getElementById("spot-modal-backdrop").classList.add("is-open");
}
function closeSpotModal(){
  document.getElementById("spot-modal-backdrop").classList.remove("is-open");
}

document.addEventListener("DOMContentLoaded", function(){
  const closeBtn = document.getElementById("spot-modal-close");
  const backdrop = document.getElementById("spot-modal-backdrop");
  if (closeBtn) closeBtn.addEventListener("click", closeSpotModal);
  if (backdrop) backdrop.addEventListener("click", function(e){ if (e.target === this) closeSpotModal(); });
  document.addEventListener("keydown", function(e){ if (e.key === "Escape") closeSpotModal(); });

  function initFishingMap(){
    map = L.map("fishing-map", { zoomControl: true, scrollWheelZoom: true, tap: true })
      .setView(MAP_CENTER, MAP_DEFAULT_ZOOM);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    renderFishingSpots();
  }

  if (document.getElementById("fishing-map")) initFishingMap();

  /* Fullscreen toggle + floating "View Full Map" button */
  const mapWrapper = document.getElementById("map-shell-wrapper");
  const fullscreenBtn = document.getElementById("fullscreen-toggle");
  const fullscreenLabel = document.getElementById("fullscreen-label");

  function toggleMapFullscreen(){
    mapWrapper.classList.toggle("is-fullscreen");
    const isFull = mapWrapper.classList.contains("is-fullscreen");
    fullscreenLabel.textContent = isFull ? "Exit" : "Fullscreen";
    setTimeout(function(){ if (map) map.invalidateSize(); }, 150);
  }

  if (fullscreenBtn) fullscreenBtn.addEventListener("click", toggleMapFullscreen);

  const viewFullMapBtn = document.getElementById("view-full-map-btn");
  if (viewFullMapBtn){
    viewFullMapBtn.addEventListener("click", function(){
      document.getElementById("map-preview").scrollIntoView({ behavior: "smooth" });
      if (!mapWrapper.classList.contains("is-fullscreen")) setTimeout(toggleMapFullscreen, 350);
    });
  }
});


/* =============================================================================
   10. Sticky CTA + footer year
   ========================================================================= */
document.addEventListener("DOMContentLoaded", function(){
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Exposed for later steps / future integration (e.g. a checkout success handler
// calling window.LAKE_MARTIN_PASSPORT.unlockPremiumMap() after payment).
window.LAKE_MARTIN_PASSPORT = {
  lakeInfo: lakeInfo,
  passportData: passportData,
  calendarData: calendarData,
  fishingSpots: fishingSpots,
  speciesData: speciesData,
  tripPlannerData: tripPlannerData,
  renderFishingSpots: renderFishingSpots,
  showSpotDetails: showSpotDetails,
  lockPremiumSpot: lockPremiumSpot,
  unlockPremiumMap: unlockPremiumMap
};
