import OpenAI from 'openai';

let client;

const getClient = () => {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }
  return client;
};

const systemPrompt = `You are a travel planning assistant. You MUST respond with ONLY valid JSON, nothing else.
- No markdown, no code blocks, no explanations
- No trailing commas
- All strings must be properly escaped with double quotes only
- Do NOT escape single quotes or apostrophes
- All JSON must be valid and parseable
- Start your response with { and end with }
- Do not include any text before or after the JSON`;

const cleanJSON = (text) => {
  let cleaned = text.trim();
  
  // Remove markdown code blocks
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  
  // Find the first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  // Replace newlines with spaces
  cleaned = cleaned.replace(/\n/g, ' ');
  
  // Remove trailing commas before } and ]
  cleaned = cleaned.replace(/,\s*}/g, '}');
  cleaned = cleaned.replace(/,\s*]/g, ']');
  
  // Collapse multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  return cleaned;
};

export const generateItineraryPlans = async (userInput) => {
  const userPrompt = `Generate 3 travel itinerary options (A, B, C) for:
From: ${userInput.fromCity}
To: ${userInput.toCity}
Days: ${userInput.durationDays}
Profile: ${userInput.profileType.join(', ')}
Budget: ${userInput.budget}
Notes: ${userInput.extraNotes || 'None'}

Return ONLY this JSON structure with exactly 3 plans. Each plan must have a summary only (no days array):
{
  "plans": [
    {
      "id": "A",
      "title": "Plan A - Name",
      "summary": "2-3 sentence summary of the ${userInput.durationDays}-day itinerary",
      "estimated_total_cost": {"currency": "INR", "amount_min": 40000, "amount_max": 75000},
      "suitability_tags": ["tag1", "tag2"]
    },
    {
      "id": "B",
      "title": "Plan B - Name",
      "summary": "2-3 sentence summary of the ${userInput.durationDays}-day itinerary",
      "estimated_total_cost": {"currency": "INR", "amount_min": 40000, "amount_max": 75000},
      "suitability_tags": ["tag1", "tag2"]
    },
    {
      "id": "C",
      "title": "Plan C - Name",
      "summary": "2-3 sentence summary of the ${userInput.durationDays}-day itinerary",
      "estimated_total_cost": {"currency": "INR", "amount_min": 40000, "amount_max": 75000},
      "suitability_tags": ["tag1", "tag2"]
    }
  ]
}`;

  try {
    const groqClient = getClient();
    const response = await groqClient.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 2048,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    console.log('Finish reason:', response.choices[0].finish_reason);
    
    let jsonText = cleanJSON(response.choices[0].message.content);
    
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      console.error('Cleaned JSON length:', jsonText.length);
      console.error('Cleaned JSON end:', jsonText.substring(Math.max(0, jsonText.length - 200)));
      console.error('Raw response length:', response.choices[0].message.content.length);
      throw new Error(`Failed to parse JSON response: ${parseError.message}`);
    }

    if (!parsed.plans || !Array.isArray(parsed.plans) || parsed.plans.length === 0) {
      throw new Error('Invalid response: missing or empty plans array');
    }

    return parsed;
  } catch (error) {
    console.error('Error generating itinerary plans:', error.message);
    throw error;
  }
};

export const expandItineraryPlan = async (selectedPlan, durationDays) => {
  const userPrompt = `Expand this itinerary plan into a detailed day-by-day schedule for ${durationDays} days:
${JSON.stringify(selectedPlan, null, 2)}

IMPORTANT: Generate EXACTLY ${durationDays} days in the days array. Each day must have morning, afternoon, and evening segments.

Return ONLY this JSON structure with ${durationDays} day objects:
{
  "plan_id": "${selectedPlan.id}",
  "title": "${selectedPlan.title}",
  "days": [
    {
      "day_number": 1,
      "date_hint": "Day 1",
      "segments": [
        {
          "segment_type": "morning",
          "time_range": "08:00-12:00",
          "label": "Morning Activities",
          "steps": [
            {
              "time": "08:00",
              "name": "Activity Name",
              "description": "Description",
              "location": {"name": "Place", "address": "Address", "latitude": 0, "longitude": 0},
              "transport_from_previous": {"mode": "walk", "approx_minutes": 0, "notes": "Notes"},
              "approx_duration_minutes": 120,
              "cost_hint": {"currency": "INR", "amount_min": 500, "amount_max": 1500},
              "image_url": "https://example.com/image.jpg"
            }
          ]
        },
        {
          "segment_type": "afternoon",
          "time_range": "12:00-17:00",
          "label": "Afternoon Activities",
          "steps": []
        },
        {
          "segment_type": "evening",
          "time_range": "17:00-22:00",
          "label": "Evening Activities",
          "steps": []
        }
      ]
    }
  ]
}`;

  try {
    const groqClient = getClient();
    const response = await groqClient.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 8192,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    let jsonText = cleanJSON(response.choices[0].message.content);
    
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      console.error('Attempted to parse:', jsonText.substring(0, 200));
      throw new Error(`Failed to parse JSON response: ${parseError.message}`);
    }

    if (!parsed.plan_id || !parsed.days || !Array.isArray(parsed.days)) {
      throw new Error('Invalid response: missing plan_id or days array');
    }

    return parsed;
  } catch (error) {
    console.error('Error expanding itinerary plan:', error.message);
    throw error;
  }
};
