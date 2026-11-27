import Link from 'next/link'
import type { Metadata } from 'next'
import FbPageLink from '@/components/FbPageLink'
import Showcase from './Showcase'

export const metadata: Metadata = {
  title: 'Made with Love · PARN & MIKE',
  description: 'เบื้องหลังงานแต่ง Parn & Mike ที่เจ้าสาวลงมือทำเองแทบทุกอย่าง',
}

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

      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Facebook page banner */}
        <a
          href="https://www.facebook.com/profile.php?id=61596252849472"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-3xl shadow-lg border border-[#789568]/10 overflow-hidden mb-12 group"
        >
          <img src="/images/fb-cover.jpg" alt="เพจ เมื่อฉันจะต้อง 'แต่งงาน'" className="w-full aspect-[1251/405] object-cover" />
          <div className="px-5 sm:px-8 pb-6 sm:pb-7 flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-5">
            <img
              src="/images/fb-avatar.png"
              alt=""
              className="-mt-12 sm:-mt-14 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md bg-[#F5EBD2]"
            />
            <div className="flex-1 sm:pt-4">
              <p className="text-[10px] tracking-[0.25em] text-[#C9A45C] font-semibold">ALL HANDMADE · WEDDING BY PARN</p>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#536B3E] mt-1">เมื่อฉันจะต้อง &apos;แต่งงาน&apos;</h1>
              <p className="text-sm text-[#789568] mt-1">ทุกชิ้นในงานนี้ เป็นงานแฮนด์เมดของเจ้าสาวทั้งหมด</p>
            </div>
            <span className="self-start sm:self-end inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#536B3E] text-white text-sm font-semibold shadow group-hover:bg-[#3a4d2e] transition">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4.5 1.9-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.9c0-.6.3-.9 1-.9z" /></svg>
              ติดตามผลงาน
            </span>
          </div>
        </a>

        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#536B3E] mb-3">Made with Love</h2>
          <p className="text-sm text-[#789568] max-w-xl mx-auto leading-relaxed">
            จากความตั้งใจอยากให้วันสำคัญเป็นแบบที่เราสองคนชอบที่สุด ตั้งแต่ขันหมาก การ์ด ของชำร่วย ไปจนถึงเกมในงานและเว็บที่คุณกำลังเปิดอยู่ เจ้าสาวค่อย ๆ ทำขึ้นเองด้วยมือทุกชิ้น
          </p>
        </div>

        <Showcase />

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
