'use client';

import { useState, useRef, useCallback } from 'react';
import { Plus, BookOpen, Volume2, Eye, X } from 'lucide-react';
import { VocabularyWord, createVocabularyWord } from '@/lib/vocabulary';

interface TextPromptProps {
  language: string;
  onWordAdded: (word: VocabularyWord) => void;
  isVisible: boolean;
  onClose: () => void;
}

interface WordSelection {
  text: string;
  position: { x: number; y: number };
}

interface WordInfo {
  word: string;
  translation: string;
  pronunciation?: string;
  definition: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  frequency: 'very-common' | 'common' | 'uncommon' | 'rare';
  etymology?: string;
}

export default function TextPrompt({ language, onWordAdded, isVisible, onClose }: TextPromptProps) {
  const [inputText, setInputText] = useState('');
  const [selectedWord, setSelectedWord] = useState<WordSelection | null>(null);
  const [wordInfo, setWordInfo] = useState<WordInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock API call to get word information
  const getWordInfo = useCallback(async (word: string): Promise<WordInfo | null> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - in a real app, this would call a dictionary API
    const mockData: { [key: string]: WordInfo } = {
      'hello': {
        word: 'hello',
        translation: 'hola',
        pronunciation: 'həˈloʊ',
        definition: 'Used as a greeting or to begin a phone conversation',
        examples: ['Hello, how are you?', 'She said hello to everyone'],
        synonyms: ['hi', 'hey', 'greetings'],
        antonyms: ['goodbye', 'farewell'],
        frequency: 'very-common',
        etymology: 'From Old English hǣl (whole, healthy)'
      },
      'beautiful': {
        word: 'beautiful',
        translation: 'hermoso',
        pronunciation: 'ˈbjuːtɪfəl',
        definition: 'Pleasing the senses or mind aesthetically',
        examples: ['What a beautiful sunset', 'She has a beautiful voice'],
        synonyms: ['lovely', 'gorgeous', 'stunning'],
        antonyms: ['ugly', 'hideous', 'unattractive'],
        frequency: 'common',
        etymology: 'From Middle English beaute + -ful'
      },
      'responsibility': {
        word: 'responsibility',
        translation: 'responsabilidad',
        pronunciation: 'rɪˌspɑːnsəˈbɪləti',
        definition: 'The state of being accountable for something',
        examples: ['It is your responsibility to complete the task', 'She accepted responsibility for the mistake'],
        synonyms: ['duty', 'obligation', 'accountability'],
        antonyms: ['irresponsibility', 'negligence'],
        frequency: 'common',
        etymology: 'From Latin responsum (answered) + -ibility'
      }
    };

    const result = mockData[word.toLowerCase()] || {
      word,
      translation: `[${word} translation]`,
      pronunciation: `[${word} pronunciation]`,
      definition: `Definition for ${word}`,
      examples: [`Example sentence with ${word}`],
      synonyms: [],
      antonyms: [],
      frequency: 'common' as const,
      etymology: undefined
    };

    setIsLoading(false);
    return result;
  }, []);

  const handleTextSelection = useCallback(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start === end) return; // No selection

    const selectedText = textarea.value.substring(start, end).trim();
    if (!selectedText) return;

    // Get cursor position relative to viewport
    const rect = textarea.getBoundingClientRect();
    const position = {
      x: rect.left + (rect.width / 2),
      y: rect.top + 50
    };

    setSelectedWord({ text: selectedText, position });
  }, []);

  const handleDoubleClick = useCallback((event: React.MouseEvent) => {
    const textarea = event.target as HTMLTextAreaElement;
    const clickPosition = textarea.selectionStart;
    const text = textarea.value;

    // Find word boundaries
    let start = clickPosition;
    let end = clickPosition;

    // Move start backwards to find word start
    while (start > 0 && /\w/.test(text[start - 1])) {
      start--;
    }

    // Move end forwards to find word end
    while (end < text.length && /\w/.test(text[end])) {
      end++;
    }

    const word = text.substring(start, end).trim();
    if (word) {
      const rect = textarea.getBoundingClientRect();
      const position = {
        x: rect.left + (rect.width / 2),
        y: rect.top + 50
      };

      setSelectedWord({ text: word, position });
    }
  }, []);

  const handleWordLookup = useCallback(async (word: string) => {
    const info = await getWordInfo(word);
    if (info) {
      setWordInfo(info);
      setShowPopup(true);
    }
  }, [getWordInfo]);

  const handleAddToVocabulary = useCallback(() => {
    if (!wordInfo) return;

    const newWord = createVocabularyWord({
      word: wordInfo.word,
      translation: wordInfo.translation,
      language: language,
      pronunciation: wordInfo.pronunciation,
      examples: wordInfo.examples.map(ex => ({ sentence: ex, translation: '' })),
      synonyms: wordInfo.synonyms,
      antonyms: wordInfo.antonyms,
      frequency: wordInfo.frequency,
      categories: ['imported'],
      etymology: wordInfo.etymology
    });

    onWordAdded(newWord);
    setShowPopup(false);
    setWordInfo(null);
    setSelectedWord(null);
  }, [wordInfo, language, onWordAdded]);

  const playPronunciation = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Text Analysis & Word Collection</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Paste or type text in the area below</li>
              <li>• <strong>Double-click</strong> any word to see its definition and add it to your vocabulary</li>
              <li>• <strong>Select/highlight</strong> phrases to analyze multiple words at once</li>
              <li>• Click the lookup button to get detailed word information</li>
            </ul>
          </div>

          {/* Text Input Area */}
          <div className="relative">
            <label htmlFor="textInput" className="block text-sm font-medium text-gray-700 mb-2">
              Enter text to analyze:
            </label>
            <textarea
              ref={textareaRef}
              id="textInput"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onMouseUp={handleTextSelection}
              onDoubleClick={handleDoubleClick}
              placeholder="Paste text here and double-click words or highlight phrases to add them to your vocabulary..."
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
            
            {selectedWord && (
              <div 
                className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-3"
                style={{
                  left: `${selectedWord.position.x}px`,
                  top: `${selectedWord.position.y}px`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-gray-900">&#34;{selectedWord.text}&#34;</span>
                  <button
                    onClick={() => playPronunciation(selectedWord.text)}
                    className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleWordLookup(selectedWord.text)}
                    disabled={isLoading}
                    className="flex items-center space-x-1 px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{isLoading ? 'Loading...' : 'Lookup'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedWord(null)}
                    className="px-3 py-1 text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sample Text */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Sample Text (try double-clicking words):</h3>
            <p className="text-gray-700 leading-relaxed">
              Learning a new language requires dedication and responsibility. It&#39;s a beautiful journey that opens doors to different cultures and perspectives. Every hello in a foreign language is a step toward understanding the world better.
            </p>
          </div>
        </div>
      </div>

      {/* Word Information Popup */}
      {showPopup && wordInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h3 className="text-2xl font-bold text-gray-900">{wordInfo.word}</h3>
                  <button
                    onClick={() => playPronunciation(wordInfo.word)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {wordInfo.pronunciation && (
                <p className="text-gray-600 mt-1">/{wordInfo.pronunciation}/</p>
              )}
            </div>

            <div className="p-6 space-y-6">
              {/* Translation */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Translation</h4>
                <p className="text-lg text-indigo-600 font-medium">{wordInfo.translation}</p>
              </div>

              {/* Definition */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Definition</h4>
                <p className="text-gray-700">{wordInfo.definition}</p>
              </div>

              {/* Examples */}
              {wordInfo.examples.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
                  <ul className="space-y-1">
                    {wordInfo.examples.map((example, index) => (
                      <li key={index} className="text-gray-700">
                        • {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Synonyms */}
              {wordInfo.synonyms.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Synonyms</h4>
                  <div className="flex flex-wrap gap-2">
                    {wordInfo.synonyms.map((synonym, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Antonyms */}
              {wordInfo.antonyms.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Antonyms</h4>
                  <div className="flex flex-wrap gap-2">
                    {wordInfo.antonyms.map((antonym, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                        {antonym}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Frequency & Etymology */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Frequency</h4>
                  <span className={`px-2 py-1 rounded text-sm ${
                    wordInfo.frequency === 'very-common' ? 'bg-green-100 text-green-800' :
                    wordInfo.frequency === 'common' ? 'bg-yellow-100 text-yellow-800' :
                    wordInfo.frequency === 'uncommon' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {wordInfo.frequency}
                  </span>
                </div>
                
                {wordInfo.etymology && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Etymology</h4>
                    <p className="text-gray-700 text-sm">{wordInfo.etymology}</p>
                  </div>
                )}
              </div>

              {/* Add to Vocabulary Button */}
              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={handleAddToVocabulary}
                  className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add to Vocabulary</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}