import { useEffect, useRef, type RefObject } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Command } from "cmdk"

import { Dialog, DialogPortal, DialogTitle } from "@/components/ui/dialog"
import { EMAIL, LINKS, type SectionId, type Shot } from "@/data"

export type Opener = RefObject<HTMLElement | null>

/** Remembers what has focus right now; call it from the event handler that opens a dialog. */
export function rememberFocus(opener: Opener) {
  opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
}

/**
 * Radix only returns focus to its own Trigger. These dialogs open from many places,
 * so give focus back to whatever opened them.
 */
function restoreFocus(opener: Opener) {
  return (event: Event) => {
    event.preventDefault()
    if (opener.current?.isConnected) opener.current.focus({ preventScroll: true })
  }
}

export interface LightboxState {
  items: Shot[]
  index: number
}

export function Lightbox({
  state,
  onChange,
  opener,
}: {
  state: LightboxState | null
  onChange: (state: LightboxState | null) => void
  opener: Opener
}) {
  const count = state?.items.length ?? 0
  const shot = state ? state.items[state.index] : null
  const step = (delta: number) => {
    if (state && count > 1) onChange({ ...state, index: (state.index + delta + count) % count })
  }

  return (
    <Dialog open={state !== null} onOpenChange={(open) => !open && onChange(null)}>
      <DialogPortal>
        <DialogPrimitive.Overlay className="lb-overlay" />
        <DialogPrimitive.Content
          className="lb"
          aria-describedby={undefined}
          onCloseAutoFocus={restoreFocus(opener)}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") step(-1)
            if (event.key === "ArrowRight") step(1)
          }}
        >
          <div className="lb-bar">
            <DialogTitle asChild>
              <p>
                {count > 1 && state ? `${state.index + 1} / ${count} · ` : ""}
                {shot?.alt}
              </p>
            </DialogTitle>
            <div className="lb-ctl">
              {count > 1 && (
                <>
                  <button type="button" aria-label="รูปก่อนหน้า" onClick={() => step(-1)}>
                    ←
                  </button>
                  <button type="button" aria-label="รูปถัดไป" onClick={() => step(1)}>
                    →
                  </button>
                </>
              )}
              <DialogPrimitive.Close>ปิด</DialogPrimitive.Close>
            </div>
          </div>
          {shot && <img key={shot.full} src={shot.full} alt={shot.alt} />}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

export interface PaletteActions {
  go: (id: SectionId) => void
  toggleTheme: () => void
  toggleExplain: () => void
  copyEmail: () => void
}

const SECTION_LABELS: [SectionId, string][] = [
  ["writeups", "Writeups — รายงาน pentest"],
  ["projects", "Projects — งานที่สร้าง"],
  ["toolbox", "Toolbox — เครื่องมือ"],
  ["path", "Path — เส้นทาง"],
  ["contact", "Contact — ติดต่อ"],
]

export function Palette({
  open,
  onOpenChange,
  actions,
  opener,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  actions: PaletteActions
  opener: Opener
}) {
  // an item that moves the page should not have focus yanked back to the opener
  const acted = useRef(false)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  const pick = (action: () => void) => () => {
    acted.current = true
    onOpenChange(false)
    // let the dialog release focus and scroll lock before acting
    window.setTimeout(action, 60)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogPrimitive.Overlay className="lb-overlay" />
        <DialogPrimitive.Content
          className="palette"
          aria-describedby={undefined}
          onOpenAutoFocus={() => {
            acted.current = false
          }}
          onCloseAutoFocus={(event) => {
            if (acted.current) event.preventDefault()
            else restoreFocus(opener)(event)
          }}
        >
          <DialogTitle className="sr-only">เมนูค้นหา</DialogTitle>
          <Command label="เมนูค้นหา" loop>
            <Command.Input placeholder="ไปที่ไหน หรือทำอะไร…" />
            <Command.List>
              <Command.Empty>ไม่เจอคำสั่งนี้</Command.Empty>
              <Command.Group heading="ไปที่">
                {SECTION_LABELS.map(([id, label]) => (
                  <Command.Item key={id} value={`${id} ${label}`} onSelect={pick(() => actions.go(id))}>
                    {label}
                  </Command.Item>
                ))}
              </Command.Group>
              <Command.Group heading="ทำ">
                <Command.Item value="theme dark light สลับธีม" onSelect={pick(actions.toggleTheme)}>
                  สลับธีม dark / light
                </Command.Item>
                <Command.Item value="explain technical อธิบายแบบคนทั่วไป" onSelect={pick(actions.toggleExplain)}>
                  สลับคำอธิบาย write-up
                </Command.Item>
                <Command.Item value={`copy email คัดลอกอีเมล ${EMAIL}`} onSelect={pick(actions.copyEmail)}>
                  คัดลอกอีเมล <small>{EMAIL}</small>
                </Command.Item>
              </Command.Group>
              <Command.Group heading="เปิดลิงก์">
                {Object.entries(LINKS).map(([key, link]) => (
                  <Command.Item
                    key={key}
                    value={`open ${key} ${link.label}`}
                    onSelect={pick(() => window.open(link.href, "_blank", "noopener"))}
                  >
                    {link.label} <small>↗</small>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}
