'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { SHEET_SCRIPT_URL, compressImage, postToSheet } from '@/lib/sheet'
import { STICKER_KEYS, StickerIcon } from '@/components/CuteStickers'
import VoiceInput from '@/components/VoiceInput'

// In-venue guestbook: guests write a short wish on a card, decorate it with stickers and can
// attach a photo. The Apps Script (v6+) saves cards to the separate "อวยพรในงาน" sheet, with
// stickers and the photo in their own columns, and returns `photo` so the wall shows a polaroid.

const STICKERS = STICKER_KEYS
// Emoji stickers used before the drawn set; still recognised so older cards keep their stickers
const LEGACY_STICKERS = ['💐', '🥂', '✨', '🕊️', '🍾', '🧸', '🎉', '🌿', '🫶', '💒', '🍰']
const MAX_STICKERS = 4

const CARD_COLORS = [
  { bg: '#FFF8EC', edge: '#E9D9B5' }, // cream
  { bg: '#EEF3E6', edge: '#C9D6B7' }, // sage
  { bg: '#FCEDEE', edge: '#EFCFD3' }, // blush
  { bg: '#FBF3DD', edge: '#E8D49A' }, // gold
  { bg: '#EFF1F7', edge: '#CDD3E4' }, // mist
]

const SPOTS = [
  'top-[-14px] right-[-10px] rotate-12',
  'bottom-[-14px] left-[-10px] -rotate-12',
  'top-[-14px] left-[-10px] -rotate-6',
  'bottom-[-14px] right-[-10px] rotate-6',
]

type Wish = { name: string; side?: string; message: string; photo?: string }

function splitStickers(message: string) {
  const lines = String(message || '').split('\n')
  const last = lines[lines.length - 1]?.trim() || ''
  const tokens = last.split(/\s+/).filter(Boolean)
  if (lines.length > 1 && tokens.length && tokens.every((t) => STICKERS.includes(t) || LEGACY_STICKERS.includes(t))) {
    return { text: lines.slice(0, -1).join('\n').trim(), stickers: tokens.slice(0, MAX_STICKERS) }
  }
  return { text: String(message || ''), stickers: [] as string[] }
}

function colorFor(name: string) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return CARD_COLORS[h % CARD_COLORS.length]
}

