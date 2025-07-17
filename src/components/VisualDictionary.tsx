'use client';

import { useState, useEffect } from 'react';
import { Search, Volume2, BookOpen, Eye, Camera, Star, Filter, Grid, List, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface VisualWord {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  category: string;
  imageUrl: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  isLearned: boolean;
  isFavorite: boolean;
}

interface VisualDictionaryProps {
  language: string;
  onClose: () => void;
}

export default function VisualDictionary({ language, onClose }: VisualDictionaryProps) {
  const [words, setWords] = useState<VisualWord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedWord, setSelectedWord] = useState<VisualWord | null>(null);
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);

  const categories = [
    'all', 'animals', 'food', 'home', 'clothing', 'nature', 'transportation', 
    'body', 'emotions', 'colors', 'shapes', 'sports', 'technology'
  ];

  useEffect(() => {
    loadVisualWords();
  }, [language]);

  const loadVisualWords = () => {
    // Mock visual dictionary data - in a real app, this would be loaded from an API
    const mockWords: VisualWord[] = [
      {
        id: '1',
        word: 'Perro',
        translation: 'Dog',
        pronunciation: 'PEH-roh',
        category: 'animals',
        imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop',
        description: 'A domesticated carnivorous mammal that is typically kept as a pet',
        difficulty: 'beginner',
        tags: ['pet', 'animal', 'companion'],
        isLearned: false,
        isFavorite: false
      },
      {
        id: '2',
        word: 'Manzana',
        translation: 'Apple',
        pronunciation: 'man-SAH-nah',
        category: 'food',
        imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300&h=200&fit=crop',
        description: 'A sweet, edible fruit produced by an apple tree',
        difficulty: 'beginner',
        tags: ['fruit', 'healthy', 'red'],
        isLearned: true,
        isFavorite: true
      },
      {
        id: '3',
        word: 'Casa',
        translation: 'House',
        pronunciation: 'KAH-sah',
        category: 'home',
        imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&h=200&fit=crop',
        description: 'A building for human habitation',
        difficulty: 'beginner',
        tags: ['building', 'home', 'shelter'],
        isLearned: false,
        isFavorite: false
      },
      {
        id: '4',
        word: 'Coche',
        translation: 'Car',
        pronunciation: 'KOH-cheh',
        category: 'transportation',
        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop',
        description: 'A road vehicle, typically with four wheels',
        difficulty: 'beginner',
        tags: ['vehicle', 'transport', 'wheels'],
        isLearned: true,
        isFavorite: false
      },
      {
        id: '5',
        word: 'Feliz',
        translation: 'Happy',
        pronunciation: 'feh-LEES',
        category: 'emotions',
        imageUrl: 'https://images.unsplash.com/photo-1567422045116-cad6e1007cd3?w=300&h=200&fit=crop',
        description: 'Feeling or showing pleasure or contentment',
        difficulty: 'intermediate',
        tags: ['emotion', 'positive', 'feeling'],
        isLearned: false,
        isFavorite: true
      },
      {
        id: '6',
        word: 'Azul',
        translation: 'Blue',
        pronunciation: 'ah-SOOL',
        category: 'colors',
        imageUrl: 'https://images.unsplash.com/photo-1541696070979-32db6c14d45c?w=300&h=200&fit=crop',
        description: 'Of a color intermediate between green and violet',
        difficulty: 'beginner',
        tags: ['color', 'primary', 'sky'],
        isLearned: true,
        isFavorite: false
      }
    ];

    setWords(mockWords);
  };

  const filteredWords = words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const playPronunciation = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = language === 'spanish' ? 'es-ES' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleFavorite = (wordId: string) => {
    setWords(prev => prev.map(word =>
      word.id === wordId ? { ...word, isFavorite: !word.isFavorite } : word
    ));
  };

  const markAsLearned = (wordId: string) => {
    setWords(prev => prev.map(word =>
      word.id === wordId ? { ...word, isLearned: !word.isLearned } : word
    ));
  };

  const startQuiz = () => {
    setMode('quiz');
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setShowQuizAnswer(false);
  };

  const handleQuizAnswer = (selectedTranslation: string) => {
    const currentWord = filteredWords[currentQuizIndex];
    const isCorrect = selectedTranslation === currentWord.translation;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    
    setShowQuizAnswer(true);
    
    setTimeout(() => {
      if (currentQuizIndex < filteredWords.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
        setShowQuizAnswer(false);
      } else {
        // Quiz complete
        alert(`Quiz complete! Score: ${quizScore + (isCorrect ? 1 : 0)}/${filteredWords.length}`);
        setMode('learn');
      }
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (mode === 'quiz') {
    const currentWord = filteredWords[currentQuizIndex];
    const otherWords = filteredWords.filter(w => w.id !== currentWord?.id);
    const options = [
      currentWord?.translation,
      ...otherWords.slice(0, 3).map(w => w.translation)
    ].sort(() => Math.random() - 0.5);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Visual Quiz</h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {currentQuizIndex + 1} / {filteredWords.length}
              </span>
              <button
                onClick={() => setMode('learn')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="text-center space-y-6">
            <div className="relative">
              <img
                src={currentWord?.imageUrl}
                alt={currentWord?.word}
                className="w-64 h-48 object-cover rounded-lg mx-auto"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                Score: {quizScore}/{currentQuizIndex + (showQuizAnswer ? 1 : 0)}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900">{currentWord?.word}</h3>

            <div className="grid grid-cols-2 gap-3">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showQuizAnswer && handleQuizAnswer(option)}
                  disabled={showQuizAnswer}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    showQuizAnswer
                      ? option === currentWord?.translation
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {showQuizAnswer && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-900 font-medium">
                  Correct answer: {currentWord?.translation}
                </p>
                <p className="text-blue-700 text-sm mt-1">{currentWord?.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Visual Dictionary</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={startQuiz}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Start Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search words..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredWords.map((word) => (
                <div
                  key={word.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedWord(word)}
                >
                  <div className="relative">
                    <img
                      src={word.imageUrl}
                      alt={word.word}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(word.id);
                        }}
                        className={`p-1 rounded-full ${
                          word.isFavorite ? 'bg-yellow-500 text-white' : 'bg-white text-gray-600'
                        }`}
                      >
                        <Star className="w-3 h-3" />
                      </button>
                      {word.isLearned && (
                        <div className="p-1 bg-green-500 text-white rounded-full">
                          <Eye className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className={`absolute bottom-2 left-2 px-2 py-1 text-xs rounded ${getDifficultyColor(word.difficulty)}`}>
                      {word.difficulty}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900">{word.word}</h3>
                    <p className="text-gray-600 text-sm">{word.translation}</p>
                    <p className="text-gray-500 text-xs mt-1">/{word.pronunciation}/</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredWords.map((word) => (
                <div
                  key={word.id}
                  className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => setSelectedWord(word)}
                >
                  <img
                    src={word.imageUrl}
                    alt={word.word}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{word.word}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(word.difficulty)}`}>
                        {word.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600">{word.translation}</p>
                    <p className="text-gray-500 text-sm">/{word.pronunciation}/</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playPronunciation(word.word);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(word.id);
                      }}
                      className={`p-2 rounded-full ${
                        word.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Word Detail Modal */}
      {selectedWord && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <h3 className="text-3xl font-bold text-gray-900">{selectedWord.word}</h3>
                <button
                  onClick={() => playPronunciation(selectedWord.word)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => setSelectedWord(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedWord.imageUrl}
                  alt={selectedWord.word}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Translation</h4>
                  <p className="text-2xl text-blue-600 font-medium">{selectedWord.translation}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Pronunciation</h4>
                  <p className="text-gray-600">/{selectedWord.pronunciation}/</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Description</h4>
                  <p className="text-gray-600">{selectedWord.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Category</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {selectedWord.category}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedWord.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleFavorite(selectedWord.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedWord.isFavorite
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  <span>{selectedWord.isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
                </button>
                
                <button
                  onClick={() => markAsLearned(selectedWord.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedWord.isLearned
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>{selectedWord.isLearned ? 'Learned' : 'Mark as Learned'}</span>
                </button>
              </div>
              
              <span className={`px-3 py-1 rounded ${getDifficultyColor(selectedWord.difficulty)}`}>
                {selectedWord.difficulty}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}