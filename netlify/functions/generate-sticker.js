const OpenAI = require('openai');

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const { prompt, petAnalysis } = JSON.parse(event.body);
    
    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Prompt is required' 
        })
      };
    }

    console.log('🎨 Generating DALL-E image...');
    console.log('Prompt:', prompt);
    console.log('Pet:', petAnalysis?.petType || 'Unknown');

    // Enhanced prompt for better sticker results
    const enhancedPrompt = `${prompt}. Digital sticker art style, clean white background, high contrast, vibrant colors, perfect for messaging apps, detailed illustration, children's book art style, whimsical and cute.`;

    // Call DALL-E 3 API
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    const imageUrl = response.data[0].url;
    const revisedPrompt = response.data[0].revised_prompt;

    console.log('✅ DALL-E Success!');
    console.log('Image URL:', imageUrl);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        imageUrl: imageUrl,
        revisedPrompt: revisedPrompt,
        originalPrompt: prompt
      })
    };

  } catch (error) {
    console.error('❌ DALL-E Error:', error);
    
    let errorMessage = 'Failed to generate image';
    let statusCode = 500;
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      errorMessage = 'Invalid API key - please check your OPENAI_API_KEY environment variable';
      statusCode = 401;
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.status === 400) {
      errorMessage = 'Invalid request. Please check your prompt.';
      statusCode = 400;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};