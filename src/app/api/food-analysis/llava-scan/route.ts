import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Basic calorie mapping for common foods (per 100g) - reusing from quick-scan
const CALORIE_MAP: Record<string, number> = {
  'eggplant': 25,
  'broccoli': 34,
  'carrot': 41,
  'apple': 52,
  'banana': 89,
  'rice': 130,
  'chicken': 165,
  'beef': 250,
  'salmon': 208,
  'potato': 77,
  'tomato': 18,
  'cucumber': 15,
  'spinach': 23,
  'lettuce': 15,
  'orange': 47,
  'grape': 67,
  'bread': 265,
  'pasta': 131,
  'egg': 155,
  'milk': 42,
  'yogurt': 59,
  'cheese': 402,
};

function estimateCalories(foodName: string): { calories: number; confidence: number } {
  const normalizedFood = foodName.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  
  for (const [key, calories] of Object.entries(CALORIE_MAP)) {
    if (normalizedFood.includes(key)) {
      return {
        calories,
        confidence: 0.9  // Higher confidence with LLaVA
      };
    }
  }
  
  return {
    calories: 100,
    confidence: 0.6  // Higher base confidence than quick-scan
  };
}

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // Use LLaVA model for enhanced food detection
    const detection = await replicate.run(
      "yorickvp/llava-v1.6-vicuna-13b:0603dec596080fa084e26f0ae6d605fc5788ed2b1a0358cd25010619487eae63",
      {
        input: {
          image: image,
          prompt: `Analyze this food image and provide the information in the following markdown format:

# [Food Name]

## Serving Size
[Specify approximate serving size in grams or standard measurements]

## Preparation
[Describe how the food appears to be prepared (e.g., grilled, baked, raw)]

## Description
[Provide a detailed description of what you see]

## Ingredients
[List visible or likely ingredients]

Please be specific and detailed in your analysis.`,
          temperature: 0.5,
          max_tokens: 500
        }
      }
    );

    // Handle both array and string responses from LLaVA
    const markdownContent = Array.isArray(detection) 
      ? detection.join('').replace(/```\n|```/g, '') // Remove markdown code blocks
      : detection;

    // Just return the markdown response with a default confidence
    return NextResponse.json({
      markdown: markdownContent,
      confidence: 0.9
    });

  } catch (error) {
    console.error('Error in LLaVA food analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze food' },
      { status: 500 }
    );
  }
} 
