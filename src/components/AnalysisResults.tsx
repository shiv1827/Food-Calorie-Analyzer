'use client';

import ReactMarkdown from 'react-markdown';

interface NutritionalInfo {
  protein?: number;
  carbs?: number;
  fats?: number;
  fiber?: number;
  vitamins?: Record<string, number>;
}

interface AnalysisResult {
  foodName?: string;
  calories?: number;
  servingSize?: string;
  confidence?: number;
  nutritionalInfo?: NutritionalInfo;
  ingredients?: string[];
  allergens?: string[];
  dietaryNotes?: string[];
  description?: string;
  preparation?: string;
  markdown?: string;
  analysisType?: 'quick' | 'detailed' | 'llava';
}

interface AnalysisResultsProps {
  result?: AnalysisResult;
  isLoading: boolean;
  isDetailedView: boolean;
  isAdvancedView: boolean;
}

export default function AnalysisResults({
  result,
  isLoading,
  isDetailedView,
  isAdvancedView,
}: AnalysisResultsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-100 rounded-lg w-1/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded w-1/4"></div>
              <div className="h-6 bg-gray-100 rounded w-1/2"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded w-1/4"></div>
              <div className="h-6 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // Show markdown content only if we're in the correct tab
  if (result.markdown && 
      ((isDetailedView && result.analysisType === 'detailed') || 
       (isAdvancedView && result.analysisType === 'llava'))) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="prose prose-blue max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mb-6">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">{children}</h2>,
              p: ({ children }) => <p className="text-gray-600 mb-4 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">{children}</ul>,
              li: ({ children }) => <li className="text-gray-600">{children}</li>,
            }}
          >
            {result.markdown}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  // For quick scan (BLIP-2), show basic metrics
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b pb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            {result.foodName}
          </h2>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Calories</p>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-gray-900">{result.calories}</p>
              <p className="ml-2 text-gray-500">kcal</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Serving Size</p>
            <p className="text-3xl font-bold text-gray-900">{result.servingSize}</p>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Confidence Score</span>
            <span className="text-sm font-medium text-gray-900">
              {result.confidence ? Math.round(result.confidence * 100) : 0}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${result.confidence ? result.confidence * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
} 
