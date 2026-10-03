export const SITE = "https://ahmadaduwa.github.io/Ahmadaduwa/"

export const EMAIL = "adu27747g@gmail.com"

export const LINKS = {
  github: { label: "GitHub", href: "https://github.com/Ahmadaduwa" },
  htb: { label: "HackTheBox", href: "https://app.hackthebox.com/users/1704621" },
  medium: { label: "Medium", href: "https://medium.com/@adu27747g" },
  facebook: { label: "Facebook", href: "https://www.facebook.com/amadaduwa.daoh.1" },
} as const

export type LinkKey = keyof typeof LINKS

export const SECTIONS = ["writeups", "projects", "toolbox", "path", "contact"] as const

export type SectionId = (typeof SECTIONS)[number]

export const ABOUT: [string, string][] = [
  ["focus", "pentest · CTF"],
  ["now", "intern @ Armstrong Techs"],
  ["research", "landslide EWS (IEEE)"],
  ["practice", "HTB Academy · HackTheBox"],
  ["study", "Walailak University"],
  ["based", "Thailand"],
]

export const STATS = [
  { value: "01", count: 1, title: "IEEE paper", note: "ICST 2025 · co-author" },
  { value: "1st", count: null, title: "Mini CTF", note: "NCSA CTF Boot Camp 2025" },
  { value: "03", count: 3, title: "Pentest write-ups", note: "HTB Academy · Medium" },
  { value: "02", count: 2, title: "Internships", note: "Nightbears · Armstrong Techs" },
]

export type Severity = "high" | "medium" | "low"

export interface Report {
  level: string
  severity: Severity
  meta: string
  title: string
  href: string
  /** [step name, technical wording, plain-language wording] */
  chain: [string, string, string][]
  impact: string
  tools: string[]
}

export const REPORTS: Report[] = [
  {
    level: "Hard",
    severity: "high",
    meta: "2026-10-01 · Windows",
    title: "Attacking Common Services",
    href: "https://medium.com/@adu27747g/lab-write-up-attacking-common-services-hard-diffuculti-fe506c1847c6",
    chain: [
      ["recon", "Nmap หา service ที่เปิดอยู่", "สำรวจว่าเครื่องนี้เปิดประตูไว้กี่บาน"],
      ["enumerate", "SMB share + credential spraying", "เจอโฟลเดอร์แชร์ที่ไม่ล็อก แล้วลองรหัสที่ได้กับทุกบัญชี"],
      ["escalate", "MSSQL linked server → sysadmin", "ฐานข้อมูลตัวหนึ่งเชื่อมกับอีกตัวที่ให้สิทธิ์ผู้ดูแล จึงยืมสิทธิ์นั้นมาใช้"],
      ["execute", "xp_cmdshell → NT AUTHORITY\\SYSTEM", "ใช้ฐานข้อมูลสั่งงานเครื่องโดยตรง จนได้สิทธิ์สูงสุดของ Windows"],
    ],
    impact: "จากโฟลเดอร์แชร์ที่ใครก็เปิดได้ ไปจบที่สิทธิ์สูงสุดของเครื่อง เพราะรหัสผ่านถูกใช้ซ้ำและฐานข้อมูลให้สิทธิ์เกินจำเป็น",
    tools: ["Nmap", "smbclient", "Hydra", "MSSQL"],
  },
  {
    level: "Medium",
    severity: "medium",
    meta: "2026-09-27 · Linux",
    title: "Attacking Common Services",
    href: "https://medium.com/@adu27747g/lab-write-up-attacking-common-services-medium-difficulty-bed1e3e0b681",
    chain: [
      ["recon", "Nmap ครบทุกพอร์ต", "สำรวจทุกประตู ไม่ใช่แค่ประตูที่คนใช้บ่อย"],
      ["enumerate", "ไล่ดู service ทีละตัว", "ดูทีละบริการว่าเปิดให้ทำอะไรได้บ้าง"],
      ["exploit", "brute force ด้วย password list ที่เจอในระบบ", "เจอรายการรหัสผ่านในระบบ แล้วไล่ลองจนเข้าได้"],
      ["loot", "เข้า FTP อ่าน flag", "เข้าไปหยิบไฟล์เป้าหมายออกมา"],
    ],
    impact: "ผู้ใช้คนเดียวใช้รหัสเดียวกับ 3 service หลุดที่เดียวจึงหลุดทั้งหมด — และถ้าสแกนแค่ 1,000 พอร์ตแรกจะมองไม่เห็น service ที่ซ่อนอยู่เลย",
    tools: ["Nmap", "FTP", "POP3", "Brute force"],
  },
  {
    level: "Easy",
    severity: "low",
    meta: "2026-09-26 · ภาษาไทย",
    title: "Attacking Common Services",
    href: "https://medium.com/@adu27747g/attacking-common-services-easy-htb-2de9e039f353",
    chain: [
      ["recon", "Nmap", "สำรวจว่าเครื่องเปิดบริการอะไรบ้าง"],
      ["enumerate", "หารายชื่อ user", "หาว่ามีบัญชีผู้ใช้ชื่ออะไร"],
      ["exploit", "brute force รหัสผ่าน → FTP", "เดารหัสผ่านจนเข้าบริการรับส่งไฟล์ได้"],
      ["pivot", "MariaDB เขียน web shell", "ใช้ฐานข้อมูลวางไฟล์คำสั่งไว้ในเว็บ แล้วสั่งงานผ่านหน้าเว็บ"],
    ],
    impact: "ฐานข้อมูลที่เขียนไฟล์ลงโฟลเดอร์ของเว็บได้ เท่ากับสั่งรันคำสั่งบนเครื่องได้ — รหัสผ่านอ่อนตัวเดียวจึงกลายเป็นการยึดเว็บทั้งตัว",
    tools: ["Nmap", "FTP", "MariaDB", "Web shell"],
  },
]

