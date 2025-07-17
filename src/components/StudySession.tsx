'use client';

import { useState, useEffect } from 'react';
import { Volume2, RotateCcw, CheckCircle, X, ArrowRight, Brain, Target } from 'lucide-react';

interface Word {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed: Date;
  repetitionCount: number;
  correctStreak: number;
}

interface StudySessionProps {
  language: string;
  mode: 'flashcards' | 'multiple-choice' | 'typing' | 'listening';
  onModeChange: (mode: 'flashcards' | 'multiple-choice' | 'typing' | 'listening') => void;
}

// Sample vocabulary data
const sampleVocabulary: { [key: string]: Word[] } = {
  spanish: [
    { id: '1', word: 'Hola', translation: 'Hello', pronunciation: 'OH-lah', difficulty: 'easy', lastReviewed: new Date(), repetitionCount: 0, correctStreak: 0 },
    { id: '2', word: 'Gracias', translation: 'Thank you', pronunciation: 'GRAH-see-ahs', difficulty: 'easy', lastReviewed: new Date(), repetitionCount: 0, correctStreak: 0 },
    { id: '3', word: 'Hermoso', translation: 'Beautiful', pronunciation: 'er-MOH-soh', difficulty: 'medium', lastReviewed: new Date(), repetitionCount: 0, correctStreak: 0 },
    { id: '4', word: 'Responsabilidad', translation: 'Responsibility', pronunciation: 'res-pon-sah-bee-lee-DAHD', difficulty: 'hard', lastReviewed: new Date(), repetitionCount: 0, correctStreak: 0 },
    { id: '5', word: 'Comida', translation: 'Food', pronunciation: 'ko-MEE-dah', difficulty: 'easy', lastReviewed: new Date(), repetitionCount: 0, correctStreak: 0 }
  ],
  french: [
    { id: '1', word: 'Bonjour', translation: 'Hello', pronunciation: 'bon-ZHOOR', difficulty: 'easy', lastReviewed: new Date(), repetitionCount: 0, correctStreak: 0 },
    { id: '2', word: 'Merci', translation: 'Thank you', pronunciation: 'mer-SEE', difficulty: 'easy', lastReviewed: new Date(), repetitionCount: 0, correctStreak: 0 },
    { id: '3', word: 'Magnifique', translation: 'Beautiful', pronunciation: 'mah-nee-FEEK', difficulty: 'medium', lastReviewed: new Date(), repetitionCount: 0, correctStreak: 0 }
  ]
};

