import React from 'react';
import { Sparkles } from './icons';
import { IMAGE_SERVICES, getAllServices } from '../services/imageGeneration';

const StickerCount = ({
  count,
  onCountChange,
  selectedTheme,
  uploadedImages,
  selectedImageService,
  onImageServiceChange,
  onGenerate
}) => {
  const canGenerate = selectedTheme && uploadedImages.length > 0;
  const availableServices = getAllServices();
  const currentService = IMAGE_SERVICES[selectedImageService];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generation Settings</h2>
        <p className="text-gray-600">Configure your sticker generation</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Sticker Count Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Stickers
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Count:</span>
            <input
              type="range"
              min="1"
              max="12"
              value={count}
              onChange={(e) => onCountChange(parseInt(e.target.value))}
              className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-purple-600 font-bold text-xl min-w-[3rem] text-center">
              {count}
            </span>
          </div>
        </div>

        {/* AI Service Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Image Service
          </label>
          <select
            value={selectedImageService}
            onChange={(e) => onImageServiceChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {availableServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.provider}) - {service.cost}
              </option>
            ))}
          </select>
          
          {/* Service Information */}
          {currentService && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600">
                <div className="flex justify-between items-center mb-1">
                  <span><strong>Quality:</strong> {currentService.quality}</span>
                  <span><strong>Speed:</strong> {currentService.speed}</span>
                </div>
                <p><strong>Description:</strong> {currentService.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Cost Estimation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-1">Cost Estimation</p>
            <div className="text-blue-700">
              {selectedImageService === 'dalle-3' && (
                <p>{count} stickers × $0.080 = ~${(count * 0.08).toFixed(2)}</p>
              )}
              {selectedImageService === 'dalle-2' && (
                <p>{count} stickers × $0.020 = ~${(count * 0.02).toFixed(2)}</p>
              )}
              {selectedImageService === 'stable-diffusion' && (
                <p>{count} stickers × $0.002 = ~${(count * 0.002).toFixed(3)}</p>
              )}
              {selectedImageService === 'leonardo' && (
                <p>Pricing varies - check service documentation</p>
              )}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
        >
          <Sparkles className="w-5 h-5" />
          <span>Generate with {currentService?.name || 'AI'}</span>
        </button>
        
        {!canGenerate && (
          <p className="text-center text-sm text-gray-500">
            Please upload pet photos and select a theme to continue
          </p>
        )}
        
        <p className="text-xs text-gray-500 text-center">
          Your pet photos will be analyzed to create personalized artwork featuring your specific pet!
        </p>
      </div>
    </div>
  );
};

export default StickerCount;
