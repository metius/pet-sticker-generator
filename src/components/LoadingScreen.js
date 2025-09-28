import React from 'react';

const LoadingScreen = ({ progress, currentStep }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-6"></div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating Your Magical Scene Stickers</h2>
      <p className="text-gray-600 mb-4">{progress}</p>
      <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
        <div 
          className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
          style={{width: `${(currentStep - 1) * 50}%`}}
        ></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