export interface Shot {
  full: string
  alt: string
}

export interface Project {
  id: string
  status: string
  title: string
  summary: string
  metrics: [string, string][]
  role: string
  brief: [string, string][]
  tags: string[]
  links: { label: string; href: string }[]
  art:
    | { kind: "paper"; src: string; caption: string; shot: Shot; w: number; h: number }
    | { kind: "image"; src: string; shot: Shot; w: number; h: number }
    | { kind: "tree"; root: string; rows: [string, string][] }
  extraShot?: { label: string; shot: Shot }
}

export const PROJECTS: Project[] = [
  {
    id: "landslide",
    status: "Published · IEEE ICST 2025",
    title: "Landslide Early Warning System",
    summary: "ระบบเตือนภัยดินถล่มต้นทุนต่ำที่ยังทำงานได้แม้อินเทอร์เน็ตล่มและไฟดับช่วงมรสุม",
    metrics: [["F1-score", "0.73"], ["sensor types", "5"], ["venue", "IEEE"]],
    role: "ผู้เขียนร่วม — เขียนโมเดล AI ตรวจจับความผิดปกติ",
    brief: [
      ["ปัญหา", "พื้นที่เสี่ยงอยู่ห่างไกล และไม่มีข้อมูลเหตุการณ์จริงมากพอจะสอนโมเดลแบบมีป้ายกำกับ"],
      ["วิธีทำ", "โหนดเซ็นเซอร์พลังงานแสงอาทิตย์ส่งข้อมูลผ่าน LoRaWAN มี SD card สำรอง แล้วใช้ Isolation Forest ซึ่งไม่ต้องใช้ป้ายกำกับ"],
      ["ผลลัพธ์", "จับเหตุการณ์วิกฤตได้ F1 0.73 ตีพิมพ์ใน IEEE ICST 2025 และใช้กับพื้นที่ อ.สิชล จ.นครศรีธรรมราช"],
    ],
    tags: ["LoRaWAN", "Isolation Forest", "LSTM", "Python"],
    links: [
      { label: "Paper", href: "https://ieeexplore.ieee.org/document/11512451" },
      { label: "Code", href: "https://github.com/Ahmadaduwa/Landslide" },
      { label: "ข่าว", href: "https://www.wu.ac.th/th/news/26262/" },
    ],
    art: {
      kind: "paper",
      src: "assets/img/paper/ieee-icst-2025.png",
      caption: "IEEE Xplore · DOI 10.1109/ICST66402.2025.11512451",
      w: 1373,
      h: 777,
      shot: {
        full: "assets/img/paper/ieee-icst-2025.png",
        alt: "หน้า IEEE Xplore ของ paper A LoRaWAN-based Landslide Early Warning System using Unsupervised AI แสดงชื่อผู้เขียนและบทคัดย่อ",
      },
    },
  },
  {
    id: "tesa2025",
    status: "TESA Top Gun Rally 2025",
    title: "Drone Detection & Tracking",
    summary: "หาโดรนจากภาพกล้องแบบ real-time แล้วบอกพิกัดกับความสูงบน dashboard แผนที่",
    metrics: [["modules", "5"], ["team", "5"], ["days", "6"]],
    role: "หัวหน้าทีม — คุมทีม 5 คน และรับผิดชอบงาน AI",
    brief: [
      ["ปัญหา", "โจทย์ “Defense Innovations”: ต้องรู้ว่าโดรนอยู่ตรงไหนและสูงเท่าไรจากภาพกล้อง"],
      ["วิธีทำ", "YOLO หาโดรน, ByteTrack ติดตาม, EfficientNet-B0 ทำนาย lat / lon / alt แล้วส่งผ่าน WebSocket ขึ้น dashboard"],
      ["ผลลัพธ์", "ได้ระบบที่ต่อกันครบ 5 ส่วน: AI pipeline, backend API, dashboard, MATLAB simulation และ MQTT bridge"],
    ],
    tags: ["YOLO", "ByteTrack", "EfficientNet-B0", "MQTT"],
    links: [{ label: "Code", href: "https://github.com/Ahmadaduwa/tesa2025" }],
    art: {
      kind: "image",
      src: "assets/img/thumbs/projects/drone-detection.jpg",
      w: 760,
      h: 428,
      shot: {
        full: "assets/img/projects/drone-detection.jpg",
        alt: "ผลตรวจจับโดรนจากกล้อง มีกรอบสีเขียวรอบโดรนพร้อมค่าความสูงที่ทำนายได้",
      },
    },
    extraShot: {
      label: "รูปทีม",
      shot: {
        full: "assets/img/events/tesa-top-gun-rally-2025.jpg",
        alt: "ทีม COE-AI มหาวิทยาลัยวลัยลักษณ์ ในงาน TESA Top Gun Rally 2025",
      },
    },
  },
  {
    id: "durian",
    status: "AI · Mobile app",
    title: "Durian Leaf Disease AI",
    summary: "ถ่ายรูปใบทุเรียนแล้วบอกโรค พร้อมแสดงว่าโมเดลดูตรงไหนของใบ",
    metrics: [["accuracy", "97.7%"], ["test images", "612"], ["classes", "5"]],
    role: "ทำทั้งระบบคนเดียว ตั้งแต่โมเดลจนถึงแอป",
    brief: [
      ["ปัญหา", "โรคใบทุเรียนหลายชนิดดูคล้ายกันจนแยกด้วยตาได้ยาก"],
      ["วิธีทำ", "transfer learning เทียบ 5 สถาปัตยกรรม รวมผลแบบ ensemble และใช้ Grad-CAM อธิบายผล"],
      ["ผลลัพธ์", "แม่นยำ 97.7% บนภาพทดสอบ 612 ภาพ และต่อยอดเป็นแอป RooJai Durian สำหรับชาวสวน"],
    ],
    tags: ["PyTorch", "Transfer Learning", "Grad-CAM", "Flutter"],
    links: [
      { label: "Model", href: "https://github.com/Ahmadaduwa/durianLeafDisease" },
      { label: "App", href: "https://github.com/Ahmadaduwa/flutter_durian" },
    ],
    art: {
      kind: "image",
      src: "assets/img/thumbs/projects/durian-leaves.jpg",
      w: 760,
      h: 760,
      shot: { full: "assets/img/projects/durian-leaves.jpg", alt: "ตัวอย่างภาพใบทุเรียนจากชุดข้อมูล 4 ใบ" },
    },
  },
  {
    id: "tesa2024",
    status: "TESA Top Gun Rally 2024",
    title: "Real-time Audio Signal IoT",
    summary: "ฟังเสียง แยกประเภทสัญญาณ แล้วรายงานผลผ่านเครือข่าย ทั้งหมดบนอุปกรณ์ embedded",
    metrics: [["sampling", "48 kHz"], ["threads", "3"]],
    role: "ฝ่าย embedded — เขียนโค้ดทั้งหมดใน repo นี้",
    brief: [
      ["ปัญหา", "จำแนกสัญญาณเสียงแบบ real-time บนอุปกรณ์ embedded แล้วรายงานผลผ่านเครือข่าย"],
      ["วิธีทำ", "โปรแกรม C แบบ multi-thread แยกงานจับเสียง, FFT + KNN และ MQTT ออกจากกันด้วย pthreads"],
      ["ผลลัพธ์", "ระบบทำงานครบวงจรตั้งแต่ไมโครโฟนถึง MQTT พร้อมเก็บผลลง SQLite"],
    ],
    tags: ["C", "pthreads", "ALSA", "FFT", "MQTT"],
    links: [{ label: "Code", href: "https://github.com/Ahmadaduwa/PROJECT_TESA_2024" }],
    art: {
      kind: "tree",
      root: "sound_app.c",
      rows: [
        ["├─ alsa_thr.c  ", "capture 48 kHz"],
        ["├─ fft_thr.c   ", "FFT + KNN"],
        ["├─ db_helper.c ", "SQLite"],
        ["└─ iot_app.c   ", "MQTT"],
      ],
    },
  },
]

