import React from 'react';
import { Download, Sparkles } from './icons';
import { themes } from '../data/themes';

const StickerResults = ({ 
  stickers, 
  selectedTheme, 
  onDownloadSticker, 
  onDownloadAll, 
  onReset 
}) => {
  const themeData = themes.find(t => t.id === selectedTheme);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Magical Scene Stickers! ✨</h2>
        <p className="text-gray-600 mb-6">
          {stickers.length} illustrated scenes featuring your pet in {themeData?.name} adventures
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onDownloadAll}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all flex items-center space-x-2 shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>Download All Scene Stickers</span>
          </button>
          
          <button
            onClick={onReset}
            className="bg-gray-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all shadow-lg"
          >
            Create New Adventure
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stickers.map((sticker) => (
          <div key={sticker.id} className="group relative bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-all">
            <img
              src={sticker.url}
              alt={`Scene sticker: ${sticker.title}`}
              className="w-full h-60 object-contain rounded-lg mb-4"
            />
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-gray-800">
                {sticker.title}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Scene:</strong> {sticker.scene}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Mood:</strong> {sticker.mood}
              </p>
              {sticker.service && (
                <p className="text-xs text-blue-600">
                  <strong>Generated with:</strong> {sticker.service.toUpperCase()}
                </p>
              )}
              {sticker.imagePrompt && (
                <div className="bg-blue-50 p-2 rounded text-xs">
                  <strong>AI Art Prompt:</strong> {sticker.imagePrompt.substring(0, 100)}...
                </div>
              )}
              <p className="text-xs text-gray-500 line-clamp-3">
                {sticker.description}
              </p>
              <button
                onClick={() => onDownloadSticker(sticker)}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2 mt-3"
              >
                <Download className="w-4 h-4" />
                <span>{sticker.isRealArt ? 'Download Artwork' : 'Download Scene'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-green-800 mb-1">Perfect! Just Like Your Example</p>
            <p className="text-green-700">
              Each sticker features YOUR specific pet in magical environments. The real version creates 
              beautiful artwork using AI illustration tools based on your pet's actual appearance!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickerResults;
