// Shared script for the Angkor Steps admin dashboard

// ---------- Icons ----------
function svg(paths) {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
}
const ICONS = {
  package: svg('<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>'),
  layers: svg('<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>'),
  boxes: svg('<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/>'),
  dollar: svg('<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
  alert: svg('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>'),
  cart: svg('<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>')
};

// ---------- Settings (localStorage) ----------
const SETTINGS_KEY = "as_settings";
function getSettings() {
  var s = { reorder: 10, riel: 4100 };
  try {
    var raw = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (raw) {
      if (raw.reorder) s.reorder = raw.reorder;
      if (raw.riel) s.riel = raw.riel;
    }
  } catch (e) {}
  return s;
}
function saveSettings(s) { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (e) {} }
function getReorderLevel() { return getSettings().reorder; }

function riel(usd) { return Math.round(usd * getSettings().riel).toLocaleString(); }

// ---------- Saved entries (localStorage) ----------
const ENTRIES_KEY = "as_stock_entries";
function getEntries() { try { return JSON.parse(localStorage.getItem(ENTRIES_KEY)) || []; } catch (e) { return []; } }
function saveEntries(e) { try { localStorage.setItem(ENTRIES_KEY, JSON.stringify(e)); } catch (err) {} }
function netChange(id) {
  return getEntries().reduce(function (s, e) { return e.id === id ? (e.type === "in" ? s + e.qty : s - e.qty) : s; }, 0);
}
function effectiveStock(p) { return p.stock + netChange(p.id); }
function isLow(p) { return effectiveStock(p) <= getReorderLevel(); }

// ---------- Theme ----------
function applyTheme(t) { document.documentElement.setAttribute("data-theme", t); }
function toggleTheme() {
  var h = document.documentElement;
  var n = h.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(n);
  try { localStorage.setItem("as_theme", n); } catch (e) {}
}

// ---------- Top bar ----------
function setupTopbar() {
  var welcome = document.getElementById("welcome");
  if (welcome) {
    var h = new Date().getHours();
    var g = h < 12 ? "Good morning" : (h < 18 ? "Good afternoon" : "Good evening");
    welcome.textContent = g + ", Admin";
  }
  var dateEl = document.getElementById("dateNow");
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
  }

  var lowCount = PRODUCTS.filter(isLow).length;
  var navCount = document.getElementById("navLowCount");
  if (navCount) navCount.textContent = lowCount;
  var bellDot = document.getElementById("bellDot");
  if (bellDot && lowCount > 0) bellDot.style.display = "block";

  var bell = document.getElementById("bellBtn");
  if (bell) bell.addEventListener("click", function () { location.href = "products.html?low=1"; });

  var gs = document.getElementById("globalSearch");
  if (gs) gs.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = gs.querySelector("input").value.trim();
    location.href = "products.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  });

  var dd = document.getElementById("avatarDropdown");
  var ddBtn = document.getElementById("avatarBtn");
  if (dd && ddBtn) {
    ddBtn.addEventListener("click", function (e) { e.stopPropagation(); dd.classList.toggle("open"); });
    document.addEventListener("click", function () { dd.classList.remove("open"); });
  }

  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  var themeItem = document.getElementById("themeItem");
  if (themeItem) themeItem.addEventListener("click", toggleTheme);
}

// ---------- Sidebar ----------
function setupSidebar() {
  var collapse = document.getElementById("sidebarCollapse");
  if (collapse) {
    collapse.addEventListener("click", function () {
      document.body.classList.toggle("sidebar-collapsed");
      try { localStorage.setItem("as_collapsed", document.body.classList.contains("sidebar-collapsed") ? "1" : "0"); } catch (e) {}
    });
    try { if (localStorage.getItem("as_collapsed") === "1") document.body.classList.add("sidebar-collapsed"); } catch (e) {}
  }
  var menuBtn = document.getElementById("menuBtn");
  if (menuBtn) menuBtn.addEventListener("click", function () { document.body.classList.toggle("sidebar-open"); });
  var overlay = document.getElementById("sidebarOverlay");
  if (overlay) overlay.addEventListener("click", function () { document.body.classList.remove("sidebar-open"); });
}

