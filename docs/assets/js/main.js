(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };

  // ---------- theme: dark by default, light on toggle
  var toggle = $(".theme-toggle");
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    toggle.textContent = theme;
    toggle.setAttribute("aria-pressed", String(theme === "light"));
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  setTheme(saved === "light" ? "light" : "dark");
  toggle.addEventListener("click", function () {
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  // ---------- hero prompt types once (~40ms per character)
  var typed = $("[data-type]");
  if (typed && !reduced) {
    var text = typed.textContent;
    var i = 0;
    typed.textContent = "";
    (function tick() {
      typed.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, 40);
    })();
  }

  // ---------- scroll progress
  var bar = $(".progress");
  var ticking = false;
  function progress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(progress); }
  }, { passive: true });
  progress();

  // ---------- write-ups: technical vs plain-language steps
  var reports = $(".reports");
  var modeButtons = $$("[data-mode]");
  function setMode(mode) {
    reports.classList.toggle("plain", mode === "plain");
    modeButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === mode));
    });
  }
  modeButtons.forEach(function (b) {
    b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
  });

  // ---------- path filter
  var filterButtons = $$("[data-filter]");
  function setFilter(kind) {
    filterButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === kind));
    });
    $$(".year").forEach(function (year) {
      var shown = 0;
      $$("li", year).forEach(function (li) {
        var on = kind === "all" || li.getAttribute("data-kind") === kind;
        li.hidden = !on;
        if (on) { shown++; li.classList.add("in"); }
      });
      year.hidden = shown === 0;
    });
  }
  filterButtons.forEach(function (b) {
    b.addEventListener("click", function () { setFilter(b.getAttribute("data-filter")); });
  });

  // ---------- certificate rail arrows
  var rail = $(".rail");
  $$("[data-rail]").forEach(function (b) {
    b.addEventListener("click", function () {
      rail.scrollBy({ left: Number(b.getAttribute("data-rail")) * 612, behavior: reduced ? "auto" : "smooth" });
    });
  });

  // ---------- lightbox with previous / next inside a gallery
  var box = $(".lightbox");
  var boxImg = $("img", box);
  var boxName = $(".lightbox-name", box);
  var group = [];
  var at = 0;
  function show(index) {
    at = (index + group.length) % group.length;
    var el = group[at];
    boxImg.src = el.getAttribute("data-full");
    boxImg.alt = el.getAttribute("data-alt") || "";
    boxName.textContent = (group.length > 1 ? at + 1 + " / " + group.length + " · " : "") + el.getAttribute("data-full").split("/").pop();
  }
  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-full]");
    if (trigger) {
      var gallery = trigger.closest(".rail, .mosaic");
      group = gallery ? $$("[data-full]", gallery) : [trigger];
      box.classList.toggle("single", group.length < 2);
      show(group.indexOf(trigger));
      box.showModal();
      return;
    }
    if (event.target.closest(".lightbox-prev")) return show(at - 1);
    if (event.target.closest(".lightbox-next")) return show(at + 1);
    if (event.target === box || event.target.closest(".lightbox-close")) box.close();
  });
  box.addEventListener("keydown", function (event) {
    if (group.length < 2) return;
    if (event.key === "ArrowLeft") show(at - 1);
    if (event.key === "ArrowRight") show(at + 1);
  });

  // ---------- cards light up under the pointer
  if (window.matchMedia("(hover: hover)").matches) {
    $$(".report, .proj, .tool, .stats li").forEach(function (card) {
      card.classList.add("spot");
      card.addEventListener("pointermove", function (event) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", event.clientX - r.left + "px");
        card.style.setProperty("--my", event.clientY - r.top + "px");
      });
    });
  }

  // ---------- nav highlight, reveal on scroll, stat count-up
  var links = $$(".nav-links a");
  function countUp(el) {
    var target = Number(el.getAttribute("data-count"));
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / 700);
      var value = Math.round(target * t);
      el.textContent = (value < 10 ? "0" : "") + value;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          if (link.getAttribute("href") === "#" + entry.target.id) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    $$("section[id]").forEach(function (section) { spy.observe(section); });

    if (!reduced) {
      var reveal = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          var counter = $("[data-count]", entry.target);
          if (counter) countUp(counter);
          reveal.unobserve(entry.target);
        });
      }, { threshold: 0.05 });
      $$(".stats li, .report, .proj, .sowhat, .tool, .year li, .tile, .cta").forEach(function (el) {
        el.classList.add("reveal");
        reveal.observe(el);
      });
    }
  }

  // ---------- interactive terminal
  // Output is built with textContent and createElement only, so typed input is never parsed as HTML.
  var term = $("#term");
  var out = $(".term-out", term);
  var form = $(".term-in", term);
  var input = $("#cmd");
  var history = [];
  var cursor = 0;
  var LINKS = {
    github: "https://github.com/Ahmadaduwa",
    htb: "https://app.hackthebox.com/users/1704621",
    medium: "https://medium.com/@adu27747g",
    facebook: "https://www.facebook.com/amadaduwa.daoh.1",
    email: "mailto:adu27747g@gmail.com"
  };
  var SECTIONS = ["writeups", "projects", "toolbox", "path", "contact"];
  var ABOUT = $$(".facts dt", term).map(function (dt) { return dt.textContent + ": " + dt.nextElementSibling.textContent; });

  function line(text, cls) {
    var p = document.createElement("p");
    if (cls) p.className = cls;
    p.textContent = text;
    out.appendChild(p);
    return p;
  }
  function linkLine(label, href) {
    var p = document.createElement("p");
    var a = document.createElement("a");
    a.href = href;
    a.rel = "noopener";
    a.textContent = label;
    p.appendChild(document.createTextNode("→ "));
    p.appendChild(a);
    out.appendChild(p);
  }
  function go(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
  function titles(sel) {
    return $$(sel).map(function (h) { return h.textContent.trim(); });
  }

  var COMMANDS = {
    help: function () {
      line("whoami            ผมคือใคร");
      line("ls                ดูว่ามีอะไรในเว็บนี้");
      line("cat about.yml     ข้อมูลย่อ");
      line("writeups          รายงาน pentest");
      line("projects          งานที่สร้าง");
      line("toolbox | path    เครื่องมือ / เส้นทาง");
      line("explain           สลับคำอธิบายแบบคนทั่วไป");
      line("open <name>       เปิดลิงก์");
      line("  github htb medium facebook email");
      line("theme             สลับ dark / light");
      line("contact · clear");
    },
    whoami: function () {
      line("Ahmad-aduwa Da-oh (Wa)");
      line("Pentester who can explain.", "ok");
    },
    ls: function () { line(SECTIONS.map(function (s) { return s + "/"; }).join("  ")); },
    cat: function (arg) {
      if (arg !== "about.yml") return line("cat: " + (arg || "") + ": No such file — ลอง cat about.yml", "err");
      ABOUT.forEach(function (row) { line(row); });
    },
    writeups: function () {
      $$(".report").forEach(function (r) {
        linkLine("[" + $(".badge", r).textContent + "] " + $("h3", r).textContent.trim(), $("h3 a", r).href);
      });
      go("writeups");
    },
    projects: function () {
      titles(".proj h3").forEach(function (t, n) { line(n + 1 + ". " + t); });
      go("projects");
    },
    toolbox: function () {
      $$(".tool").forEach(function (t) {
        line($("h3", t).textContent + ": " + $$("li", t).map(function (li) { return li.textContent; }).join(", "));
      });
      go("toolbox");
    },
    path: function () {
      line("ไปที่เส้นทาง 2024 → 2027");
      go("path");
    },
    contact: function () {
      Object.keys(LINKS).forEach(function (k) { linkLine(k, LINKS[k]); });
      go("contact");
    },
    open: function (arg) {
      if (!LINKS[arg]) return line("open: ใช้ได้กับ " + Object.keys(LINKS).join(", "), "err");
      linkLine("เปิด " + arg, LINKS[arg]);
    },
    theme: function (arg) {
      var next = arg === "dark" || arg === "light" ? arg : root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
      line("theme: " + next, "ok");
    },
    explain: function () {
      var plain = !reports.classList.contains("plain");
      setMode(plain ? "plain" : "tech");
      line(plain ? "writeups: อธิบายแบบคนทั่วไป" : "writeups: technical", "ok");
      go("writeups");
    },
    sudo: function () { line("wa is not in the sudoers file. This incident will be reported.", "err"); },
    clear: function () { out.textContent = ""; }
  };
  COMMANDS.cd = function (arg) {
    var id = (arg || "").replace(/\/$/, "");
    if (SECTIONS.indexOf(id) < 0) return line("cd: no such directory: " + (arg || ""), "err");
    COMMANDS[id]();
  };

  function run(raw) {
    var text = raw.trim().slice(0, 80);
    if (!text) return;
    var echo = line("", "term-cmd");
    var who = document.createElement("span");
    who.className = "signal";
    who.textContent = "wa@victus:~$";
    echo.appendChild(who);
    echo.appendChild(document.createTextNode(" " + text));
    var parts = text.split(/\s+/);
    var name = parts[0].toLowerCase().replace(/^\.\//, "");
    if (Object.prototype.hasOwnProperty.call(COMMANDS, name)) COMMANDS[name]((parts[1] || "").toLowerCase());
    else line("command not found: " + parts[0] + " — ลอง help", "err");
    history.push(text);
    cursor = history.length;
    out.scrollTop = out.scrollHeight;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    run(input.value);
    input.value = "";
  });
  input.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp" && cursor > 0) {
      event.preventDefault();
      input.value = history[--cursor];
    } else if (event.key === "ArrowDown" && cursor < history.length) {
      event.preventDefault();
      input.value = history[++cursor] || "";
    } else if (event.key === "Tab" && input.value) {
      var match = Object.keys(COMMANDS).filter(function (c) { return c.indexOf(input.value.toLowerCase()) === 0; });
      if (match.length === 1) {
        event.preventDefault();
        input.value = match[0];
      }
    }
  });
  $$("[data-cmd]", term).forEach(function (b) {
    b.addEventListener("click", function () { run(b.getAttribute("data-cmd")); });
  });
  out.addEventListener("click", function (event) {
    if (!event.target.closest("a") && !window.getSelection().toString()) input.focus({ preventScroll: true });
  });
})();
