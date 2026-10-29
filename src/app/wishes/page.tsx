'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import GiftWishes, { WISHES_SCRIPT_URL } from '@/components/GiftWishes'

type Wish = { name: string; side?: string; message: string }

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(WISHES_SCRIPT_URL)
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          setWishes(data.items.filter((w: Wish) => w && w.name && w.message).slice(0, 60))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#F5EBD2]">
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-[#789568]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-serif font-bold text-base sm:text-lg text-[#789568] whitespace-nowrap">PARN & MIKE</Link>
            <div className="space-x-3 sm:space-x-6 whitespace-nowrap">
              <Link href="/rsvp" className="text-xs sm:text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">RSVP</Link>
              <Link href="/information" className="text-xs sm:text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">Information</Link>
              <Link href="/schedule" className="text-xs sm:text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">Schedule</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#536B3E] mb-2">Wishes &amp; Gift</h1>
          <p className="font-serif text-[#789568]">ส่งคำอวยพรและร่วมแสดงความยินดีกับป่านและไมค์</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#789568]/10">
          <GiftWishes onSent={(w) => setWishes((prev) => [w, ...prev])} />
        </div>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-[#536B3E] text-center mb-2">คำอวยพรจากเพื่อน ๆ 💌</h2>
          <p className="text-center text-sm text-[#789568] mb-6">ทุกข้อความมีความหมายกับเรามากค่ะ</p>
          {loading && <p className="text-center text-sm text-[#789568]">กำลังโหลดคำอวยพร…</p>}
          {!loading && wishes.length === 0 && (
            <p className="text-center text-sm text-[#789568]">ยังไม่มีคำอวยพร เป็นคนแรกได้เลยนะคะ 💗</p>
          )}
          <div className="grid gap-3">
            {wishes.map((w, i) => (
              <div key={i} className="flex gap-3 bg-white rounded-2xl p-4 shadow-sm border-l-4 border-[#789568]">
                <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-[#789568] to-[#C9A45C] text-white flex items-center justify-center font-semibold">
                  {w.name.trim().charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#536B3E] text-sm">
                    {w.name}
                    {w.side && <span className="font-normal text-[#789568]"> · {w.side}</span>}
                  </p>
                  <p className="text-sm text-[#536B3E]/80 mt-1 whitespace-pre-line break-words">{w.message}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center mt-10">
          <Link href="/" className="text-[#789568] hover:text-[#536B3E] font-semibold underline">← Back to Home</Link>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-[#536B3E] to-[#3a4d2e] text-white py-12 mt-16 border-t border-[#789568]/20">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-3">
          <p className="font-serif text-lg font-semibold text-[#B7A286]">PARN & MIKE</p>
          <p className="text-sm text-[#B7A286]">© 2026 Our Special Day. All our love.</p>
          <p className="text-xs text-[#B7A286]/80">Created by Bride Parn</p>
        </div>
      </footer>
    </div>
  )
}