// ---------- Dashboard ----------
function countUp(el, target, money) {
  var dur = 1000, start = performance.now();
  function frame(now) {
    var p = Math.min((now - start) / dur, 1);
    var eased = 1 - Math.pow(1 - p, 3);
    var val = Math.round(target * eased);
    el.textContent = (money ? "$" : "") + val.toLocaleString();
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = (money ? "$" : "") + target.toLocaleString();
  }
  requestAnimationFrame(frame);
}

function setupDashboard() {
  var statsEl = document.getElementById("stats");
  if (!statsEl) return;

  var total = PRODUCTS.length;
  var lines = new Set(PRODUCTS.map(function (p) { return p.gender; })).size;
  var units = PRODUCTS.reduce(function (s, p) { return s + effectiveStock(p); }, 0);
  var value = PRODUCTS.reduce(function (s, p) { return s + effectiveStock(p) * p.price; }, 0);
  var low = PRODUCTS.filter(isLow).length;

  var cards = [
    { label: "Total Products", value: total, money: false, icon: "package", tone: "tone-blue" },
    { label: "Product Lines", value: lines, money: false, icon: "layers", tone: "tone-cyan" },
    { label: "Pairs in Stock", value: units, money: false, icon: "boxes", tone: "tone-purple" },
    { label: "Total Stock Value", value: value, money: true, icon: "dollar", tone: "tone-pink" },
    { label: "Low Stock Alerts", value: low, money: false, icon: "alert", tone: "tone-danger" }
  ];

  statsEl.innerHTML = cards.map(function (c) {
    return '<div class="stat-card"><div class="stat-icon ' + c.tone + '">' + ICONS[c.icon] + '</div>' +
      '<div class="stat-body"><div class="stat-label">' + c.label + '</div>' +
      '<div class="stat-value" data-value="' + c.value + '" data-money="' + c.money + '">0</div></div></div>';
  }).join("");

  statsEl.querySelectorAll(".stat-value").forEach(function (el) {
    countUp(el, parseInt(el.getAttribute("data-value"), 10), el.getAttribute("data-money") === "true");
  });

  renderCategoryChart();
  renderDonut();
  renderLowStock();
  renderActivities();
}

function renderCategoryChart() {
  var chart = document.getElementById("chart");
  if (!chart) return;
  var byCat = {};
  PRODUCTS.forEach(function (p) { byCat[p.category] = (byCat[p.category] || 0) + effectiveStock(p); });
  var cats = Object.keys(byCat).sort(function (a, b) { return byCat[b] - byCat[a]; });
  var max = Math.max.apply(null, cats.map(function (c) { return byCat[c]; })) || 1;

  chart.innerHTML = cats.map(function (c) {
    return '<div class="bar-row" data-cat="' + c + '" data-val="' + byCat[c] + '">' +
      '<span class="bar-label">' + c + '</span>' +
      '<span class="bar-track"><span class="bar-fill" style="width:0%"></span></span>' +
      '<span class="bar-value">' + byCat[c] + '</span></div>';
  }).join("");

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      chart.querySelectorAll(".bar-fill").forEach(function (b) {
        var row = b.closest(".bar-row");
        b.style.width = Math.round((parseInt(row.getAttribute("data-val"), 10) / max) * 100) + "%";
      });
    });
  });

  var tip = document.getElementById("tooltip");
  if (!tip) return;
  chart.querySelectorAll(".bar-row").forEach(function (row) {
    row.addEventListener("mousemove", function (e) {
      tip.style.display = "block";
      tip.style.left = (e.clientX + 14) + "px";
      tip.style.top = (e.clientY + 14) + "px";
      tip.textContent = row.getAttribute("data-cat") + " — " + row.getAttribute("data-val") + " pairs";
    });
    row.addEventListener("mouseleave", function () { tip.style.display = "none"; });
  });
}

