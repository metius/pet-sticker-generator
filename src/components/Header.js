import React from 'react';
import { Sparkles } from './icons';

const Header = ({ selectedImageService }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Pet Scene Sticker Generator</h1>
            <p className="text-gray-600">Create magical illustrated scenes featuring your pet with real AI</p>
          </div>
          <div className="bg-green-100 border border-green-200 rounded-lg p-2">
            <span className="text-green-800 text-sm font-medium">
              Ready for {selectedImageService?.toUpperCase() || 'AI'}!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
