// Rezervacije – ŠRD Straža, Tenis center Obrul (v3)
const COURTS = [
  { id: 1, name: "Igrišče 1", sub: "z reflektorji" },
  { id: 2, name: "Igrišče 2", sub: "z reflektorji" }
];
const DAYS_AHEAD = 14;
const OPEN = 7 * 60, CLOSE = 24 * 60, STEP = 30, MAX_DUR = 180;
const PRICE_PER_HOUR = 10;
const KIND = { turnir: "🏆 Turnir", trening: "🎾 Trening", vzdrzevanje: "🛠 Vzdrževanje", drugo: "Zasedeno" };
const DOW = ["ned","pon","tor","sre","čet","pet","sob"];
const DOW_LONG = ["nedelja","ponedeljek","torek","sreda","četrtek","petek","sobota"];
const MONTHS = ["januar","februar","marec","april","maj","junij","julij","avgust","september","oktober","november","december"];

const pad = n => String(n).padStart(2, "0");
const ymd = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const hm = m => (m === 1440 ? "24" : pad(Math.floor(m / 60))) + ":" + pad(m % 60);
const durLabel = m => { const h = Math.floor(m / 60), r = m % 60; return (h ? h + " h" : "") + (h && r ? " " : "") + (r ? r + " min" : ""); };
const price = m => (PRICE_PER_HOUR * m / 60).toLocaleString("sl-SI", { maximumFractionDigits: 2 }) + " €";
const prettyDate = s => { const d = new Date(s + "T12:00:00"); return DOW_LONG[d.getDay()] + ", " + d.getDate() + ". " + MONTHS[d.getMonth()]; };
const shortDate = s => { const d = new Date(s + "T12:00:00"); return d.getDate() + ". " + (d.getMonth() + 1) + "."; };
const key = (date, court, slot) => date + "|" + court + "|" + slot;
const $ = id => document.getElementById(id);

const cfg = window.CONFIG || {};
const configured = cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes("XXXX") && window.supabase;
const sb = configured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

let taken = new Map();          // key -> booking_id
let blocks = [];                // turnirji, treningi ...
let selectedDate = ymd(new Date());
let pending = null;

function loadMine() { try { return JSON.parse(localStorage.getItem("obrul_mine_v2") || "{}"); } catch (e) { return {}; } }
function saveMine(m) { try { localStorage.setItem("obrul_mine_v2", JSON.stringify(m)); } catch (e) {} }
let mine = loadMine();

function toast(msg, ms) { const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), ms || 2600); }
function showBanner(msg) { const b = $("banner"); b.textContent = msg; b.style.display = "block"; }

function blockAt(date, court, min) {
  return blocks.find(b => b.date === date && b.courts.includes(court) && b.start_min <= min && b.end_min > min);
}

function renderDays() {
  const box = $("days"); box.innerHTML = "";
  const today = new Date();
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    const s = ymd(d);
    const b = document.createElement("button");
    b.type = "button"; b.className = "day" + (s === selectedDate ? " active" : "") + (blocks.some(x => x.date === s && x.kind === "turnir") ? " has-event" : "");
    b.innerHTML = "<small></small><b></b>";
    b.querySelector("small").textContent = i === 0 ? "danes" : DOW[d.getDay()];
    b.querySelector("b").textContent = d.getDate();
    b.onclick = () => { selectedDate = s; renderDays(); renderGrid(); };
    box.appendChild(b);
  }
}

function isPast(date, min) { return new Date(date + "T" + pad(Math.floor(min / 60)) + ":" + pad(min % 60) + ":00") < new Date(); }

