'use client'

import { useState } from 'react'

// Sample wishes guests can tap to drop into the wish box, then edit. Helpful for elders
// and for guests who aren't sure what to write.

const EXAMPLES = [
  'ขอให้รักกันนาน ๆ มีความสุขมาก ๆ นะ',
  'ยินดีด้วยนะป่านกับไมค์ ขอให้ครอบครัวอบอุ่น มั่นคงตลอดไป',
  'ขอให้คู่บ่าวสาวรักกันยืนยาว เข้าใจกัน และดูแลกันไปทุกวัน',
  'ขอให้สุขภาพแข็งแรง ร่ำรวย การงานก้าวหน้า มีลูกหลานน่ารัก',
  'ขอบคุณที่ชวนมาร่วมวันสำคัญนะ ยินดีด้วยจากใจเลย',
  'Congratulations! Wishing you a lifetime of love and happiness.',
]

export default function WishExamples({ onPick }: { onPick: (text: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="text-xs font-semibold text-[#536B3E] underline decoration-[#C9A45C] underline-offset-2"
      >
        {open ? 'ซ่อนตัวอย่างคำอวยพร' : '💡 ไม่รู้จะเขียนอะไร? ดูตัวอย่างคำอวยพร'}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          <p className="text-xs text-[#789568]">แตะข้อความที่ชอบ แล้วแก้ต่อได้ตามใจเลยค่ะ</p>
          {EXAMPLES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { onPick(t); setOpen(false) }}
              className="block w-full text-left text-sm px-3.5 py-2.5 rounded-xl bg-[#F5EBD2]/70 border border-[#C9A45C]/40 text-[#536B3E] hover:bg-[#F5EBD2] transition"
            >
              “{t}”
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
