# LinguaLexis - AI-Powered Language Learning Platform

## Project Overview
**Live Application**: https://igor-kan.github.io/lingualexis/

Advanced AI-powered language learning platform featuring personalized learning paths, intelligent spaced repetition, real-time pronunciation coaching, and adaptive content generation. Built with the latest React 19 and Next.js.

## Technology Stack
- **Framework**: Next.js 15 with React 19.1.0 (latest version)
- **Language**: TypeScript with modern config files
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Configuration**: 
  - `next.config.ts` - TypeScript-based Next.js configuration
  - `eslint.config.mjs` - Modern ESLint configuration
- **Development**: Turbopack for faster builds

## Planned AI Features

### 🧠 Core AI Learning Systems

#### Intelligent Spaced Repetition System (SRS)
- **Adaptive Algorithms**: Optimal review timing with difficulty assessment
- **Memory Prediction**: Personal memory curve analysis and interval optimization
- **Multi-modal Learning**: Visual, auditory, and kinesthetic repetition methods
- **Performance Tracking**: Individual word/phrase mastery progression

#### AI-Powered Pronunciation Coaching
- **Real-time Recognition**: Speech-to-text with phoneme-level analysis
- **Accent Coaching**: Comparative analysis with native speaker patterns
- **Progress Tracking**: Pronunciation improvement metrics and goals
- **Interactive Feedback**: Visual and audio guidance for correction

#### Adaptive Content Generation
- **Personalized Curriculum**: Goal-based and proficiency-adapted learning paths
- **Interest Integration**: Context-relevant examples based on user preferences
- **Cultural Context**: Language learning with cultural immersion elements
- **Dynamic Difficulty**: Real-time content adjustment based on performance

#### NLP & Conversation AI
- **AI Conversation Partners**: Interactive practice with simulated native speakers
- **Grammar Analysis**: Real-time corrections with contextual explanations
- **Pattern Recognition**: Language structure learning through contextual examples
- **Contextual Learning**: Situation-based vocabulary and phrase acquisition

#### Gamified Learning Intelligence
- **Dynamic Achievements**: Learning pattern-based reward systems
- **Peer Matching**: AI-powered competitive learning and social features
- **Progress Gamification**: XP, levels, and milestone achievement systems

## TypeScript Architecture

### Core Interfaces
```typescript
interface LinguaLexisAIService {
  calculateNextReview(word: Vocabulary, performance: Performance[]): Promise<ReviewSchedule>;
  analyzePronunciation(audio: AudioData, target: string): Promise<PronunciationAnalysis>;
  generatePersonalizedContent(user: UserProfile, topic: string): Promise<LearningContent>;
  processConversationInput(input: string, context: ConversationContext): Promise<AIResponse>;
}

interface UserProfile {
  targetLanguages: Language[];
  proficiencyLevels: Record<string, ProficiencyLevel>;
  learningGoals: LearningGoal[];
  learningStyle: LearningStyle;
  interests: Topic[];
  studySchedule: SchedulePreference;
}

interface LearningContent {
  type: 'vocabulary' | 'grammar' | 'conversation' | 'pronunciation';
  difficulty: ProficiencyLevel;
  content: ContentItem[];
  exercises: Exercise[];
  culturalContext?: CulturalNote[];
}
```

### Planned Components
- `components/SpacedRepetitionSystem.tsx` - Intelligent SRS implementation
- `components/PronunciationCoach.tsx` - Real-time speech analysis and coaching
- `components/ConversationPartner.tsx` - AI conversation practice interface
- `components/AdaptiveCurriculum.tsx` - Personalized learning path generation
- `components/ProgressAnalytics.tsx` - Comprehensive learning analytics dashboard

## Development Commands
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Special Features
- **Turbopack Integration**: Fast development builds with `next dev --turbopack`
- **React 19 Features**: Latest React capabilities and performance optimizations
- **TypeScript Configuration**: Modern config files for enhanced development experience
- **AI-Ready Architecture**: Structured for seamless AI service integration

## Future Implementation Roadmap
1. **Phase 1**: Core SRS system with basic vocabulary management
2. **Phase 2**: Pronunciation coaching with Web Speech API integration
3. **Phase 3**: AI conversation partners and contextual learning
4. **Phase 4**: Adaptive content generation and cultural context integration
5. **Phase 5**: Advanced analytics and social learning features

## Deployment
- **Platform**: GitHub Pages
- **URL**: https://igor-kan.github.io/lingualexis/
- **Build Process**: Static export optimization
- **Auto-deployment**: GitHub Actions workflow