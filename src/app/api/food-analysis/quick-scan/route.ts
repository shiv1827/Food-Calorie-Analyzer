import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Basic calorie mapping for common foods (per 100g)
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
  // Convert to lowercase and remove any punctuation for matching
  const normalizedFood = foodName.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  
  // Look for matches in our calorie map
  for (const [key, calories] of Object.entries(CALORIE_MAP)) {
    if (normalizedFood.includes(key)) {
      return {
        calories,
        confidence: 0.85
      };
    }
  }
  
  // If no match found, return a lower confidence estimate
  return {
    calories: 100,  // Default conservative estimate
    confidence: 0.5
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

    // Use BLIP-2 model for accurate food detection
    const detection = await replicate.run(
      "salesforce/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608",
      {
        input: {
          image: image,
          question: "What food item is this? Please be specific about what you see in the image.",
        }
      }
    ) as unknown as string;

    // Process the detection result
    const foodInfo = detection;
    const foodName = foodInfo.split('.')[0].trim(); // Take the first sentence as food name
    
    // Get calorie estimate
    const { calories, confidence } = estimateCalories(foodName);
    
    // Extract serving size if mentioned, otherwise use default
    const servingSizeMatch = foodInfo.match(/(\d+)\s*(g|grams|oz|ounces|cups?|pieces?|servings?)/i);
    const servingSize = servingSizeMatch 
      ? servingSizeMatch[0]
      : "100g (estimated)";

    const result = {
      foodName,
      calories,
      servingSize,
      confidence,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in food analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze food' },
      { status: 500 }
    );
  }
} 