export default function StudySession({ language, mode, onModeChange }: StudySessionProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [userInput, setUserInput] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  const vocabulary = sampleVocabulary[language] || sampleVocabulary.spanish;
  const currentWord = vocabulary[currentWordIndex];

  const handleAnswer = (isCorrect: boolean) => {
    setSessionStats(prev => ({
      ...prev,
      [isCorrect ? 'correct' : 'incorrect']: prev[isCorrect ? 'correct' : 'incorrect'] + 1
    }));

    setTimeout(() => {
      if (currentWordIndex < vocabulary.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setShowAnswer(false);
        setUserInput('');
        setSelectedAnswer(null);
      } else {
        // Session complete
        alert(`Session complete! Correct: ${sessionStats.correct + (isCorrect ? 1 : 0)}, Incorrect: ${sessionStats.incorrect + (isCorrect ? 0 : 1)}`);
      }
    }, 1500);
  };

  const generateMultipleChoiceOptions = (correctAnswer: string, allWords: Word[]) => {
    const options = [correctAnswer];
    const otherWords = allWords.filter(w => w.translation !== correctAnswer);
    
    while (options.length < 4 && otherWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherWords.length);
      const randomWord = otherWords.splice(randomIndex, 1)[0];
      options.push(randomWord.translation);
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  const playPronunciation = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(language);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getLanguageCode = (lang: string) => {
    const codes: { [key: string]: string } = {
      spanish: 'es-ES',
      french: 'fr-FR',
      german: 'de-DE',
      italian: 'it-IT',
      portuguese: 'pt-PT'
    };
    return codes[lang] || 'en-US';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Study Mode Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Study Session</h2>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { mode: 'flashcards', label: 'Flashcards', icon: <Brain className="w-4 h-4" /> },
            { mode: 'multiple-choice', label: 'Multiple Choice', icon: <Target className="w-4 h-4" /> },
            { mode: 'typing', label: 'Type Answer', icon: <ArrowRight className="w-4 h-4" /> },
            { mode: 'listening', label: 'Listening', icon: <Volume2 className="w-4 h-4" /> }
          ].map(({ mode: m, label, icon }) => (
            <button
              key={m}
              onClick={() => onModeChange(m as 'flashcards' | 'multiple-choice' | 'typing' | 'listening')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                mode === m
                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Word {currentWordIndex + 1} of {vocabulary.length}
          </div>
          <div className="flex space-x-4 text-sm">
            <span className="text-green-600">✓ {sessionStats.correct}</span>
            <span className="text-red-600">✗ {sessionStats.incorrect}</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentWordIndex) / vocabulary.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Study Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {mode === 'flashcards' && (
          <FlashcardMode 
            word={currentWord}
            showAnswer={showAnswer}
            onShowAnswer={() => setShowAnswer(true)}
            onAnswer={handleAnswer}
            onPlayPronunciation={() => playPronunciation(currentWord.word)}
          />
        )}

        {mode === 'multiple-choice' && (
          <MultipleChoiceMode
            word={currentWord}
            options={generateMultipleChoiceOptions(currentWord.translation, vocabulary)}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={setSelectedAnswer}
            onSubmit={() => {
              const isCorrect = selectedAnswer === currentWord.translation;
              handleAnswer(isCorrect);
            }}
            onPlayPronunciation={() => playPronunciation(currentWord.word)}
          />
        )}

        {mode === 'typing' && (
          <TypingMode
            word={currentWord}
            userInput={userInput}
            onInputChange={setUserInput}
            onSubmit={() => {
              const isCorrect = userInput.toLowerCase().trim() === currentWord.translation.toLowerCase();
              handleAnswer(isCorrect);
            }}
            onPlayPronunciation={() => playPronunciation(currentWord.word)}
          />
        )}

        {mode === 'listening' && (
          <ListeningMode
            word={currentWord}
            userInput={userInput}
            onInputChange={setUserInput}
            onSubmit={() => {
              const isCorrect = userInput.toLowerCase().trim() === currentWord.word.toLowerCase();
              handleAnswer(isCorrect);
            }}
            onPlayPronunciation={() => playPronunciation(currentWord.word)}
          />
        )}
      </div>
    </div>
  );
}

function FlashcardMode({ word, showAnswer, onShowAnswer, onAnswer, onPlayPronunciation }: {
  word: Word;
  showAnswer: boolean;
  onShowAnswer: () => void;
  onAnswer: (correct: boolean) => void;
  onPlayPronunciation: () => void;
}) {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <h3 className="text-4xl font-bold text-gray-900">{word.word}</h3>
          <button
            onClick={onPlayPronunciation}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
        
        {word.pronunciation && (
          <p className="text-gray-500 text-lg">/{word.pronunciation}/</p>
        )}
      </div>

      {!showAnswer ? (
        <button
          onClick={onShowAnswer}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Show Answer
        </button>
      ) : (
        <div className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-2xl font-semibold text-gray-900">{word.translation}</p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => onAnswer(false)}
              className="flex items-center space-x-2 px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Incorrect</span>
            </button>
            <button
              onClick={() => onAnswer(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Correct</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MultipleChoiceMode({ word, options, selectedAnswer, onSelectAnswer, onSubmit, onPlayPronunciation }: {
  word: Word;
  options: string[];
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  onSubmit: () => void;
  onPlayPronunciation: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <h3 className="text-4xl font-bold text-gray-900">{word.word}</h3>
          <button
            onClick={onPlayPronunciation}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-600">Choose the correct translation:</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(option)}
            className={`p-4 rounded-lg border-2 transition-colors text-left ${
              selectedAnswer === option
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {selectedAnswer && (
        <div className="text-center">
          <button
            onClick={onSubmit}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
}

function TypingMode({ word, userInput, onInputChange, onSubmit, onPlayPronunciation }: {
  word: Word;
  userInput: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onPlayPronunciation: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <h3 className="text-4xl font-bold text-gray-900">{word.word}</h3>
          <button
            onClick={onPlayPronunciation}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-600">Type the translation in English:</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Enter translation..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-lg"
          onKeyPress={(e) => e.key === 'Enter' && userInput.trim() && onSubmit()}
        />
        
        <button
          onClick={onSubmit}
          disabled={!userInput.trim()}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}

function ListeningMode({ word, userInput, onInputChange, onSubmit, onPlayPronunciation }: {
  word: Word;
  userInput: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onPlayPronunciation: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="text-gray-600">Listen and type what you hear:</p>
        <button
          onClick={onPlayPronunciation}
          className="p-4 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors"
        >
          <Volume2 className="w-8 h-8" />
        </button>
        <p className="text-sm text-gray-500">Click to replay</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type what you heard..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-lg"
          onKeyPress={(e) => e.key === 'Enter' && userInput.trim() && onSubmit()}
        />
        
        <button
          onClick={onSubmit}
          disabled={!userInput.trim()}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}