function StickerChip({ s, className = '' }: { s: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-2xl shadow-[0_3px_8px_rgba(83,107,62,0.25)] ring-[3px] ring-white select-none ${className}`}
      aria-hidden
    >
      <StickerIcon s={s} className="w-9 h-9" />
    </span>
  )
}

function Polaroid({ src, big, flip }: { src: string; big?: boolean; flip?: boolean }) {
  return (
    <div className={`relative bg-white p-2 pb-8 sm:p-2.5 sm:pb-9 shadow-lg ${flip ? 'rotate-2' : '-rotate-2'} ${big ? 'w-56' : 'w-[38%] sm:w-44'} shrink-0`}>
      <img src={src} alt="รูปจากแขก" className="w-full aspect-[3/4] object-cover bg-[#F5EBD2]" loading="lazy" />
      <p className="absolute bottom-2.5 left-0 right-0 text-center font-serif text-[11px] tracking-[0.15em] text-[#789568] whitespace-nowrap">
        P &amp; M · 06·12·2026
      </p>
    </div>
  )
}

function WishCard(props: {
  name: string; side?: string; text: string; stickers: string[]; color: { bg: string; edge: string }; big?: boolean; photo?: string
  flip?: boolean // true = photo on the right
}) {
  if (!props.photo) return <NoteCard {...props} />
  return (
    <div className={`flex items-center gap-3 sm:gap-5 ${props.flip ? 'flex-row-reverse' : 'flex-row'}`}>
      <Polaroid src={props.photo} big={props.big} flip={props.flip} />
      <div className="flex-1 min-w-0"><NoteCard {...props} /></div>
    </div>
  )
}

function NoteCard({ name, side, text, stickers, color, big = false }: {
  name: string; side?: string; text: string; stickers: string[]; color: { bg: string; edge: string }; big?: boolean
}) {
  return (
    <div
      className="relative rounded-2xl p-5 pt-6 shadow-md border-2"
      style={{ background: color.bg, borderColor: color.edge }}
    >
      {stickers.map((s, i) => (
        <StickerChip key={i} s={s} className={`absolute ${SPOTS[i]}`} />
      ))}
      <p className={`font-serif text-[#536B3E] ${big ? 'text-xl' : 'text-base'} leading-relaxed whitespace-pre-line break-words min-h-[3rem]`}>
        {text || <span className="text-[#B7A286]">คำอวยพรของคุณจะขึ้นตรงนี้…</span>}
      </p>
      <p className={`mt-3 text-right font-serif ${big ? 'text-base' : 'text-sm'} text-[#789568]`}>
        — {name || 'ชื่อของคุณ'}
        {side && <span className="text-[#B7A286]"> · {side}</span>}
      </p>
    </div>
  )
}

export default function GuestbookPage() {
  const [name, setName] = useState('')
  const [side, setSide] = useState('')
  const [text, setText] = useState('')
  const [picked, setPicked] = useState<string[]>(['💍', '💕'])
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [wall, setWall] = useState<Wish[]>([])
  const [bigScreen, setBigScreen] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoBusy, setPhotoBusy] = useState(false)

  const pickPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPhotoBusy(true)
    try {
      setPhoto(await compressImage(file, 1280, 0.82))
    } catch {
      alert('ใส่รูปไม่สำเร็จ ลองเลือกรูปใหม่อีกครั้งนะคะ')
    } finally {
      setPhotoBusy(false)
    }
  }

  const loadWall = useCallback(() => {
    const show = (items: Wish[]) => setWall(items.filter((w) => w && w.name && w.message).slice(0, 80))
    // v6+ script keeps guestbook cards in their own sheet ("อวยพรในงาน"); older scripts only
    // have the Wishes tab, so fall back to it.
    fetch(`${SHEET_SCRIPT_URL}?action=guestbook`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.version >= 6 && Array.isArray(d.items)) return show(d.items)
        return fetch(SHEET_SCRIPT_URL)
          .then((r) => r.json())
          .then((d2) => { if (d2 && Array.isArray(d2.items)) show(d2.items) })
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    try { setBigScreen(new URLSearchParams(window.location.search).get('screen') === '1') } catch {}
    loadWall()
    const t = setInterval(loadWall, 30000)
    return () => clearInterval(t)
  }, [loadWall])

  const toggle = (s: string) => {
    setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : p.length >= MAX_STICKERS ? p : [...p, s]))
  }

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setStatus('sending')
    const message = picked.length ? `${text.trim()}\n${picked.join(' ')}` : text.trim()
    try {
      const payload: Record<string, string> = { action: 'guestbook', name: name.trim(), side, message }
      if (photo) payload.photo = photo
      await postToSheet(payload)
      setWall((w) => [{ name: name.trim(), side, message, photo: photo || undefined }, ...w])
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const again = () => {
    setText('')
    setPicked(['💍', '💕'])
    setPhoto(null)
    setStatus('idle')
  }

  const wallGrid = (
    <div className={`grid gap-8 ${bigScreen ? 'sm:grid-cols-2 2xl:grid-cols-3' : 'sm:grid-cols-2'}`}>
      {wall.map((w, i) => {
        const { text: t, stickers } = splitStickers(w.message)
        // Alternate photo side by upload order (counted from the oldest) so a card keeps its side
        const photoOrder = w.photo ? wall.slice(i + 1).filter((x) => x.photo).length : 0
        return (
          <div key={i} className={w.photo ? 'sm:col-span-2' : ''}>
            <WishCard name={w.name} side={w.side} text={t} stickers={stickers} color={colorFor(w.name)} big={bigScreen} photo={w.photo} flip={photoOrder % 2 === 1} />
          </div>
        )
      })}
    </div>
  )

  if (bigScreen) {
    return (
      <div className="min-h-screen bg-[#F5EBD2] px-8 py-8">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10">
          <aside className="lg:sticky lg:top-8 self-start text-center">
            <div className="bg-white p-3 pb-12 shadow-xl -rotate-2 mx-auto w-[260px] relative">
              <img src="/images/guestbook-couple.jpg" alt="ป่านและไมค์" className="w-full aspect-[3/4] object-cover object-[50%_28%]" />
              <p className="absolute bottom-3 left-0 right-0 font-serif text-sm tracking-[0.2em] text-[#789568]">06 · 12 · 2026</p>
            </div>
            <h1 className="font-serif text-5xl font-bold text-[#536B3E] mt-8 leading-tight">Parn &amp; Mike</h1>
            <p className="font-serif italic text-xl text-[#789568] mb-6">Wishing Wall 💌</p>
            <img src="/images/guestbook-qr.svg" alt="QR ไปหน้าเขียนคำอวยพร" className="w-44 h-44 mx-auto rounded-2xl shadow-lg bg-white p-3" />
            <p className="font-serif font-bold text-lg text-[#536B3E] mt-4">สแกนเขียนการ์ดอวยพร</p>
            <p className="font-serif text-[#789568]">แปะสติ๊กเกอร์ และถ่ายรูปแนบการ์ดได้เลย</p>
          </aside>
          <main>
            {wall.length ? wallGrid : <p className="text-center font-serif text-xl text-[#789568] mt-20">No wishes yet — be the first 💗</p>}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5EBD2]">
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-[#789568]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-serif font-bold text-base sm:text-lg text-[#789568] whitespace-nowrap">PARN & MIKE</Link>
            <div className="space-x-3 sm:space-x-6 whitespace-nowrap">
              <Link href="/schedule" className="text-xs sm:text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">Schedule</Link>
              <Link href="/upload" className="text-xs sm:text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">Photos</Link>
              <Link href="/wishes" className="text-xs sm:text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">Gift</Link>
            </div>
          </div>
        </div>
      </nav>

      <header className="relative max-w-xl mx-auto">
        <img
          src="/images/guestbook-couple.jpg"
          alt="ป่านและไมค์"
          className="w-full h-[62vh] min-h-[380px] max-h-[620px] object-cover object-[50%_28%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#F5EBD2]" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-2 text-center">
          <p className="inline-block bg-white/85 backdrop-blur-sm rounded-full px-4 py-1 text-[#C9A45C] font-serif font-semibold tracking-[0.25em] text-xs mb-3">
            GUESTBOOK · สมุดอวยพร
          </p>
          <h1 className="font-serif text-4xl font-bold text-[#536B3E] leading-tight">Parn &amp; Mike</h1>
          <p className="font-serif tracking-[0.3em] text-sm text-[#789568]">06 · 12 · 2026</p>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-6 pb-10">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#536B3E] mb-2">เขียนการ์ดอวยพร 💌</h2>
          <p className="font-serif text-[#789568]">เขียนถึงป่านกับไมค์ และถ่ายรูปแนบการ์ดได้ด้วยค่ะ</p>
        </div>

        <div className="px-3 py-4 mb-8">
          <WishCard name={name.trim()} side={side} text={text} stickers={picked} color={colorFor(name.trim() || 'ป่านไมค์')} photo={photo || undefined} />
        </div>

        {status === 'sent' ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-[#789568]/10">
            <p className="text-5xl mb-3">🎉</p>
            <h2 className="font-serif text-2xl font-bold text-[#536B3E] mb-2">ส่งการ์ดแล้ว ขอบคุณมากนะคะ</h2>
            <p className="font-serif text-[#789568] mb-6">การ์ดของคุณจะขึ้นบน Wishing Wall ด้านล่างค่ะ</p>
            <button onClick={again} className="px-8 py-3 rounded-full border-2 border-[#789568] text-[#536B3E] font-serif font-semibold hover:bg-[#789568] hover:text-white transition">
              เขียนอีกใบ
            </button>
          </div>
        ) : (
          <form onSubmit={send} className="bg-white rounded-3xl shadow-xl p-6 space-y-5 border border-[#789568]/10">
            <div>
              <p className="block text-sm font-semibold text-[#536B3E] mb-2">เลือกสติ๊กเกอร์ <span className="font-normal text-[#B7A286]">({picked.length}/{MAX_STICKERS})</span></p>
              <div className="grid grid-cols-8 gap-2">
                {STICKERS.map((s) => {
                  const on = picked.includes(s)
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggle(s)}
                      aria-pressed={on}
                      aria-label={`สติ๊กเกอร์ ${s}`}
                      className={`aspect-square rounded-2xl p-1 flex items-center justify-center transition ${on ? 'bg-[#789568]/15 ring-2 ring-[#789568] scale-105' : 'bg-[#F5EBD2]/60 hover:bg-[#F5EBD2]'}`}
                    >
                      <StickerIcon s={s} className="w-full h-full" />
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <p className="block text-sm font-semibold text-[#536B3E] mb-2">แนบรูป <span className="font-normal text-[#B7A286]">(ถ้ามี)</span></p>
              {photo ? (
                <div className="flex items-center gap-3">
                  <img src={photo} alt="รูปที่เลือก" className="w-16 h-20 object-cover rounded-lg border border-[#789568]/20" />
                  <label className="text-sm text-[#536B3E] underline cursor-pointer">
                    เปลี่ยนรูป
                    <input type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
                  </label>
                  <button type="button" onClick={() => setPhoto(null)} className="text-sm text-[#B7A286] underline">เอาออก</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#C9A45C]/70 text-[#536B3E] font-serif cursor-pointer hover:bg-[#F5EBD2]/60">
                    📷 ถ่ายรูป
                    <input type="file" accept="image/*" capture="environment" onChange={pickPhoto} className="hidden" />
                  </label>
                  <label className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#C9A45C]/70 text-[#536B3E] font-serif cursor-pointer hover:bg-[#F5EBD2]/60">
                    🖼️ เลือกจากอัลบั้ม
                    <input type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
                  </label>
                </div>
              )}
              {photoBusy && <p className="text-xs text-[#B7A286] mt-1">กำลังเตรียมรูป…</p>}
            </div>
            <div>
              <label htmlFor="gb-text" className="block text-sm font-semibold text-[#536B3E] mb-1">คำอวยพร</label>
              <textarea
                id="gb-text"
                required
                rows={4}
                maxLength={300}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="ขอให้รักกันนาน ๆ นะ…"
                className="w-full px-4 py-3 border-2 border-[#C9A45C]/60 rounded-xl bg-white focus:outline-none focus:border-[#789568] resize-none"
              />
              <div className="flex items-start justify-between gap-2">
                <VoiceInput value={text} onChange={setText} maxLength={300} />
                <p className="text-xs text-[#B7A286] pt-1.5">{text.length}/300</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gb-name" className="block text-sm font-semibold text-[#536B3E] mb-1">ชื่อของคุณ</label>
                <input
                  id="gb-name"
                  required
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น แนน"
                  className="w-full px-4 py-3 border-2 border-[#C9A45C]/60 rounded-xl bg-white focus:outline-none focus:border-[#789568]"
                />
              </div>
              <div>
                <label htmlFor="gb-side" className="block text-sm font-semibold text-[#536B3E] mb-1">เพื่อนฝั่งไหน</label>
                <select
                  id="gb-side"
                  value={side}
                  onChange={(e) => setSide(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#C9A45C]/60 rounded-xl bg-white focus:outline-none focus:border-[#789568]"
                >
                  <option value="">ไม่ระบุ</option>
                  <option value="ฝั่งเจ้าสาว (ป่าน)">ฝั่งเจ้าสาว (ป่าน)</option>
                  <option value="ฝั่งเจ้าบ่าว (ไมค์)">ฝั่งเจ้าบ่าว (ไมค์)</option>
                  <option value="เพื่อนทั้งคู่">เพื่อนทั้งคู่</option>
                </select>
              </div>
            </div>
            {status === 'error' && <p className="text-sm text-red-600">ส่งไม่สำเร็จ ลองใหม่อีกครั้งนะคะ 🙏</p>}
            <button
              type="submit"
              disabled={status === 'sending' || photoBusy}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#789568] to-[#536B3E] text-white font-serif font-semibold shadow-lg disabled:opacity-60"
            >
              {status === 'sending' ? 'กำลังส่ง…' : 'ส่งการ์ดอวยพร 💌'}
            </button>
          </form>
        )}

        <section className="mt-14">
          <h2 className="font-serif text-2xl font-bold text-[#536B3E] text-center mb-1">Wishing Wall</h2>
          <p className="text-center text-sm text-[#789568] mb-8">Updates every 30 seconds</p>
          {wall.length ? wallGrid : <p className="text-center text-sm text-[#789568]">No wishes yet — be the first 💗</p>}
        </section>

        <div className="text-center mt-12">
          <Link href="/" className="text-[#789568] hover:text-[#536B3E] font-semibold underline">← Back to Home</Link>
        </div>
      </main>
    </div>
  )
}
