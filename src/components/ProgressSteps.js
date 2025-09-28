import React from 'react';
import { Camera, Palette, Star } from './icons';

const ProgressSteps = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
          currentStep >= 1 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          <Camera className="w-5 h-5" />
        </div>
        <div className={`h-1 w-20 ${currentStep >= 2 ? 'bg-purple-500' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
          currentStep >= 2 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          <Palette className="w-5 h-5" />
        </div>
        <div className={`h-1 w-20 ${currentStep >= 3 ? 'bg-purple-500' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
          currentStep >= 3 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          <Star className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;
