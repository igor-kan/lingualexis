'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, X, BookOpen, Eye } from 'lucide-react';

interface WordMeaning {
  id: string;
  definition: string;
  context: string;
  examples: string[];
  visualType: 'image' | '3d' | 'animation' | 'diagram';
  visualContent: {
    url?: string;
    component?: React.ComponentType<any>;
    animationType?: 'bounce' | 'spin' | 'fade' | 'slide' | 'morph';
  };
  partOfSpeech: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  frequency: 'rare' | 'common' | 'frequent';
}

interface MultiMeaningWord {
  id: string;
  word: string;
  language: string;
  phonetic: string;
  meanings: WordMeaning[];
  commonMeaning: string; // ID of the most common meaning
}

interface MultiMeaningVisualizerProps {
  word: MultiMeaningWord;
  onClose: () => void;
  onMeaningSelect: (meaning: WordMeaning) => void;
}

const AnimatedVisual = ({ 
  animationType, 
  content, 
  meaning 
}: { 
  animationType: string;
  content: string;
  meaning: WordMeaning;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getAnimationClass = () => {
    if (!isAnimating) return '';
    
    switch (animationType) {
      case 'bounce':
        return 'animate-bounce';
      case 'spin':
        return 'animate-spin';
      case 'fade':
        return 'animate-pulse';
      case 'slide':
        return 'animate-pulse'; // Tailwind doesn't have slide, using pulse
      case 'morph':
        return 'animate-pulse';
      default:
        return 'animate-pulse';
    }
  };

  return (
    <div className={`transition-all duration-300 ${getAnimationClass()}`}>
      {content.startsWith('http') ? (
        <img 
          src={content} 
          alt={meaning.definition}
          className="w-full h-48 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {meaning.partOfSpeech.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-gray-700 text-sm">{meaning.definition}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const MeaningCard = ({ 
  meaning, 
  isSelected, 
  onClick, 
  index,
  total 
}: {
  meaning: WordMeaning;
  isSelected: boolean;
  onClick: () => void;
  index: number;
  total: number;
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'frequent': return 'bg-blue-100 text-blue-800';
      case 'common': return 'bg-indigo-100 text-indigo-800';
      case 'rare': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-500">
            {index + 1} of {total}
          </span>
          <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(meaning.difficulty)}`}>
            {meaning.difficulty}
          </span>
          <span className={`px-2 py-1 rounded text-xs ${getFrequencyColor(meaning.frequency)}`}>
            {meaning.frequency}
          </span>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {meaning.partOfSpeech}
        </span>
      </div>

      <div className="mb-3">
        {meaning.visualContent.animationType ? (
          <AnimatedVisual
            animationType={meaning.visualContent.animationType}
            content={meaning.visualContent.url || ''}
            meaning={meaning}
          />
        ) : meaning.visualContent.url ? (
          <img 
            src={meaning.visualContent.url} 
            alt={meaning.definition}
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 text-sm">Visual representation</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">{meaning.definition}</h3>
        <p className="text-sm text-gray-600">{meaning.context}</p>
        
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-gray-700">Examples:</h4>
          {meaning.examples.slice(0, 2).map((example, idx) => (
            <p key={idx} className="text-xs text-gray-600 italic">
              "{example}"
            </p>
          ))}
          {meaning.examples.length > 2 && (
            <p className="text-xs text-gray-500">
              +{meaning.examples.length - 2} more examples
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MultiMeaningVisualizer({ 
  word, 
  onClose, 
  onMeaningSelect 
}: MultiMeaningVisualizerProps) {
  const [selectedMeaningIndex, setSelectedMeaningIndex] = useState(0);
  const [showAllMeanings, setShowAllMeanings] = useState(false);

  const playPronunciation = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = word.language === 'spanish' ? 'es-ES' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const nextMeaning = () => {
    setSelectedMeaningIndex((prev) => (prev + 1) % word.meanings.length);
  };

  const prevMeaning = () => {
    setSelectedMeaningIndex((prev) => (prev - 1 + word.meanings.length) % word.meanings.length);
  };

  const selectedMeaning = word.meanings[selectedMeaningIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h2 className="text-3xl font-bold text-gray-900">{word.word}</h2>
              <button
                onClick={() => playPronunciation(word.word)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <span className="text-gray-600">/{word.phonetic}/</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAllMeanings(!showAllMeanings)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showAllMeanings 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showAllMeanings ? 'Focus View' : 'All Meanings'}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            {word.meanings.length} different meanings • Most common: {
              word.meanings.find(m => m.id === word.commonMeaning)?.definition || 'N/A'
            }
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {showAllMeanings ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {word.meanings.map((meaning, index) => (
                <MeaningCard
                  key={meaning.id}
                  meaning={meaning}
                  isSelected={index === selectedMeaningIndex}
                  onClick={() => {
                    setSelectedMeaningIndex(index);
                    onMeaningSelect(meaning);
                  }}
                  index={index}
                  total={word.meanings.length}
                />
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Navigation */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={prevMeaning}
                  disabled={word.meanings.length === 1}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Meaning {selectedMeaningIndex + 1} of {word.meanings.length}
                  </span>
                  <div className="flex space-x-1">
                    {word.meanings.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedMeaningIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === selectedMeaningIndex ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={nextMeaning}
                  disabled={word.meanings.length === 1}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Selected Meaning Detail */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    {selectedMeaning.visualContent.animationType ? (
                      <AnimatedVisual
                        animationType={selectedMeaning.visualContent.animationType}
                        content={selectedMeaning.visualContent.url || ''}
                        meaning={selectedMeaning}
                      />
                    ) : selectedMeaning.visualContent.url ? (
                      <img 
                        src={selectedMeaning.visualContent.url} 
                        alt={selectedMeaning.definition}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                              {selectedMeaning.partOfSpeech.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-700">Visual representation</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">
                        {selectedMeaning.partOfSpeech}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        selectedMeaning.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        selectedMeaning.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedMeaning.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        selectedMeaning.frequency === 'frequent' ? 'bg-blue-100 text-blue-800' :
                        selectedMeaning.frequency === 'common' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {selectedMeaning.frequency}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedMeaning.definition}
                      </h3>
                      <p className="text-gray-600 mb-4">{selectedMeaning.context}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Examples:</h4>
                      <div className="space-y-2">
                        {selectedMeaning.examples.map((example, index) => (
                          <p key={index} className="text-gray-600 italic">
                            "{example}"
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onMeaningSelect(selectedMeaning)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Study This Meaning</span>
                    </button>
                  </div>
                  
                  {selectedMeaning.id === word.commonMeaning && (
                    <span className="text-sm text-green-600 font-medium">
                      ✓ Most Common Usage
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}