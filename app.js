// Rezervacije – ŠRD Straža, Tenis center Obrul
const COURTS = [
  { id: 1, name: "Igrišče 1", sub: "z reflektorji" },
  { id: 2, name: "Igrišče 2", sub: "z reflektorji" }
];
const DAYS_AHEAD = 14;
const OPEN = 7, CLOSE = 24;
const DOW = ["ned","pon","tor","sre","čet","pet","sob"];
const DOW_LONG = ["nedelja","ponedeljek","torek","sreda","četrtek","petek","sobota"];
const MONTHS = ["januar","februar","marec","april","maj","junij","julij","avgust","september","oktober","november","december"];

const pad = n => String(n).padStart(2, "0");
const ymd = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const endLabel = h => (h + 1 === 24 ? "24" : pad(h + 1)) + ":00";
const prettyDate = s => { const d = new Date(s + "T12:00:00"); return DOW_LONG[d.getDay()] + ", " + d.getDate() + ". " + MONTHS[d.getMonth()]; };
const slotId = (date, court, hour) => date + "_c" + court + "_h" + pad(hour);
const $ = id => document.getElementById(id);

const cfg = window.CONFIG || {};
const configured = cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes("XXXX") && window.supabase;
const sb = configured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

let taken = new Set();          // zasedeni id-ji
let selectedDate = ymd(new Date());
let pending = null;

// moje rezervacije (žetoni za preklic) – shranjeno v brskalniku
function loadMine() { try { return JSON.parse(localStorage.getItem("obrul_mine") || "{}"); } catch (e) { return {}; } }
function saveMine(m) { try { localStorage.setItem("obrul_mine", JSON.stringify(m)); } catch (e) {} }
let mine = loadMine();

function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2600); }
function showBanner(msg) { const b = $("banner"); b.textContent = msg; b.style.display = "block"; }

function renderDays() {
  const box = $("days"); box.innerHTML = "";
  const today = new Date();
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    const s = ymd(d);
    const b = document.createElement("button");
    b.type = "button"; b.className = "day" + (s === selectedDate ? " active" : "");
    b.innerHTML = "<small></small><b></b>";
    b.querySelector("small").textContent = i === 0 ? "danes" : DOW[d.getDay()];
    b.querySelector("b").textContent = d.getDate();
    b.onclick = () => { selectedDate = s; renderDays(); renderGrid(); };
    box.appendChild(b);
  }
}

function renderGrid() {
  const t = $("grid"); t.innerHTML = "";
  const head = document.createElement("tr");
  head.appendChild(document.createElement("th"));
  COURTS.forEach(c => { const th = document.createElement("th"); th.innerHTML = "<span></span><small></small>"; th.firstChild.textContent = c.name; th.lastChild.textContent = c.sub; head.appendChild(th); });
  t.appendChild(head);
  const now = new Date();
  for (let h = OPEN; h < CLOSE; h++) {
    const tr = document.createElement("tr");
    const td = document.createElement("td"); td.className = "time"; td.textContent = pad(h) + ":00"; tr.appendChild(td);
    COURTS.forEach(c => {
      const cell = document.createElement("td");
      const btn = document.createElement("button"); btn.type = "button";
      const id = slotId(selectedDate, c.id, h);
      const start = new Date(selectedDate + "T" + pad(h) + ":00:00");
      if (mine[id] && taken.has(id)) {
        btn.className = "slot mine"; btn.textContent = "Tvoj termin";
        btn.onclick = () => openManage(id);
      } else if (taken.has(id)) {
        btn.className = "slot taken"; btn.textContent = "Zasedeno"; btn.disabled = true;
      } else if (start < now) {
        btn.className = "slot past"; btn.textContent = "—"; btn.disabled = true;
      } else {
        btn.className = "slot free"; btn.textContent = "Prosto";
        btn.onclick = () => openBook(selectedDate, c.id, h);
      }
      cell.appendChild(btn); tr.appendChild(cell);
    });
    t.appendChild(tr);
  }
  renderMine();
}

function renderMine() {
  const rows = $("mineRows"); rows.innerHTML = "";
  const today = ymd(new Date());
  const list = Object.entries(mine).filter(([id, b]) => b.date >= today && taken.has(id)).sort((a, b) => a[0].localeCompare(b[0]));
  $("mineList").style.display = list.length ? "block" : "none";
  list.forEach(([id, b]) => {
    const r = document.createElement("div"); r.className = "mrow";
    const court = COURTS.find(c => c.id === b.court);
    r.innerHTML = '<div><div class="t"></div><div class="s"></div></div>';
    r.querySelector(".t").textContent = prettyDate(b.date) + " · " + pad(b.hour) + ":00–" + endLabel(b.hour);
    r.querySelector(".s").textContent = court ? court.name : "";
    const x = document.createElement("button"); x.className = "link-btn"; x.textContent = "Prekliči";
    x.onclick = () => cancelBooking(id);
    r.appendChild(x); rows.appendChild(r);
  });
}

