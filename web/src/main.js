// Steel Battalion Bridge - shared UI (Windows WebView2 + Linux browser), built on Fluent UI Web Components (Fluent 2).
import { setTheme } from "@fluentui/web-components";
import { webLightTheme, webDarkTheme } from "@fluentui/tokens";
import "@fluentui/web-components/badge/define.js";
import "@fluentui/web-components/button/define.js";
import "@fluentui/web-components/checkbox/define.js";
import "@fluentui/web-components/dialog/define.js";
import "@fluentui/web-components/dialog-body/define.js";
import "@fluentui/web-components/divider/define.js";
import "@fluentui/web-components/dropdown/define.js";
import "@fluentui/web-components/link/define.js";
import "@fluentui/web-components/listbox/define.js";
import "@fluentui/web-components/menu/define.js";
import "@fluentui/web-components/menu-button/define.js";
import "@fluentui/web-components/menu-item/define.js";
import "@fluentui/web-components/menu-list/define.js";
import "@fluentui/web-components/message-bar/define.js";
import "@fluentui/web-components/option/define.js";
import "@fluentui/web-components/slider/define.js";
import "@fluentui/web-components/switch/define.js";
import "@fluentui/web-components/tab/define.js";
import "@fluentui/web-components/tablist/define.js";
import "@fluentui/web-components/text-input/define.js";

// ---------------------------------------------------------------- theme (follows the OS light/dark setting)
const dark = window.matchMedia("(prefers-color-scheme: dark)");
const applyTheme = () => setTheme(dark.matches ? webDarkTheme : webLightTheme);
applyTheme();
dark.addEventListener("change", applyTheme);

const $ = id => document.getElementById(id);
let meta = null, profile = null, selIndex = -1, st = null, learning = null, saveTimer = null, tab = "live";

// ---------------------------------------------------------------- helpers
async function api(method, path, body) {
  const opt = { method, headers: { "X-SBBridge": "1" } };
  if (method !== "GET") { opt.headers["Content-Type"] = "application/json"; opt.body = JSON.stringify(body === undefined ? {} : body); }
  const r = await fetch(path, opt);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "HTTP " + r.status);
  return j;
}
function el(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === "class") e.className = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, "");
    else if (v !== undefined && v !== null && v !== false) e.setAttribute(k, v);
  }
  for (const k of kids) if (k !== null && k !== undefined) e.append(k);
  return e;
}
function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600); }
const ctl = id => meta.controls.find(c => c.id === id) || { id, name: "(none)", kind: "None" };
const human = s => s.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^D(\d)$/, "$1").replace(/^NumPad/, "Numpad ");

/** Fluent dropdown with options; `selected` attribute sets the initial value reliably. */
function dropdown(values, labels, value, onChange, opts = {}) {
  const lb = el("fluent-listbox");
  values.forEach((v, i) => lb.append(el("fluent-option", { value: v, selected: v === value }, labels ? labels[i] : v)));
  const dd = el("fluent-dropdown", { placeholder: opts.placeholder || "Select…", type: opts.combobox ? "combobox" : null, "aria-label": opts.label }, lb);
  dd.addEventListener("change", () => { const v = dd.value; if (v !== null && v !== undefined) onChange(v); });
  return dd;
}
function field(label, control, hint) {
  const id = "f" + Math.random().toString(36).slice(2, 8);
  control.id = id;
  return el("div", { class: "field" }, el("label", { for: id }, label), control, hint ? el("span", { class: "hint" }, hint) : null);
}
function textInput(value, type, onInput, attrs = {}) {
  const t = el("fluent-text-input", Object.assign({ type, value: value ?? "" }, attrs));
  t.addEventListener("input", () => onInput(t.value));
  t.addEventListener("change", () => onInput(t.value));
  return t;
}
function toggle(label, checked, onChange) {
  const s = el("fluent-switch", { checked: !!checked }, label);
  s.addEventListener("change", () => onChange(!!s.checked));
  return s;
}

