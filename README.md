# 📰 NewsFlash AI

> **Smart News Summaries Powered by AI**

A modern, responsive news application that delivers the latest headlines with AI-powered summaries. Built with Next.js, TypeScript, and cutting-edge web technologies for an exceptional reading experience.

![NewsFlash AI](https://img.shields.io/badge/NewsFlash-AI%20Powered-blue?style=for-the-badge&logo=react)
![Version](https://img.shields.io/badge/version-0.3.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)

## ✨ Features

### 🤖 **AI-Powered Intelligence**
- **Smart Summaries**: Client-side AI text summarization using advanced algorithms
- **Keyword Extraction**: Automatically identifies key topics and themes
- **Reading Time Estimation**: Calculates estimated reading time for each article
- **Content Analysis**: Intelligent text processing without external API dependencies

### 📱 **Modern User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Glass Morphism UI**: Modern, elegant design with subtle transparency effects
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Progressive Web App**: Fast loading with offline capabilities

### 🔍 **Advanced News Features**
- **Real-time Headlines**: Latest news from trusted global sources
- **Smart Filtering**: Filter by category, country, and custom search terms
- **Bookmark System**: Save articles for later reading
- **Reading Progress**: Track your reading habits and statistics
- **Search Functionality**: Powerful search with trending suggestions

### 📊 **Analytics & Insights**
- **Reading Statistics**: Track articles read, time spent, and reading streaks
- **Progress Goals**: Set and monitor daily reading targets
- **Category Insights**: Discover your favorite news topics
- **Achievement System**: Unlock badges for reading milestones

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/newsflash-ai.git
   cd newsflash-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Optional: Custom API configurations
NEXT_PUBLIC_APP_NAME=NewsFlash AI
NEXT_PUBLIC_APP_VERSION=0.3.0
```

## 🛠️ Tech Stack

### **Frontend Framework**
- **Next.js 14** - React framework with App Router
- **React 18** - Modern React with concurrent features
- **TypeScript** - Type-safe development

### **Styling & UI**
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Smooth animations and transitions

### **Data & APIs**
- **NewsData.io API** - Global news headlines
- **Client-side AI** - Local text summarization
- **Local Storage** - User preferences and reading data

### **Development Tools**
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
newsflash-ai/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── news/             # News pages
│   ├── bookmarks/        # Bookmarks page
│   └── analytics/        # Analytics page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── premium-navbar.tsx # Navigation component
│   ├── news-card.tsx     # Article card component
│   └── ...               # Other components
├── lib/                  # Utility libraries
│   ├── news-api.ts       # News API integration
│   ├── text-summarizer.ts # AI summarization
│   ├── storage.ts        # Local storage utilities
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
└── public/              # Static assets
```

## 🎯 Key Features Explained

### **AI Text Summarization**
Our advanced client-side summarization engine:
- Analyzes sentence importance using TF-IDF algorithms
- Extracts key information without external API calls
- Provides 2-sentence summaries for quick reading
- Identifies important keywords and topics

### **Smart News Filtering**
Comprehensive filtering system:
- **Categories**: Business, Technology, Sports, Health, etc.
- **Countries**: Global news sources from 50+ countries
- **Search**: Real-time search with query suggestions
- **Trending**: Popular search terms and topics

### **Reading Analytics**
Track your news consumption:
- Daily reading goals and progress
- Reading streak tracking
- Favorite categories analysis
- Time spent reading statistics

### **Responsive Design**
Optimized for all devices:
- Mobile-first approach
- Touch-friendly interactions
- Adaptive layouts
- Fast loading on all connections

## 🔧 Configuration

### **News API Setup**
The app uses NewsData.io for news headlines:
- Free tier: 200 requests per day
- Automatic rate limiting
- Error handling and fallbacks

### **Customization Options**
- Theme preferences (light/dark/system)
- Reading goals and targets
- Preferred news categories
- Country and language settings

## 📱 Mobile Experience

### **Progressive Web App**
- Add to home screen capability
- Offline reading for bookmarked articles
- Fast loading with service worker caching
- Native app-like experience

### **Mobile Optimizations**
- Touch-optimized interface
- Swipe gestures for navigation
- Optimized typography for mobile reading
- Efficient data usage

## 🎨 Design System

### **Color Palette**
- **Primary**: Blue to Purple gradient
- **Secondary**: Subtle grays and whites
- **Accent**: Context-aware colors for categories
- **Dark Mode**: Carefully crafted dark theme

### **Typography**
- **Display**: Inter font family for headings
- **Body**: Optimized for reading comfort
- **Code**: JetBrains Mono for technical content

### **Components**
- Consistent spacing and sizing
- Accessible color contrasts
- Smooth hover and focus states
- Glass morphism effects

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm run build
vercel --prod
```

### **Other Platforms**
```bash
npm run build
npm start
```

The app is optimized for deployment on:
- Vercel
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Standards**
- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NewsData.io** - For providing reliable news API
- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For the utility-first CSS framework
- **Next.js Team** - For the amazing React framework
- **Open Source Community** - For inspiration and tools

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/newsflash-ai/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/newsflash-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/newsflash-ai/discussions)

## 🔮 Roadmap

### **Version 0.4.0**
- [ ] Real-time notifications
- [ ] Social sharing features
- [ ] Advanced search filters
- [ ] Personalized recommendations

### **Version 0.5.0**
- [ ] Multi-language support
- [ ] Voice reading feature
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations

### **Version 1.0.0**
- [ ] User accounts and sync
- [ ] Premium features
- [ ] Mobile app versions
- [ ] Enterprise features

---

<div align="center">

**Built with ❤️ by the NewsFlash AI Team**

[🌟 Star this repo](https://github.com/yourusername/newsflash-ai) • [🐛 Report Bug](https://github.com/yourusername/newsflash-ai/issues) • [💡 Request Feature](https://github.com/yourusername/newsflash-ai/issues)

</div>