export const TOOLBOX: { name: string; hot?: boolean; tools: [string, string][] }[] = [
  {
    name: "Offensive",
    hot: true,
    tools: [
      ["Nmap", "write-up ทั้ง 3 เรื่อง"],
      ["Hydra", "write-up ระดับ Hard"],
      ["smbclient", "write-up ระดับ Hard"],
      ["MSSQL / xp_cmdshell", "write-up ระดับ Hard"],
      ["FTP · POP3 · SMB", "write-up ทั้ง 3 เรื่อง"],
      ["Web shell", "write-up ระดับ Easy"],
      ["Kali Linux", "เครื่องที่ใช้ทำ lab ทุกเรื่อง"],
    ],
  },
  {
    name: "Code",
    tools: [
      ["Python", "Landslide · TESA 2025 · Durian"],
      ["C", "TESA 2024"],
      ["JavaScript / TypeScript", "Ai_Apti บน GitHub"],
      ["Dart", "แอป RooJai Durian"],
      ["Bash", "งาน lab บน Linux"],
    ],
  },
  {
    name: "Backend",
    tools: [
      ["Node.js", "backend ของ TESA 2025"],
      ["FastAPI", "Robotic Gripper บน GitHub"],
      ["PostgreSQL", "TESA 2025"],
      ["SQLite", "TESA 2024"],
      ["Docker", "Ai_Apti บน GitHub"],
    ],
  },
  {
    name: "AI / Data",
    tools: [
      ["PyTorch", "Durian"],
      ["scikit-learn", "Landslide"],
      ["YOLO", "TESA 2025"],
      ["Isolation Forest", "Landslide"],
      ["Grad-CAM", "Durian"],
    ],
  },
  {
    name: "IoT",
    tools: [
      ["LoRaWAN", "Landslide"],
      ["MQTT", "TESA 2024 · TESA 2025"],
      ["ALSA", "TESA 2024"],
      ["MATLAB", "TESA 2024 · TESA 2025"],
    ],
  },
]

