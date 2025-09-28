import { getApiEndpoint } from '../utils/apiEndpoints';

// Available image generation services
export const IMAGE_SERVICES = {
  'dalle-3': {
    name: 'DALL-E 3',
    provider: 'OpenAI',
    cost: '$0.080',
    quality: 'Excellent',
    speed: 'Medium',
    description: 'Best overall quality, great at following complex prompts'
  },
  'dalle-2': {
    name: 'DALL-E 2', 
    provider: 'OpenAI',
    cost: '$0.020',
    quality: 'Good',
    speed: 'Fast',
    description: 'Lower cost alternative, good for simple prompts'
  },
  'stable-diffusion': {
    name: 'Stable Diffusion',
    provider: 'Stability AI',
    cost: '$0.002',
    quality: 'Good',
    speed: 'Fast',
    description: 'Very affordable, highly customizable'
  },
  'leonardo': {
    name: 'Leonardo AI',
    provider: 'Leonardo',
    cost: 'Token-based',
    quality: 'Very Good',
    speed: 'Fast',
    description: 'Great for character consistency and illustration styles'
  }
};

/**
 * Generate a sticker image using the specified service
 */
export const generateStickerImage = async (prompt, service, index = 0) => {
  console.log(`🎨 Generating image ${index + 1} with ${service}:`);
  console.log(`Prompt: ${prompt}`);

  try {
    switch (service) {
      case 'dalle-3':
        return await generateWithDALLE3(prompt);
      
      case 'dalle-2':
        return await generateWithDALLE2(prompt);
      
      case 'stable-diffusion':
        return await generateWithStableDiffusion(prompt);
      
      case 'leonardo':
        return await generateWithLeonardo(prompt);
      
      default:
        throw new Error(`Unsupported image service: ${service}`);
    }
  } catch (error) {
    console.error(`❌ ${service} generation failed:`, error);
    throw new Error(`${service} generation failed: ${error.message}`);
  }
};

/**
 * DALL-E 3 generation via Netlify function
 */
const generateWithDALLE3 = async (prompt) => {
  const response = await fetch(getApiEndpoint('generate-sticker'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      model: 'dall-e-3',
      size: '1024x1024',
      quality: 'hd'
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`DALL-E 3 API error (${response.status}): ${errorData}`);
  }

  const data = await response.json();
  if (data.success) {
    console.log('✅ DALL-E 3 Success:', data.imageUrl);
    return data.imageUrl;
  } else {
    throw new Error(data.error || 'Unknown DALL-E 3 error');
  }
};

// Placeholder functions for other services (you can implement these later)
const generateWithDALLE2 = async (prompt) => {
  throw new Error('DALL-E 2 service not yet implemented');
};

const generateWithStableDiffusion = async (prompt) => {
  throw new Error('Stable Diffusion service not yet implemented');
};

const generateWithLeonardo = async (prompt) => {
  throw new Error('Leonardo AI service not yet implemented');
};

/**
 * Get all available services
 */
export const getAllServices = () => {
  return Object.entries(IMAGE_SERVICES).map(([id, info]) => ({
    id,
    ...info
  }));
};