/** Modal text prompt using fluent-dialog. Resolves to the text or null. */
function ask(title, value) {
  return new Promise(resolve => {
    const d = $("dlg"), input = $("dlgInput");
    $("dlgTitle").textContent = title;
    input.value = value || "";
    const done = v => { $("dlgOk").onclick = $("dlgCancel").onclick = null; input.onkeydown = null; d.hide(); resolve(v); };
    $("dlgOk").onclick = () => done(input.value.trim() || null);
    $("dlgCancel").onclick = () => done(null);
    input.onkeydown = e => { if (e.key === "Enter") done(input.value.trim() || null); };
    d.show();
    setTimeout(() => input.focus(), 50);
  });
}
function askConfirm(title) {
  return new Promise(resolve => {
    const d = $("dlg"), input = $("dlgInput");
    $("dlgTitle").textContent = title; input.hidden = true;
    const done = v => { $("dlgOk").onclick = $("dlgCancel").onclick = null; input.hidden = false; d.hide(); resolve(v); };
    $("dlgOk").onclick = () => done(true);
    $("dlgCancel").onclick = () => done(false);
    d.show();
  });
}
async function act(promise, okMsg) { try { const r = await promise; if (okMsg) toast(okMsg); return r; } catch (e) { toast(e.message); return null; } }

// ---------------------------------------------------------------- tabs
$("tabs").addEventListener("change", () => {
  const id = $("tabs").activeid || "tab-live";
  tab = id.replace("tab-", "");
  for (const p of document.querySelectorAll(".panel")) p.hidden = p.id !== "panel-" + tab;
});

// ---------------------------------------------------------------- profiles
async function loadProfiles() {
  const p = await api("GET", "/api/profiles");
  const host = $("profileHost"); host.innerHTML = "";
  host.append(dropdown(p.names, null, p.active, async name => {
    if (name === profile?.name) return;
    await flushSave();
    await act(api("POST", "/api/profiles/select", { name }), "Profile: " + name);
    await loadProfiles();
  }, { label: "Profile" }));
  profile = await api("GET", "/api/profile");
  selIndex = -1; renderBindings(); renderEditor();
}
$("miNew").addEventListener("click", async () => { const n = await ask("New profile name", "My profile"); if (n) { await flushSave(); await act(api("POST", "/api/profiles/new", { name: n, copy: false })); await loadProfiles(); } });
$("miCopy").addEventListener("click", async () => { const n = await ask("Duplicate profile as", profile.name + " copy"); if (n) { await flushSave(); await act(api("POST", "/api/profiles/new", { name: n, copy: true })); await loadProfiles(); } });
$("miRename").addEventListener("click", async () => { const n = await ask("Rename profile", profile.name); if (n && n !== profile.name) { await flushSave(); await act(api("POST", "/api/profiles/rename", { name: n })); await loadProfiles(); } });
$("miDelete").addEventListener("click", async () => { if (await askConfirm("Delete the profile “" + profile.name + "”?")) { await act(api("POST", "/api/profiles/delete"), "Profile deleted"); await loadProfiles(); } });
$("miDefaults").addEventListener("click", async () => { if (await askConfirm("Restore the built-in profiles? Your own profiles are kept; edited built-in ones are overwritten.")) { await act(api("POST", "/api/profiles/reset-defaults"), "Built-in profiles restored"); await loadProfiles(); } });

function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 400); }
async function save() { saveTimer = null; try { await api("PUT", "/api/profile", profile); } catch (e) { toast("Couldn't save: " + e.message); } }
async function flushSave() { if (saveTimer) { clearTimeout(saveTimer); await save(); } }

// ---------------------------------------------------------------- bindings list
const isAxis = b => ctl(b.control).kind === "Axis";
const buttonLike = b => ["XboxButton", "Key", "MouseButton"].includes(b.output);
function targetText(b) {
  switch (b.output) {
    case "XboxButton": return "Xbox " + human(b.xboxButton);
    case "XboxAxis": return "Xbox " + human(b.xboxAxis);
    case "Key": return "Key " + (b.withCtrl ? "Ctrl+" : "") + (b.withShift ? "Shift+" : "") + (b.withAlt ? "Alt+" : "") + human(b.key);
    case "MouseButton": return "Mouse " + human(b.mouseButton);
    case "MouseMove": return "Mouse " + b.mouseAxis + " movement";
    default: return "—";
  }
}
const modeText = b => buttonLike(b) ? (isAxis(b) ? b.direction + " past " + b.threshold : human(b.mode)) : (b.invert ? "Inverted" : "");
const layerText = b => b.layer === "Always" ? "" : (b.layer === "ShiftedOnly" ? "Shift" : "Normal");

