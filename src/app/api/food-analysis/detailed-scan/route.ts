import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // Analyze the image using GPT-4 Vision
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this food image and provide nutritional information in the following markdown format:

# [Food Name]
## Serving Size
[serving size details]

## Nutritional Information
- Calories: [number] kcal
- Protein: [number]g
- Carbohydrates: [number]g
- Fats: [number]g
- Fiber: [number]g

## Ingredients
[list of ingredients]

## Allergens
[list of allergens if any]

## Dietary Notes
[vegan/vegetarian/gluten-free/etc]

Please be specific and detailed in your analysis.`,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from GPT-4 Vision');
    }

    return NextResponse.json({ 
      markdown: response,
      confidence: 0.95 
    });

  } catch (error) {
    console.error('Error in detailed food analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze food' },
      { status: 500 }
    );
  }
} 