function renderDonut() {
  var wrap = document.getElementById("donut");
  if (!wrap) return;
  var groups = { Men: 0, Women: 0, Kids: 0 };
  PRODUCTS.forEach(function (p) { groups[p.gender] += effectiveStock(p); });
  var total = groups.Men + groups.Women + groups.Kids || 1;
  var colors = ["#318BFF", "#00D9FF", "#9B5CFF"];
  var names = ["Men", "Women", "Kids"];
  var r = 60, c = 2 * Math.PI * r, offset = 0, circles = "", legend = "";

  names.forEach(function (n, i) {
    var frac = groups[n] / total;
    var len = frac * c;
    circles += '<circle cx="80" cy="80" r="' + r + '" fill="none" stroke="' + colors[i] + '" stroke-width="20" stroke-dasharray="' + len + ' ' + (c - len) + '" stroke-dashoffset="' + (-offset) + '"></circle>';
    offset += len;
    legend += '<div class="legend-item"><span class="legend-dot" style="background:' + colors[i] + '"></span>' + n + '<b>' + groups[n].toLocaleString() + '</b></div>';
  });

  wrap.innerHTML = '<svg viewBox="0 0 160 160" width="170" height="170"><g transform="rotate(-90 80 80)">' + circles + '</g>' +
    '<text class="donut-num" x="80" y="78" text-anchor="middle" font-size="24">' + total.toLocaleString() + '</text>' +
    '<text class="donut-sub" x="80" y="96" text-anchor="middle" font-size="11">pairs</text></svg>';
  var legendEl = document.getElementById("donutLegend");
  if (legendEl) legendEl.innerHTML = legend;
}

function renderLowStock() {
  var el = document.getElementById("lowStockList");
  if (!el) return;
  var low = PRODUCTS.filter(isLow);
  el.innerHTML = low.length ? low.map(function (p) {
    return '<div class="low-item"><span class="id">' + p.id + '</span><span class="nm">' + p.name + '</span><span class="st">' + effectiveStock(p) + ' left</span></div>';
  }).join("") : '<div class="note">No low stock items — all healthy.</div>';
}

function renderActivities() {
  var el = document.getElementById("activityList");
  if (!el) return;
  var entries = getEntries().slice(-8).reverse();
  if (!entries.length) { el.innerHTML = '<div class="note">No activity yet — record stock in/out to see it here.</div>'; return; }
  el.innerHTML = entries.map(function (e) {
    var p = PRODUCTS.find(function (x) { return x.id === e.id; });
    var type = e.type === "in" ? "Stock In" : "Stock Out";
    return '<div class="act-item"><span class="act-dot"></span><span><b>' + (p ? p.name : e.id) + '</b> — ' + type + ' × ' + e.qty + ' <span style="opacity:.7">(' + e.date + ')</span></span></div>';
  }).join("");
}

// ---------- Products ----------
let currentGender = "All";
let currentCategory = "All";
let currentSearch = "";
let currentSort = "default";
let lowOnly = false;

function sortedProducts(list) {
  var arr = list.slice();
  if (currentSort === "priceAsc") arr.sort(function (a, b) { return a.price - b.price; });
  else if (currentSort === "priceDesc") arr.sort(function (a, b) { return b.price - a.price; });
  else if (currentSort === "stockAsc") arr.sort(function (a, b) { return effectiveStock(a) - effectiveStock(b); });
  else if (currentSort === "stockDesc") arr.sort(function (a, b) { return effectiveStock(b) - effectiveStock(a); });
  return arr;
}

