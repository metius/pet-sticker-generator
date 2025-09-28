import React, { useRef } from 'react';
import { Upload, X } from './icons';

const ImageUpload = ({ uploadedImages, onImageUpload, onRemoveImage }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Pet Photos</h2>
        <p className="text-gray-600">Add photos of your pet to star in magical illustrated scenes</p>
      </div>

      <div 
        className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer bg-purple-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Upload your pet photos for magical scene stickers
        </p>
        <p className="text-gray-500">Your pet will become the star of illustrated adventures!</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
      </div>

      {uploadedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Pet Photos ({uploadedImages.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-24 object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={() => onRemoveImage(image.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
