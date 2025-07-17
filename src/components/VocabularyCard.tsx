'use client';

import { useState } from 'react';
import { Volume2, Edit, Trash2, Star, StarOff } from 'lucide-react';

interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  partOfSpeech?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isFavorite: boolean;
  example?: string;
  notes?: string;
  lastReviewed: Date;
  nextReview: Date;
  correctStreak: number;
}

interface VocabularyCardProps {
  word: VocabularyWord;
  onEdit?: (word: VocabularyWord) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onPlayPronunciation?: (text: string) => void;
}

export default function VocabularyCard({ 
  word, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onPlayPronunciation 
}: VocabularyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 5) return 'text-green-600';
    if (streak >= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="relative group">
      <div 
        className={`relative w-full h-64 transition-transform duration-700 preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{word.word}</h3>
                  {onPlayPronunciation && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayPronunciation(word.word);
                      }}
                      className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {word.pronunciation && (
                  <p className="text-gray-500 text-sm">/{word.pronunciation}/</p>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onToggleFavorite && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(word.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {word.isFavorite ? (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    ) : (
                      <StarOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(word);
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(word.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center mb-4">
                <p className="text-gray-600">Click to see translation</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(word.difficulty)}`}>
                  {word.difficulty}
                </span>
                {word.partOfSpeech && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {word.partOfSpeech}
                  </span>
                )}
              </div>
              <div className={`text-xs font-medium ${getStreakColor(word.correctStreak)}`}>
                {word.correctStreak > 0 && `${word.correctStreak}🔥`}
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="bg-indigo-50 rounded-xl border border-indigo-200 shadow-sm p-6 h-full flex flex-col">
            {/* Translation */}
            <div className="flex-1 flex flex-col justify-center text-center space-y-4">
              <h3 className="text-3xl font-bold text-indigo-900">{word.translation}</h3>
              
              {word.example && (
                <div className="bg-white rounded-lg p-4 border border-indigo-200">
                  <p className="text-sm text-gray-700 italic">&#34;{word.example}&#34;</p>
                </div>
              )}
              
              {word.notes && (
                <div className="bg-white rounded-lg p-4 border border-indigo-200">
                  <p className="text-sm text-gray-600">{word.notes}</p>
                </div>
              )}
            </div>

            {/* Review Info */}
            <div className="pt-4 border-t border-indigo-200">
              <div className="text-xs text-indigo-600 space-y-1">
                <p>Last reviewed: {word.lastReviewed.toLocaleDateString()}</p>
                <p>Next review: {word.nextReview.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}