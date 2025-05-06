import React from 'react';
import Image from 'next/image';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function ImageModal({ isOpen, imageUrl, onClose }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[90vw] h-auto max-h-[90vh] bg-transparent rounded-lg"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 z-10 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <div className="relative w-full h-[80vh] flex items-center justify-center">
          <Image
            src={imageUrl}
            alt="Enlarged view"
            fill
            style={{ objectFit: 'contain' }}
            unoptimized={imageUrl.startsWith('http')}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
