'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { SHEET_SCRIPT_URL } from '@/lib/sheet'
import FbPageLink from '@/components/FbPageLink'

// Guest photo gallery: lists images from the Drive photo folders through the Apps Script
// (?action=gallery, v7+). Friends can open a photo full screen and download it.

type Photo = { id: string; name: string; kind: string; time: number }

// lh3 serves Drive thumbnails with CORS headers, which lets us read pixels for duplicate checks
const thumb = (id: string, w = 800) => `https://lh3.googleusercontent.com/d/${id}=w${w}`

// Difference hash (9×8 grayscale): near-identical pictures give hashes a few bits apart,
// even when the same photo was uploaded twice at different sizes or from different pages.
function dHash(id: string, attempt = 0): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const c = document.createElement('canvas')
        c.width = 9
        c.height = 8
        const ctx = c.getContext('2d')
        if (!ctx) return resolve(null)
        ctx.drawImage(img, 0, 0, 9, 8)
        const d = ctx.getImageData(0, 0, 9, 8).data
        const g = (x: number, y: number) => {
          const k = (y * 9 + x) * 4
          return d[k] * 0.299 + d[k + 1] * 0.587 + d[k + 2] * 0.114
        }
        let bits = ''
        for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bits += g(x, y) > g(x + 1, y) ? '1' : '0'
        resolve(bits)
      } catch {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    setTimeout(() => resolve(null), 3000) // never wait on a stalled request
    img.src = thumb(id, 64) + (attempt ? `?r=${attempt}` : '')
  })
}

// Shows one Drive photo. The image source is kept in state for this photo only, so a retry can
// never paint another photo's picture into this frame. Tries Drive's thumbnail first, then lh3.
function SmartImg({ id, w, className }: { id: string; w: number; className?: string }) {
  const sources = [
    `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`,
    thumb(id, w),
    `https://drive.google.com/thumbnail?id=${id}&sz=w${w}&retry=1`,
  ]
  const [n, setN] = useState(0)
  useEffect(() => setN(0), [id])
  return (
    <img
      key={`${id}-${n}`}
      src={sources[Math.min(n, sources.length - 1)]}
      onError={() => n < sources.length - 1 && setTimeout(() => setN((x) => x + 1), 400)}
      alt=""
      loading="lazy"
      className={className}
    />
  )
}

const distance = (a: string, b: string) => {
  let n = 0
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) n++
  return n
}

// Keep the first (newest) copy of each picture; drop later near-duplicates.
async function removeDuplicates(items: Photo[]): Promise<Photo[]> {
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const hashWithRetry = async (id: string) => {
    for (let attempt = 0; attempt < 2; attempt++) {
      const h = await dHash(id, attempt)
      if (h) return h
      await wait(500 * (attempt + 1))
    }
    return null
  }
  // Small batches so the image server is not flooded
  const hashes: (string | null)[] = []
  for (let i = 0; i < items.length; i += 4) {
    hashes.push(...(await Promise.all(items.slice(i, i + 4).map((p) => hashWithRetry(p.id)))))
  }
  const kept: Photo[] = []
  const keptHashes: string[] = []
  items.forEach((p, i) => {
    const h = hashes[i]
    if (h && keptHashes.some((k) => distance(k, h) <= 6)) return
    kept.push(p)
    if (h) keptHashes.push(h)
  })
  return kept
}
const download = (id: string) => `https://drive.google.com/uc?export=download&id=${id}`

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState<number | null>(null)

  const load = useCallback(() => {
    fetch(`${SHEET_SCRIPT_URL}?action=gallery`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.version >= 7 && Array.isArray(d.items)) {
          // Show photos within 2.5 s even if duplicate checking is slow; tidy up once it finishes
          let done = false
          const t = setTimeout(() => { if (!done) setPhotos((cur) => cur ?? d.items) }, 2500)
          return removeDuplicates(d.items).then((list) => { done = true; clearTimeout(t); setPhotos(list) })
        }
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
            {/* Masonry: every photo keeps its real shape (no cropping) */}
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setOpen(i)}
                  className="group block w-full mb-3 sm:mb-4 break-inside-avoid rounded-2xl bg-white p-1.5 sm:p-2 shadow-[0_4px_14px_rgba(83,107,62,0.18)] hover:shadow-[0_8px_24px_rgba(83,107,62,0.28)] transition-shadow text-left"
                  aria-label={`ดูรูป${p.name ? ' จาก ' + p.name : ''}`}
                >
                  <div className="overflow-hidden rounded-xl bg-[#EFE6D2]">
                    <SmartImg id={p.id} w={700} className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  {p.name && (
                    <p className="px-1.5 pt-2 pb-0.5 text-[11px] sm:text-xs font-serif text-[#789568] truncate">
                      {p.kind === 'card' ? '💌 ' : '📷 '}{p.name}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
        <div className="text-center mt-12"><FbPageLink tone="dark" /></div>
      </main>

      {current && open !== null && photos && (
        <div className="fixed inset-0 z-50 bg-[#141a10] flex flex-col" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
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
            <div onClick={(e) => e.stopPropagation()} className="max-w-full max-h-full flex"><SmartImg id={current.id} w={2000} className="max-w-full max-h-[calc(100vh-90px)] object-contain" /></div>
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