function renderGrid() {
  const t = $("grid"); t.innerHTML = "";
  const head = document.createElement("tr");
  head.appendChild(document.createElement("th"));
  COURTS.forEach(c => { const th = document.createElement("th"); th.innerHTML = "<span></span><small></small>"; th.firstChild.textContent = c.name; th.lastChild.textContent = c.sub; head.appendChild(th); });
  t.appendChild(head);
  for (let m = OPEN; m < CLOSE; m += STEP) {
    const tr = document.createElement("tr");
    if (m % 60 === 0) tr.className = "full";
    const td = document.createElement("td"); td.className = "time"; td.textContent = hm(m); tr.appendChild(td);
    COURTS.forEach(c => {
      const cell = document.createElement("td");
      const btn = document.createElement("button"); btn.type = "button";
      const bid = taken.get(key(selectedDate, c.id, m / STEP));
      const blk = blockAt(selectedDate, c.id, m);
      if (blk) {
        btn.className = "slot event"; btn.textContent = (KIND[blk.kind] || "Zasedeno") + ": " + blk.title; btn.title = btn.textContent; btn.disabled = true;
      } else if (bid && mine[bid]) {
        btn.className = "slot mine"; btn.textContent = "Tvoj termin";
        btn.onclick = () => openManage(bid);
      } else if (bid) {
        btn.className = "slot taken"; btn.textContent = "Zasedeno"; btn.disabled = true;
      } else if (isPast(selectedDate, m)) {
        btn.className = "slot past"; btn.textContent = "—"; btn.disabled = true;
      } else {
        btn.className = "slot free"; btn.textContent = "Prosto";
        btn.onclick = () => openBook(selectedDate, c.id, m);
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
  const active = new Set(taken.values());
  const list = Object.entries(mine).filter(([id, b]) => b.date >= today && (active.has(id) || b.date > ymd(new Date(Date.now() + DAYS_AHEAD * 864e5))))
    .sort((a, b) => (a[1].date + pad(a[1].start)).localeCompare(b[1].date + pad(b[1].start)));
  $("mineList").style.display = list.length ? "block" : "none";
  list.forEach(([id, b]) => {
    const r = document.createElement("div"); r.className = "mrow";
    const court = COURTS.find(c => c.id === b.court);
    r.innerHTML = '<div><div class="t"></div><div class="s"></div></div>';
    r.querySelector(".t").textContent = prettyDate(b.date) + " · " + hm(b.start) + "–" + hm(b.start + b.dur);
    r.querySelector(".s").textContent = (court ? court.name : "") + " · " + durLabel(b.dur) + (b.series ? " · ponavljajoča" : "");
    const x = document.createElement("button"); x.className = "link-btn"; x.textContent = "Prekliči";
    x.onclick = () => cancelBooking(id);
    r.appendChild(x); rows.appendChild(r);
  });
}

function maxFree(date, court, start) {
  let d = 0;
  while (d < MAX_DUR && start + d < CLOSE && !taken.has(key(date, court, (start + d) / STEP)) && !blockAt(date, court, start + d)) d += STEP;
  return d;
}

function updateSummary() {
  if (!pending || pending.manage) return;
  const dur = Number($("fDur").value), weeks = Number($("fRepeat").value);
  const c = COURTS.find(x => x.id === pending.court);
  $("mWhen").textContent = prettyDate(pending.date) + " · " + hm(pending.start) + "–" + hm(pending.start + dur) + " · " + c.name;
  $("fPrice").textContent = "Cena: " + price(dur) + (weeks > 1 ? " na termin × " + weeks + " tednov" : "") +
    (pending.start + dur > 17 * 60 ? " + reflektorji (1,5 €/h), če je temno" : "");
}

function openBook(date, court, start) {
  const free = maxFree(date, court, start);
  pending = { date, court, start };
  const sel = $("fDur"); sel.innerHTML = "";
  for (let d = STEP; d <= free; d += STEP) {
    const o = document.createElement("option"); o.value = d; o.textContent = durLabel(d);
    if (d === Math.min(60, free)) o.selected = true;
    sel.appendChild(o);
  }
  $("fRepeat").value = "1"; $("fRepeatOn").checked = false; $("fWeeksWrap").style.display = "none"; $("fWeeks").value = "4";
  $("mTitle").textContent = "Rezervacija termina";
  $("adminBox").innerHTML = ""; $("fields").style.display = "block";
  $("mSubmit").textContent = "Potrdi rezervacijo";
  $("mErr").textContent = "";
  try { const s = JSON.parse(localStorage.getItem("obrul_contact") || "{}"); if (s.name) $("fName").value = s.name; if (s.phone) $("fPhone").value = s.phone; if (s.email) $("fEmail").value = s.email; } catch (e) {}
  updateSummary();
  $("overlay").classList.add("open"); setTimeout(() => $("fName").focus(), 50);
}
$("fDur").addEventListener("change", updateSummary);
$("fRepeat").addEventListener("change", updateSummary);

function openManage(id) {
  const b = mine[id];
  pending = { id, manage: true };
  const c = COURTS.find(x => x.id === b.court);
  $("mTitle").textContent = "Tvoja rezervacija";
  $("mWhen").textContent = prettyDate(b.date) + " · " + hm(b.start) + "–" + hm(b.start + b.dur) + " · " + (c ? c.name : "");
  $("fields").style.display = "none"; $("adminBox").innerHTML = ""; $("mErr").textContent = ""; $("fPrice").textContent = "";
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
    const name = $("fName").value.trim(), phone = $("fPhone").value.trim(), email = $("fEmail").value.trim();
    const dur = Number($("fDur").value), weeks = Number($("fRepeat").value) || 1;
    if (name.length < 2) { $("mErr").textContent = "Vpiši ime."; return; }
    if (!/^[+0-9 ()\/-]{6,20}$/.test(phone)) { $("mErr").textContent = "Vpiši veljavno telefonsko številko."; return; }
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { $("mErr").textContent = "Vpiši veljaven e-naslov ali pusti polje prazno."; return; }
    if (!dur) { $("mErr").textContent = "Izberi trajanje."; return; }
    try { localStorage.setItem("obrul_contact", JSON.stringify({ name, phone, email })); } catch (e) {}
    const p = pending;
    let res;
    if (sb) {
      const { data, error } = await sb.rpc("book", {
        p_date: p.date, p_court: p.court, p_start_min: p.start, p_dur_min: dur,
        p_name: name, p_phone: phone, p_players: Number($("fPlayers").value), p_note: $("fNote").value.trim(),
        p_email: email || null, p_weeks: weeks
      });
      if (error) throw new Error(error.message || "napaka");
      res = data;
    } else {
      for (let m = p.start; m < p.start + dur; m += STEP) if (taken.has(key(p.date, p.court, m / STEP))) throw new Error("Termin je zaseden");
      res = { booked: [{ id: "demo-" + Date.now(), token: "demo", date: p.date }], skipped: [] };
    }
    (res.booked || []).forEach(b => {
      for (let m = p.start; m < p.start + dur; m += STEP) taken.set(key(b.date, p.court, m / STEP), b.id);
      mine[b.id] = { date: b.date, court: p.court, start: p.start, dur, token: b.token, series: !!res.series_id };
    });
    saveMine(mine);
    $("fNote").value = "";
    closeModal(); renderGrid();
    const n = (res.booked || []).length, sk = res.skipped || [];
    let msg = n > 1 ? "Rezerviranih terminov: " + n + " ✓" : "Termin je rezerviran ✓";
    if (sk.length) msg += " · Ni bilo mogoče: " + sk.map(s => shortDate(s.date)).join(", ");
    if (email) msg += " · Potrditev je poslana na " + email;
    toast(msg, sk.length || email ? 6000 : 2600);
  } catch (err) {
    console.log(err);
    const m = (err && err.message) || "";
    const known = /zaseden|turnir|največ 2|mimo|14 dni|e-naslov/i.test(m);
    $("mErr").textContent = known ? m.replace(/^.*?: /, "") : "Rezervacija ni uspela. Poskusi znova ali pokliči 031 528 978.";
    if (/zaseden|turnir/i.test(m)) await loadSlots();
  } finally { btn.disabled = false; }
});

async function cancelBooking(id) {
  const b = mine[id]; if (!b) return;
  try {
    if (sb) {
      const { data, error } = await sb.rpc("cancel_booking", { p_id: id, p_token: b.token });
      if (error || data === false) throw error || new Error("not found");
    }
    for (const [k, v] of taken) if (v === id) taken.delete(k);
    delete mine[id]; saveMine(mine);
    renderGrid(); toast("Rezervacija je preklicana");
  } catch (err) { console.log(err); toast("Preklic ni uspel – pokliči 031 528 978"); }
}

async function loadSlots() {
  if (!sb) return;
  const from = ymd(new Date());
  const to = new Date(); to.setDate(to.getDate() + DAYS_AHEAD);
  const [s, b] = await Promise.all([
    sb.rpc("taken_slots", { p_from: from, p_to: ymd(to) }),
    sb.from("blocks").select("date,start_min,end_min,courts,title,kind").gte("date", from).lte("date", ymd(to))
  ]);
  if (s.error) { console.log(s.error); $("status").textContent = "Terminov ni bilo mogoče naložiti."; return; }
  taken = new Map((s.data || []).map(r => [key(r.date, r.court, r.slot), r.booking_id]));
  blocks = b.error ? [] : (b.data || []);
  $("status").textContent = "Termini se osvežujejo samodejno.";
  renderDays(); renderGrid();
}

async function loadNews() {
  if (!sb || !$("newsBanner")) return;
  const since = new Date(Date.now() - 30 * 864e5).toISOString();
  const { data } = await sb.from("news").select("title,body,created_at").eq("important", true).gte("created_at", since).order("created_at", { ascending: false }).limit(1);
  if (data && data.length) {
    const n = data[0], box = $("newsBanner");
    box.querySelector("b").textContent = n.title;
    box.querySelector("span").textContent = n.body ? " – " + n.body.slice(0, 160) + (n.body.length > 160 ? "…" : "") : "";
    box.style.display = "block";
  }
}

renderDays(); renderGrid();
if (!sb) {
  showBanner("Predogled: baza še ni povezana, rezervacije se ne shranjujejo.");
  $("status").textContent = "Način predogleda.";
} else {
  loadSlots(); loadNews();
  setInterval(loadSlots, 30000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) loadSlots(); });
}