function openBook(date, court, hour) {
  pending = { date, court, hour, id: slotId(date, court, hour) };
  const c = COURTS.find(x => x.id === court);
  $("mTitle").textContent = "Rezervacija termina";
  $("mWhen").textContent = prettyDate(date) + " · " + pad(hour) + ":00–" + endLabel(hour) + " · " + c.name;
  $("adminBox").innerHTML = ""; $("fields").style.display = "block";
  $("mSubmit").textContent = "Potrdi rezervacijo";
  $("mErr").textContent = "";
  try { const s = JSON.parse(localStorage.getItem("obrul_contact") || "{}"); if (s.name) $("fName").value = s.name; if (s.phone) $("fPhone").value = s.phone; } catch (e) {}
  $("overlay").classList.add("open"); setTimeout(() => $("fName").focus(), 50);
}

function openManage(id) {
  const b = mine[id];
  pending = { id, manage: true };
  const c = COURTS.find(x => x.id === b.court);
  $("mTitle").textContent = "Tvoja rezervacija";
  $("mWhen").textContent = prettyDate(b.date) + " · " + pad(b.hour) + ":00–" + endLabel(b.hour) + " · " + (c ? c.name : "");
  $("fields").style.display = "none"; $("adminBox").innerHTML = ""; $("mErr").textContent = "";
  $("mSubmit").textContent = "Prekliči rezervacijo";
  $("overlay").classList.add("open");
}

function closeModal() { $("overlay").classList.remove("open"); pending = null; }
$("mCancel").onclick = closeModal;
$("overlay").addEventListener("click", e => { if (e.target.id === "overlay") closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

$("form").addEventListener("submit", async e => {
  e.preventDefault();
  if (!pending) return;
  const btn = $("mSubmit"); btn.disabled = true;
  try {
    if (pending.manage) { await cancelBooking(pending.id); closeModal(); return; }
    const name = $("fName").value.trim(), phone = $("fPhone").value.trim();
    if (name.length < 2) { $("mErr").textContent = "Vpiši ime."; return; }
    if (!/^[+0-9 ()\/-]{6,20}$/.test(phone)) { $("mErr").textContent = "Vpiši veljavno telefonsko številko."; return; }
    try { localStorage.setItem("obrul_contact", JSON.stringify({ name, phone })); } catch (e) {}
    const p = pending;
    let token;
    if (sb) {
      const { data, error } = await sb.rpc("book_slot", {
        p_date: p.date, p_court: p.court, p_hour: p.hour, p_name: name, p_phone: phone,
        p_players: Number($("fPlayers").value), p_note: $("fNote").value.trim()
      });
      if (error) {
        if ((error.message || "").includes("zaseden") || error.code === "23505") throw new Error("taken");
        throw error;
      }
      token = data;
    } else {
      if (taken.has(p.id)) throw new Error("taken");
      token = "demo";
    }
    taken.add(p.id);
    mine[p.id] = { date: p.date, court: p.court, hour: p.hour, token };
    saveMine(mine);
    $("fNote").value = "";
    closeModal(); renderGrid(); toast("Termin je rezerviran ✓");
  } catch (err) {
    console.log(err);
    $("mErr").textContent = err && err.message === "taken" ? "Ta termin je ravnokar zasedel nekdo drug." : "Rezervacija ni uspela. Poskusi znova ali pokliči 031 528 978.";
    if (err && err.message === "taken") { await loadSlots(); }
  } finally { btn.disabled = false; }
});

async function cancelBooking(id) {
  const b = mine[id]; if (!b) return;
  try {
    if (sb) {
      const { data, error } = await sb.rpc("cancel_slot", { p_id: id, p_token: b.token });
      if (error || data === false) throw error || new Error("not found");
    }
    taken.delete(id); delete mine[id]; saveMine(mine);
    renderGrid(); toast("Rezervacija je preklicana");
  } catch (err) { console.log(err); toast("Preklic ni uspel – pokliči 031 528 978"); }
}

async function loadSlots() {
  if (!sb) return;
  const from = ymd(new Date());
  const to = new Date(); to.setDate(to.getDate() + DAYS_AHEAD);
  const { data, error } = await sb.rpc("taken_slots", { p_from: from, p_to: ymd(to) });
  if (error) { console.log(error); $("status").textContent = "Terminov ni bilo mogoče naložiti."; return; }
  taken = new Set((data || []).map(r => r.id));
  $("status").textContent = "Termini se osvežujejo samodejno.";
  renderGrid();
}

renderDays(); renderGrid();
if (!sb) {
  showBanner("Predogled: baza še ni povezana, rezervacije se ne shranjujejo.");
  $("status").textContent = "Način predogleda.";
} else {
  loadSlots();
  setInterval(loadSlots, 30000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) loadSlots(); });
}
