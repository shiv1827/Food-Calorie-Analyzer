'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageCapture: (file: File) => void;
}

export default function ImageUpload({ onImageCapture }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageCapture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCapturing(true);
      // Additional camera handling logic will be added here
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please make sure you have granted camera permissions.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {preview ? (
        <div className="relative w-full h-64">
          <Image
            src={preview}
            alt="Food preview"
            fill
            className="object-cover rounded-lg"
          />
          <button
            onClick={() => {
              setPreview(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="mx-auto w-12 h-12 mb-4">
              <svg
                className="w-full h-full text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-gray-600">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
          </div>

          <button
            onClick={handleCameraCapture}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Take Photo
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
