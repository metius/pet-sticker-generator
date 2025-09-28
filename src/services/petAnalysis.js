import { getApiEndpoint } from '../utils/apiEndpoints';

/**
 * Analyze uploaded pet photos to extract detailed characteristics
 * @param {Array} images - Array of uploaded image objects
 * @returns {Promise<Object>} - Detailed pet analysis
 */
export const analyzePetPhotos = async (images) => {
  if (!images || images.length === 0) {
    throw new Error('No images provided for analysis');
  }

  try {
    console.log(`🔍 Analyzing ${images.length} pet photos...`);
    
    // Convert images to base64 for API
    const base64Images = await Promise.all(
      images.map(img => convertImageToBase64(img))
    );

    console.log('📤 Sending images to analysis service...');

    // Call our Netlify function for pet analysis
    const response = await fetch(getApiEndpoint('analyze-pet'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: base64Images
      })
    });

    console.log(`🔍 Analysis service response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Analysis service error:', errorData);
      throw new Error(`Pet analysis failed (${response.status}): ${errorData}`);
    }

    const data = await response.json();

    if (data.success) {
      console.log('✅ Pet analysis complete:', data.analysis);
      
      // Validate the analysis has required fields
      validatePetAnalysis(data.analysis);
      
      return data.analysis;
    } else {
      console.warn('⚠️ Analysis failed, using fallback:', data.fallback);
      
      // If the service provides a fallback, use it
      if (data.fallback) {
        return enhanceFallbackAnalysis(data.fallback, images);
      }
      
      throw new Error(data.error || 'Pet analysis failed');
    }

  } catch (error) {
    console.error('❌ Pet analysis failed:', error);
    
    // Fallback to local analysis if service fails
    console.warn('🔄 Using local fallback analysis...');
    return createLocalFallbackAnalysis(images);
  }
};

/**
 * Convert uploaded image to base64 for API transmission
 */
const convertImageToBase64 = async (imageObj) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    
    image.onload = () => {
      // Resize for API efficiency while maintaining quality
      const maxSize = 512;
      let { width, height } = image;
      
      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);
      const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      resolve(base64);
    };
    
    image.src = imageObj.url;
  });
};

/**
 * Validate that pet analysis contains required fields
 */
const validatePetAnalysis = (analysis) => {
  const requiredFields = [
    'petType',
    'physicalDescription', 
    'uniqueFeatures',
    'personalityTraits'
  ];
  
  for (const field of requiredFields) {
    if (!analysis[field]) {
      throw new Error(`Pet analysis missing required field: ${field}`);
    }
  }
  
  if (!Array.isArray(analysis.uniqueFeatures) || analysis.uniqueFeatures.length === 0) {
    throw new Error('Pet analysis must include unique features array');
  }
};

/**
 * Enhance fallback analysis from service
 */
const enhanceFallbackAnalysis = (fallback, images) => {
  const firstImageName = images[0]?.name?.toLowerCase() || '';
  
  // Try to infer pet type from filename
  let petType = fallback.petType || 'pet';
  if (firstImageName.includes('cat') || firstImageName.includes('kitten')) {
    petType = 'cat';
  } else if (firstImageName.includes('dog') || firstImageName.includes('puppy')) {
    petType = 'dog';
  }
  
  return {
    petType: petType,
    breed: 'mixed breed',
    size: 'medium',
    physicalDescription: fallback.physicalDescription || `adorable ${petType} with distinctive markings and expressive eyes`,
    coatDetails: 'beautiful fur with natural coloring',
    facialFeatures: 'expressive eyes and alert expression',
    uniqueFeatures: fallback.uniqueFeatures || [
      'distinctive facial markings',
      'expressive eyes',
      'unique personality'
    ],
    personalityTraits: fallback.personalityTraits || 'playful and photogenic',
    preferredPoses: ['sitting', 'lying down', 'alert pose'],
    colorPalette: ['brown', 'cream', 'black'],
    artDirection: `Focus on capturing the ${petType}'s natural charm and personality in a whimsical, illustrated style`
  };
};

/**
 * Create local fallback analysis when service is unavailable
 */
const createLocalFallbackAnalysis = (images) => {
  const firstImageName = images[0]?.name?.toLowerCase() || '';
  
  let petType = 'pet';
  if (firstImageName.includes('cat') || firstImageName.includes('kitten')) {
    petType = 'cat';
  } else if (firstImageName.includes('dog') || firstImageName.includes('puppy')) {
    petType = 'dog';
  }
  
  return {
    petType: petType,
    breed: 'mixed breed',
    size: 'medium',
    physicalDescription: `adorable ${petType} with distinctive markings and expressive eyes`,
    coatDetails: 'beautiful fur with natural coloring',
    facialFeatures: 'expressive eyes and alert expression',
    uniqueFeatures: [
      'distinctive facial markings',
      'expressive eyes',
      'unique personality'
    ],
    personalityTraits: 'playful and photogenic',
    preferredPoses: ['sitting', 'lying down', 'alert pose'],
    colorPalette: ['brown', 'cream', 'black'],
    artDirection: `Focus on capturing the ${petType}'s natural charm and personality in a whimsical, illustrated style`
  };
};
