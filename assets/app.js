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

const rq = (f) => window.requestAnimationFrame(f);
const nM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

sll(".sec, .crd, .wrk-itm, .sdbr-auth, .gal-fig, .vid-card, .dtl, .ntf, .chps, .btns, .src-lst").forEach((e) => {
  const p = e.parentElement;
  const i = p ? Array.prototype.indexOf.call(p.children, e) : 0;
  e.style.setProperty("--i", String(Math.min(i, 14)));
});

if (!nM) {
  sll("details.dtl").forEach((d) => {
    const sm = d.querySelector("summary");
    const cnt = d.querySelector(".dtl-cnt");
    if (!sm || !cnt) return;
    sm.addEventListener("click", (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if (d.open) {
        cnt.style.height = cnt.scrollHeight + "px";
        rq(() => {
          cnt.style.transition = "height 300ms cubic-bezier(0.2,0,0,1)";
          cnt.style.height = "0px";
        });
        const fn = () => {
          d.open = false;
          cnt.style.height = "";
          cnt.style.transition = "";
          cnt.removeEventListener("transitionend", fn);
        };
        cnt.addEventListener("transitionend", fn);
      } else {
        d.open = true;
        const h = cnt.scrollHeight;
        cnt.style.height = "0px";
        rq(() => {
          cnt.style.transition = "height 450ms cubic-bezier(0.05,0.7,0.1,1)";
          cnt.style.height = h + "px";
        });
        const fn = () => {
          cnt.style.height = "";
          cnt.style.transition = "";
          cnt.removeEventListener("transitionend", fn);
        };
        cnt.addEventListener("transitionend", fn);
      }
    });
  });
}

const fab = byd("fab");
const tbr = dcmnt.querySelector(".tbr");
const nScr = () => {
  const y = window.scrollY || 0;
  if (fab) fab.classList.toggle("fab--vis", y > 480);
  if (tbr) tbr.classList.toggle("tbr--hi", y > 12);
};
window.addEventListener("scroll", nScr, { passive: true });
nScr();
if (fab) {
  fab.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: nM ? "auto" : "smooth" });
  });
}
