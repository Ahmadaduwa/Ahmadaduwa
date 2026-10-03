import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { Toaster, toast } from "sonner"

import { Lightbox, Palette, rememberFocus, type LightboxState } from "@/components/Overlays"
import { Contact, Path, Projects, Stats, Toolbox, Writeups } from "@/components/Sections"
import { Terminal } from "@/components/Terminal"
import { EMAIL, LINKS, SECTIONS, type SectionId, type Shot } from "@/data"
import {
  prefersReducedMotion, scrollToId, useReveal, useScrollProgress, useScrollSpy, useTheme,
} from "@/lib/hooks"

/** Types the prompt command once on load. */
function Typed({ text }: { text: string }) {
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? text.length : 0))
  useEffect(() => {
    if (shown >= text.length) return
    const timer = window.setTimeout(() => setShown((n) => n + 1), 40)
    return () => window.clearTimeout(timer)
  }, [shown, text])
  return <b aria-label={text}>{text.slice(0, shown)}</b>
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL)
    toast.success("คัดลอกอีเมลแล้ว", { description: EMAIL })
  } catch {
    toast.message("คัดลอกไม่ได้ในเบราว์เซอร์นี้", { description: EMAIL })
  }
}

function Site() {
  const { theme, setTheme, toggle: toggleTheme } = useTheme()
  const [explain, setExplain] = useState(false)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)
  const [palette, setPaletteOpen] = useState(false)
  const lightboxOpener = useRef<HTMLElement | null>(null)
  const paletteOpener = useRef<HTMLElement | null>(null)
  const active = useScrollSpy(SECTIONS)
  const progress = useScrollProgress()
  useReveal()

  const go = useCallback((id: SectionId) => scrollToId(id), [])
  const open = useCallback((items: Shot[], index = 0) => {
    rememberFocus(lightboxOpener)
    setLightbox({ items, index })
  }, [])
  const setPalette = useCallback((next: boolean) => {
    if (next) rememberFocus(paletteOpener)
    setPaletteOpen(next)
  }, [])

  return (
    <>
      <a className="skip" href="#writeups">
        ข้ามไปที่เนื้อหา
      </a>
      <div className="progress" ref={progress} aria-hidden="true" />

      <header className="nav">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="Aduwa — กลับขึ้นบน">
            aduwa
            <span aria-hidden="true" />
          </a>
          <nav className="nav-links" aria-label="Sections">
            {SECTIONS.map((id) => (
              <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}>
                {id}
              </a>
            ))}
          </nav>
          <button type="button" className="kbd" aria-label="เปิดเมนูค้นหา" onClick={() => setPalette(true)}>
            <span>ค้นหา</span>
            <kbd>Ctrl K</kbd>
          </button>
          <button
            type="button"
            className="theme-toggle"
            aria-label={theme === "dark" ? "เปลี่ยนเป็นธีมสว่าง" : "เปลี่ยนเป็นธีมมืด"}
            onClick={toggleTheme}
          >
            {theme}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="pill">
                <span className="dot" aria-hidden="true" />
                Intern @ Armstrong Techs · ก.ย. 2026 – เม.ย. 2027
              </p>
              <p className="prompt-line">
                <span className="signal">wa@victus:~$</span> <Typed text="whoami" />
              </p>
              <h1 className="display">
                Aduwa
                <span className="cursor" aria-hidden="true" />
              </h1>
              <p className="tagline">
                Pentester who can <em>explain.</em>
              </p>
              <p className="lede">
                Ahmad-aduwa Da-oh (Wa) นักศึกษาปีสุดท้าย มหาวิทยาลัยวลัยลักษณ์ — เจาะระบบได้
                และอธิบายให้คนที่ไม่ใช่สาย security เข้าใจได้ว่ามันสำคัญยังไง
              </p>
              <div className="actions">
                <a className="btn btn-primary" href="#contact">
                  ติดต่อ →
                </a>
                <a className="btn" href="#writeups">
                  ดู writeups
                </a>
                <a className="btn btn-ghost" href={LINKS.github.href} rel="noopener">
                  GitHub ↗
                </a>
              </div>
            </div>
            <Terminal
              go={go}
              theme={theme}
              setTheme={setTheme}
              explain={explain}
              setExplain={setExplain}
              openPalette={() => setPalette(true)}
            />
          </div>
          <div className="wrap">
            <Stats />
          </div>
        </section>

        <Writeups explain={explain} setExplain={setExplain} />
        <Projects open={open} />
        <Toolbox />
        <Path open={open} />
        <Contact copyEmail={copyEmail} />
      </main>

      <footer className="footer">
        <div className="wrap">
          <span>© 2026 Aduwa</span>
          <a href="#top">กลับขึ้นบน ↑</a>
        </div>
      </footer>

      <Lightbox state={lightbox} onChange={setLightbox} opener={lightboxOpener} />
      <Palette
        open={palette}
        onOpenChange={setPalette}
        opener={paletteOpener}
        actions={{
          go,
          toggleTheme,
          toggleExplain: () => {
            setExplain((on) => !on)
            go("writeups")
          },
          copyEmail,
        }}
      />
      <Toaster theme={theme} position="bottom-center" />
    </>
  )
}

/** If rendering ever fails, show the essentials instead of a blank page. */
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="wrap" style={{ padding: "96px 28px" }}>
        <h1 className="display">Aduwa</h1>
        <p className="lede">หน้านี้โหลดไม่สมบูรณ์ ลองรีเฟรชอีกครั้ง หรือติดต่อที่</p>
        <p>
          <a className="mail" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </p>
      </main>
    )
  }
}

export default function App() {
  return (
    <Boundary>
      <Site />
    </Boundary>
  )
}