function renderProducts() {
  var tbody = document.querySelector("#productTable tbody");
  if (!tbody) return;

  var filtered = PRODUCTS.filter(function (p) {
    var g = currentGender === "All" || p.gender === currentGender;
    var c = currentCategory === "All" || p.category === currentCategory;
    var l = !lowOnly || isLow(p);
    var q = currentSearch.toLowerCase();
    var t = p.name.toLowerCase().indexOf(q) !== -1 || p.id.toLowerCase().indexOf(q) !== -1;
    return g && c && l && t;
  });

  tbody.innerHTML = sortedProducts(filtered).map(function (p) {
    var s = effectiveStock(p);
    var low = s <= getReorderLevel();
    return "<tr><td>" + p.id + "</td><td>" + p.name + "</td><td>" + p.category + "</td><td>" + p.gender + "</td>" +
      '<td>$' + p.price + '<span class="price-riel">≈ ' + riel(p.price) + ' ៛</span></td>' +
      "<td>" + s + "</td>" +
      '<td><span class="badge ' + (low ? "low" : "ok") + '">' + (low ? "LOW" : "OK") + "</span></td></tr>";
  }).join("");

  var count = document.getElementById("resultCount");
  if (count) count.textContent = "Showing " + filtered.length + " of " + PRODUCTS.length + " products";
}

function setupProducts() {
  var tbody = document.querySelector("#productTable tbody");
  if (!tbody) return;

  var search = document.getElementById("search");
  var filterBtns = document.querySelectorAll("#filters button");
  var sort = document.getElementById("sort");
  var catFilter = document.getElementById("catFilter");
  var lowToggle = document.getElementById("lowToggle");

  var cats = {};
  PRODUCTS.forEach(function (p) { cats[p.category] = true; });
  Object.keys(cats).sort().forEach(function (c) {
    var o = document.createElement("option");
    o.value = c;
    o.textContent = c;
    catFilter.appendChild(o);
  });

  var params = new URLSearchParams(location.search);
  if (params.get("q")) { currentSearch = params.get("q"); search.value = currentSearch; }
  if (params.get("low") === "1") { lowOnly = true; lowToggle.classList.add("active"); }

  search.addEventListener("input", function () { currentSearch = search.value; renderProducts(); });

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentGender = btn.dataset.gender;
      renderProducts();
    });
  });

  catFilter.addEventListener("change", function () { currentCategory = catFilter.value; renderProducts(); });
  sort.addEventListener("change", function () { currentSort = sort.value; renderProducts(); });
  lowToggle.addEventListener("click", function () {
    lowOnly = !lowOnly;
    lowToggle.classList.toggle("active", lowOnly);
    renderProducts();
  });

  renderProducts();
}

// ---------- Stock In/Out ----------
function setupStock() {
  var form = document.getElementById("stockForm");
  if (!form) return;
  var select = document.getElementById("product");
  var msg = document.getElementById("formMsg");
  var logBody = document.getElementById("logBody");
  var clearBtn = document.getElementById("clearBtn");

  select.innerHTML = PRODUCTS.map(function (p) {
    return '<option value="' + p.id + '">' + p.id + " — " + p.name + "</option>";
  }).join("");
  document.getElementById("date").value = new Date().toISOString().slice(0, 10);

  function renderLog() {
    var entries = getEntries();
    if (!entries.length) {
      logBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text2);">No entries yet.</td></tr>';
      return;
    }
    logBody.innerHTML = entries.map(function (e, i) {
      var p = PRODUCTS.find(function (x) { return x.id === e.id; });
      var name = p ? p.id + " — " + p.name : e.id;
      var type = e.type === "in" ? "Stock In" : "Stock Out";
      return "<tr><td>" + (i + 1) + "</td><td>" + e.date + "</td><td>" + name + "</td><td>" + type + "</td><td>" + e.qty + "</td></tr>";
    }).join("");
  }
  renderLog();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var id = select.value;
    var product = PRODUCTS.find(function (p) { return p.id === id; });
    var type = form.type.value;
    var qty = parseInt(document.getElementById("qty").value, 10);
    var date = document.getElementById("date").value;

    var entries = getEntries();
    entries.push({ id: id, type: type, qty: qty, date: date });
    saveEntries(entries);
    renderLog();

    msg.textContent = "Saved: " + (type === "in" ? "Stock In" : "Stock Out") + " of " + qty + " × " + product.name + ". New stock: " + effectiveStock(product) + ".";
    form.reset();
    document.getElementById("qty").value = 1;
    document.getElementById("date").value = new Date().toISOString().slice(0, 10);
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      saveEntries([]);
      renderLog();
      msg.textContent = "All entries cleared.";
    });
  }
}

