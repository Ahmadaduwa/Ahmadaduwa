import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"

import { ABOUT, EMAIL, LINKS, PROJECTS, REPORTS, SECTIONS, TOOLBOX, type LinkKey, type SectionId } from "@/data"
import type { Theme } from "@/lib/hooks"

type Line =
  | { kind: "cmd" | "out" | "ok" | "err"; text: string }
  | { kind: "link"; text: string; href: string }

export interface TerminalActions {
  go: (id: SectionId) => void
  theme: Theme
  setTheme: (theme: Theme) => void
  explain: boolean
  setExplain: (on: boolean) => void
  openPalette: () => void
}

const CHIPS = ["help", "whoami", "writeups", "projects", "explain", "contact"]
const OPEN: Record<string, string> = {
  ...Object.fromEntries(Object.entries(LINKS).map(([key, link]) => [key, link.href])),
  email: `mailto:${EMAIL}`,
}
const aboutLines = (): Line[] => ABOUT.map(([key, value]) => ({ kind: "out", text: `${key}: ${value}` }))
const isSection = (name: string): name is SectionId => (SECTIONS as readonly string[]).includes(name)

/** Runs one command and returns the lines to print, or null to clear the screen. */
function execute(raw: string, actions: TerminalActions): Line[] | null {
  const [first = "", second = ""] = raw.split(/\s+/)
  const name = first.toLowerCase().replace(/^\.\//, "")
  const arg = second.toLowerCase()
  const out = (text: string): Line => ({ kind: "out", text })

  const sections: Record<SectionId, () => Line[]> = {
    writeups: () =>
      REPORTS.map((r): Line => ({ kind: "link", text: `[${r.level}] ${r.title}`, href: r.href })),
    projects: () => PROJECTS.map((p, i) => out(`${i + 1}. ${p.title}`)),
    toolbox: () => TOOLBOX.map((group) => out(`${group.name}: ${group.tools.map(([tool]) => tool).join(", ")}`)),
    path: () => [out("ไปที่เส้นทาง 2024 → 2027")],
    contact: () => Object.entries(OPEN).map(([key, href]): Line => ({ kind: "link", text: key, href })),
  }
  const visit = (id: SectionId) => {
    actions.go(id)
    return sections[id]()
  }

  if (isSection(name)) return visit(name)
  switch (name) {
    case "help":
      return [
        "whoami            ผมคือใคร",
        "ls                ดูว่ามีอะไรในเว็บนี้",
        "cat about.yml     ข้อมูลย่อ",
        "writeups          รายงาน pentest",
        "projects          งานที่สร้าง",
        "toolbox | path    เครื่องมือ / เส้นทาง",
        "explain           สลับคำอธิบายแบบคนทั่วไป",
        "open <name>       เปิดลิงก์",
        "  github htb medium facebook email",
        "theme             สลับ dark / light",
        "palette           เปิดเมนูค้นหา (Ctrl K)",
        "contact · clear",
      ].map(out)
    case "whoami":
      return [out("Ahmad-aduwa Da-oh (Wa)"), { kind: "ok", text: "Pentester who can explain." }]
    case "ls":
      return [out(SECTIONS.map((s) => `${s}/`).join("  "))]
    case "cat":
      return arg === "about.yml"
        ? aboutLines()
        : [{ kind: "err", text: `cat: ${second}: No such file — ลอง cat about.yml` }]
    case "cd": {
      const id = arg.replace(/\/$/, "")
      return isSection(id) ? visit(id) : [{ kind: "err", text: `cd: no such directory: ${second}` }]
    }
    case "open":
      return OPEN[arg]
        ? [{ kind: "link", text: `เปิด ${arg}`, href: OPEN[arg as LinkKey | "email"] }]
        : [{ kind: "err", text: `open: ใช้ได้กับ ${Object.keys(OPEN).join(", ")}` }]
    case "theme": {
      const next: Theme = arg === "dark" || arg === "light" ? arg : actions.theme === "dark" ? "light" : "dark"
      actions.setTheme(next)
      return [{ kind: "ok", text: `theme: ${next}` }]
    }
    case "explain": {
      const next = !actions.explain
      actions.setExplain(next)
      actions.go("writeups")
      return [{ kind: "ok", text: next ? "writeups: อธิบายแบบคนทั่วไป" : "writeups: technical" }]
    }
    case "palette":
      actions.openPalette()
      return [{ kind: "ok", text: "เปิดเมนูค้นหา" }]
    case "sudo":
      return [{ kind: "err", text: "wa is not in the sudoers file. This incident will be reported." }]
    case "clear":
      return null
    default:
      return [{ kind: "err", text: `command not found: ${first} — ลอง help` }]
  }
}

const COMMAND_NAMES = [
  "help", "whoami", "ls", "cat", "cd", "open", "theme", "explain", "palette", "clear", ...SECTIONS,
]

export function Terminal(actions: TerminalActions) {
  const [lines, setLines] = useState<Line[]>(() => [{ kind: "cmd", text: "cat about.yml" }, ...aboutLines()])
  const [value, setValue] = useState("")
  const history = useRef<string[]>([])
  const cursor = useRef(0)
  const out = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const ran = useRef(false)

  // keep the newest output in view, but leave the initial screen at the top
  useEffect(() => {
    if (ran.current && out.current) out.current.scrollTop = out.current.scrollHeight
  }, [lines])

  const run = (raw: string) => {
    const text = raw.trim().slice(0, 80)
    if (!text) return
    ran.current = true
    const result = execute(text, actions)
    setLines((prev) => (result === null ? [] : [...prev, { kind: "cmd", text } as Line, ...result].slice(-200)))
    history.current.push(text)
    cursor.current = history.current.length
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    run(value)
    setValue("")
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const past = history.current
    if (event.key === "ArrowUp" && cursor.current > 0) {
      event.preventDefault()
      cursor.current -= 1
      setValue(past[cursor.current])
    } else if (event.key === "ArrowDown" && cursor.current < past.length) {
      event.preventDefault()
      cursor.current += 1
      setValue(past[cursor.current] ?? "")
    } else if (event.key === "Tab" && value) {
      const matches = COMMAND_NAMES.filter((name) => name.startsWith(value.toLowerCase()))
      if (matches.length === 1) {
        event.preventDefault()
        setValue(matches[0])
      }
    }
  }

  return (
    <div className="term" id="term">
      <div className="term-bar">
        <span>wa@victus — interactive</span>
        <span>พิมพ์ help</span>
      </div>
      <div
        className="term-out"
        ref={out}
        role="log"
        aria-label="Terminal output"
        onClick={(event) => {
          const onLink = (event.target as HTMLElement).closest("a")
          if (!onLink && !window.getSelection()?.toString()) input.current?.focus({ preventScroll: true })
        }}
      >
        {lines.map((line, i) =>
          line.kind === "cmd" ? (
            <p key={i} className="term-cmd">
              <span className="signal">wa@victus:~$</span> {line.text}
            </p>
          ) : line.kind === "link" ? (
            <p key={i}>
              →{" "}
              <a href={line.href} rel="noopener">
                {line.text}
              </a>
            </p>
          ) : (
            <p key={i} className={line.kind === "out" ? undefined : line.kind}>
              {line.text}
            </p>
          ),
        )}
      </div>
      <form className="term-in" autoComplete="off" onSubmit={onSubmit}>
        <label className="signal" htmlFor="cmd">
          wa@victus:~$
        </label>
        <input
          id="cmd"
          ref={input}
          type="text"
          value={value}
          maxLength={80}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="ลองพิมพ์ help"
          aria-label="Terminal command"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
        />
      </form>
      <div className="term-chips" role="group" aria-label="คำสั่งที่ลองได้">
        {CHIPS.map((chip) => (
          <button key={chip} type="button" onClick={() => run(chip)}>
            {chip}
          </button>
        ))}
      </div>
    </div>
  )
}
