'use client'

import { useEffect, useRef, useState } from 'react'

// Big "พูดแทนพิมพ์" button: speech-to-text in Thai through the browser's Web Speech API
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
      <p className="text-xs text-[#789568] mt-2 leading-relaxed">
        🎤 อยากพูดแทนพิมพ์: แตะช่องคำอวยพร แล้วกดปุ่ม <b>ไมโครโฟน</b> บนแป้นพิมพ์มือถือได้เลยค่ะ
      </p>
    )
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={listening ? stop : start}
        aria-pressed={listening}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-serif font-semibold text-base transition ${
          listening
            ? 'bg-[#E9576A] text-white shadow-lg animate-pulse'
            : 'bg-[#789568]/12 border-2 border-[#789568] text-[#536B3E] hover:bg-[#789568] hover:text-white'
        }`}
      >
        <span className="text-xl" aria-hidden>{listening ? '⏹' : '🎤'}</span>
        {listening ? 'กำลังฟัง… พูดได้เลย (แตะเพื่อหยุด)' : 'กดแล้วพูดคำอวยพร ไม่ต้องพิมพ์'}
      </button>
      {listening && interim && <p className="text-sm text-[#789568] mt-2 italic">“{interim}”</p>}
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      {!listening && !error && value && (
        <p className="text-xs text-[#B7A286] mt-1.5">แก้ไขคำที่ฟังผิดในช่องด้านบนได้ก่อนกดส่งนะคะ</p>
      )}
    </div>
  )
}