export type Kind = "security" | "work" | "ai" | "other"

export const KINDS: { id: Kind | "all"; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "security", label: "Security" },
  { id: "work", label: "Work" },
  { id: "ai", label: "AI · IoT" },
  { id: "other", label: "อื่น ๆ" },
]

export interface PathItem {
  year: number
  when: string
  kind: Kind
  title: string
  titleLink?: { label: string; href: string }
  note: string
  hot?: boolean
  link?: { label: string; href: string }
  cert?: Shot
}

const cert = (file: string, alt: string): Shot => ({ full: `assets/img/certs/${file}.jpg`, alt })

export const PATH: PathItem[] = [
  {
    year: 2026,
    when: "ก.ย. 2026 – เม.ย. 2027",
    kind: "work",
    title: "Intern (Cooperative Education) · ",
    titleLink: { label: "Armstrong Techs", href: "https://www.armstrongtechs.com/" },
    note: "สหกิจศึกษา — กำลังทำอยู่",
    hot: true,
  },
  {
    year: 2026,
    when: "มิ.ย.",
    kind: "security",
    title: "NCSA x CISCO CTF 2026",
    note: "NCSA CTF Thailand Tournament ในนามทีม MaiMeName67",
    cert: cert("ncsa-cisco-ctf-2026", "เกียรติบัตร NCSA x CISCO CTF 2026"),
  },
  {
    year: 2026,
    when: "มี.ค. – เม.ย.",
    kind: "other",
    title: "Cross-cultural Exchange · Ningbo, China",
    note: "Student Training Program ที่ Ningbo City College of Vocational Technology",
    cert: cert("ningbo-exchange-2026", "Certificate of Completion จาก Ningbo City College of Vocational Technology"),
  },
  {
    year: 2025,
    when: "ธ.ค.",
    kind: "ai",
    title: "IEEE paper · ICST 2025",
    note: "ผู้เขียนร่วม “A LoRaWAN-based Landslide Early Warning System using Unsupervised AI”",
    link: { label: "DOI", href: "https://doi.org/10.1109/ICST66402.2025.11512451" },
  },
  {
    year: 2025,
    when: "ธ.ค.",
    kind: "security",
    title: "Road To Cybersecurity 2025 GEN6 · SOSECURE",
    note: "จบหลักสูตร",
    cert: cert("sosecure-road-to-cybersecurity-gen6", "Certificate หลักสูตร Road To Cybersecurity 2025 GEN6 จาก SOSECURE"),
  },
  {
    year: 2025,
    when: "พ.ย.",
    kind: "ai",
    title: "TESA Top Gun Rally 2025",
    note: "หัวข้อ “Defense Innovations” ที่โรงเรียนนายร้อยพระจุลจอมเกล้า",
    cert: cert("tesa-top-gun-rally-2025", "เกียรติบัตร TESA Top Gun Rally 2025"),
  },
  {
    year: 2025,
    when: "ก.ค.",
    kind: "security",
    title: "ชนะเลิศ Mini CTF · NCSA CTF Boot Camp",
    note: "ทีม “กองกำลังแฮกเกอร์” ที่หาดใหญ่ จัดโดย สกมช.",
    hot: true,
    cert: cert("mini-ctf-winner-2025", "ประกาศนียบัตรรางวัลชนะเลิศ Mini CTF จาก สกมช."),
  },
  {
    year: 2025,
    when: "พ.ค.",
    kind: "security",
    title: "Basic Cybersecurity · NCSA MOOC",
    note: "จบหลักสูตร",
    cert: cert("ncsa-basic-cybersecurity", "Certificate of Completion หลักสูตร Basic Cybersecurity จาก NCSA MOOC"),
  },
  {
    year: 2025,
    when: "เม.ย. – มิ.ย.",
    kind: "work",
    title: "Backend Developer Intern · Nightbears Technology",
    note: "ฝึกงาน 2 เดือน",
    cert: cert("nightbears-internship", "Certificate of Internship จาก Nightbears Technology"),
  },
  {
    year: 2025,
    when: "มี.ค.",
    kind: "ai",
    title: "Super AI Engineer Season 5",
    note: "ผ่านระดับ Foundation AI (Theory)",
    cert: cert("super-ai-engineer-ss5", "Certificate Super AI Engineer Season 5 ระดับ Foundation AI"),
  },
  {
    year: 2024,
    when: "พ.ย.",
    kind: "ai",
    title: "TESA Top Gun Rally 2024",
    note: "มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา",
    cert: cert("tesa-top-gun-rally-2024", "Certificate of Attendance TESA Top Gun Rally 2024"),
  },
  {
    year: 2024,
    when: "พ.ค.",
    kind: "other",
    title: "ค่ายนิเวศวิทยาทางทะเล ครั้งที่ 31",
    note: "ภาคปฏิบัติที่ภูเก็ต",
    link: { label: "ข่าว", href: "https://cas.wu.ac.th/archives/27200" },
    cert: cert("marine-ecology-31", "วุฒิบัตรโครงการค่ายนิเวศวิทยาทางทะเล ครั้งที่ 31"),
  },
]

