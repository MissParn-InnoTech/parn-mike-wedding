'use client'

import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'

interface UploadedFile {
  file: File
  preview: string
  id: string
}

interface FormData {
  senderName: string
  wishingMessage: string
  files: UploadedFile[]
}

const isValidImageType = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
  return validTypes.includes(file.type)
}

const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file)
}

const handleFileSelection = (files: FileList | null): UploadedFile[] => {
  if (!files) return []

  const validFiles: UploadedFile[] = []

  Array.from(files).forEach((file) => {
    if (isValidImageType(file)) {
      validFiles.push({
        file,
        preview: createPreviewUrl(file),
        id: Math.random().toString(36).substr(2, 9),
      })
    }
  })

  return validFiles
}

export default function PhotoUploadComponent() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<FormData>({
    senderName: '',
    wishingMessage: '',
    files: [],
  })

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = handleFileSelection(e.target.files)
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-[#C9A45C]', 'bg-[#F5EBD2]')
    }
  }

  const handleDragLeave = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-[#C9A45C]', 'bg-[#F5EBD2]')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-[#C9A45C]', 'bg-[#F5EBD2]')
    }
    const newFiles = handleFileSelection(e.dataTransfer.files)
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }))
  }

  const handleRemoveFile = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.id !== id),
    }))
  }

  const handleSubmit = async () => {
    if (formData.files.length === 0) {
      alert('กรุณาเลือกรูปภาพก่อน')
      return
    }

    if (!formData.senderName.trim()) {
      alert('กรุณากรอกชื่อของคุณ')
      return
    }

    setIsUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)

    try {
      const totalFiles = formData.files.length

      for (let i = 0; i < totalFiles; i++) {
        const fileFormData = new FormData()
        fileFormData.append('file', formData.files[i].file)
        fileFormData.append('senderName', formData.senderName)
        fileFormData.append('wishingMessage', formData.wishingMessage)
        fileFormData.append('uploadedAt', new Date().toISOString())

        await fetch('/api/upload', {
          method: 'POST',
          body: fileFormData,
        })

        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100))
      }

      setUploadStatus('success')
      alert('อัพโหลดรูปสำเร็จ! ขอบคุณค่ะ 💚')

      setFormData({
        senderName: '',
        wishingMessage: '',
        files: [],
      })
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('error')
      alert('เกิดข้อผิดพลาดในการอัพโหลด กรุณาลองอีกครั้ง')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#536B3E] mb-2">
          Share Your Beautiful Moments
        </h2>
        <p className="text-[#789568] text-lg">
          ร่วมแชร์ความทรงจำในงานแต่งงานของเรา
        </p>
        <p className="text-[#C9A45C] font-semibold mt-3">PARN & MIKE</p>
      </div>

      <div className="mb-8">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full bg-[#789568] hover:bg-[#536B3E] disabled:bg-gray-400 text-white font-bold py-6 px-4 rounded-lg mb-4 transition duration-200 flex items-center justify-center gap-3 text-lg"
        >
          <Upload size={28} />
          กดเพื่อเลือกรูปภาพ / ถ่ายรูป
        </button>

        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-4 border-dashed border-[#789568] rounded-lg p-8 text-center bg-white transition duration-200 cursor-pointer hover:border-[#C9A45C]"
        >
          <p className="text-[#789568] font-semibold">
            หรือลากรูปมาวางที่นี่
          </p>
          <p className="text-sm text-[#97a889] mt-2">
            (รองรับ JPG, JPEG, PNG)
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-8 bg-[#F5EBD2] rounded-lg p-6">
        <div>
          <label className="block text-[#536B3E] font-semibold mb-2">
            ชื่อของคุณ *
          </label>
          <input
            type="text"
            value={formData.senderName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, senderName: e.target.value }))
            }
            placeholder="เช่น สมชาย ชาติไทย"
            className="w-full px-4 py-3 border-2 border-[#C9A45C] rounded-lg focus:outline-none focus:border-[#789568] text-[#536B3E]"
          />
        </div>

        <div>
          <label className="block text-[#536B3E] font-semibold mb-2">
            คำอวยพร (ตัวเลือก)
          </label>
          <textarea
            value={formData.wishingMessage}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, wishingMessage: e.target.value }))
            }
            placeholder="เช่น ขอให้บ่าวสาวมีความสุขตลอดไป 💚"
            className="w-full px-4 py-3 border-2 border-[#C9A45C] rounded-lg focus:outline-none focus:border-[#789568] text-[#536B3E] resize-none"
            rows={3}
          />
        </div>
      </div>

      {formData.files.length > 0 && (
        <div className="mb-8">
          <h3 className="text-[#536B3E] font-bold mb-4">
            ตัวอย่างรูป ({formData.files.length} รูป)
          </h3>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {formData.files.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 group"
              >
                <img
                  src={uploadedFile.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={() => handleRemoveFile(uploadedFile.id)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition duration-200"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {isUploading && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-[#789568] mb-2">
                <span>กำลังอัพโหลด...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#789568] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-4">
              ✓ อัพโหลดสำเร็จแล้ว!
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
              ✗ เกิดข้อผิดพลาด กรุณาลองอีกครั้ง
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isUploading || formData.files.length === 0}
        className="w-full bg-[#C9A45C] hover:bg-[#B7A286] disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition duration-200 text-lg"
      >
        {isUploading ? `กำลังส่ง... (${uploadProgress}%)` : 'ส่งรูปภาพ (Upload Now)'}
      </button>

      <p className="text-center text-sm text-[#97a889] mt-4">
        💚 ขอบคุณที่ร่วมแชร์ความสุขของวันพิเศษนี้
      </p>
    </div>
  )
}
