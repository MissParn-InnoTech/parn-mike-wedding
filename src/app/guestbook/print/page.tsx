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

// Table tent panel (A5 landscape): QR on the left, text on the right.
function TentPanel() {
  return (
    <div className="h-full w-full flex items-center justify-center gap-[7%] px-[10%] relative">
      <Frame />
      <div className="bg-white rounded-2xl p-2 shadow-[0_0_0_5px_#F5EBD2] w-[36%] shrink-0">
        <img src={QR} alt="QR หน้าเขียนคำอวยพร" className="w-full h-auto block" />
      </div>
      <div className="text-left">
        <p className="font-serif tracking-[0.35em] text-[#C9A45C] text-[9pt]">06 · 12 · 2026</p>
        <p className="font-serif font-bold text-[#536B3E] leading-tight text-[28pt]">Parn &amp; Mike</p>
        <p className="font-serif italic text-[#789568] text-[11pt] mb-3">Leave us a wish</p>
        <p className="font-serif font-bold text-[#536B3E] text-[15pt] leading-snug">สแกนเขียนการ์ดอวยพร 💌</p>
        <p className="font-serif text-[#789568] text-[9.5pt] leading-snug mt-1">แปะสติ๊กเกอร์ ถ่ายรูปแนบการ์ด<br />แล้วดูการ์ดของทุกคนบนจอในงาน</p>
      </div>
    </div>
  )
}

// Floor standee (A4 portrait, scale up at the print shop).
function PosterPanel() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center px-[8%] relative">
      <Frame />
      <p className="font-serif tracking-[0.35em] text-[#C9A45C] text-[15pt] mb-3">06 · 12 · 2026</p>
      <p className="font-serif font-bold text-[#536B3E] leading-none text-[54pt]">Parn &amp; Mike</p>
      <p className="font-serif italic text-[#789568] text-[18pt] mt-3 mb-8">Leave us a wish</p>
      <div className="bg-white rounded-2xl p-4 shadow-[0_0_0_8px_#F5EBD2] w-[58%]">
        <img src={QR} alt="QR หน้าเขียนคำอวยพร" className="w-full h-auto block" />
      </div>
      <p className="font-serif font-bold text-[#536B3E] text-[26pt] mt-8">สแกนเขียนการ์ดอวยพร 💌</p>
      <p className="font-serif text-[#789568] text-[15pt] mt-2">แปะสติ๊กเกอร์ ถ่ายรูปแนบการ์ด แล้วดูการ์ดของทุกคนบนจอในงานได้เลย</p>
      <p className="font-serif tracking-[0.2em] text-[#B7A286] text-[11pt] mt-8">parn-mike-wedding.vercel.app/guestbook</p>
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
