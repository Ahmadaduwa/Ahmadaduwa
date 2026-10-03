import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react"

import { prefersReducedMotion } from "@/lib/hooks"

/** Image that hides itself instead of showing a broken icon if the file is missing. */
export function Img(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [broken, setBroken] = useState(false)
  return (
    <img
      loading="lazy"
      decoding="async"
      {...props}
      className={[props.className, broken ? "broken" : ""].filter(Boolean).join(" ") || undefined}
      onError={() => setBroken(true)}
    />
  )
}

export function Seg<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { id: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" aria-pressed={o.id === value} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** Counts from zero to `to` the first time it scrolls into view. */
export function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLElement>(null)
  const [value, setValue] = useState(to)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) return
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / 700)
          setValue(Math.round(to * t))
          if (t < 1) frame = requestAnimationFrame(step)
        }
        setValue(0)
        frame = requestAnimationFrame(step)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [to])
  return <b ref={ref}>{String(value).padStart(2, "0")}</b>
}

export function SoWhat({ children }: { children: string }) {
  return (
    <aside className="sowhat" data-reveal>
      <span>&gt;&gt; so what</span>
      <p>{children}</p>
    </aside>
  )
}

export function SectionHead({ index, id, title, note }: { index: string; id: string; title: string; note: string }) {
  return (
    <div className="sec-head">
      <p className="eyebrow">
        {index} / {id}
      </p>
      <h2>{title}</h2>
      <p>{note}</p>
    </div>
  )
}
