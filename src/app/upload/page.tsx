'use client'

import Link from 'next/link'
import PhotoUploadComponent from '@/app/components/PhotoUploadComponent'

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-[#F5EBD2]">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-[#789568]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-serif font-bold text-lg text-[#789568] hover:text-[#536B3E]">
              PARN & MIKE
            </Link>
            <div className="space-x-6">
              <Link href="https://drive.google.com/drive/folders/161V_cnOtutZLQOh5CVz3Es5fmMdDBX4R?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">Photos</Link>
              <Link href="/rsvp" className="text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">RSVP</Link>
              <Link href="/information" className="text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">Information</Link>
              <Link href="/schedule" className="text-sm font-serif font-medium text-[#536B3E] hover:text-[#789568]">Schedule</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#F5EBD2] via-[#EFDCC4] to-[#C9A45C] py-16 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <h1 className="text-white font-serif text-3xl md:text-4xl font-bold">
            📸 Share Your Moments
          </h1>
          <p className="text-white font-serif text-lg">
            ร่วมแชร์ความทรงจำในงานแต่งงานของเรา
          </p>
        </div>
      </div>

      {/* Upload Component */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <PhotoUploadComponent />
      </div>

      {/* Back to Home */}
      <section className="max-w-2xl mx-auto px-4 py-8 text-center">
        <Link href="/" className="text-[#789568] hover:text-[#536B3E] font-semibold underline">
          ← Back to Home
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#536B3E] to-[#3a4d2e] text-white py-12 mt-16 border-t border-[#789568]/20">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-3">
          <p className="font-serif text-lg font-semibold text-[#B7A286]">PARN & MIKE</p>
          <p className="text-sm text-[#B7A286]">© 2026 Our Special Day. All our love.</p>
          <p className="text-xs text-[#B7A286]/80">Created by Bride Parn</p>
        </div>
      </footer>
    </div>
  )
}
