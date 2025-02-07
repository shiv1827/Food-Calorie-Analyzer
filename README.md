# Food Calorie Analyzer

A modern web application that uses AI to analyze food images and provide detailed nutritional information. The app offers three levels of analysis:

## 🚀 Features

- **⚡ Quick Scan**: Instant food detection and basic calorie estimation using BLIP-2
- **🔍 Advanced Scan**: Detailed food analysis with LLaVA, including preparation methods and ingredients
- **📊 Detailed Analysis**: Comprehensive nutritional breakdown using GPT-4 Vision

## 🛠️ Technologies Used

- **Frontend**
  - React with Next.js 14 (App Router)
  - TailwindCSS for modern UI
  - React Markdown for content rendering
  - Framer Motion for animations

- **AI/ML Integration**
  - OpenAI GPT-4 Vision for detailed analysis
  - LLaVA for advanced food detection
  - BLIP-2 for quick scans
  - Replicate for model hosting

- **APIs**
  - Vercel AI SDK for streaming responses
  - Firebase for future features

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/shiv1827/Food-Calorie-Analyzer.git
   cd Food-Calorie-Analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   OPENAI_API_KEY=your_openai_key
   REPLICATE_API_TOKEN=your_replicate_token
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Visit [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Features in Detail

### Quick Scan
- Instant food identification
- Basic calorie estimation
- Confidence scoring
- Serving size detection

### Advanced Scan (LLaVA)
- Detailed food recognition
- Preparation method detection
- Ingredient identification
- Enhanced confidence scoring

### Detailed Analysis (GPT-4V)
- Comprehensive nutritional breakdown
- Allergen information
- Dietary notes
- Detailed serving suggestions

## 📱 User Interface

- Modern, sleek design with gradient accents
- Responsive layout for all devices
- Intuitive image upload interface
- Real-time analysis feedback
- Beautiful card-based results display

## 🛣️ Roadmap

- [ ] User authentication and history
- [ ] Save and share analysis results
- [ ] Custom food database integration
- [ ] Meal planning suggestions
- [ ] Nutritional goal tracking

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.