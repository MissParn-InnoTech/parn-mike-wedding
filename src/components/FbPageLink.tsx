// Link to Parn's Facebook page (wedding planning), shown in footers.
const FB_URL = 'https://www.facebook.com/profile.php?id=61596252849472'

export default function FbPageLink({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const cls =
    tone === 'light'
      ? 'text-[#F5EBD2] border-[#B7A286]/50 hover:bg-white/10'
      : 'text-[#536B3E] border-[#789568]/40 hover:bg-[#789568]/10'
  return (
    <a
      href={FB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm transition ${cls}`}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M14 8h3V4h-3c-2.8 0-4.5 1.9-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.9c0-.6.3-.9 1-.9z" />
      </svg>
      <span>ติดตามเพจ <b className="font-semibold">เมื่อฉันจะต้อง &apos;แต่งงาน&apos;</b></span>
    </a>
  )
}
