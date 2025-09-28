/**
 * API endpoint configuration for different environments and services
 */

// Base URL configuration
const getBaseUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:8888/.netlify/functions';
  }
  return '/.netlify/functions';
};

// Endpoint mappings for different image generation services
const ENDPOINTS = {
  // OpenAI services
  'generate-sticker': 'generate-sticker',           // DALL-E 3 (existing)
  'generate-sticker-dalle2': 'generate-dalle2',     // DALL-E 2
  
  // Other AI services
  'generate-stable-diffusion': 'generate-sd',       // Stable Diffusion via Replicate
  'generate-midjourney': 'generate-midjourney',     // Midjourney via third-party
  'generate-leonardo': 'generate-leonardo',         // Leonardo AI
  'generate-google-imagen': 'generate-imagen',      // Google Imagen
  
  // Utility endpoints
  'analyze-pet': 'analyze-pet',                     // Pet photo analysis
  'health-check': 'health-check'                    // Service health check
};

/**
 * Get the full API endpoint URL for a service
 * @param {string} serviceName - Name of the service endpoint
 * @returns {string} - Full URL to the endpoint
 */
export const getApiEndpoint = (serviceName) => {
  const endpoint = ENDPOINTS[serviceName];
  if (!endpoint) {
    throw new Error(`Unknown API endpoint: ${serviceName}`);
  }
  
  return `${getBaseUrl()}/${endpoint}`;
};

/**
 * Get endpoint for specific image generation service
 * @param {string} serviceId - Service ID (dalle-3, stable-diffusion, etc.)
 * @returns {string} - Endpoint URL for the service
 */
export const getImageServiceEndpoint = (serviceId) => {
  const endpointMap = {
    'dalle-3': 'generate-sticker',
    'dalle-2': 'generate-sticker-dalle2', 
    'stable-diffusion': 'generate-stable-diffusion',
    'midjourney': 'generate-midjourney',
    'leonardo': 'generate-leonardo',
    'google-imagen': 'generate-google-imagen'
  };
  
  const endpointName = endpointMap[serviceId];
  if (!endpointName) {
    throw new Error(`No endpoint configured for service: ${serviceId}`);
  }
  
  return getApiEndpoint(endpointName);
};

/**
 * Check if running in development mode
 */
export const isDevelopment = () => {
  return window.location.hostname === 'localhost';
};

/**
 * Get environment-specific configuration
 */
export const getEnvironmentConfig = () => {
  return {
    isDev: isDevelopment(),
    baseUrl: getBaseUrl(),
    enableDebugLogs: isDevelopment(),
    apiTimeout: isDevelopment() ? 60000 : 30000, // Longer timeout in dev
  };
};
