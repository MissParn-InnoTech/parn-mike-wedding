'use client'
import Link from 'next/link'

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-[#F5EBD2] pt-20 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#536B3E] text-center mb-8">Share Your Moments</h1>
        <div className="space-y-4">
          <a href="https://drive.google.com/drive/folders/1YHj4X7oMPL65LF4-sM_8XrDM96q0rNA4" target="_blank" className="block bg-[#C9A45C] text-white p-4 rounded text-center">URI สลิป</a>
          <a href="https://drive.google.com/drive/folders/161V_cnOtutZLQOh5CVz3Es5fmMdDBX4R" target="_blank" className="block bg-[#789568] text-white p-4 rounded text-center">Wedding Photos</a>
        </div>
        <div className="text-center mt-8"><Link href="/">Back Home</Link></div>
      </div>
    </div>
  )
}
