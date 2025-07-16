'use client';

import { useState, useEffect } from 'react';
import { Clock, Target, Trophy, Star, CheckCircle, X, ArrowRight, Shuffle, Brain } from 'lucide-react';
import { VocabularyWord } from '@/lib/vocabulary';

interface QuizModesProps {
  words: VocabularyWord[];
  language: string;
  onComplete: (score: number, totalQuestions: number, mode: string) => void;
  onClose: () => void;
}

type QuizMode = 'speed' | 'survival' | 'perfect' | 'adaptive' | 'challenge';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  word: VocabularyWord;
  type: 'translation' | 'definition' | 'audio' | 'context';
}

export default function QuizModes({ words, language, onComplete, onClose }: QuizModesProps) {
  const [selectedMode, setSelectedMode] = useState<QuizMode>('speed');
  const [isActive, setIsActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [lives, setLives] = useState(3);
  const [perfectStreak, setPerfectStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const quizModes = {
    speed: {
      name: 'Speed Quiz',
      description: '30 seconds per question, test your quick recall',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-blue-500',
      timeLimit: 30,
      questions: 20
    },
    survival: {
      name: 'Survival Mode',
      description: '3 lives, how long can you survive?',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-red-500',
      timeLimit: 45,
      questions: 50
    },
    perfect: {
      name: 'Perfect Run',
      description: 'No mistakes allowed, achieve perfection',
      icon: <Star className="w-6 h-6" />,
      color: 'bg-yellow-500',
      timeLimit: 60,
      questions: 15
    },
    adaptive: {
      name: 'Adaptive Challenge',
      description: 'Difficulty adjusts based on your performance',
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-purple-500',
      timeLimit: 45,
      questions: 25
    },
    challenge: {
      name: 'Daily Challenge',
      description: 'Special mixed challenge with bonus points',
      icon: <Trophy className="w-6 h-6" />,
      color: 'bg-green-500',
      timeLimit: 40,
      questions: 30
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeout();
    }
  }, [isActive, timeLeft, isAnswered]);

  const generateQuestions = (mode: QuizMode) => {
    const questionTypes: Array<'translation' | 'definition' | 'audio' | 'context'> = 
      ['translation', 'definition', 'audio', 'context'];
    
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const numQuestions = Math.min(quizModes[mode].questions, shuffledWords.length);
    
    return shuffledWords.slice(0, numQuestions).map((word, index) => {
      const questionType = questionTypes[index % questionTypes.length];
      const otherWords = words.filter(w => w.id !== word.id);
      const wrongOptions = otherWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => questionType === 'translation' ? w.translation : w.word);
      
      const correctAnswer = questionType === 'translation' ? word.translation : word.word;
      const options = [...wrongOptions, correctAnswer].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(correctAnswer);

      let question = '';
      switch (questionType) {
        case 'translation':
          question = `What is the translation of "${word.word}"?`;
          break;
        case 'definition':
          question = `Which word means "${word.translation}"?`;
          break;
        case 'audio':
          question = `Listen and choose the correct word:`;
          break;
        case 'context':
          question = `Complete the sentence: "${word.examples[0]?.sentence || 'Example sentence'}"`;
          break;
      }

      return {
        id: word.id,
        question,
        options,
        correct: correctIndex,
        word,
        type: questionType
      };
    });
  };

  const startQuiz = () => {
    const newQuestions = generateQuestions(selectedMode);
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(quizModes[selectedMode].timeLimit);
    setLives(selectedMode === 'survival' ? 3 : 1);
    setPerfectStreak(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsAnswered(false);
    setIsActive(true);
  };

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
      setPerfectStreak(perfectStreak + 1);
    } else {
      setPerfectStreak(0);
      if (selectedMode === 'survival') {
        setLives(lives - 1);
      }
      if (selectedMode === 'perfect') {
        endQuiz();
        return;
      }
    }

    setTimeout(() => {
      if (selectedMode === 'survival' && lives - (isCorrect ? 0 : 1) <= 0) {
        endQuiz();
      } else if (currentQuestion + 1 >= questions.length) {
        endQuiz();
      } else {
        nextQuestion();
      }
    }, 1500);
  };

  const handleTimeout = () => {
    if (selectedMode === 'survival') {
      setLives(lives - 1);
      if (lives - 1 <= 0) {
        endQuiz();
        return;
      }
    }
    if (selectedMode === 'perfect') {
      endQuiz();
      return;
    }
    
    setPerfectStreak(0);
    setIsAnswered(true);
    setTimeout(() => {
      if (currentQuestion + 1 >= questions.length) {
        endQuiz();
      } else {
        nextQuestion();
      }
    }, 1500);
  };

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setTimeLeft(quizModes[selectedMode].timeLimit);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const endQuiz = () => {
    setIsActive(false);
    setShowResult(true);
    onComplete(score, questions.length, selectedMode);
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (showResult) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">Quiz Complete!</h2>
            <p className="text-gray-600">{quizModes[selectedMode].name}</p>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Score:</span>
                <span className={`font-bold ${getScoreColor()}`}>
                  {score}/{questions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Accuracy:</span>
                <span className={`font-bold ${getScoreColor()}`}>
                  {Math.round((score / questions.length) * 100)}%
                </span>
              </div>
              {perfectStreak > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Perfect Streak:</span>
                  <span className="font-bold text-green-600">{perfectStreak}</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={startQuiz}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isActive) {
    const question = questions[currentQuestion];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-6">
          {/* Quiz Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${quizModes[selectedMode].color} text-white`}>
                {quizModes[selectedMode].icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{quizModes[selectedMode].name}</h2>
                <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {selectedMode === 'survival' && (
                <div className="flex items-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < lives ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              <div className={`text-2xl font-bold ${
                timeLeft <= 10 ? 'text-red-500' : 'text-blue-600'
              }`}>
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{question.question}</h3>
            
            {question.type === 'audio' && (
              <div className="mb-4 text-center">
                <button
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      const utterance = new SpeechSynthesisUtterance(question.word.word);
                      utterance.lang = 'es-ES'; // Adjust based on language
                      speechSynthesis.speak(utterance);
                    }
                  }}
                  className="bg-blue-100 text-blue-600 p-4 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <Clock className="w-6 h-6" />
                </button>
                <p className="text-gray-600 mt-2">Click to hear the word</p>
              </div>
            )}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isAnswered
                    ? index === question.correct
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : index === selectedAnswer
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {isAnswered && index === question.correct && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {isAnswered && index === selectedAnswer && index !== question.correct && (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Score Display */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Score: {score}/{questions.length}</span>
            {perfectStreak > 0 && (
              <span className="text-green-600">Perfect streak: {perfectStreak}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Choose Quiz Mode</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Object.entries(quizModes).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => setSelectedMode(key as QuizMode)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedMode === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-full ${mode.color} text-white`}>
                  {mode.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{mode.name}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">{mode.description}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{mode.timeLimit}s per question</span>
                <span>{mode.questions} questions</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Ready to test your knowledge with {words.length} words?
          </p>
          <button
            onClick={startQuiz}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Start Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}