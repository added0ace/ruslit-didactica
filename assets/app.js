const dcmnt = document;
const strg = window.localStorage;
const byd = (x) => dcmnt.getElementById(x);
const sll = (s, r) => Array.from((r || dcmnt).querySelectorAll(s));
const dflt = { l: "lcl-thm" };
const rq = (f) => window.requestAnimationFrame(f);
const nM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pop = (el) => {
  if (nM || !el) return;
  const cls = el.id === "fab" ? "fab--spin" : "thm-pop";
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
};

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
    pop(thmBtn);
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
          cnt.style.transition = "height 500ms cubic-bezier(0.34,1.3,0.64,1)";
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
    pop(fab);
    window.scrollTo({ top: 0, behavior: nM ? "auto" : "smooth" });
  });
}

if (!nM) {
  dcmnt.addEventListener("click", (e) => {
    const a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || a.hasAttribute("download") || a.target === "_blank") return;
    if (a.origin !== location.origin) return;
    const h = a.getAttribute("href") || "";
    if (!h || h.startsWith("#") || h.startsWith("?")) return;
    window.setTimeout(() => {
      if (!dcmnt.querySelector(".m3-load")) {
        const el = dcmnt.createElement("div");
        el.className = "m3-load";
        el.setAttribute("aria-hidden", "true");
        dcmnt.body.appendChild(el);
      }
    }, 220);
  });
  window.addEventListener("pageshow", () => {
    const l = dcmnt.querySelector(".m3-load");
    if (l) l.remove();
  });
}

const POS_L = "txt-pos:";
const pgnt = (t, cap) => {
  const pages = [];
  let cur = "";
  for (const ln of t.split("\n")) {
    const add = cur ? "\n" + ln : ln;
    if (cur && cur.length + add.length > cap) {
      pages.push(cur);
      cur = ln;
    } else {
      cur += add;
    }
  }
  if (cur) pages.push(cur);
  return pages.length ? pages : [""];
};

sll("details.dtl[data-src]").forEach((dtl) => {
  const src = dtl.getAttribute("data-src");
  const cap = parseInt(dtl.getAttribute("data-cap"), 10) || 30000;
  const total = Math.max(1, parseInt(dtl.getAttribute("data-total"), 10) || 1);
  const key = dtl.getAttribute("data-key") || "";
  const txtEl = dtl.querySelector(".txt");
  if (!txtEl) return;
  let pages = null;
  let loading = null;
  let i = 0;
  let rsd = false;
  const saved = key ? parseInt(strg.getItem(POS_L + key) || "0", 10) || 0 : 0;
  const max = () => (pages ? pages.length : total);
  const paint = () => {
    if (pages) txtEl.textContent = pages[Math.min(i, pages.length - 1)];
    sll(".txt-page", dtl).forEach((e) => (e.textContent = `Стр. ${i + 1} из ${max()}`));
    sll(".txt-cur", dtl).forEach((e) => (e.textContent = String(i + 1)));
    sll(".txt-prev", dtl).forEach((b) => (b.disabled = i <= 0));
    sll(".txt-next", dtl).forEach((b) => (b.disabled = i >= max() - 1));
    sll(".txt-rst", dtl).forEach((b) => (b.hidden = i <= 0));
  };
  const load = () => {
    if (pages) return Promise.resolve(pages);
    if (!loading) {
      loading = fetch(src)
        .then((r) => r.text())
        .then((t) => {
          pages = pgnt(t, cap);
          return pages;
        });
    }
    return loading;
  };
  const navEl = dtl.querySelector(".txt-nav");
  const goto = (n, scroll) => {
    const run = () => {
      i = Math.max(0, Math.min(n, max() - 1));
      if (key) strg.setItem(POS_L + key, String(i));
      paint();
      if (scroll) (navEl || txtEl).scrollIntoView({ behavior: nM ? "auto" : "smooth", block: "start" });
    };
    if (pages || n <= 0) {
      run();
      return;
    }
    load().then(run);
  };
  dtl.addEventListener("click", (e) => {
    const b = e.target && e.target.closest ? e.target.closest("button") : null;
    if (!b || !dtl.contains(b)) return;
    if (b.classList.contains("txt-prev")) goto(i - 1, true);
    else if (b.classList.contains("txt-next")) goto(i + 1, true);
    else if (b.classList.contains("txt-top")) txtEl.scrollIntoView({ behavior: nM ? "auto" : "smooth", block: "start" });
    else if (b.classList.contains("txt-rst")) goto(0, true);
  });
  paint();
  if (saved > 0 && saved < total) {
    dtl.addEventListener("toggle", () => {
      if (!dtl.open || rsd) return;
      rsd = true;
      load().then(() => {
        goto(saved, false);
        sll(".txt-nav", dtl).forEach((n) => {
          n.classList.add("txt-nav--pulse");
          window.setTimeout(() => n.classList.remove("txt-nav--pulse"), 800);
        });
      });
    });
  }
});

const applySort = (mode) => {
  if (!sdbr) return;
  const items = sll(".sdbr-auth", sdbr);
  items.sort((x, y) => {
    if (mode === "az") {
      return (x.getAttribute("data-az") || "").localeCompare(y.getAttribute("data-az") || "", "ru");
    }
    return (+y.getAttribute("data-pop") || 0) - (+x.getAttribute("data-pop") || 0);
  });
  items.forEach((el) => sdbr.appendChild(el));
  sll(".sdbr-sort-btn").forEach((b) => b.classList.toggle("md3-chip-strong", b.getAttribute("data-sort") === mode));
  strg.setItem("sdbr-sort", mode);
};
sll(".sdbr-sort-btn").forEach((b) => b.addEventListener("click", () => applySort(b.getAttribute("data-sort"))));
if (sdbr) applySort(strg.getItem("sdbr-sort") || "pop");

sll("a.sdbr-avlnk").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    location.href = a.href;
  });
});
