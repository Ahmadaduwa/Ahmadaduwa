import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react"

export type Theme = "dark" | "light"

const reducedQuery = "(prefers-reduced-motion: reduce)"

export function prefersReducedMotion() {
  return typeof window.matchMedia === "function" && window.matchMedia(reducedQuery).matches
}

function readTheme(): Theme {
  try {
    return localStorage.getItem("theme") === "light" ? "light" : "dark"
  } catch {
    return "dark"
  }
}

/** Dark by default; the choice is kept in localStorage when it is available. */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readTheme)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    try {
      localStorage.setItem("theme", theme)
    } catch {
      // private mode: the theme still applies for this visit
    }
  }, [theme])
  const toggle = useCallback(() => setThemeState((t) => (t === "dark" ? "light" : "dark")), [])
  return { theme, setTheme: setThemeState, toggle }
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" })
}

/** Id of the section crossing the middle band of the viewport. */
export function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: "-40% 0px -55% 0px" },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    const onScroll = () => {
      if (window.scrollY < 200) setActive(null)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [ids])
  return active
}

/** Fades in every [data-reveal] element once, as it enters the viewport. */
export function useReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
      for (const el of items) el.dataset.in = ""
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).dataset.in = ""
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.05 },
    )
    for (const el of items) observer.observe(el)
    return () => observer.disconnect()
  }, [])
}

export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (ref.current) ref.current.style.transform = `scaleX(${ratio})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])
  return ref
}

/** Moves the card's soft highlight under the pointer. */
export function spotlight(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty("--mx", `${event.clientX - rect.left}px`)
  el.style.setProperty("--my", `${event.clientY - rect.top}px`)
}
