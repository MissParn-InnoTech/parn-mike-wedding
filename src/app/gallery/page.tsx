'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { SHEET_SCRIPT_URL } from '@/lib/sheet'

// Guest photo gallery: lists images from the Drive photo folders through the Apps Script
// (?action=gallery, v7+). Friends can open a photo full screen and download it.

type Photo = { id: string; name: string; kind: string; time: number }

const thumb = (id: string, w = 800) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`
const download = (id: string) => `https://drive.google.com/uc?export=download&id=${id}`

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState<number | null>(null)

  const load = useCallback(() => {
    fetch(`${SHEET_SCRIPT_URL}?action=gallery`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.version >= 7 && Array.isArray(d.items)) setPhotos(d.items)
        else setFailed(true)
      })
      .catch(() => setFailed(true))
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 60000)
    return () => clearInterval(t)
  }, [load])

  useEffect(() => {
    if (open === null || !photos) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : Math.min(photos.length - 1, i + 1)))
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : Math.max(0, i - 1)))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, photos])

  const current = open !== null && photos ? photos[open] : null

  return (
    <div className="min-h-screen bg-[#F5EBD2]">
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-[#789568]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-serif font-bold text-base sm:text-lg text-[#789568] whitespace-nowrap">PARN & MIKE</Link>
            <div className="space-x-3 sm:space-x-6 whitespace-nowrap">
              <Link href="/upload" className="text-xs sm:text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">Share Photos</Link>
              <Link href="/guestbook" className="text-xs sm:text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">Guestbook</Link>
              <Link href="/schedule" className="text-xs sm:text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">Schedule</Link>
            </div>
          </div>
        </div>
      </nav>

      <header className="text-center px-4 pt-12 pb-8">
        <p className="text-[#C9A45C] font-serif font-semibold tracking-[0.25em] text-xs mb-2">GALLERY · รูปจากเพื่อน ๆ</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#536B3E] mb-2">Our Moments 📸</h1>
        <p className="font-serif text-[#789568]">รูปที่ทุกคนส่งมาในงาน แตะรูปเพื่อดูเต็มจอและดาวน์โหลดได้เลยค่ะ</p>
        <Link href="/upload" className="inline-block mt-5 px-8 py-3 rounded-full bg-gradient-to-r from-[#789568] to-[#536B3E] text-white font-serif font-semibold shadow-lg">
          + ส่งรูปของคุณ
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 pb-16">
        {photos === null && !failed && <p className="text-center font-serif text-[#789568]">กำลังโหลดรูป…</p>}
        {failed && <p className="text-center font-serif text-[#789568]">ยังเปิดแกลเลอรี่ไม่ได้ตอนนี้ ลองใหม่อีกครั้งนะคะ</p>}
        {photos && photos.length === 0 && <p className="text-center font-serif text-[#789568]">ยังไม่มีรูป เป็นคนแรกที่ส่งรูปได้เลยนะคะ 💗</p>}
        {photos && photos.length > 0 && (
          <>
            <p className="text-center text-sm text-[#B7A286] mb-6">{photos.length.toLocaleString('th-TH')} รูป</p>
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setOpen(i)}
                  className="group relative block w-full mb-3 sm:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-md"
                  aria-label={`ดูรูป${p.name ? ' จาก ' + p.name : ''}`}
                >
                  <img src={thumb(p.id, 600)} alt="" loading="lazy" className="w-full h-auto block transition-transform duration-300 group-hover:scale-105" />
                  {p.name && (
                    <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent text-white text-xs font-serif text-left px-3 pt-6 pb-2">
                      {p.kind === 'card' ? '💌 ' : '📷 '}{p.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      {current && open !== null && photos && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <div className="flex items-center justify-between px-4 py-3 text-white" onClick={(e) => e.stopPropagation()}>
            <p className="font-serif text-sm truncate">{current.name ? `จาก ${current.name}` : ''}</p>
            <div className="flex items-center gap-2 shrink-0">
              <a href={download(current.id)} className="px-4 py-2 rounded-full bg-white text-[#536B3E] font-serif font-semibold text-sm">
                ⬇ ดาวน์โหลด
              </a>
              <button onClick={() => setOpen(null)} className="w-10 h-10 rounded-full bg-white/15 text-xl" aria-label="ปิด">×</button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center px-2 pb-4 relative min-h-0">
            <img src={thumb(current.id, 2000)} alt="" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
            {open > 0 && (
              <button onClick={(e) => { e.stopPropagation(); setOpen(open - 1) }} className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 text-white text-2xl" aria-label="รูปก่อนหน้า">‹</button>
            )}
            {open < photos.length - 1 && (
              <button onClick={(e) => { e.stopPropagation(); setOpen(open + 1) }} className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 text-white text-2xl" aria-label="รูปถัดไป">›</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
