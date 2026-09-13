'use client'

import { useEffect } from 'react'

export default function PhotosPage() {
  useEffect(() => {
    // Redirect to Google Drive folder
    window.location.href = 'https://drive.google.com/drive/folders/161V_cnOtutZLQOh5CVz3Es5fmMdDBX4R?usp=sharing'
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5EBD2]">
      <p className="text-[#789568]">Redirecting to photos folder...</p>
    </div>
  )
}