function renderBindings() {
  const tb = $("bindRows"); tb.innerHTML = "";
  profile.bindings.forEach((b, i) => {
    const tr = el("tr", { class: "clickable" + (i === selIndex ? " sel" : ""), onclick: () => { selIndex = i; renderBindings(); renderEditor(); } },
      el("td", {}, ctl(b.control).name), el("td", {}, layerText(b)), el("td", {}, targetText(b)), el("td", {}, modeText(b)), el("td", { class: "note" }, b.note || ""));
    tr.dataset.control = b.control;
    tb.append(tr);
  });
  const sh = $("shiftHost"); sh.innerHTML = "";
  const btns = meta.controls.filter(c => c.kind === "Button" || c.kind === "VirtualButton");
  sh.append(dropdown(["None"].concat(btns.map(c => c.id)), ["None"].concat(btns.map(c => c.name)), profile.shiftControl || "None",
    v => { profile.shiftControl = v; scheduleSave(); }, { label: "Shift control" }));
}
function refreshRow() {
  const b = profile.bindings[selIndex], tr = $("bindRows").children[selIndex];
  if (!b || !tr) return;
  [ctl(b.control).name, layerText(b), targetText(b), modeText(b), b.note || ""].forEach((t, i) => tr.children[i].textContent = t);
}
function newBinding(control) {
  const axis = control && ctl(control).kind === "Axis";
  return { control: control || "None", layer: "Always", output: axis ? "XboxAxis" : "XboxButton", xboxButton: "A", xboxAxis: "LeftStickX", key: "None",
    withCtrl: false, withShift: false, withAlt: false, mouseButton: "Left", mouseAxis: "X", mouseSpeed: 1200, mode: "Hold", pulseMs: 60,
    direction: "Positive", threshold: 0.5, invert: false, deadzone: 0.05, curve: 1, oneSidedToFullRange: false, scale: 1, note: "" };
}
$("btnAdd").addEventListener("click", () => { profile.bindings.push(newBinding()); selIndex = profile.bindings.length - 1; renderBindings(); renderEditor(); scheduleSave(); });
$("btnDup").addEventListener("click", () => { if (selIndex < 0) return; profile.bindings.splice(selIndex + 1, 0, JSON.parse(JSON.stringify(profile.bindings[selIndex]))); selIndex++; renderBindings(); renderEditor(); scheduleSave(); });
$("btnRemove").addEventListener("click", () => { if (selIndex < 0) return; profile.bindings.splice(selIndex, 1); selIndex = Math.min(selIndex, profile.bindings.length - 1); renderBindings(); renderEditor(); scheduleSave(); });
$("btnSort").addEventListener("click", () => { const order = meta.controls.map(c => c.id); profile.bindings.sort((a, b) => order.indexOf(a.control) - order.indexOf(b.control)); selIndex = -1; renderBindings(); renderEditor(); scheduleSave(); });

