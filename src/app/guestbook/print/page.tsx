'use client'

import { useState } from 'react'

// Printable QR signs for the venue: a folding table tent (A4 portrait, fold in half)
// and a floor standee (A4 portrait — print larger at a print shop from the PDF).

const QR = '/images/guestbook-qr.svg'

function Frame() {
  return (
    <>
      <div className="absolute inset-[4%] border-[1.5px] border-[#C9A45C]/70 rounded-[18px] pointer-events-none" />
      <div className="absolute inset-[5.5%] border border-[#789568]/30 rounded-[14px] pointer-events-none" />
    </>
  )
}

const COUPLE = '/images/guestbook-couple.jpg'

function CouplePolaroid({ className = '', caption = true }: { className?: string; caption?: boolean }) {
  return (
    <div className={`bg-white shadow-[0_2px_10px_rgba(83,107,62,0.25)] ${className}`}>
      <img src={COUPLE} alt="ป่านและไมค์" className="w-full aspect-[3/4] object-cover object-[50%_28%] block" />
      {caption && <p className="text-center font-serif text-[7pt] tracking-[0.2em] text-[#789568] pt-[1.5mm]">P &amp; M</p>}
    </div>
  )
}

// Table tent panel (A5 landscape): couple polaroid · text · QR.
function TentPanel() {
  return (
    <div className="h-full w-full flex items-center justify-center gap-[5%] px-[9%] relative">
      <Frame />
      <CouplePolaroid className="w-[25%] shrink-0 p-[2mm] pb-[2.5mm] -rotate-3" />
      <div className="text-center flex-1">
        <p className="font-serif tracking-[0.3em] text-[#C9A45C] text-[8pt]">06 · 12 · 2026</p>
        <p className="font-serif font-bold text-[#536B3E] leading-tight text-[24pt]">Parn &amp; Mike</p>
        <p className="font-serif italic text-[#789568] text-[10pt] mb-2">Leave us a wish</p>
        <p className="font-serif font-bold text-[#536B3E] text-[12.5pt] leading-snug">สแกนเขียนการ์ดอวยพร 💌</p>
        <p className="font-serif text-[#789568] text-[8.5pt] leading-snug mt-1">แปะสติ๊กเกอร์ ถ่ายรูปแนบการ์ด<br />แล้วดูการ์ดของทุกคนบนจอในงาน</p>
      </div>
      <div className="bg-white rounded-xl p-[1.5mm] shadow-[0_0_0_4px_#F5EBD2] w-[27%] shrink-0">
        <img src={QR} alt="QR หน้าเขียนคำอวยพร" className="w-full h-auto block" />
      </div>
    </div>
  )
}

// Floor standee (A4 portrait, scale up at the print shop): arched couple photo, names, QR.
function PosterPanel() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center px-[10%] relative">
      <Frame />
      <div className="w-[62%] rounded-t-full overflow-hidden border-[3mm] border-white shadow-[0_3px_14px_rgba(83,107,62,0.25)]">
        <img src={COUPLE} alt="ป่านและไมค์" className="w-full aspect-[4/5] object-cover object-[50%_25%] block" />
      </div>
      <p className="font-serif tracking-[0.35em] text-[#C9A45C] text-[13pt] mt-6">06 · 12 · 2026</p>
      <p className="font-serif font-bold text-[#536B3E] leading-none text-[46pt] mt-1">Parn &amp; Mike</p>
      <p className="font-serif italic text-[#789568] text-[16pt] mt-2 mb-6">Leave us a wish</p>
      <div className="flex items-center gap-[6%] w-full justify-center">
        <div className="bg-white rounded-2xl p-[2.5mm] shadow-[0_0_0_6px_#F5EBD2] w-[34%] shrink-0">
          <img src={QR} alt="QR หน้าเขียนคำอวยพร" className="w-full h-auto block" />
        </div>
        <div className="text-left">
          <p className="font-serif font-bold text-[#536B3E] text-[20pt] leading-snug">สแกนเขียน<br />การ์ดอวยพร 💌</p>
          <p className="font-serif text-[#789568] text-[12pt] mt-2 leading-snug">แปะสติ๊กเกอร์ ถ่ายรูปแนบการ์ด<br />แล้วดูการ์ดของทุกคนบนจอในงาน</p>
        </div>
      </div>
    </div>
  )
}

export default function PrintSigns() {
  const [kind, setKind] = useState<'table' | 'floor'>('table')

  return (
    <div className="min-h-screen bg-[#e9e4d8] print:bg-white">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body { background: #fff !important; }
          .sheet { box-shadow: none !important; margin: 0 !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="print:hidden max-w-3xl mx-auto px-4 pt-8 pb-4 text-center">
        <h1 className="font-serif text-2xl font-bold text-[#536B3E] mb-1">ป้าย QR สำหรับงาน</h1>
        <p className="font-serif text-sm text-[#789568] mb-4">
          เลือกแบบ แล้วกด “พิมพ์ / บันทึกเป็น PDF” (ตั้ง Margins เป็น None และเปิด Background graphics)
        </p>
        <div className="inline-flex rounded-full bg-white p-1 shadow mb-3">
          {([['table', 'Tent Card ตั้งโต๊ะ'], ['floor', 'ป้ายตั้งพื้น']] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`px-5 py-2 rounded-full font-serif text-sm ${kind === k ? 'bg-[#789568] text-white' : 'text-[#536B3E]'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div>
          <button onClick={() => window.print()} className="px-8 py-3 rounded-full bg-gradient-to-r from-[#789568] to-[#536B3E] text-white font-serif font-semibold shadow-lg">
            พิมพ์ / บันทึกเป็น PDF
          </button>
        </div>
        <p className="font-serif text-xs text-[#B7A286] mt-3">
          {kind === 'table'
            ? 'กระดาษ A4 แนวตั้ง พิมพ์แล้วพับครึ่งตามเส้นประ ตั้งเป็นสามเหลี่ยมบนโต๊ะ (อ่านได้ทั้งสองด้าน) แนะนำกระดาษการ์ด 180–250 แกรม'
            : 'ไฟล์ A4 แนวตั้ง ส่งร้านพิมพ์ขยายเป็น A2 หรือ A1 ได้ (QR เป็นภาพเวกเตอร์ ขยายแล้วยังคมชัด) ติดบนฟิวเจอร์บอร์ดหรือขาตั้งป้าย'}
        </p>
      </div>

      <div className="flex justify-center pb-12 print:pb-0 overflow-x-auto">
        {kind === 'table' ? (
          <div className="sheet bg-[#FFFBF2] shadow-2xl relative" style={{ width: '210mm', height: '297mm' }}>
            <div className="absolute inset-x-0 top-0 h-1/2 rotate-180"><TentPanel /></div>
            <div className="absolute inset-x-0 bottom-0 h-1/2"><TentPanel /></div>
            <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-[#B7A286]/70" />
          </div>
        ) : (
          <div className="sheet bg-[#FFFBF2] shadow-2xl" style={{ width: '210mm', height: '297mm' }}>
            <PosterPanel />
          </div>
        )}
      </div>
    </div>
  )
}
