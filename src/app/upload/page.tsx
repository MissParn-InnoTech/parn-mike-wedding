'use client'

import { useState } from 'react'
import Link from 'next/link'

const FOLDERS = {
  receipt: {
    id: '1YHj4X7oMPL65LF4-sM_8XrDM96q0rNA4',
    name: 'URI สลิป / Receipt',
    emoji: '🧾'
  },
  photos: {
    id: '161V_cnOtutZLQOh5CVz3Es5fmMdDBX4R',
    name: 'รูปในงาน / Wedding Photos',
    emoji: '📸'
  }
}

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-[#F5EBD2] pt-20 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#536B3E] mb-3">
            Share Your Moments 📸
          </h1>
          <p className="text-[#789568] text-lg">
            ช่วยแชร์ความสุขของวันพิเศษนี้ได้เลยค่ะ
          </p>
        </div>

        {/* Folder Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Receipt Folder */}
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-[#C9A45C] hover:shadow-lg transition">
            <div className="text-center">
              <div className="text-5xl mb-3">{FOLDERS.receipt.emoji}</div>
              <h2 className="text-xl font-bold text-[#536B3E] mb-3">
                {FOLDERS.receipt.name}
              </h2>
              <p className="text-[#789568] text-sm mb-4">
                Upload payment receipts and slips here
              </p>
              
                href={`https://drive.google.com/drive/folders/${FOLDERS.receipt.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#C9A45C] hover:bg-[#B7A286] text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                Open Folder
              </a>
            </div>
          </div>

          {/* Photos Folder */}
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-[#789568] hover:shadow-lg transition">
            <div className="text-center">
              <div className="text-5xl mb-3">{FOLDERS.photos.emoji}</div>
              <h2 className="text-xl font-bold text-[#536B3E] mb-3">
                {FOLDERS.photos.name}
              </h2>
              <p className="text-[#789568] text-sm mb-4">
                Share your beautiful wedding photos
              </p>
              
                href={`https://drive.google.com/drive/folders/${FOLDERS.photos.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#789568] hover:bg-[#536B3E] text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                Open Folder
              </a>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-[#C9A45C]">
          <h3 className="text-xl font-bold text-[#536B3E] mb-4">วิธีการ Upload:</h3>
          <ol className="list-decimal list-inside text-[#789568] space-y-2 mb-6">
            <li>เลือก Folder ด้านบน</li>
            <li>Click "New" → "File upload"</li>
            <li>Select files จากคอมพิวเตอร์หรือมือถือ</li>
            <li>Wait for upload to complete</li>
            <li>ขอบคุณค่ะ! 💚</li>
          </ol>

          <div className="bg-[#F5EBD2] rounded-lg p-4 border-l-4 border-[#789568]">
            <p className="text-[#789568] text-sm">
              💚 กรุณาเลือก Folder ที่ถูกต้อง เพื่อให้การจัดระเบียบง่ายขึ้น
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="text-[#789568] hover:text-[#536B3E] font-semibold underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
