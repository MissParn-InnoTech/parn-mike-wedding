import Link from 'next/link'
import type { Metadata } from 'next'
import FbPageLink from '@/components/FbPageLink'

export const metadata: Metadata = {
  title: 'Made with Love · PARN & MIKE',
  description: 'เบื้องหลังงานแต่ง Parn & Mike ที่เจ้าสาวลงมือทำเองแทบทุกอย่าง',
}

const ink = '#536B3E'

// Line icons drawn for this page (stroke uses currentColor).
const icons: Record<string, JSX.Element> = {
  khanmaak: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 26h32l-4 12H12z" />
      <path d="M14 26c0-6 4-10 10-10s10 4 10 10" />
      <path d="M24 16v-5M20 9c2 2 6 2 8 0" />
      <path d="M18 32h12" />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="12" width="32" height="24" rx="3" />
      <path d="M8 15l16 11 16-11" />
      <path d="M24 33c-3-2-5-3.5-5-5.5a2.5 2.5 0 0 1 5-1 2.5 2.5 0 0 1 5 1c0 2-2 3.5-5 5.5z" fill="currentColor" stroke="none" opacity=".35" />
    </svg>
  ),
  vendor: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="12" y="8" width="24" height="32" rx="3" />
      <path d="M18 8V5h12v3" />
      <path d="M18 19l3 3 5-6M18 30l3 3 5-6" />
      <path d="M30 20h2M30 31h2" />
    </svg>
  ),
  art: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 8C14 8 8 15 8 23c0 9 7 15 13 15 3 0 3-3 2-5s0-4 3-4h5c5 0 9-3 9-9 0-7-7-12-16-12z" />
      <circle cx="17" cy="20" r="2" /><circle cx="25" cy="15" r="2" /><circle cx="32" cy="21" r="2" />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="10" width="32" height="28" rx="3" />
      <path d="M8 18h32M18 18v20M8 26h32M8 32h32" />
    </svg>
  ),
  web: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="15" y="6" width="18" height="36" rx="4" />
      <path d="M22 37h4" />
      <path d="M24 26c-3-2-5-3.5-5-5.5a2.5 2.5 0 0 1 5-1 2.5 2.5 0 0 1 5 1c0 2-2 3.5-5 5.5z" />
    </svg>
  ),
}

const works = [
  { key: 'khanmaak', en: 'Khan Maak Set', th: 'ชุดขันหมาก', note: 'จัดพานและของในขันหมากเอง ทุกชิ้นเลือกให้เข้าธีมของงาน' },
  { key: 'card', en: 'Invitation Cards', th: 'การ์ดเชิญ', note: 'ออกแบบการ์ดและซองเอง ทั้งแบบพิมพ์และแบบส่งออนไลน์' },
  { key: 'vendor', en: 'Vendor Planning', th: 'ประสานงาน Vendor', note: 'เลือกและดูแลทีมงานเอง สถานที่ ช่างภาพ ดอกไม้ อาหาร' },
  { key: 'art', en: 'Artwork & Signage', th: 'งานอาร์ตและป้าย', note: 'ผังโต๊ะ ป้ายต้อนรับ Tent Card สติ๊กเกอร์ ในโทนเดียวกันทั้งงาน' },
  { key: 'system', en: 'Wedding Management', th: 'ระบบจัดการงาน', note: 'ตอบรับแขก ผังที่นั่ง ของรางวัล เชื่อมกับ Google Sheet ในที่เดียว' },
  { key: 'web', en: 'Wedding Website', th: 'เว็บงานแต่ง', note: 'เว็บไซต์นี้ รวม RSVP กำหนดการ แกลเลอรี่ และการ์ดอวยพรในงาน' },
]

export default function MadeWithLovePage() {
  return (
    <div className="min-h-screen bg-[#F5EBD2]">
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-[#789568]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-serif font-bold text-base sm:text-lg text-[#789568] whitespace-nowrap">PARN & MIKE</Link>
            <div className="space-x-3 sm:space-x-6 whitespace-nowrap">
              <Link href="/gallery" className="text-xs sm:text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">Photos</Link>
              <Link href="/rsvp" className="text-xs sm:text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">RSVP</Link>
              <Link href="/information" className="text-xs sm:text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">Information</Link>
              <Link href="/schedule" className="text-xs sm:text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">Schedule</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-14 sm:py-20">
        <header className="text-center mb-12">
          <p className="text-[#C9A45C] font-serif font-semibold tracking-[0.3em] text-xs mb-4">BEHIND THE DAY</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#536B3E] mb-3">Made with Love</h1>
          <p className="font-serif text-lg text-[#536B3E]">งานนี้ เจ้าสาวลงมือทำเองแทบทุกอย่าง</p>
          <p className="text-sm text-[#789568] mt-3 max-w-xl mx-auto leading-relaxed">
            จากความตั้งใจอยากให้วันสำคัญเป็นแบบที่เราสองคนชอบที่สุด
            ทุกรายละเอียดตั้งแต่ขันหมากจนถึงเว็บที่คุณกำลังเปิดอยู่ จึงค่อย ๆ ถูกทำขึ้นด้วยมือของเราเอง
          </p>
        </header>

        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {works.map((w) => (
            <li key={w.key} className="bg-white rounded-2xl p-5 sm:p-6 border border-[#789568]/10 shadow-sm text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#F5EBD2] flex items-center justify-center" style={{ color: ink }}>
                <span className="w-9 h-9 block">{icons[w.key]}</span>
              </div>
              <p className="text-[10px] tracking-[0.2em] text-[#C9A45C] font-semibold uppercase">{w.en}</p>
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#536B3E] mt-1">{w.th}</h2>
              <p className="text-xs sm:text-sm text-[#789568] mt-2 leading-relaxed">{w.note}</p>
            </li>
          ))}
        </ul>

        <section className="mt-14 text-center bg-white/60 rounded-3xl border border-[#C9A45C]/30 px-6 py-10">
          <p className="font-serif text-xl font-bold text-[#536B3E]">อยากได้แบบนี้ในงานของคุณบ้างไหม?</p>
          <p className="text-sm text-[#789568] mt-2 mb-6 max-w-md mx-auto leading-relaxed">
            ถ้าชอบชิ้นไหน หรืออยากให้ช่วยดูแลบางส่วนของงานแต่งคุณ ทักมาคุยกันเล่น ๆ ที่เพจได้เลยนะคะ
          </p>
          <FbPageLink tone="dark" />
        </section>

        <div className="text-center mt-10">
          <Link href="/" className="text-[#789568] hover:text-[#536B3E] font-semibold underline">← Back to Home</Link>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-[#536B3E] to-[#3a4d2e] text-white py-12 mt-8 border-t border-[#789568]/20">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-3">
          <p className="font-serif text-lg font-semibold text-[#B7A286]">PARN & MIKE</p>
          <p className="text-sm text-[#B7A286]">© 2026 Our Special Day. All our love.</p>
        </div>
      </footer>
    </div>
  )
}