export interface Tile extends Shot {
  thumb: string
  title: string
  note: string
  w: number
  h: number
  win?: boolean
}

export const PHOTOS: Tile[] = [
  {
    full: "assets/img/events/ctf-2025.jpg",
    thumb: "assets/img/events/ctf-2025.jpg",
    alt: "ห้องแข่งขัน CTF ปี 2025 ผู้เข้าแข่งขันนั่งทำโจทย์หน้าแล็ปท็อป",
    title: "CTF",
    note: "2025",
    w: 1600,
    h: 1066,
  },
  {
    full: "assets/img/events/tesa-top-gun-rally-2025.jpg",
    thumb: "assets/img/thumbs/events/tesa-top-gun-rally-2025.jpg",
    alt: "ทีม COE-AI มหาวิทยาลัยวลัยลักษณ์ รับเกียรติบัตร TESA Top Gun Rally 2025",
    title: "TESA Top Gun Rally",
    note: "2025",
    w: 760,
    h: 428,
  },
  {
    full: "assets/img/events/marine-ecology-2024.jpg",
    thumb: "assets/img/thumbs/events/marine-ecology-2024.jpg",
    alt: "ภาพรวมกิจกรรมค่ายนิเวศวิทยาทางทะเล ครั้งที่ 31",
    title: "Marine Ecology Course",
    note: "2024",
    w: 760,
    h: 507,
  },
]

