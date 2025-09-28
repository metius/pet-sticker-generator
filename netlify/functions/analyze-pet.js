const { Anthropic } = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY // We'll need to add this environment variable
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
    const { images } = JSON.parse(event.body);
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Images array is required' 
        })
      };
    }

    console.log(`🔍 Analyzing ${images.length} pet photos via Netlify function...`);

    // Create detailed analysis prompt
    const analysisPrompt = `Please analyze these pet photos in detail. I need specific information to generate personalized AI artwork featuring this exact pet.

Provide a comprehensive analysis focusing on:

**Physical Characteristics:**
- Animal type (dog, cat, bird, etc.) and breed if identifiable
- Size (small, medium, large) and body structure
- Coat/fur details: color, pattern, length, texture
- Distinctive markings: spots, stripes, patches, unique colorations
- Facial features: eye color, nose shape, ear type
- Any unique physical traits that make this pet distinctive

**Personality & Behavior:**
- Observable personality traits from the photos
- Typical poses or expressions
- Energy level indicators
- Preferred activities or behaviors visible

**Artistic Considerations:**
- Most photogenic angles of this pet
- Colors that complement their appearance
- Environments that would suit their personality
- Poses that capture their essence

Respond with detailed JSON:
{
  "petType": "specific animal type",
  "breed": "breed or mix if identifiable",
  "size": "size category", 
  "physicalDescription": "detailed description of appearance including colors, markings, and distinctive features",
  "coatDetails": "fur/coat color, pattern, length, texture",
  "facialFeatures": "eye color, nose, ears, expression",
  "uniqueFeatures": ["distinctive trait 1", "distinctive trait 2", "distinctive trait 3"],
  "personalityTraits": "observed personality and energy",
  "preferredPoses": ["pose type 1", "pose type 2"],
  "colorPalette": ["color 1", "color 2", "color 3"],
  "artDirection": "guidance for creating artwork of this specific pet"
}

Be extremely detailed and specific - this will be used to generate personalized artwork that should look like THIS specific pet, not a generic animal.`;

    // Prepare image content for Claude
    const imageContent = images.map(base64Image => ({
      type: "image",
      source: {
        type: "base64",
        media_type: "image/jpeg",
        data: base64Image
      }
    }));

    // Call Claude API
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: [
            ...imageContent,
            {
              type: "text",
              text: analysisPrompt
            }
          ]
        }
      ]
    });

    let analysisText = response.content[0].text;
    
    // Clean up response and parse JSON
    analysisText = analysisText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const petAnalysis = JSON.parse(analysisText);
    
    console.log('✅ Pet analysis complete via Netlify function');
    console.log('Pet type:', petAnalysis.petType);
    console.log('Description:', petAnalysis.physicalDescription);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        analysis: petAnalysis
      })
    };

  } catch (error) {
    console.error('❌ Pet analysis error:', error);
    
    let errorMessage = 'Failed to analyze pet photos';
    let statusCode = 500;
    
    if (error.status === 401) {
      errorMessage = 'Invalid Claude API key - please check ANTHROPIC_API_KEY environment variable';
      statusCode = 401;
    } else if (error.status === 429) {
      errorMessage = 'Claude API rate limit exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({
        success: false,
        error: errorMessage,
        fallback: {
          petType: "pet",
          physicalDescription: "adorable pet with distinctive markings",
          uniqueFeatures: ["expressive eyes", "unique personality", "photogenic nature"],
          personalityTraits: "playful and charming"
        }
      })
    };
  }
};
