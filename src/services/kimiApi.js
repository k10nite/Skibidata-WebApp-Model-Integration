// Kimi API Service - AI-powered code generation
const KIMI_API_KEY = import.meta.env.VITE_KIMI_API_KEY;
const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

export async function generateUIWithKimi(prompt) {
  try {
    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIMI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: 'You are an expert React developer specializing in creating beautiful, modern UI components with Tailwind CSS, GSAP animations, and premium design aesthetics. Generate complete, production-ready React component code.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`Kimi API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Kimi API Error:', error);
    throw error;
  }
}

export async function improveComponent(componentCode, improvementRequest) {
  const prompt = `
I have this React component:

\`\`\`jsx
${componentCode}
\`\`\`

Please improve it with the following requirements:
${improvementRequest}

Return ONLY the complete improved component code, no explanations.
  `;

  return await generateUIWithKimi(prompt);
}

export async function createNewComponent(componentName, description, requirements) {
  const prompt = `
Create a React component named ${componentName}.

Description: ${description}

Requirements:
${requirements}

Use:
- React hooks (useState, useEffect, useRef)
- Tailwind CSS for styling
- GSAP for animations (useGSAP hook)
- Lucide React icons
- Premium, modern design aesthetic (Apple/Airbnb style)
- Smooth transitions and micro-interactions
- Responsive design

Return ONLY the complete component code, ready to use.
  `;

  return await generateUIWithKimi(prompt);
}

/**
 * Analyzes satellite-derived soil data and generates AI interpretation
 * @param {Object} soilData - Soil parameters (pH, nitrogen, phosphorus, potassium, organic matter, etc.)
 * @param {string} location - Farm location for regional context
 * @returns {Promise<string>} AI-generated soil analysis interpretation
 */
export async function analyzeSoilData(soilData, location) {
  try {
    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIMI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: `You are an agricultural soil expert helping Filipino farmers understand their soil conditions.
Provide clear, practical interpretations in simple language that farmers can understand.
Focus on:
- What the soil data means for crop growth
- Potential issues or deficiencies
- Simple explanations without overly technical jargon
- Recommendations specific to Philippine agriculture
Keep responses concise and actionable.`
          },
          {
            role: 'user',
            content: `Analyze this soil data for a farm in ${location}:

Soil Parameters:
${JSON.stringify(soilData, null, 2)}

Provide a clear interpretation that helps a Filipino farmer understand:
1. Overall soil health assessment
2. Key strengths and weaknesses of this soil
3. What crops would grow well in this soil
4. Any immediate concerns that need attention`
          }
        ],
        temperature: 0.6,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Kimi API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Kimi API Error (analyzeSoilData):', error);
    throw error;
  }
}

/**
 * Interprets fertilizer recommendation in farmer-friendly language
 * @param {Object} recommendation - Fertilizer recommendation data (NPK values, application rates, etc.)
 * @param {string} crop - Target crop for the recommendation
 * @returns {Promise<string>} AI-generated farmer-friendly explanation
 */
export async function interpretFertilizerRecommendation(recommendation, crop) {
  try {
    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIMI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: `You are an agricultural advisor helping Filipino farmers understand fertilizer recommendations.
Explain technical fertilizer data in simple, practical terms.
Focus on:
- What each nutrient does for the crop
- How much fertilizer to apply and when
- Common fertilizer products available in the Philippines
- Cost-effective alternatives when possible
- Safety precautions and proper application methods
Use everyday language that farmers without technical background can easily follow.`
          },
          {
            role: 'user',
            content: `Explain this fertilizer recommendation for ${crop} in simple terms:

Recommendation Data:
${JSON.stringify(recommendation, null, 2)}

Provide a farmer-friendly explanation that covers:
1. What fertilizers to buy (use common Philippine brand names or generic descriptions)
2. How much to apply per hectare or per plant
3. When and how to apply (timing and method)
4. Why these nutrients are important for ${crop}
5. Any tips to save money or improve effectiveness`
          }
        ],
        temperature: 0.6,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Kimi API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Kimi API Error (interpretFertilizerRecommendation):', error);
    throw error;
  }
}

/**
 * Generates seasonal farming tips based on current weather and conditions
 * @param {Object} weatherData - Current and forecasted weather data
 * @param {string} crop - Target crop
 * @param {string} location - Farm location
 * @returns {Promise<string>} AI-generated farming tips and advice
 */
export async function generateFarmingTips(weatherData, crop, location) {
  try {
    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIMI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: `You are an experienced Filipino agricultural advisor with deep knowledge of Philippine farming conditions, seasons, and practices.
Provide practical, timely advice that considers:
- Current weather patterns and their impact on farming
- Regional growing conditions in the Philippines
- Traditional and modern farming practices
- Pest and disease prevention based on weather
- Water management and irrigation tips
- Harvest timing and post-harvest handling
Keep advice practical and immediately actionable for small to medium-scale Filipino farmers.`
          },
          {
            role: 'user',
            content: `Generate farming tips for a ${crop} farmer in ${location} based on these weather conditions:

Weather Data:
${JSON.stringify(weatherData, null, 2)}

Provide helpful tips covering:
1. What to do this week based on the weather forecast
2. Pest or disease risks to watch for given current conditions
3. Irrigation and water management advice
4. Any urgent actions needed (e.g., harvest before rain, protect from typhoon)
5. Long-term planning tips for the coming season`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Kimi API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Kimi API Error (generateFarmingTips):', error);
    throw error;
  }
}
