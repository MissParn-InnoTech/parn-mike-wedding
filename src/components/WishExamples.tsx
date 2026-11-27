'use client'

// Sample wishes in a compact dropdown: picking one drops it into the wish box to edit.
// Helpful for elders and guests who aren't sure what to write.

const EXAMPLES = [
  'ขอให้รักกันนาน ๆ มีความสุขมาก ๆ นะ',
  'ยินดีด้วยนะป่านกับไมค์ ขอให้ครอบครัวอบอุ่น มั่นคงตลอดไป',
  'ขอให้คู่บ่าวสาวรักกันยืนยาว เข้าใจกัน และดูแลกันไปทุกวัน',
  'ขอให้สุขภาพแข็งแรง ร่ำรวย การงานก้าวหน้า มีลูกหลานน่ารัก',
  'ขอบคุณที่ชวนมาร่วมวันสำคัญนะ ยินดีด้วยจากใจเลย',
  'Congratulations! Wishing you a lifetime of love and happiness.',
]

export default function WishExamples({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="mt-2">
      <div className="relative">
      <label htmlFor="wish-examples" className="sr-only">ตัวอย่างคำอวยพร</label>
      <select
        id="wish-examples"
        value=""
        onChange={(e) => { if (e.target.value) onPick(e.target.value) }}
        className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl bg-[#F5EBD2]/70 border border-[#C9A45C]/40 text-sm text-[#536B3E] focus:outline-none focus:border-[#789568] cursor-pointer"
      >
        <option value="">💡 ไม่รู้จะเขียนอะไร? เลือกตัวอย่างคำอวยพร</option>
        {EXAMPLES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <svg viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#789568]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <p className="text-[11px] text-[#789568] mt-1">เลือกแล้วแก้ต่อได้ตามใจเลยค่ะ</p>
    </div>
  )
}
