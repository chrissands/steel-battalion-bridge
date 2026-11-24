// Steel Battalion Bridge - compact control overlay page (/overlay.html). Same data as the Windows overlay.
const $ = id => document.getElementById(id);
let last = "";
function render(o) {
  const key = JSON.stringify(o);
  if (key === last) return;
  last = key;
  $("profile").textContent = o.profile;
  $("shift").hidden = !o.shift;
  $("conn").hidden = o.connected;
  const main = $("groups"); main.replaceChildren();
  for (const g of o.groups) {
    const sec = document.createElement("section");
    const h = document.createElement("h2"); h.textContent = g.title; sec.append(h);
    for (const r of g.rows) {
      const row = document.createElement("div"); row.className = "row" + (r.active ? " on" : "");
      const c = document.createElement("span"); c.className = "c"; c.textContent = r.control;
      const a = document.createElement("span"); a.className = "a"; a.textContent = r.action; a.title = r.action;
      row.append(c, a); sec.append(row);
    }
    main.append(sec);
  }
}
async function poll() {
  try { const r = await fetch("/api/overlay", { headers: { "X-SBBridge": "1" } }); if (r.ok) render(await r.json()); } catch (e) { /* service restarting */ }
  setTimeout(poll, document.hidden ? 1000 : 120);
}
poll();
