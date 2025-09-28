import React from 'react';
import { themes } from '../data/themes';

const ThemeSelector = ({ selectedTheme, onThemeSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Magical Theme</h2>
        <p className="text-gray-600">Pick the world where your pet will have adventures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => onThemeSelect(theme.id)}
            className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
              selectedTheme === theme.id
                ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
            }`}
          >
            <div className={`text-4xl mb-4 p-4 rounded-lg bg-gradient-to-r ${theme.gradient} text-center shadow-sm`}>
              {theme.example}
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">{theme.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{theme.description}</p>
            <div className="text-xs text-gray-500">
              <strong>Sample scenes:</strong> {theme.scenes.slice(0, 2).join(', ')}...
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
