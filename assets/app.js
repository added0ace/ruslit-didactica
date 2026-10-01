const dcmnt = document;
const strg = window.localStorage;
const byd = (x) => dcmnt.getElementById(x);
const sll = (s, r) => Array.from((r || dcmnt).querySelectorAll(s));
const dflt = { l: "lcl-thm" };

const thmBtn = byd("thm-btn");
const cur = strg.getItem(dflt.l);
if (cur) {
  dcmnt.documentElement.setAttribute("data-thm", cur);
} else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  dcmnt.documentElement.setAttribute("data-thm", "drk");
}
if (thmBtn) {
  thmBtn.addEventListener("click", () => {
    const now = dcmnt.documentElement.getAttribute("data-thm") === "drk" ? "lt" : "drk";
    dcmnt.documentElement.setAttribute("data-thm", now);
    strg.setItem(dflt.l, now);
    thmBtn.textContent = now === "drk" ? "☀️" : "🌙";
  });
  if (dcmnt.documentElement.getAttribute("data-thm") === "drk") thmBtn.textContent = "☀️";
}

const sdbr = byd("sdbr");
const scr = byd("scr");
const sdbrBtn = byd("sdbr-btn");
const clsSdbr = () => {
  if (sdbr) sdbr.classList.remove("sdbr--opn");
  if (scr) scr.classList.remove("scrim--opn");
};
if (sdbrBtn && sdbr) {
  sdbrBtn.addEventListener("click", () => {
    const opn = sdbr.classList.toggle("sdbr--opn");
    if (scr) scr.classList.toggle("scrim--opn", opn);
  });
}
if (scr) scr.addEventListener("click", clsSdbr);

const fltr = byd("fltr");
const auths = sll(".sdbr-auth");
const wrks = sll(".sdbr-wrk");
const appd = (el, q) => (el.textContent || "").toLowerCase().includes(q);

if (fltr && auths.length) {
  fltr.addEventListener("input", () => {
    const q = fltr.value.trim().toLowerCase();
    if (!q) {
      auths.forEach((a) => {
        a.hidden = false;
        sll(".sdbr-wrk", a).forEach((w) => (w.hidden = false));
      });
      return;
    }
    auths.forEach((a) => {
      const hd = a.querySelector(".sdbr-auth-hd");
      const wls = sll(".sdbr-wrk", a);
      if (!wls.length) {
        a.hidden = !appd(hd, q);
        return;
      }
      let n = 0;
      wls.forEach((w) => {
        const m = appd(w, q) || appd(hd, q);
        w.hidden = !m;
        if (m) n++;
      });
      a.hidden = n === 0;
      if (n) a.setAttribute("open", "");
    });
  });
}

const expBtn = byd("exp-btn");
if (expBtn) {
  expBtn.addEventListener("click", () => {
    const dts = sll("details.dtl");
    const open = dts.some((d) => !d.open);
    dts.forEach((d) => (d.open = open));
    expBtn.textContent = open ? "Свернуть все тексты" : "Развернуть все тексты";
  });
}

sll(".gal-fig img").forEach((im) => {
  im.addEventListener("error", () => {
    const f = im.closest(".gal-fig");
    if (f) f.remove();
  });
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") clsSdbr();
});
