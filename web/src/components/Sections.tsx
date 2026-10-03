import { useMemo, useRef, useState, type PointerEvent } from "react"

import { CountUp, Img, SectionHead, Seg, SoWhat } from "@/components/Shared"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CERTS, EMAIL, KINDS, LINKS, PATH, PHOTOS, PROJECTS, REPORTS, STATS, TOOLBOX,
  type Kind, type Project, type Shot,
} from "@/data"
import { prefersReducedMotion, spotlight } from "@/lib/hooks"

type OpenShots = (items: Shot[], index?: number) => void

export function Stats() {
  return (
    <ul className="stats">
      {STATS.map((stat) => (
        <li key={stat.title} className="spot" data-reveal onPointerMove={spotlight}>
          {stat.count === null ? <b>{stat.value}</b> : <CountUp to={stat.count} />}
          <span>
            {stat.title}
            <small>{stat.note}</small>
          </span>
        </li>
      ))}
    </ul>
  )
}

export function Writeups({ explain, setExplain }: { explain: boolean; setExplain: (on: boolean) => void }) {
  return (
    <section className="section" id="writeups">
      <div className="wrap">
        <SectionHead
          index="01"
          id="writeups"
          title="เจาะแล้วเขียนเป็นรายงาน"
          note="งานใน lab ที่เล่าให้ครบ: ทำอะไรตามลำดับ ใช้เครื่องมืออะไร และช่องโหว่นั้นกระทบอะไร"
        />
        <Seg
          label="ระดับคำอธิบาย"
          value={explain ? "plain" : "tech"}
          options={[
            { id: "tech", label: "Technical" },
            { id: "plain", label: "อธิบายแบบคนทั่วไป" },
          ]}
          onChange={(mode) => setExplain(mode === "plain")}
        />
        <div className={explain ? "reports plain" : "reports"}>
          {REPORTS.map((report) => (
            <article
              key={report.href}
              className={`report spot sev-${report.severity}`}
              data-reveal
              onPointerMove={spotlight}
            >
              <header>
                <span className="badge">{report.level}</span>
                <span className="report-meta">{report.meta}</span>
              </header>
              <h3>
                <a href={report.href} rel="noopener">
                  {report.title}
                  <span className="sr-only"> — ระดับ {report.level}</span>
                </a>
              </h3>
              <ol className="chain">
                {report.chain.map(([step, tech, plain]) => (
                  <li key={step}>
                    <b>{step}</b>
                    {explain ? plain : tech}
                  </li>
                ))}
              </ol>
              <p className="impact">{report.impact}</p>
              <footer>
                <ul className="chips">
                  {report.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
                <span className="more" aria-hidden="true">
                  อ่านรายงาน ↗
                </span>
              </footer>
            </article>
          ))}
        </div>
        <SoWhat>
          ทั้งสาม lab ไม่มีช่องโหว่ล้ำ ๆ เลย — มีแค่รหัสผ่านที่ใช้ซ้ำ ไฟล์ที่ลืมลบ และสิทธิ์ที่ให้เกิน
          ซึ่งเป็นสิ่งที่องค์กรจริงแก้ได้โดยไม่ต้องซื้ออะไรเพิ่ม
        </SoWhat>
      </div>
    </section>
  )
}

function ProjectArt({ project, open }: { project: Project; open: OpenShots }) {
  const { art } = project
  if (art.kind === "tree") {
    return (
      <div className="proj-art art-code" aria-hidden="true">
        <pre>
          <span>{art.root}</span>
          {art.rows.map(([file, note]) => (
            <span key={file} className="row">
              {"\n"}
              {file}
              <i>{note}</i>
            </span>
          ))}
        </pre>
      </div>
    )
  }
  return (
    <button
      type="button"
      className={art.kind === "paper" ? "proj-art art-paper" : "proj-art"}
      aria-label={`ขยายรูป: ${art.shot.alt}`}
      onClick={() => open([art.shot])}
    >
      <Img src={art.src} alt={art.shot.alt} width={art.w} height={art.h} />
      {art.kind === "paper" && <span>{art.caption}</span>}
    </button>
  )
}

function ProjectCard({ project, feature, open }: { project: Project; feature: boolean; open: OpenShots }) {
  const brief = (
    <dl className="brief">
      {project.brief.map(([term, text]) => (
        <div key={term} className="brief-row">
          <dt>{term}</dt>
          <dd>{text}</dd>
        </div>
      ))}
    </dl>
  )
  return (
    <article className={feature ? "proj proj-feature spot" : "proj spot"} data-reveal onPointerMove={spotlight}>
      <ProjectArt project={project} open={open} />
      <div className="proj-body">
        <p className="proj-status">{project.status}</p>
        <h3>{project.title}</h3>
        <p className="proj-sum">{project.summary}</p>
        <dl className="metrics">
          {project.metrics.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="role">
          <b>บทบาท</b>
          {project.role}
        </p>
        {feature ? (
          brief
        ) : (
          <details>
            <summary>รายละเอียด</summary>
            {brief}
          </details>
        )}
        <ul className="chips">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <p className="proj-links">
          {project.links.map((link) => (
            <a key={link.href} href={link.href} rel="noopener">
              {link.label} ↗
            </a>
          ))}
          {project.extraShot && (
            <button type="button" onClick={() => open([project.extraShot!.shot])}>
              {project.extraShot.label}
            </button>
          )}
        </p>
      </div>
    </article>
  )
}

export function Projects({ open }: { open: OpenShots }) {
  return (
    <section className="section" id="projects">
      <div className="wrap">
        <SectionHead
          index="02"
          id="projects"
          title="ระบบที่สร้างเองกับมือ"
          note="ตั้งแต่เซ็นเซอร์ถึง dashboard แต่ละงานบอกว่าปัญหาคืออะไร ผมทำส่วนไหน และได้ผลอะไร"
        />
        <div className="bento">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} feature={i === 0} open={open} />
          ))}
        </div>
        <SoWhat>
          ทำไมคนอยากเป็น pentester ถึงมีโปรเจกต์ IoT กับ AI เต็มไปหมด —
          เพราะคนที่เคยสร้างระบบเองตั้งแต่เซ็นเซอร์จนถึง API จะรู้ว่ามันมักพังตรงไหน
          และอธิบายให้ทีมที่สร้างฟังได้ว่าต้องแก้อะไร
        </SoWhat>
      </div>
    </section>
  )
}

