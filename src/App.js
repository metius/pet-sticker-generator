import React from 'react';
import './App.css';
import Header from './components/Header';
import ProgressSteps from './components/ProgressSteps';
import ImageUpload from './components/ImageUpload';
import ThemeSelector from './components/ThemeSelector';
import StickerCount from './components/StickerCount';
import LoadingScreen from './components/LoadingScreen';
import StickerResults from './components/StickerResults';
import { usePetStickers } from './hooks/usePetStickers';

const PetStickerGenerator = () => {
  const {
    // State
    uploadedImages,
    selectedTheme,
    stickerCount,
    generatedStickers,
    isGenerating,
    currentStep,
    generationProgress,
    selectedImageService,
    
    // Actions
    handleImageUpload,
    removeImage,
    setSelectedTheme,
    setStickerCount,
    setSelectedImageService,
    generateStickers,
    downloadSticker,
    downloadAllStickers,
    resetApp
  } = usePetStickers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header selectedImageService={selectedImageService} />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ProgressSteps currentStep={currentStep} />

        {isGenerating && (
          <LoadingScreen 
            progress={generationProgress} 
            currentStep={currentStep} 
          />
        )}

        {currentStep === 1 && !isGenerating && (
          <div className="space-y-8">
            <ImageUpload
              uploadedImages={uploadedImages}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
            />
            
            <ThemeSelector
              selectedTheme={selectedTheme}
              onThemeSelect={setSelectedTheme}
            />
            
            <StickerCount
              count={stickerCount}
              onCountChange={setStickerCount}
              selectedTheme={selectedTheme}
              uploadedImages={uploadedImages}
              selectedImageService={selectedImageService}
              onImageServiceChange={setSelectedImageService}
              onGenerate={generateStickers}
            />
          </div>
        )}

        {currentStep === 3 && generatedStickers.length > 0 && (
          <StickerResults
            stickers={generatedStickers}
            selectedTheme={selectedTheme}
            onDownloadSticker={downloadSticker}
            onDownloadAll={downloadAllStickers}
            onReset={resetApp}
          />
        )}
      </div>
    </div>
  );
};

export default PetStickerGenerator;
