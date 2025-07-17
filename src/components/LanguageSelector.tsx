'use client';

import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' }
];

interface LanguageSelectorProps {
  selected: string;
  onSelect: (language: string) => void;
}

export default function LanguageSelector({ selected, onSelect }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedLanguage = languages.find(lang => lang.code === selected) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-lg">{selectedLanguage.flag}</span>
        <span className="text-sm font-medium text-gray-700">{selectedLanguage.name}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onSelect(language.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  selected === language.code ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <div className="flex-1">
                  <p className="font-medium">{language.name}</p>
                  <p className="text-sm text-gray-500">{language.nativeName}</p>
                </div>
                {selected === language.code && (
                  <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}