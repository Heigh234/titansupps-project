'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, ImageIcon, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imgError, setImgError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setError('')
    setSuccess(false)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Error uploading image')

      onChange(data.url)
      setImgError(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }, [])

  const handleClear = () => {
    onChange('')
    setError('')
    setImgError(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      {/* Preview */}
      {value && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border group bg-card">
          {imgError ? (
            // Fallback when image URL is invalid
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-500">
              <AlertTriangle className="w-10 h-10 text-yellow-500" />
              <p className="text-sm font-semibold text-yellow-500">Invalid image URL</p>
              <p className="text-xs text-gray-500">Upload an image or paste a valid URL</p>
            </div>
          ) : (
            // Use regular img tag to avoid Next.js crashes with invalid domains
            <img
              src={value}
              alt="Product preview"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
              onLoad={() => setImgError(false)}
            />
          )}
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleClear}
              className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {success && (
            <div className="absolute top-3 right-3 bg-neon text-background px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />Upload successful
            </div>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300',
          dragging ? 'border-neon bg-neon/10 scale-[1.02]' : 'border-border hover:border-neon/50 hover:bg-card-hover',
          uploading && 'pointer-events-none opacity-60'
        )}
      >
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-neon animate-spin" />
            <p className="font-semibold">Uploading image...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={cn('w-14 h-14 rounded-full flex items-center justify-center transition-colors', dragging ? 'bg-neon/20' : 'bg-card')}>
              {value ? <ImageIcon className="w-7 h-7 text-neon" /> : <Upload className="w-7 h-7 text-gray-400" />}
            </div>
            <div>
              <p className="font-semibold">{value ? 'Change image' : 'Upload product image'}</p>
              <p className="text-sm text-gray-400 mt-1">Drag here or click to select</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP — max 5MB</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm flex items-center gap-2">
          <X className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      {/* URL fallback */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-gray-500">or paste a URL</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <input
        type="url"
        className="input text-sm"
        placeholder="https://example.com/image.jpg"
        value={value}
        onChange={(e) => { onChange(e.target.value); setImgError(false) }}
      />
    </div>
  )
}
