'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import AnalysisResults from '@/components/AnalysisResults';

interface AnalysisResult {
  foodName: string;
  calories: number;
  servingSize: string;
  confidence: number;
  nutritionalInfo?: {
    protein?: number;
    carbs?: number;
    fats?: number;
    fiber?: number;
    vitamins?: Record<string, number>;
  };
  ingredients?: string[];
  allergens?: string[];
  dietaryNotes?: string[];
  description?: string;
  preparation?: string;
  markdown?: string;
  analysisType?: 'quick' | 'detailed' | 'llava';
}

type AnalysisType = 'quick' | 'detailed' | 'llava';

export default function Home() {
  const [analysisType, setAnalysisType] = useState<AnalysisType>('quick');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | undefined>(undefined);

  const handleImageCapture = async (file: File) => {
    setIsLoading(true);
    setAnalysisResult(undefined);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Call appropriate API based on analysis type
        const endpoint = 
          analysisType === 'detailed' ? '/api/food-analysis/detailed-scan' :
          analysisType === 'llava' ? '/api/food-analysis/llava-scan' :
          '/api/food-analysis/quick-scan';
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Image,
            analysisType,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }

        const result = await response.json();
        setAnalysisResult({
          ...result,
          analysisType,
        });
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Food Calorie Analyzer
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-gray-500 leading-relaxed">
                Instantly analyze your food and get detailed nutritional information powered by advanced AI technology.
              </p>
            </div>

            {/* Analysis Type Selection */}
            <div className="flex flex-wrap justify-center items-center gap-4 p-6 max-w-2xl mx-auto">
              <button
                onClick={() => setAnalysisType('quick')}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                  analysisType === 'quick'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                ⚡ Quick Scan
              </button>
              <button
                onClick={() => setAnalysisType('llava')}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                  analysisType === 'llava'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                🔍 Advanced Scan
              </button>
              <button
                onClick={() => setAnalysisType('detailed')}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                  analysisType === 'detailed'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                📊 Detailed Analysis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-blue-600 mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Analysis</h3>
              <p className="text-gray-500 text-sm">Get instant calorie estimates and basic nutritional info in seconds.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-blue-600 mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Detection</h3>
              <p className="text-gray-500 text-sm">Detailed food recognition with preparation methods and ingredients.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-blue-600 mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Analysis</h3>
              <p className="text-gray-500 text-sm">Comprehensive nutritional breakdown with allergen information.</p>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <ImageUpload onImageCapture={handleImageCapture} />
          </div>

          {/* Results Section */}
          <div className="transition-all duration-200">
            <AnalysisResults
              result={analysisResult}
              isLoading={isLoading}
              isDetailedView={analysisType === 'detailed'}
              isAdvancedView={analysisType === 'llava'}
            />
          </div>

          {/* Info Footer */}
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-50 text-sm text-gray-600">
              <span className="mr-2">
                {analysisType === 'detailed' ? '🤖' : analysisType === 'llava' ? '🔮' : '⚡'}
              </span>
              <p>
                {analysisType === 'detailed'
                  ? 'Powered by GPT-4 Vision for comprehensive analysis'
                  : analysisType === 'llava'
                  ? 'Enhanced by LLaVA for precise food detection'
                  : 'Utilizing BLIP-2 for rapid recognition'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
