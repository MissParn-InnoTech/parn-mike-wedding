'use client'

import { useState } from 'react'

const ACCOUNT_NUMBER = '142-8-14923-4'

export const WISHES_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwem0FzQkbwe97fvuI-4VbTq0lC-weLz7X_cbe1iFvZNs5uoeUUMHYLdJwqQyAwEUr_/exec'

async function compressImage(file: File, maxDim = 1000, quality = 0.8): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', quality)
}

type Props = {
  defaultName?: string
  onClose?: () => void
  onSent?: (wish: { name: string; side: string; message: string }) => void
}

export default function GiftWishes({ defaultName = '', onClose, onSent }: Props) {
  const [copied, setCopied] = useState(false)
  const [wish, setWish] = useState({ name: defaultName, side: '', message: '' })
  const [slip, setSlip] = useState<string | null>(null)
  const [wishStatus, setWishStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(ACCOUNT_NUMBER)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const handleSlip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) { setSlip(null); return }
    try {
      setSlip(await compressImage(file))
    } catch {
      setSlip(null)
      alert('แนบรูปสลิปไม่สำเร็จ ลองเลือกรูปใหม่อีกครั้งนะคะ')
    }
  }

  const sendWish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wish.name.trim() || !wish.message.trim()) return
    setWishStatus('sending')
    try {
      const payload: Record<string, string> = {
        name: wish.name.trim(),
        side: wish.side,
        message: wish.message.trim(),
      }
      if (slip) payload.slipImage = slip
      await fetch(WISHES_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      })
      setWishStatus('sent')
      onSent?.({ name: payload.name, side: payload.side, message: payload.message })
    } catch {
      setWishStatus('error')
    }
  }

  return (
    <>
    <div className="h-1.5 bg-gradient-to-r from-[#789568] to-[#C9A45C]"></div>
    <div className="px-6 pt-6 pb-2 text-center">
      <p className="text-3xl mb-2">🎁</p>
      <h2 id="gift-title" className="font-serif text-2xl font-bold text-[#536B3E] mb-2">ร่วมช่วยงานแต่งงาน</h2>
      <p className="text-sm text-[#789568] leading-relaxed">
        ถ้าเพื่อน ๆ อยากร่วมอวยพรเป็นพิเศษ สแกน QR ด้านล่างนี้ได้เลยค่ะ ไม่ต้องเกรงใจนะคะ 💛
      </p>
    </div>
    <div className="px-6 pt-4">
      <a href="/images/gift-qr.png" target="_blank" rel="noopener noreferrer" className="block">
        <img
          src="/images/gift-qr.png"
          alt="QR Code ร่วมแสดงความยินดี บัญชีกสิกรไทย Phitchaphorn"
          className="w-full h-auto rounded-2xl border border-[#789568]/15"
        />
      </a>
      <p className="text-xs text-center text-[#B7A286] mt-2">แตะที่รูปเพื่อดู QR แบบเต็มจอ</p>
    </div>
    <div className="px-6 py-5 space-y-3">
      <div className="flex items-center justify-between gap-3 bg-[#F5EBD2]/60 rounded-xl px-4 py-3">
        <div className="text-left">
          <p className="text-xs text-[#789568]">กสิกรไทย · Phitchaphorn</p>
          <p className="font-bold text-[#536B3E] tracking-wide">{ACCOUNT_NUMBER}</p>
        </div>
        <button
          type="button"
          onClick={copyAccount}
          className="shrink-0 px-3 py-1.5 rounded-lg border border-[#C9A45C] text-sm text-[#536B3E] bg-white hover:bg-[#C9A45C] hover:text-white transition"
        >
          {copied ? 'คัดลอกแล้ว ✓' : 'คัดลอกเลขบัญชี'}
        </button>
      </div>
      <a
        href="/images/gift-qr.png"
        download="Parn-Mike-QR.png"
        className="block w-full text-center py-3 rounded-xl border-2 border-[#789568] text-[#536B3E] font-semibold hover:bg-[#789568] hover:text-white transition"
      >
        บันทึกรูป QR
      </a>
      <p className="text-xs text-center text-[#B7A286]">ขอบคุณสำหรับทุกความปรารถนาดีนะคะ 💚</p>
    </div>

    <div className="border-t border-[#789568]/15 px-6 py-6 bg-[#F5EBD2]/30">
      <p className="text-xs font-semibold tracking-wide text-[#C9A45C] text-center mb-1">พร้อมใส่ข้อมูล 💌</p>
      <h3 className="font-serif text-xl font-bold text-[#536B3E] text-center">ฝากคำอวยพร</h3>
      <p className="text-sm text-[#789568] text-center mb-5">เขียนอะไรก็ได้ที่อยากบอกป่านกับไมค์ — สั้น ยาว ตลก ซึ้ง ได้หมดค่ะ</p>

      {wishStatus === 'sent' ? (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded text-sm">
          ✓ ได้รับคำอวยพรแล้ว ขอบคุณมาก ๆ นะคะ 💗
        </div>
      ) : (
        <form onSubmit={sendWish} className="space-y-4 text-left">
          <div>
            <label htmlFor="wish-name" className="block text-sm font-semibold text-[#536B3E] mb-1">ชื่อของคุณ</label>
            <input
              id="wish-name"
              type="text"
              required
              maxLength={60}
              value={wish.name}
              onChange={(e) => setWish({ ...wish, name: e.target.value })}
              placeholder="เช่น แนน เพื่อนสมัยมหาวิทยาลัย"
              className="w-full px-4 py-3 border-2 border-[#C9A45C]/60 rounded-xl bg-white focus:outline-none focus:border-[#789568]"
            />
          </div>
          <div>
            <label htmlFor="wish-side" className="block text-sm font-semibold text-[#536B3E] mb-1">คุณเป็นเพื่อนฝั่งไหน</label>
            <select
              id="wish-side"
              value={wish.side}
              onChange={(e) => setWish({ ...wish, side: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#C9A45C]/60 rounded-xl bg-white focus:outline-none focus:border-[#789568]"
            >
              <option value="">ไม่ระบุ</option>
              <option value="ฝั่งเจ้าสาว (ป่าน)">ฝั่งเจ้าสาว (ป่าน)</option>
              <option value="ฝั่งเจ้าบ่าว (ไมค์)">ฝั่งเจ้าบ่าว (ไมค์)</option>
              <option value="เพื่อนทั้งคู่">เพื่อนทั้งคู่</option>
            </select>
          </div>
          <div>
            <label htmlFor="wish-message" className="block text-sm font-semibold text-[#536B3E] mb-1">คำอวยพร</label>
            <textarea
              id="wish-message"
              required
              rows={4}
              maxLength={500}
              value={wish.message}
              onChange={(e) => setWish({ ...wish, message: e.target.value })}
              placeholder="เขียนอะไรก็ได้ที่อยากบอกป่านกับไมค์..."
              className="w-full px-4 py-3 border-2 border-[#C9A45C]/60 rounded-xl bg-white focus:outline-none focus:border-[#789568] resize-none"
            />
          </div>
          <div>
            <label htmlFor="wish-slip" className="block text-sm font-semibold text-[#536B3E] mb-1">แนบสลิปโอนเงิน (ถ้ามี)</label>
            <input
              id="wish-slip"
              type="file"
              accept="image/*"
              onChange={handleSlip}
              className="w-full text-sm text-[#536B3E] file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-[#789568]/15 file:text-[#536B3E]"
            />
            {slip && (
              <div className="flex items-center gap-3 mt-2">
                <img src={slip} alt="สลิป" className="w-16 h-16 object-cover rounded-lg border border-[#789568]/20" />
                <button type="button" onClick={() => setSlip(null)} className="text-xs text-[#536B3E] underline">เอาออก</button>
              </div>
            )}
          </div>
          {wishStatus === 'error' && (
            <p className="text-sm text-red-600">ส่งไม่สำเร็จ ลองใหม่อีกครั้งนะคะ 🙏</p>
          )}
          <button
            type="submit"
            disabled={wishStatus === 'sending'}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#789568] to-[#536B3E] text-white font-semibold shadow-lg disabled:opacity-60"
          >
            {wishStatus === 'sending' ? 'กำลังส่ง…' : 'ส่งคำอวยพร 💌'}
          </button>
        </form>
      )}
    </div>
    {onClose && (
      <div className="px-6 pb-6 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl border border-[#789568]/40 text-[#536B3E] font-semibold hover:bg-[#F5EBD2] transition"
        >
          ปิดหน้าต่างนี้
        </button>
      </div>
    )}
    </>
  )
}