const certTile = (file: string, title: string, note: string, alt: string, h: number, win?: boolean): Tile => ({
  full: `assets/img/certs/${file}.jpg`,
  thumb: `assets/img/thumbs/certs/${file}.jpg`,
  alt,
  title,
  note,
  w: 760,
  h,
  win,
})

export const CERTS: Tile[] = [
  certTile("mini-ctf-winner-2025", "Mini CTF — Winner", "NCSA · 2025", "ประกาศนียบัตรรางวัลชนะเลิศ Mini CTF จาก สกมช.", 532, true),
  certTile("ncsa-cisco-ctf-2026", "NCSA x CISCO CTF", "NCSA · 2026", "เกียรติบัตร NCSA x CISCO CTF 2026", 537),
  certTile("sosecure-road-to-cybersecurity-gen6", "Road To Cybersecurity GEN6", "SOSECURE · 2025", "Certificate หลักสูตร Road To Cybersecurity 2025 GEN6 จาก SOSECURE", 537),
  certTile("ncsa-basic-cybersecurity", "Basic Cybersecurity", "NCSA MOOC · 2025", "Certificate of Completion หลักสูตร Basic Cybersecurity จาก NCSA MOOC", 538),
  certTile("tesa-top-gun-rally-2025", "TESA Top Gun Rally", "TESA · 2025", "เกียรติบัตร TESA Top Gun Rally 2025", 530),
  certTile("tesa-top-gun-rally-2024", "TESA Top Gun Rally", "TESA · 2024", "Certificate of Attendance TESA Top Gun Rally 2024", 538),
  certTile("super-ai-engineer-ss5", "Super AI Engineer SS5", "AIAT · 2025", "Certificate Super AI Engineer Season 5 ระดับ Foundation AI", 538),
  certTile("nightbears-internship", "Backend Developer Intern", "Nightbears · 2025", "Certificate of Internship จาก Nightbears Technology", 538),
  certTile("ningbo-exchange-2026", "Cross-cultural Exchange", "Ningbo · 2026", "Certificate of Completion จาก Ningbo City College of Vocational Technology", 524),
  certTile("marine-ecology-31", "Marine Ecology Course", "WU · 2024", "วุฒิบัตรโครงการค่ายนิเวศวิทยาทางทะเล ครั้งที่ 31", 565),
]
