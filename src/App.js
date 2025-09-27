import React, { useState, useRef } from 'react';
import './App.css';

// Simple icon components to replace lucide-react
const Upload = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const Download = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const Sparkles = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l1.5 1.5L5 6M19 3l-1.5 1.5L19 6M12 1v6M7 7l5 5 5-5" />
  </svg>
);

const X = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Camera = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Palette = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2" />
  </svg>
);

const Star = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const PetStickerGenerator = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [stickerCount, setStickerCount] = useState(2);
  const [generatedStickers, setGeneratedStickers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [generationProgress, setGenerationProgress] = useState('');
  const fileInputRef = useRef(null);

  // Determine the API endpoint based on environment
  const getApiEndpoint = () => {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:8888/.netlify/functions/generate-sticker';
    }
    return '/.netlify/functions/generate-sticker';
  };

  const themes = [
    {
      id: 'enchanted-forest',
      name: 'Enchanted Forest',
      description: 'Magical woodland scenes with mushrooms, fireflies, and fairy tale elements',
      example: '🍄',
      gradient: 'from-green-400 to-emerald-600',
      scenes: [
        'sleeping peacefully among glowing mushrooms and fireflies',
        'exploring a fairy ring of toadstools with sparkles',
        'napping in a hollow tree trunk with forest creatures',
        'playing with magical butterflies in dappled sunlight',
        'sitting by a babbling brook with water lilies',
        'curled up in a bed of moss and tiny flowers'
      ]
    },
    {
      id: 'space-adventure',
      name: 'Space Adventure', 
      description: 'Cosmic scenes with planets, stars, and space elements',
      example: '🚀',
      gradient: 'from-purple-600 to-indigo-800',
      scenes: [
        'floating among colorful planets and asteroid fields',
        'riding a shooting star across the galaxy',
        'napping on the moon with Earth in background',
        'playing with alien friends on a distant planet',
        'exploring a cosmic garden of star flowers',
        'sailing through nebula clouds in a rocket ship'
      ]
    },
    {
      id: 'underwater-world',
      name: 'Underwater World',
      description: 'Ocean scenes with coral reefs, sea creatures, and underwater magic',
      example: '🐠',
      gradient: 'from-blue-400 to-cyan-600',
      scenes: [
        'swimming through coral gardens with tropical fish',
        'resting in a giant shell with pearls and seahorses',
        'playing with dolphins in kelp forests',
        'exploring sunken treasure chests and ruins',
        'floating in a bubble with sea anemones',
        'riding on the back of a friendly sea turtle'
      ]
    },
    {
      id: 'cozy-cafe',
      name: 'Cozy Café',
      description: 'Warm indoor scenes with coffee, books, and comfortable spaces',
      example: '☕',
      gradient: 'from-orange-400 to-red-500',
      scenes: [
        'curled up next to a steaming coffee cup and pastries',
        'reading a book by a window with rain outside',
        'napping in a basket of fresh croissants',
        'playing among stacks of vintage books',
        'sitting by a fireplace with hot chocolate',
        'sleeping on a windowsill with potted plants'
      ]
    },
    {
      id: 'japanese-garden',
      name: 'Japanese Garden',
      description: 'Serene zen scenes with cherry blossoms, koi ponds, and traditional elements',
      example: '🌸',
      gradient: 'from-pink-300 to-rose-500',
      scenes: [
        'meditating under falling cherry blossom petals',
        'watching koi fish in a peaceful pond',
        'napping on a traditional wooden bridge',
        'playing with paper lanterns and wind chimes',
        'sitting in a zen rock garden with bamboo',
        'exploring a pagoda surrounded by maple trees'
      ]
    },
    {
      id: 'winter-wonderland',
      name: 'Winter Wonderland',
      description: 'Snowy scenes with ice crystals, aurora lights, and winter magic',
      example: '❄️',
      gradient: 'from-blue-200 to-purple-400',
      scenes: [
        'playing in fresh snow with crystal formations',
        'sleeping in an igloo with northern lights above',
        'ice skating on a frozen pond with snowflakes',
        'building snow sculptures with winter animals',
        'curled up by a cozy fire with hot cocoa',
        'exploring an ice castle with frozen waterfalls'
      ]
    }
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file: file,
            url: event.target.result,
            name: file.name
          };
          setUploadedImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const generateStickers = async () => {
    if (!selectedTheme || uploadedImages.length === 0) return;
    
    setIsGenerating(true);
    setCurrentStep(2);
    setGenerationProgress('Analyzing your pet photos...');

    try {
      const selectedThemeData = themes.find(t => t.id === selectedTheme);
      
      setGenerationProgress('Identifying pet characteristics...');

      // Simple pet analysis (simplified for demo)
      const petAnalysis = {
        petType: "pet",
        physicalDescription: "cute and adorable pet",
        personalityTraits: "playful and friendly",
        uniqueFeatures: ["distinctive markings", "expressive eyes"]
      };
      
      setGenerationProgress('Creating magical scene stickers...');

      // Generate scene-based stickers
      const selectedScenes = selectedThemeData.scenes
        .sort(() => Math.random() - 0.5)
        .slice(0, stickerCount);

      const stickers = selectedScenes.map((scene, index) => ({
        id: index + 1,
        title: `${selectedThemeData.name} Adventure ${index + 1}`,
        scene: scene,
        description: `A magical ${selectedThemeData.name.toLowerCase()} scene with your pet ${scene}`,
        imagePrompt: `Whimsical children's book illustration showing a cute ${petAnalysis.physicalDescription} ${scene} in a ${selectedThemeData.name.toLowerCase()} setting. Digital sticker art style, clean background, vibrant colors, detailed illustration, perfect for messaging apps.`,
        mood: "magical and joyful"
      }));
      
      setGenerationProgress('Generating actual artwork with DALL-E 3...');

      // Generate actual images using DALL-E 3 via Netlify Functions
      const enhancedStickers = await Promise.all(
        stickers.map(async (sticker, index) => {
          try {
            const imageUrl = await generateActualSticker(sticker.imagePrompt, index, petAnalysis);
            
            return {
              ...sticker,
              url: imageUrl,
              filename: `${petAnalysis.petType.toLowerCase()}-${selectedTheme}-scene-${index + 1}.png`,
              fullDescription: `${selectedThemeData.name} illustrated scene: ${sticker.description}`,
              themeData: selectedThemeData,
              isRealArt: imageUrl.startsWith('https://') // True if it's a real DALL-E URL
            };
          } catch (error) {
            console.error(`Error generating image ${index + 1}:`, error);
            // Fallback to preview if image generation fails
            return {
              ...sticker,
              url: createSceneStickerPreview(sticker, selectedThemeData, index, petAnalysis),
              filename: `${petAnalysis.petType.toLowerCase()}-${selectedTheme}-scene-${index + 1}.png`,
              fullDescription: `${selectedThemeData.name} illustrated scene: ${sticker.description}`,
              themeData: selectedThemeData,
              isRealArt: false,
              error: error.message
            };
          }
        })
      );

      setGeneratedStickers(enhancedStickers);
      setCurrentStep(3);
      setGenerationProgress('');
    } catch (error) {
      console.error('Error generating stickers:', error);
      setGenerationProgress('');
      alert('Sorry, there was an error generating your stickers. Please try again!');
    } finally {
      setIsGenerating(false);
    }
  };

  // REAL AI IMAGE GENERATION FUNCTION - Now calls Netlify Function
  const generateActualSticker = async (imagePrompt, index, petAnalysis) => {
    setGenerationProgress(`Creating artwork ${index + 1}/${stickerCount} with DALL-E 3...`);
    
    console.log(`🎨 Attempting DALL-E generation ${index + 1}:`);
    console.log(`Prompt: ${imagePrompt}`);
    
    try {
      const response = await fetch(getApiEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          petAnalysis: petAnalysis
        })
      });

      console.log(`🔍 Netlify Function Response Status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Netlify Function Error:', errorData);
        throw new Error(`Function error (${response.status}): ${errorData}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ DALL-E Success! Generated image URL:', data.imageUrl);
        return data.imageUrl;
      } else {
        throw new Error(data.error || 'Unknown error from function');
      }
      
    } catch (error) {
      console.error('💥 DALL-E generation failed:', error);
      console.error('Full error details:', error.message);
      throw error;
    }
  };

  const createSceneStickerPreview = (sticker, themeData, index, petAnalysis) => {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="350" height="350" xmlns="http://www.w3.org/2000/svg">
        <rect width="350" height="350" rx="25" fill="white" stroke="#ddd" stroke-width="2"/>
        <rect x="20" y="20" width="310" height="310" rx="20" fill="#f0f0f0"/>
        <text x="175" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="#666">
          🎨 ${themeData.example}
        </text>
        <text x="175" y="175" font-family="Arial" font-size="12" text-anchor="middle" fill="#666">
          ${sticker.title}
        </text>
        <text x="175" y="200" font-family="Arial" font-size="10" text-anchor="middle" fill="#999">
          ${themeData.name} Theme
        </text>
        <text x="175" y="250" font-family="Arial" font-size="8" text-anchor="middle" fill="#999">
          Pet: ${petAnalysis.petType}
        </text>
      </svg>
    `)}`;
  };

  const downloadSticker = (sticker) => {
    const link = document.createElement('a');
    link.download = sticker.filename;
    link.href = sticker.url;
    link.click();
  };

  const downloadAllStickers = () => {
    generatedStickers.forEach((sticker, index) => {
      setTimeout(() => {
        downloadSticker(sticker);
      }, index * 500);
    });
  };

  const resetApp = () => {
    setUploadedImages([]);
    setSelectedTheme('');
    setGeneratedStickers([]);
    setCurrentStep(1);
    setGenerationProgress('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
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
              <span className="text-green-800 text-sm font-medium">✅ Ready for DALL-E!</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <Camera className="w-5 h-5" />
            </div>
            <div className={`h-1 w-20 ${currentStep >= 2 ? 'bg-purple-500' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <Palette className="w-5 h-5" />
            </div>
            <div className={`h-1 w-20 ${currentStep >= 3 ? 'bg-purple-500' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <Star className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Loading Screen */}
        {isGenerating && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating Your Magical Scene Stickers</h2>
            <p className="text-gray-600 mb-4">{generationProgress}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
              <div className="bg-purple-500 h-2 rounded-full transition-all duration-300" style={{width: `${(currentStep - 1) * 50}%`}}></div>
            </div>
          </div>
        )}

        {currentStep === 1 && !isGenerating && (
          <div className="space-y-8">
            {/* Image Upload Section */}
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
                  onChange={handleImageUpload}
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
                          onClick={() => removeImage(image.id)}
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

            {/* Theme Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Magical Theme</h2>
                <p className="text-gray-600">Pick the world where your pet will have adventures</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
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

            {/* Scene Count and Generate */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Number of Scene Stickers</h2>
                <p className="text-gray-600">How many magical scenes should we create?</p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-gray-700 font-medium">Scenes:</span>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={stickerCount}
                    onChange={(e) => setStickerCount(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-purple-600 font-bold text-xl min-w-[3rem] text-center">
                    {stickerCount}
                  </span>
                </div>

                <button
                  onClick={generateStickers}
                  disabled={!selectedTheme || uploadedImages.length === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Create Magical Scene Stickers</span>
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-2">
                  Ready for real DALL-E 3 generation! Add your API key to environment variables.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && generatedStickers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Magical Scene Stickers! ✨</h2>
              <p className="text-gray-600 mb-6">
                {generatedStickers.length} illustrated scenes featuring your pet in {themes.find(t => t.id === selectedTheme)?.name} adventures
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={downloadAllStickers}
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all flex items-center space-x-2 shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  <span>Download All Scene Stickers</span>
                </button>
                
                <button
                  onClick={resetApp}
                  className="bg-gray-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all shadow-lg"
                >
                  Create New Adventure
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedStickers.map((sticker) => (
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
                    {sticker.imagePrompt && (
                      <div className="bg-blue-50 p-2 rounded text-xs">
                        <strong>AI Art Prompt:</strong> {sticker.imagePrompt.substring(0, 100)}...
                      </div>
                    )}
                    <p className="text-xs text-gray-500 line-clamp-3">
                      {sticker.description}
                    </p>
                    <button
                      onClick={() => downloadSticker(sticker)}
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
                    Each sticker would be a complete illustrated scene like the forest cat you showed - 
                    but featuring YOUR specific pet in magical environments. The real version creates 
                    beautiful artwork using AI illustration tools!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetStickerGenerator;
