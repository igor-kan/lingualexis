'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Brain, BarChart, Settings, Play, Pause, Volume2, RotateCcw, CheckCircle, X, FileText, MessageSquare, Trophy, Target, Zap, Eye, Star } from 'lucide-react';
import VocabularyCard from '@/components/VocabularyCard';
import ProgressDashboard from '@/components/ProgressDashboard';
import LanguageSelector from '@/components/LanguageSelector';
import StudySession from '@/components/StudySession';
import TextPrompt from '@/components/TextPrompt';
import QuizModes from '@/components/QuizModes';
import Gamification from '@/components/Gamification';
import ConversationPractice from '@/components/ConversationPractice';
import VisualDictionary from '@/components/VisualDictionary';
import { VocabularyWord } from '@/lib/vocabulary';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'study' | 'vocabulary' | 'progress' | 'settings'>('dashboard');
  const [selectedLanguage, setSelectedLanguage] = useState('spanish');
  const [studyMode, setStudyMode] = useState<'flashcards' | 'multiple-choice' | 'typing' | 'listening'>('flashcards');
  const [showTextPrompt, setShowTextPrompt] = useState(false);
  const [showQuizModes, setShowQuizModes] = useState(false);
  const [showConversationPractice, setShowConversationPractice] = useState(false);
  const [showVisualDictionary, setShowVisualDictionary] = useState(false);
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([]);
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 250,
    xpToNextLevel: 750,
    studyStreak: 7,
    maxStudyStreak: 12,
    totalStudyTime: 145,
    wordsLearned: 45,
    quizzesCompleted: 12,
    averageAccuracy: 87,
    perfectQuizzes: 3,
    dailyGoalStreak: 5
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-8 h-8 text-indigo-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LinguaLexis
                </h1>
              </div>
              <div className="hidden sm:block">
                <LanguageSelector 
                  selected={selectedLanguage} 
                  onSelect={setSelectedLanguage} 
                />
              </div>
            </div>
            
            <nav className="flex space-x-1">
              <button
                onClick={() => setShowTextPrompt(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Text Prompt</span>
              </button>
              {[
                { id: 'dashboard', icon: BarChart, label: 'Dashboard' },
                { id: 'study', icon: Brain, label: 'Study' },
                { id: 'vocabulary', icon: BookOpen, label: 'Vocabulary' },
                { id: 'progress', icon: BarChart, label: 'Progress' },
                { id: 'settings', icon: Settings, label: 'Settings' }
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setCurrentPage(id as 'dashboard' | 'study' | 'vocabulary' | 'progress' | 'settings')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === id
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' && <DashboardView setCurrentPage={setCurrentPage} setShowTextPrompt={setShowTextPrompt} setShowQuizModes={setShowQuizModes} setShowConversationPractice={setShowConversationPractice} />}
        {currentPage === 'study' && (
          <StudySession 
            language={selectedLanguage} 
            mode={studyMode} 
            onModeChange={setStudyMode}
          />
        )}
        {currentPage === 'vocabulary' && <VocabularyView language={selectedLanguage} setShowVisualDictionary={setShowVisualDictionary} />}
        {currentPage === 'progress' && (
          <div className="space-y-8">
            <Gamification 
              userStats={userStats}
              onUpdateStats={(stats) => setUserStats(prev => ({ ...prev, ...stats }))}
            />
            <ProgressDashboard language={selectedLanguage} />
          </div>
        )}
        {currentPage === 'settings' && <SettingsView />}
      </main>

      {/* Modals */}
      <TextPrompt
        language={selectedLanguage}
        isVisible={showTextPrompt}
        onClose={() => setShowTextPrompt(false)}
        onWordAdded={(word) => {
          setVocabularyWords(prev => [...prev, word]);
          setUserStats(prev => ({ ...prev, wordsLearned: prev.wordsLearned + 1 }));
        }}
      />

      {showQuizModes && (
        <QuizModes
          words={vocabularyWords}
          language={selectedLanguage}
          onComplete={(score, total, mode) => {
            setUserStats(prev => ({
              ...prev,
              quizzesCompleted: prev.quizzesCompleted + 1,
              perfectQuizzes: prev.perfectQuizzes + (score === total ? 1 : 0),
              xp: prev.xp + (score * 10) + (score === total ? 100 : 0)
            }));
          }}
          onClose={() => setShowQuizModes(false)}
        />
      )}

      {showConversationPractice && (
        <ConversationPractice
          language={selectedLanguage}
          onClose={() => setShowConversationPractice(false)}
        />
      )}

      {showVisualDictionary && (
        <VisualDictionary
          language={selectedLanguage}
          onClose={() => setShowVisualDictionary(false)}
        />
      )}
    </div>
  );
}

function DashboardView({
  setCurrentPage,
  setShowTextPrompt,
  setShowQuizModes,
  setShowConversationPractice,
}: {
  setCurrentPage: (page: 'dashboard' | 'study' | 'vocabulary' | 'progress' | 'settings') => void;
  setShowTextPrompt: (show: boolean) => void;
  setShowQuizModes: (show: boolean) => void;
  setShowConversationPractice: (show: boolean) => void;
}) {
  const stats = {
    wordsLearned: 342,
    streak: 7,
    accuracy: 89,
    timeStudied: 45
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back! Ready to learn?
        </h2>
        <p className="text-gray-600">
          Continue your language learning journey with personalized lessons
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Words Learned', value: stats.wordsLearned, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Day Streak', value: stats.streak, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Accuracy', value: `${stats.accuracy}%`, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Minutes Today', value: stats.timeStudied, color: 'text-orange-600', bg: 'bg-orange-50' }
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-6 border border-gray-200/50`}>
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Daily Tip */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Daily Learning Tip</h3>
        <p className="text-gray-600">Consistency is key in language learning. Try to practice for at least 15 minutes every day to build strong habits and improve retention.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickActionCard
          icon={<Brain className="w-8 h-8 text-indigo-600" />}
          title="Continue Learning"
          description="Pick up where you left off"
          action="Start Session"
          color="indigo"
          onClick={() => setCurrentPage('study')}
        />
        <QuickActionCard
          icon={<MessageSquare className="w-8 h-8 text-blue-600" />}
          title="Conversation Practice"
          description="Practice with AI conversations"
          action="Start Talking"
          color="blue"
          onClick={() => setShowConversationPractice(true)}
        />
        <QuickActionCard
          icon={<Target className="w-8 h-8 text-red-600" />}
          title="Quiz Challenge"
          description="Test your knowledge"
          action="Take Quiz"
          color="red"
          onClick={() => setShowQuizModes(true)}
        />
        <QuickActionCard
          icon={<FileText className="w-8 h-8 text-orange-600" />}
          title="Text Analysis"
          description="Analyze text and collect words"
          action="Open Prompt"
          color="orange"
          onClick={() => setShowTextPrompt(true)}
        />
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, description, action, color, onClick }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  color: string;
  onClick?: () => void;
}) {
  const colorClasses = {
    indigo: 'border-indigo-200 hover:border-indigo-300',
    purple: 'border-purple-200 hover:border-purple-300',
    blue: 'border-blue-200 hover:border-blue-300',
    red: 'border-red-200 hover:border-red-300',
    orange: 'border-orange-200 hover:border-orange-300',
    green: 'border-green-200 hover:border-green-300'
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border-2 ${colorClasses[color as keyof typeof colorClasses]} p-6 transition-all hover:shadow-lg hover:scale-105 cursor-pointer`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          <button className={`text-${color}-600 font-medium text-sm hover:text-${color}-700`}>
            {action} →
          </button>
        </div>
      </div>
    </div>
  );
}

function VocabularyView({ language, setShowVisualDictionary }: { 
  language: string; 
  setShowVisualDictionary: (show: boolean) => void; 
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Vocabulary</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowVisualDictionary(true)}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Visual Dictionary</span>
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Add New Word
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
             onClick={() => setShowVisualDictionary(true)}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Visual Dictionary</h3>
              <p className="text-gray-600 text-sm">Learn with images</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Explore vocabulary with visual associations, perfect for visual learners.
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Word Lists</h3>
              <p className="text-gray-600 text-sm">Organized collections</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Create and manage custom word lists for different topics and difficulty levels.
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Favorites</h3>
              <p className="text-gray-600 text-sm">Your starred words</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Quick access to your favorite words and phrases for easy review.
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-600 text-center py-8">
          Settings panel coming soon...
        </p>
      </div>
    </div>
  );
}