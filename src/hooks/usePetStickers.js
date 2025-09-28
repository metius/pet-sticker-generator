import { useState, useRef } from 'react';
import { analyzePetPhotos } from '../services/petAnalysis';
import { generateStickerImage } from '../services/imageGeneration';
import { themes } from '../data/themes';

export const usePetStickers = () => {
  // Core state
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [stickerCount, setStickerCount] = useState(2);
  const [generatedStickers, setGeneratedStickers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [generationProgress, setGenerationProgress] = useState('');
  const [selectedImageService, setSelectedImageService] = useState('dalle-3');
  
  const fileInputRef = useRef(null);

  // Image upload handler
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

  // Remove image
  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Main generation process
  const generateStickers = async () => {
    if (!selectedTheme || uploadedImages.length === 0) return;
    
    setIsGenerating(true);
    setCurrentStep(2);
    setGenerationProgress('Analyzing your pet photos...');

    try {
      const selectedThemeData = themes.find(t => t.id === selectedTheme);
      
      // Step 1: Analyze pet photos
      const petAnalysis = await analyzePetPhotos(uploadedImages.slice(0, 5));
      
      setGenerationProgress('Creating magical scene concepts...');
      
      // Step 2: Generate scene concepts
      const selectedScenes = selectedThemeData.scenes
        .sort(() => Math.random() - 0.5)
        .slice(0, stickerCount);

      const stickerConcepts = selectedScenes.map((scene, index) => ({
        id: index + 1,
        title: `${selectedThemeData.name} Adventure ${index + 1}`,
        scene: scene,
        description: `A magical ${selectedThemeData.name.toLowerCase()} scene with your ${petAnalysis.petType} ${scene}`,
        imagePrompt: createImagePrompt(petAnalysis, scene, selectedThemeData),
        mood: "magical and joyful"
      }));
      
      setGenerationProgress(`Generating artwork with ${selectedImageService.toUpperCase()}...`);
      
      // Step 3: Generate actual images
      const enhancedStickers = await Promise.all(
        stickerConcepts.map(async (concept, index) => {
          try {
            setGenerationProgress(`Creating artwork ${index + 1}/${stickerCount} with ${selectedImageService.toUpperCase()}...`);
            
            const imageUrl = await generateStickerImage(
              concept.imagePrompt,
              selectedImageService,
              index
            );
            
            return {
              ...concept,
              url: imageUrl,
              filename: `${petAnalysis.petType.toLowerCase()}-${selectedTheme}-scene-${index + 1}.png`,
              isRealArt: imageUrl.startsWith('https://'),
              service: selectedImageService
            };
          } catch (error) {
            console.error(`Error generating image ${index + 1}:`, error);
            
            return {
              ...concept,
              url: createFallbackPreview(concept, selectedThemeData, index, petAnalysis),
              filename: `${petAnalysis.petType.toLowerCase()}-${selectedTheme}-scene-${index + 1}.png`,
              isRealArt: false,
              error: error.message,
              service: selectedImageService
            };
          }
        })
      );

      setGeneratedStickers(enhancedStickers);
      setCurrentStep(3);
      setGenerationProgress('');
    } catch (error) {
      console.error('Error in generation process:', error);
      setGenerationProgress('');
      alert(`Sorry, there was an error generating your stickers: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Create detailed image prompt
  const createImagePrompt = (petAnalysis, scene, themeData) => {
    const basePrompt = `Whimsical children's book illustration showing a ${petAnalysis.physicalDescription} ${scene} in a ${themeData.name.toLowerCase()} setting.`;
    const stylePrompt = `Digital sticker art style, clean background, vibrant colors, detailed illustration, perfect for messaging apps.`;
    const specificDetails = `The ${petAnalysis.petType} has ${petAnalysis.uniqueFeatures.join(', ')} and displays ${petAnalysis.personalityTraits}.`;
    
    return `${basePrompt} ${specificDetails} ${stylePrompt}`;
  };

  // Fallback preview generator
  const createFallbackPreview = (concept, themeData, index, petAnalysis) => {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="350" height="350" xmlns="http://www.w3.org/2000/svg">
        <rect width="350" height="350" rx="25" fill="white" stroke="#ddd" stroke-width="2"/>
        <rect x="20" y="20" width="310" height="310" rx="20" fill="#f0f0f0"/>
        <text x="175" y="140" font-family="Arial" font-size="14" text-anchor="middle" fill="#666">
          ${themeData.example} ${selectedImageService.toUpperCase()}
        </text>
        <text x="175" y="165" font-family="Arial" font-size="12" text-anchor="middle" fill="#666">
          ${concept.title}
        </text>
        <text x="175" y="190" font-family="Arial" font-size="10" text-anchor="middle" fill="#999">
          ${petAnalysis.petType} - ${themeData.name}
        </text>
        <text x="175" y="220" font-family="Arial" font-size="8" text-anchor="middle" fill="#999">
          Service: ${selectedImageService}
        </text>
        <text x="175" y="250" font-family="Arial" font-size="8" text-anchor="middle" fill="#999">
          Real artwork would appear here
        </text>
      </svg>
    `)}`;
  };

  // Download handlers
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

  // Reset app
  const resetApp = () => {
    setUploadedImages([]);
    setSelectedTheme('');
    setGeneratedStickers([]);
    setCurrentStep(1);
    setGenerationProgress('');
  };

  return {
    // State
    uploadedImages,
    selectedTheme,
    stickerCount,
    generatedStickers,
    isGenerating,
    currentStep,
    generationProgress,
    selectedImageService,
    fileInputRef,
    
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
  };
};