// ---------------------------------------------------------------- binding editor
function renderEditor() {
  const box = $("editorFields"); box.innerHTML = "";
  const b = profile.bindings[selIndex];
  $("editorEmpty").hidden = !!b;
  if (!b) return;
  const axis = isAxis(b), bl = buttonLike(b);
  const set = (k, rerender) => v => { b[k] = v; scheduleSave(); refreshRow(); if (rerender) renderEditor(); };
  const num = (k, min, max, step) => textInput(b[k], "number", v => { const n = parseFloat(v); if (!isNaN(n)) set(k)(Math.max(min, Math.min(max, n))); }, { min, max, step });
  const sel = (k, values, rerender, labels, opts) => dropdown(values, labels || values.map(human), b[k], set(k, rerender), opts);

  box.append(el("div", { class: "section-label" }, "Source"));
  box.append(field("Control", sel("control", ["None"].concat(meta.controls.map(c => c.id)), true, ["(none)"].concat(meta.controls.map(c => c.name)), { combobox: true })));
  box.append(field("Layer", sel("layer", meta.layers), "Always = both layers. Normal only / Shifted only follow the Shift control."));

  box.append(el("div", { class: "section-label" }, "Output"));
  box.append(field("Output", sel("output", meta.outputKinds, true)));
  if (b.output === "XboxButton") box.append(field("Xbox button", sel("xboxButton", meta.xboxButtons)));
  if (b.output === "XboxAxis") box.append(field("Xbox stick or trigger", sel("xboxAxis", meta.xboxAxes)));
  if (b.output === "Key") {
    box.append(field("Key", sel("key", meta.keys, false, null, { combobox: true })));
    box.append(toggle("Hold Ctrl", b.withCtrl, set("withCtrl")), toggle("Hold Shift", b.withShift, set("withShift")), toggle("Hold Alt", b.withAlt, set("withAlt")));
  }
  if (b.output === "MouseButton") box.append(field("Mouse button", sel("mouseButton", meta.mouseButtons)));
  if (b.output === "MouseMove") { box.append(field("Mouse axis", sel("mouseAxis", meta.mouseAxes))); box.append(field("Speed (pixels per second)", num("mouseSpeed", 0, 20000, 50))); }

  if (bl && !axis) {
    box.append(el("div", { class: "section-label" }, "Behaviour"));
    box.append(field("Mode", sel("mode", meta.modes), "Hold mirrors the control. Pulse taps once on press. Pulse on change taps whenever a latching switch flips. Toggle latches on/off."));
    box.append(field("Pulse length (ms)", num("pulseMs", 10, 2000, 10)));
  }
  if (axis && bl) {
    box.append(el("div", { class: "section-label" }, "Axis as button"));
    box.append(field("Direction", sel("direction", meta.directions), "Which way the axis must move to press it."));
    box.append(field("Threshold (0–1)", num("threshold", 0, 1, 0.05)));
    box.append(toggle("Invert axis", b.invert, set("invert")));
  }
  if (!axis && b.output === "XboxAxis") box.append(field("Direction", sel("direction", meta.directions), "Pushes the stick this way while the button is held."));
  if (axis && (b.output === "XboxAxis" || b.output === "MouseMove")) {
    box.append(el("div", { class: "section-label" }, "Axis tuning"));
    box.append(toggle("Invert axis", b.invert, set("invert")));
    box.append(field("Dead zone (0–0.9)", num("deadzone", 0, 0.9, 0.01)));
    box.append(field("Curve", num("curve", 0.1, 5, 0.1), "1 = linear, 2 = finer control near the centre."));
    box.append(field("Scale", num("scale", 0, 4, 0.05)));
    if (b.output === "XboxAxis") box.append(toggle("Pedal/dial uses the stick's full range", b.oneSidedToFullRange, set("oneSidedToFullRange")));
  }
  box.append(el("div", { class: "section-label" }, "Note"));
  box.append(field("Note", textInput(b.note, "text", set("note"), { placeholder: "What this does in-game" })));
}

// ---------------------------------------------------------------- learn
$("btnLearn").addEventListener("click", () => {
  if (!st || !st.connected) { toast("Connect the controller first"); return; }
  learning = JSON.parse(JSON.stringify(st)); renderBars();
});
function learnTick() {
  if (!learning || !st || !st.connected) return;
  let hit = null;
  for (const c of meta.controls) {
    const was = learning.down.includes(c.id), now = st.down.includes(c.id);
    if (c.kind === "Button" && was !== now) { hit = c.id; break; }
    if (c.kind === "VirtualButton" && now && !was) { hit = c.id; break; }
    if (c.calibratable && Math.abs(st.axes[c.id].value - learning.axes[c.id].value) > 0.45) { hit = c.id; break; }
  }
  if (!hit) return;
  learning = null; renderBars();
  const cur = profile.bindings[selIndex], axis = ctl(hit).kind === "Axis";
  if (cur && cur.control === "None") { cur.control = hit; if (axis && cur.output === "XboxButton") cur.output = "XboxAxis"; }
  else { profile.bindings.push(newBinding(hit)); selIndex = profile.bindings.length - 1; }
  if (tab !== "bindings") $("tabs").activeid = "tab-bindings";
  renderBindings(); renderEditor(); scheduleSave();
  toast("Learned: " + ctl(hit).name);
}

