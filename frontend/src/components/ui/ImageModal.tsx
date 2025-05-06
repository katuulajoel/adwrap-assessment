import React from 'react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function ImageModal({ isOpen, imageUrl, onClose }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-lg p-2"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <img src={imageUrl} alt="Enlarged view" className="max-h-[80vh]" />
      </div>
    </div>
  );
}
