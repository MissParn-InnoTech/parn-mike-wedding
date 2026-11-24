'use client'

import { useEffect, useRef, useState } from 'react'

// Small "Voice · พิมพ์ด้วยเสียง" mic button: speech-to-text in Thai through the browser's Web Speech API
// (Chrome on Android/desktop, Safari on iPhone/iPad, Edge). Each finished phrase is appended
// to the text box, so guests can speak, pause and continue. Hidden-free: when the browser has
// no speech support, it explains to use the microphone key on the phone keyboard instead.

type Props = {
  value: string
  onChange: (text: string) => void
  maxLength?: number
}

type Recognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

export default function VoiceInput({ value, onChange, maxLength = 300 }: Props) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState('')
  const recRef = useRef<Recognition | null>(null)
  const valueRef = useRef(value)
  valueRef.current = value

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }
    setSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition))
    return () => recRef.current?.stop()
  }, [])

  const start = () => {
    const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!Ctor) return
    const rec = new Ctor()
    rec.lang = 'th-TH'
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e) => {
      let finalText = ''
      let live = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) finalText += r[0].transcript
        else live += r[0].transcript
      }
      if (finalText.trim()) {
        const cur = valueRef.current
        const joined = (cur && !/\s$/.test(cur) ? cur + ' ' : cur) + finalText.trim()
        onChange(joined.slice(0, maxLength))
      }
      setInterim(live)
    }
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setError('ยังไม่ได้อนุญาตให้ใช้ไมโครโฟน กด "อนุญาต" ที่หน้าต่างของเบราว์เซอร์ แล้วลองใหม่นะคะ')
      } else if (e.error === 'no-speech') {
        setError('ไม่ได้ยินเสียงเลย ลองพูดใกล้มือถืออีกนิดนะคะ')
      } else if (e.error !== 'aborted') {
        setError('ฟังเสียงไม่สำเร็จ ลองกดใหม่อีกครั้ง หรือพิมพ์แทนได้ค่ะ')
      }
    }
    rec.onend = () => {
      setListening(false)
      setInterim('')
    }
    recRef.current = rec
    setError('')
    try {
      rec.start()
      setListening(true)
    } catch {
      setError('ฟังเสียงไม่สำเร็จ ลองกดใหม่อีกครั้งนะคะ')
    }
  }

  const stop = () => recRef.current?.stop()

  if (supported === null) return null

  if (!supported) {
    return (
      <p className="text-xs text-[#789568] mt-1.5">🎤 พิมพ์ด้วยเสียง: กดปุ่มไมค์บนแป้นพิมพ์มือถือได้เลยค่ะ</p>
    )
  }

  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={listening ? stop : start}
        aria-pressed={listening}
        aria-label={listening ? 'หยุดฟังเสียง' : 'พิมพ์ด้วยเสียง'}
        className={`inline-flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full text-xs font-serif font-semibold transition ${
          listening ? 'bg-[#E9576A] text-white' : 'bg-[#789568]/10 text-[#536B3E] hover:bg-[#789568]/20'
        }`}
      >
        <span className={`w-7 h-7 rounded-full flex items-center justify-center ${listening ? 'bg-white/25 animate-pulse' : 'bg-white shadow-sm'}`}>
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <rect x="9" y="3" width="6" height="11" rx="3" fill={listening ? 'currentColor' : 'none'} />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
        </span>
        {listening ? 'กำลังฟัง… แตะเพื่อหยุด' : 'Voice · พิมพ์ด้วยเสียง'}
      </button>
      {listening && interim && <p className="text-sm text-[#789568] mt-1.5 italic">“{interim}”</p>}
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  )
}
