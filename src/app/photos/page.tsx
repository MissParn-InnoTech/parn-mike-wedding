'use client'

import { useEffect } from 'react'

export default function PhotosPage() {
  useEffect(() => {
    // Old link: send visitors to the gallery page
    window.location.href = '/gallery'
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5EBD2]">
      <p className="text-[#789568]">กำลังไปที่แกลเลอรี่…</p>
    </div>
  )
}