// ---------- Sales ----------
function setupSales() {
  var body = document.getElementById("salesBody");
  if (!body) return;

  var sales = getEntries().filter(function (e) { return e.type === "out"; }).slice().reverse();

  var stats = document.getElementById("salesStats");
  if (stats) {
    var units = sales.reduce(function (s, e) { return s + e.qty; }, 0);
    var revenue = sales.reduce(function (s, e) {
      var p = PRODUCTS.find(function (x) { return x.id === e.id; });
      return s + (p ? e.qty * p.price : 0);
    }, 0);
    var cards = [
      { label: "Sales recorded", value: sales.length, money: false, icon: "cart", tone: "tone-blue" },
      { label: "Pairs sold", value: units, money: false, icon: "boxes", tone: "tone-purple" },
      { label: "Revenue", value: revenue, money: true, icon: "dollar", tone: "tone-pink" }
    ];
    stats.innerHTML = cards.map(function (c) {
      return '<div class="stat-card"><div class="stat-icon ' + c.tone + '">' + ICONS[c.icon] + '</div>' +
        '<div class="stat-body"><div class="stat-label">' + c.label + '</div>' +
        '<div class="stat-value">' + (c.money ? "$" : "") + c.value.toLocaleString() + '</div></div></div>';
    }).join("");
  }

  if (!sales.length) {
    body.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text2);">No sales recorded yet — record a Stock Out on the Inventory page.</td></tr>';
    return;
  }
  body.innerHTML = sales.map(function (e, i) {
    var p = PRODUCTS.find(function (x) { return x.id === e.id; });
    var name = p ? p.id + " — " + p.name : e.id;
    var unit = p ? "$" + p.price : "—";
    var total = p ? "$" + (e.qty * p.price) : "—";
    return "<tr><td>" + (i + 1) + "</td><td>" + e.date + "</td><td>" + name + "</td><td>" + e.qty + "</td><td>" + unit + "</td><td>" + total + "</td></tr>";
  }).join("");
}

// ---------- Settings ----------
function setupSettings() {
  var form = document.getElementById("settingsForm");
  if (!form) return;

  var s = getSettings();
  document.getElementById("setReorder").value = s.reorder;
  document.getElementById("setRiel").value = s.riel;

  var theme = document.documentElement.getAttribute("data-theme") || "dark";
  var radios = form.setTheme;
  for (var i = 0; i < radios.length; i++) { if (radios[i].value === theme) radios[i].checked = true; }

  var msg = document.getElementById("settingsMsg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var reorder = parseInt(document.getElementById("setReorder").value, 10) || 10;
    var rielRate = parseInt(document.getElementById("setRiel").value, 10) || 4100;
    var th = form.setTheme.value;
    saveSettings({ reorder: reorder, riel: rielRate });
    applyTheme(th);
    try { localStorage.setItem("as_theme", th); } catch (err) {}
    msg.textContent = "Settings saved — low-stock threshold: " + reorder + ", rate: " + rielRate + " riel/$1.";
  });

  var resetBtn = document.getElementById("resetData");
  var resetMsg = document.getElementById("resetMsg");
  if (resetBtn) resetBtn.addEventListener("click", function () {
    saveEntries([]);
    resetMsg.textContent = "All recorded entries cleared.";
  });
}

// ---------- Init ----------
setupTopbar();
setupSidebar();
setupDashboard();
setupProducts();
setupStock();
setupSales();
setupSettings();