// ---------------------------------------------------------------- live view
function buildLive() {
  const g = $("liveGrid"); g.innerHTML = "";
  for (const [kind, title] of [["Axis", "Axes"], ["Button", "Buttons and switches"], ["VirtualButton", "Gear lever and tuner dial"]]) {
    g.append(el("div", { class: "group-title" }, title));
    for (const c of meta.controls.filter(c => c.kind === kind)) {
      const val = el("span", { class: "val" });
      const right = kind === "Axis" ? el("span", {}, el("span", { class: "meter" + (c.bipolar ? " bi" : "") }, el("i")), val) : val;
      const row = el("div", { class: "ctl", id: "live-" + c.id }, el("span", {}, c.name), right);
      g.append(row);
    }
  }
}
function renderLive() {
  for (const c of meta.controls) {
    const row = $("live-" + c.id); if (!row) continue;
    const val = row.querySelector(".val");
    if (c.kind === "Axis") {
      const a = st.axes[c.id], v = a.value, i = row.querySelector(".meter i");
      val.textContent = (v >= 0 ? "+" : "") + v.toFixed(2);
      if (c.bipolar) { i.style.left = (v >= 0 ? 50 : 50 + v * 50) + "%"; i.style.width = Math.abs(v) * 50 + "%"; }
      else { i.style.left = "0"; i.style.width = v * 100 + "%"; }
    } else {
      const on = st.down.includes(c.id); row.classList.toggle("on", on); val.textContent = on ? "On" : "";
    }
  }
  const p = st.pad, pos = v => (v / 32768) * 34;
  $("dotL").style.transform = `translate(${pos(p.lx)}px, ${-pos(p.ly)}px)`;
  $("dotR").style.transform = `translate(${pos(p.rx)}px, ${-pos(p.ry)}px)`;
  $("trigL").style.height = (p.lt / 255 * 100) + "%"; $("trigR").style.height = (p.rt / 255 * 100) + "%";
  const pb = $("padButtons"); pb.innerHTML = "";
  for (const b of meta.xboxButtons.filter(x => !x.endsWith("Full")))
    pb.append(el("fluent-badge", { appearance: p.buttons.includes(b) ? "filled" : "ghost", color: p.buttons.includes(b) ? "brand" : "informative", size: "small" }, human(b)));
  $("rawHex").textContent = st.raw;
  $("rate").textContent = st.connected ? st.reportsPerSecond + " reports per second" : "Not connected";
}
$("btnLeds").addEventListener("click", () => act(api("POST", "/api/leds/test")));

// ---------------------------------------------------------------- calibration
function renderCal() {
  const tb = $("calRows");
  if (!tb.children.length) for (const c of st.calibration) {
    const tr = el("tr", { id: "cal-" + c.id }, el("td", {}, ctl(c.id).name));
    for (let i = 0; i < 6; i++) tr.append(el("td", { class: "num" }));
    tb.append(tr);
  }
  for (const c of st.calibration) {
    const tds = $("cal-" + c.id).children, a = st.axes[c.id];
    tds[1].textContent = a.raw;
    tds[2].textContent = st.calibrating && c.seenMin !== null ? c.seenMin : c.min;
    tds[3].textContent = st.calibrating ? "at finish" : (ctl(c.id).bipolar ? c.center : "–");
    tds[4].textContent = st.calibrating && c.seenMax !== null ? c.seenMax : c.max;
    tds[5].textContent = (a.value >= 0 ? "+" : "") + a.value.toFixed(2);
    tds[6].textContent = st.calibrating && c.seenMin !== null && c.seenMax - c.seenMin >= 100 ? "✓ moved" : "";
  }
  $("btnCalStart").disabled = st.calibrating; $("btnCalFinish").disabled = !st.calibrating; $("btnCalCancel").disabled = !st.calibrating;
  $("btnCalFinish").setAttribute("appearance", st.calibrating ? "primary" : "secondary");
}
$("btnCalStart").addEventListener("click", () => act(api("POST", "/api/calibration/start")));
$("btnCalFinish").addEventListener("click", async () => { const r = await act(api("POST", "/api/calibration/finish")); if (r) toast("Calibrated " + r.updated + " axes"); });
$("btnCalCancel").addEventListener("click", () => act(api("POST", "/api/calibration/cancel")));
$("btnCalReset").addEventListener("click", async () => { if (await askConfirm("Reset all axis calibration to the defaults?")) act(api("POST", "/api/calibration/reset"), "Calibration reset"); });

// ---------------------------------------------------------------- settings
let settingsBusy = false;
async function loadSettings() {
  const s = await api("GET", "/api/settings");
  settingsBusy = true;
  $("swLed").checked = s.ledFeedback;
  $("slBright").value = String(s.ledBright); $("vBright").textContent = s.ledBright;
  $("slDim").value = String(s.ledDim); $("vDim").textContent = s.ledDim;
  const host = $("platformToggles"); host.innerHTML = "";
  if (s.toggles.length) host.append(el("div", { class: "section-label" }, "App"));
  for (const t of s.toggles) host.append(toggle(t.label, t.value, v => act(api("PUT", "/api/settings", { toggles: { [t.id]: v } }))));
  settingsBusy = false;
}
const putLed = () => { if (settingsBusy) return; $("vBright").textContent = $("slBright").value; $("vDim").textContent = $("slDim").value;
  act(api("PUT", "/api/settings", { ledFeedback: !!$("swLed").checked, ledBright: +$("slBright").value, ledDim: +$("slDim").value })); };