/** A tool name that says where it was used: opens on hover with a mouse, on tap or Enter otherwise. */
function ToolChip({ name, usedIn }: { name: string; usedIn: string }) {
  const [open, setOpen] = useState(false)
  const byMouse = (next: boolean) => (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse") setOpen(next)
  }
  return (
    <li>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" onPointerEnter={byMouse(true)} onPointerLeave={byMouse(false)}>
            {name}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="tip"
          side="top"
          sideOffset={8}
          collisionPadding={12}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <b>ใช้ใน</b>
          {usedIn}
        </PopoverContent>
      </Popover>
    </li>
  )
}

export function Toolbox() {
  return (
    <section className="section" id="toolbox">
      <div className="wrap">
        <SectionHead
          index="03"
          id="toolbox"
          title="เครื่องมือที่ใช้จริง"
          note="ชี้หรือแตะที่ชื่อ เพื่อดูว่าใช้ในงานไหน"
        />
        <div className="tools">
          {TOOLBOX.map((group) => (
            <div
              key={group.name}
              className={group.hot ? "tool tool-hot spot" : "tool spot"}
              data-reveal
              onPointerMove={spotlight}
            >
              <h3>{group.name}</h3>
              <ul className="chips">
                {group.tools.map(([name, usedIn]) => (
                  <ToolChip key={name} name={name} usedIn={usedIn} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Path({ open }: { open: OpenShots }) {
  const [kind, setKind] = useState<Kind | "all">("all")
  const rail = useRef<HTMLDivElement>(null)
  const years = useMemo(() => Array.from(new Set(PATH.map((item) => item.year))), [])
  const shown = (itemKind: Kind) => kind === "all" || itemKind === kind

  const slide = (direction: number) =>
    rail.current?.scrollBy({ left: direction * 612, behavior: prefersReducedMotion() ? "auto" : "smooth" })

  return (
    <section className="section" id="path">
      <div className="wrap">
        <SectionHead index="04" id="path" title="เส้นทางที่ผ่านมา" note="ทุกบรรทัดกดดูหลักฐานได้" />
        <Seg label="กรองเส้นทาง" value={kind} options={KINDS} onChange={setKind} />

        <div className="years">
          {years.map((year) => {
            const items = PATH.filter((item) => item.year === year)
            return (
              <div key={year} className="year" data-reveal hidden={!items.some((item) => shown(item.kind))}>
                <h3>{year}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={item.title} className={item.hot ? "hot" : undefined} hidden={!shown(item.kind)}>
                      <time>{item.when}</time>
                      <div>
                        <strong>
                          {item.title}
                          {item.titleLink && (
                            <a href={item.titleLink.href} rel="noopener">
                              {item.titleLink.label}
                            </a>
                          )}
                        </strong>
                        <p>
                          {item.note}
                          {item.link && (
                            <a href={item.link.href} rel="noopener">
                              {item.link.label}
                            </a>
                          )}
                          {item.cert && (
                            <button
                              type="button"
                              aria-label={`ดูหลักฐาน: ${item.title}`}
                              onClick={() => open([item.cert!])}
                            >
                              {item.proofLabel ?? "cert"}
                            </button>
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <h3 className="sub">Field photos</h3>
        <div className="mosaic">
          {PHOTOS.map((photo, i) => (
            <button
              key={photo.full}
              type="button"
              className={i === 0 ? "tile tile-lg" : "tile"}
              data-reveal
              aria-label={`ขยายรูป: ${photo.alt}`}
              onClick={() => open(PHOTOS, i)}
            >
              <Img src={photo.thumb} alt={photo.alt} width={photo.w} height={photo.h} />
              <span>
                <b>{photo.title}</b>
                {photo.note}
              </span>
            </button>
          ))}
        </div>

        <div className="sub sub-row">
          <h3>
            Certificates <small>กดเพื่อขยาย</small>
          </h3>
          <div className="rail-nav">
            <button type="button" aria-label="เลื่อนไปก่อนหน้า" onClick={() => slide(-1)}>
              ←
            </button>
            <button type="button" aria-label="เลื่อนไปถัดไป" onClick={() => slide(1)}>
              →
            </button>
          </div>
        </div>
        <div className="rail" ref={rail} tabIndex={0} role="group" aria-label="Certificates">
          {CERTS.map((item, i) => (
            <button
              key={item.full}
              type="button"
              className={item.win ? "cert cert-win" : "cert"}
              aria-label={`ขยายใบประกาศ: ${item.title}, ${item.note}`}
              onClick={() => open(CERTS, i)}
            >
              <Img src={item.thumb} alt={item.alt} width={item.w} height={item.h} />
              <span>
                <b>{item.title}</b>
                {item.note}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact({ copyEmail }: { copyEmail: () => void }) {
  return (
    <section className="section section-last" id="contact">
      <div className="wrap">
        <div className="cta" data-reveal>
          <p className="eyebrow">05 / contact</p>
          <h2>มีระบบอยากให้ช่วยดู?</h2>
          <p>หรืออยากคุยเรื่อง security, CTF และงานวิจัย — ส่งข้อความมาได้เลย</p>
          <div className="mail-row">
            <a className="mail" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <button type="button" className="copy" onClick={copyEmail}>
              คัดลอก
            </button>
          </div>
          <ul className="socials">
            {Object.entries(LINKS).map(([key, link]) => (
              <li key={key}>
                <a href={link.href} rel="noopener">
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
