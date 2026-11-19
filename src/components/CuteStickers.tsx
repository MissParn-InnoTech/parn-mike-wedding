// Original pastel sticker icons for the guestbook. Each sticker is stored in the sheet as its
// emoji key (so the sheet stays readable and older cards keep working) and drawn as an SVG here.

import type { ReactElement } from 'react'

const INK = '#5b4a4a'

const S: Record<string, ReactElement> = {
  // heart with LOVE
  '💕': (
    <>
      <path d="M32 55C16 44 6 35 6 23 6 15 12 9 20 9c5 0 9 3 12 7 3-4 7-7 12-7 8 0 14 6 14 14 0 12-10 21-26 32z" fill="#F7A1B5" />
      <path d="M14 18c2-4 6-5 9-4" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".8" />
      <text x="32" y="35" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">LOVE</text>
    </>
  ),
  // ring
  '💍': (
    <>
      <circle cx="32" cy="40" r="15" fill="none" stroke="#F2C76B" strokeWidth="6" />
      <circle cx="32" cy="40" r="15" fill="none" stroke="#FBE3A6" strokeWidth="2" strokeDasharray="10 40" />
      <path d="M24 16l8-8 8 8-8 9z" fill="#BFE6F5" stroke="#8FCDE6" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M24 16h16M32 8v17" stroke="#fff" strokeWidth="1.2" opacity=".8" />
    </>
  ),
  // love letter
  '💌': (
    <>
      <rect x="8" y="18" width="48" height="34" rx="5" fill="#AEDCF0" />
      <path d="M8 22l24 17 24-17" fill="#C8E8F6" stroke="#8CC6E0" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 33c-6-4-9-7-9-10 0-2.5 2-4.5 4.5-4.5 2 0 3.5 1 4.5 2.5 1-1.5 2.5-2.5 4.5-2.5 2.5 0 4.5 2 4.5 4.5 0 3-3 6-9 10z" fill="#F7A1B5" />
      <circle cx="32" cy="42" r="2.5" fill="#7CC9A6" />
    </>
  ),
  // cupcake
  '🧁': (
    <>
      <path d="M16 36h32l-5 20H21z" fill="#F5C98E" />
      <path d="M22 36l2 20M30 36v20M38 36l-1 20" stroke="#E7AE68" strokeWidth="2" />
      <path d="M12 37c-2-9 6-14 12-13 2-7 14-7 16 0 7-1 14 4 12 13z" fill="#FFF3B8" />
      <circle cx="32" cy="15" r="4" fill="#E9576A" />
      <path d="M33 11c1-3 3-4 5-4" stroke="#7CC9A6" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <g strokeWidth="2.2" strokeLinecap="round">
        <path d="M20 31l3-1" stroke="#F7A1B5" /><path d="M29 27l2 2" stroke="#9AD7F0" /><path d="M38 30l3 1" stroke="#B9E3A3" /><path d="M44 34l1-2" stroke="#F7A1B5" />
      </g>
    </>
  ),
  // flower
  '🌸': (
    <>
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="32" cy="18" rx="11" ry="13" fill="#F9B8A3" transform={`rotate(${r} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="9" fill="#FCD9C6" />
      <circle cx="32" cy="32" r="4.5" fill="#F48E78" />
    </>
  ),
  // four-leaf clover
  '🍀': (
    <>
      <path d="M33 34c6 6 8 14 6 22" stroke="#6DBB6A" strokeWidth="3" fill="none" strokeLinecap="round" />
      {[0, 90, 180, 270].map((r) => (
        <path key={r} d="M32 32c-9-2-14-9-10-14 3-3 7-2 10 2 3-4 7-5 10-2 4 5-1 12-10 14z" fill="#7CC9A6" transform={`rotate(${r} 32 32) translate(0 -1)`} />
      ))}
      <circle cx="32" cy="32" r="2.5" fill="#5DAE63" />
    </>
  ),
  // rainbow with clouds
  '🌈': (
    <>
      <path d="M8 44a24 24 0 0 1 48 0" stroke="#F7A1B5" strokeWidth="6" fill="none" />
      <path d="M14 44a18 18 0 0 1 36 0" stroke="#FFE08A" strokeWidth="6" fill="none" />
      <path d="M20 44a12 12 0 0 1 24 0" stroke="#AEDCF0" strokeWidth="6" fill="none" />
      <g fill="#fff" stroke="#BFE3F2" strokeWidth="1.5">
        <path d="M4 52c0-4 3-6 6-5 1-4 7-4 8 0 3 0 5 2 5 5z" />
        <path d="M41 52c0-4 3-6 6-5 1-4 7-4 8 0 3 0 5 2 5 5z" />
      </g>
    </>
  ),
  // crescent moon with stars
  '🌙': (
    <>
      <path d="M40 8a24 24 0 1 0 16 36A20 20 0 1 1 40 8z" fill="#FFE98A" />
      <path d="M20 40c2 5 6 8 10 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".7" />
      <path d="M46 18l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#FFD55C" />
      <path d="M52 34v8M40 30v10" stroke="#E8C97A" strokeWidth="1" />
      <path d="M52 42l1 2 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L49 44.3l2-.3z" fill="#FFD55C" />
    </>
  ),
  // strawberry
  '🍓': (
    <>
      <path d="M32 58C18 50 10 38 12 28c2-8 12-10 20-8 8-2 18 0 20 8 2 10-6 22-20 30z" fill="#F7727F" />
      <path d="M20 22c3-6 8-6 12-3 4-3 9-3 12 3-4 2-8 3-12 1-4 2-8 1-12-1z" fill="#7CC9A6" />
      <path d="M32 20V12" stroke="#5DAE63" strokeWidth="3" strokeLinecap="round" />
      <g fill="#FFE7A8">
        {[[22, 32], [32, 30], [42, 32], [26, 40], [38, 40], [32, 48], [20, 26]].map(([x, y]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="1.4" ry="2" />
        ))}
      </g>
      <path d="M17 30c0-4 2-6 4-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".6" />
    </>
  ),
  // watermelon slice
  '🍉': (
    <>
      <path d="M6 22a26 26 0 0 0 52 0z" fill="#7CC9A6" />
      <path d="M10 22a22 22 0 0 0 44 0z" fill="#E8F6D9" />
      <path d="M13 22a19 19 0 0 0 38 0z" fill="#F7727F" />
      <g fill={INK}>
        {[[22, 28], [32, 32], [42, 28], [27, 36], [37, 36]].map(([x, y]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="1.4" ry="2.2" />
        ))}
      </g>
    </>
  ),
  // sun
  '☀️': (
    <>
      <g stroke="#FFC95C" strokeWidth="3" strokeLinecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
          <path key={r} d="M32 4v7" transform={`rotate(${r} 32 32)`} />
        ))}
      </g>
      <circle cx="32" cy="32" r="15" fill="#FFD66B" />
      <circle cx="26.5" cy="31" r="1.8" fill={INK} /><circle cx="37.5" cy="31" r="1.8" fill={INK} />
      <path d="M28.5 36.5c2 2 5 2 7 0" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="23" cy="36" r="2.4" fill="#F7A1B5" opacity=".7" /><circle cx="41" cy="36" r="2.4" fill="#F7A1B5" opacity=".7" />
    </>
  ),
  // wrapped candy
  '🍬': (
    <>
      <path d="M18 32L5 22v20zM46 32l13-10v20z" fill="#C9B6F0" />
      <ellipse cx="32" cy="32" rx="16" ry="12" fill="#D9C9F7" />
      <text x="32" y="35.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">Sweet</text>
    </>
  ),
  // lollipop
  '🍭': (
    <>
      <path d="M32 40v20" stroke="#F7A1B5" strokeWidth="4" strokeLinecap="round" />
      <circle cx="32" cy="24" r="17" fill="#FFE08A" />
      <path d="M32 24c0-4 4-6 7-4s4 8-1 12-14 3-16-4 4-15 13-15 16 8 13 19" stroke="#F7A1B5" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M32 24c0-4 4-6 7-4s4 8-1 12-14 3-16-4 4-15 13-15 16 8 13 19" stroke="#AEDCF0" strokeWidth="1.5" fill="none" strokeLinecap="round" transform="translate(1 1)" />
    </>
  ),
  // shooting star
  '🌠': (
    <>
      <path d="M26 38C34 26 46 16 60 10" stroke="#F7A1B5" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M28 42C38 32 50 24 62 20" stroke="#C9B6F0" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M22 34C28 22 38 12 50 4" stroke="#AEDCF0" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M18 30l4 8.2 9 1.3-6.5 6.4 1.5 9-8-4.2-8 4.2 1.5-9L5 39.5l9-1.3z" fill="#FFD55C" />
    </>
  ),
  // teacup with paw
  '☕': (
    <>
      <ellipse cx="30" cy="50" rx="24" ry="6" fill="#AEDCF0" />
      <path d="M12 26h36v8c0 10-8 16-18 16S12 44 12 34z" fill="#8FCDE6" />
      <path d="M48 30c6 0 8 3 7 7s-5 5-9 4" stroke="#8FCDE6" strokeWidth="3.5" fill="none" />
      <ellipse cx="30" cy="26" rx="18" ry="4" fill="#E9B97C" />
      <g fill="#fff">
        <ellipse cx="30" cy="40" rx="4" ry="3.2" /><circle cx="25" cy="34.5" r="1.8" /><circle cx="28.5" cy="32.5" r="1.8" /><circle cx="32" cy="32.5" r="1.8" /><circle cx="35.5" cy="34.5" r="1.8" />
      </g>
    </>
  ),
  // wedding cake
  '🎂': (
    <>
      <rect x="12" y="38" width="40" height="18" rx="4" fill="#FFF6E6" stroke="#F2D9B0" strokeWidth="1.5" />
      <rect x="18" y="24" width="28" height="15" rx="4" fill="#FFF6E6" stroke="#F2D9B0" strokeWidth="1.5" />
      <path d="M12 44c4 3 6 3 10 0s6-3 10 0 6 3 10 0 6-3 10 0M18 30c3 3 5 3 7 0s5-3 7 0 5 3 7 0 5-3 7 0" stroke="#F7A1B5" strokeWidth="2.5" fill="none" />
      <path d="M32 24c-4-3-6-5-6-7 0-2 1.5-3 3-3 1.3 0 2.3.7 3 1.7.7-1 1.7-1.7 3-1.7 1.5 0 3 1 3 3 0 2-2 4-6 7z" fill="#F7727F" />
      <circle cx="18" cy="50" r="2" fill="#7CC9A6" /><circle cx="46" cy="50" r="2" fill="#7CC9A6" />
    </>
  ),
}

export const STICKER_KEYS = Object.keys(S)

export function hasSticker(key: string) {
  return key in S
}

export function StickerIcon({ s, className = '' }: { s: string; className?: string }) {
  const art = S[s]
  if (!art) return <span className={className} aria-hidden>{s}</span>
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {art}
    </svg>
  )
}