$("swLed").addEventListener("change", putLed); $("slBright").addEventListener("change", putLed); $("slDim").addEventListener("change", putLed);
$("swOutput").addEventListener("change", () => act(api("POST", "/api/output", { enabled: !!$("swOutput").checked })));

// ---------------------------------------------------------------- status, message bars, polling
let lastBars = "";
function renderBars() {
  const items = [];
  if (failures >= 3) items.push({ intent: "error", title: "Lost connection to Steel Battalion Bridge.", text: meta && meta.platform === "linux" ? "Is the service running? systemctl --user status sbbridge" : "Restart the app." });
  else if (st) {
    if (learning) items.push({ intent: "info", title: "Learning…", text: "Press a button, flip a switch or push an axis on the controller.", cancel: true });
    if (!st.connected) items.push({ intent: "warning", title: "Controller not connected.", text: st.usbStatus, actions: st.actions });
    else if (st.actions && st.actions.length) items.push({ intent: "warning", title: "Action needed.", text: "", actions: st.actions });
    if (!st.padOk) items.push({ intent: "error", title: "Virtual Xbox controller unavailable.", text: st.padStatus, actions: st.connected ? [] : null });
    if (!st.outputEnabled) items.push({ intent: "info", title: "Output is off.", text: "Games won't receive input until you turn Output on." });
  }
  const key = JSON.stringify(items);
  if (key === lastBars) return;
  lastBars = key;
  const host = $("bars"); host.innerHTML = "";
  for (const it of items) {
    const bar = el("fluent-message-bar", { intent: it.intent, layout: "singleline" }, el("b", {}, it.title + " "), it.text || "");
    for (const a of it.actions || []) {
      const btn = el("fluent-button", { slot: "actions", size: "small", appearance: a.primary ? "primary" : "secondary", title: a.description || "" }, a.label);
      btn.addEventListener("click", async () => { btn.disabled = true; const r = await act(api("POST", "/api/action", { id: a.id })); if (r && r.message) toast(r.message); btn.disabled = false; });
      bar.append(btn);
    }
    if (it.cancel) { const c = el("fluent-button", { slot: "actions", size: "small" }, "Cancel"); c.addEventListener("click", () => { learning = null; renderBars(); }); bar.append(c); }
    host.append(bar);
  }
}
function badge(ok, warn, text) { return el("fluent-badge", { appearance: "tint", color: ok ? "success" : (warn ? "warning" : "danger"), shape: "rounded" }, text); }
let lastStatus = "";
function renderStatus() {
  const inputOk = /^Virtual/.test(st.inputStatus || "");
  const key = [st.connected, st.padOk, inputOk].join();
  if (key !== lastStatus) {
    lastStatus = key;
    const s = $("status"); s.innerHTML = "";
    s.append(badge(st.connected, false, st.connected ? "Controller connected" : "No controller"),
             badge(st.padOk, false, st.padOk ? "Xbox controller active" : "No virtual controller"),
             badge(inputOk, true, inputOk ? "Keys active" : "Keys unavailable"));
  }
  if (document.activeElement !== $("swOutput")) $("swOutput").checked = st.outputEnabled;
  for (const tr of $("bindRows").children) {
    const id = tr.dataset.control, c = ctl(id);
    tr.classList.toggle("on", c.kind === "Axis" ? (st.axes[id] && Math.abs(st.axes[id].value) > 0.25) : st.down.includes(id));
  }
}
let failures = 0;
async function poll() {
  try {
    st = await api("GET", "/api/state"); failures = 0;
    renderStatus(); renderBars(); learnTick();
    if (tab === "live") renderLive();
    if (tab === "calibration") renderCal();
    if (profile && st.profile !== profile.name) await loadProfiles();
  } catch (e) {
    if (++failures === 3) renderBars();
  }
  setTimeout(poll, document.hidden ? 1000 : (tab === "settings" ? 500 : 100));
}

(async () => {
  meta = await api("GET", "/api/meta");
  $("version").textContent = "Version " + meta.version + " · " + (meta.platform === "windows" ? "Windows" : "Linux");
  $("serviceHint").textContent = meta.serviceHint || "";
  buildLive();
  await loadProfiles();
  await loadSettings();
  poll();
})();
