// Vremenska napoved za Stražo pri Oplotnici (Open-Meteo, brez ključa)
(function () {
  const URL = "https://api.open-meteo.com/v1/forecast?latitude=46.3818&longitude=15.4774" +
    "&hourly=precipitation_probability,temperature_2m,weather_code" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
    "&timezone=Europe%2FLjubljana&forecast_days=16";
  function wx(code) {
    if (code === 0) return ["☀️", "jasno"];
    if (code === 1) return ["🌤️", "pretežno jasno"];
    if (code === 2) return ["⛅", "delno oblačno"];
    if (code === 3) return ["☁️", "oblačno"];
    if (code === 45 || code === 48) return ["🌫️", "megla"];
    if (code >= 51 && code <= 57) return ["🌦️", "rosenje"];
    if (code >= 61 && code <= 67) return ["🌧️", "dež"];
    if (code >= 71 && code <= 77) return ["🌨️", "sneg"];
    if (code >= 80 && code <= 82) return ["🌦️", "plohe"];
    if (code === 85 || code === 86) return ["🌨️", "snežne plohe"];
    if (code >= 95) return ["⛈️", "nevihta"];
    return ["🌡️", ""];
  }
  let data = null;
  function decorate() {
    const grid = document.getElementById("grid"); if (!grid) return;
    const date = (typeof selectedDate !== "undefined") ? selectedDate : null; if (!date) return;
    let bar = document.getElementById("weatherBar");
    if (!bar) {
      bar = document.createElement("div"); bar.id = "weatherBar"; bar.className = "weather-bar";
      const wrap = grid.closest(".grid-wrap"); wrap.parentNode.insertBefore(bar, wrap);
    }
    if (!data) { bar.style.display = "none"; return; }
    const di = data.daily.time.indexOf(date);
    bar.style.display = "flex"; bar.innerHTML = "";
    const lbl = document.createElement("span"); lbl.className = "wl"; lbl.textContent = "Vremenska napoved za Stražo"; bar.appendChild(lbl);
    const val = document.createElement("span");
    if (di < 0) { val.textContent = "Napoved za ta dan še ni na voljo."; }
    else {
      const w = wx(data.daily.weather_code[di]);
      val.textContent = w[0] + " " + w[1] + " · " + Math.round(data.daily.temperature_2m_max[di]) + "° / " + Math.round(data.daily.temperature_2m_min[di]) + "° · " +
        "možnost padavin " + (data.daily.precipitation_probability_max[di] ?? 0) + " %";
    }
    bar.appendChild(val);
    if (di < 0) return;
    grid.querySelectorAll("tr.full td.time").forEach(td => {
      if (td.querySelector(".rain")) return;
      const hh = td.textContent.trim().slice(0, 2);
      const idx = data.hourly.time.indexOf(date + "T" + hh + ":00");
      if (idx < 0) return;
      const p = data.hourly.precipitation_probability[idx];
      const t = Math.round(data.hourly.temperature_2m[idx]);
      const s = document.createElement("span"); s.className = "rain";
      s.textContent = (p >= 30 ? "💧" + p + "% " : "") + t + "°";
      if (p >= 30) s.classList.add("wet");
      td.appendChild(s);
    });
  }
  function hook() {
    const grid = document.getElementById("grid"); if (!grid) return;
    new MutationObserver(decorate).observe(grid, { childList: true });
    decorate();
  }
  fetch(URL).then(r => r.json()).then(j => { if (j && j.daily) { data = j; decorate(); } }).catch(() => {});
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hook); else hook();
  setInterval(() => fetch(URL).then(r => r.json()).then(j => { if (j && j.daily) { data = j; } }).catch(() => {}), 3600 * 1000);
})();
